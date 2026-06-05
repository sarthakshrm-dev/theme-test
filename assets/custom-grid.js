const SOFT_JACKET_VARIANT_ID = 55589832294568;

function initCustomGrid() {

  document.querySelectorAll(".custom-product-grid").forEach((grid) => {

    if (grid.dataset.initialized === "true") return;
    grid.dataset.initialized = "true";

    const popup = grid.querySelector(".product-popup");

    if (!popup) return;

    const popupImage = popup.querySelector("#popup-image");
    const popupTitle = popup.querySelector("#popup-title");
    const popupPrice = popup.querySelector("#popup-price");
    const popupDescription = popup.querySelector("#popup-description");
    const colorOptions = popup.querySelector("#color-options");
    const sizeOptions = popup.querySelector("#size-options");
    const addToCartBtn = popup.querySelector("#add-to-cart-btn");
    const closeBtn = popup.querySelector(".popup-close");
    const overlay = popup.querySelector(".product-popup__overlay");

    let currentProduct = null;
    let selectedVariantId = null;
    let selectedColor = "";

    let selectedVariant = null; // ✅ IMPORTANT (was missing)

    grid.querySelectorAll(".product-hotspot").forEach((button) => {

      button.addEventListener("click", () => {

        const card = button.closest(".product-grid__item");

        if (!card) return;

        currentProduct = {
          id: card.dataset.productId,
          title: card.dataset.title,
          price: card.dataset.price,
          description: card.dataset.description,
          image: card.dataset.image,
          variants: JSON.parse(card.dataset.variants)
        };

        popup.classList.add("active");

        popupImage.src = currentProduct.image;
        popupImage.alt = currentProduct.title;

        popupTitle.textContent = currentProduct.title;

        popupPrice.textContent =
          '$' + (Number(currentProduct.price) / 100).toFixed(2);

        popupDescription.innerHTML =
          currentProduct.description;

        buildOptions(currentProduct);
      });

    });

    function buildOptions(product) {

      colorOptions.innerHTML = "";
      sizeOptions.innerHTML = "";

      const colors = [];
      const sizes = [];

      product.variants.forEach((variant) => {

        if (variant.option2 && !colors.includes(variant.option2)) {
          colors.push(variant.option2);
        }

        if (variant.option1 && !sizes.includes(variant.option1)) {
          sizes.push(variant.option1);
        }

      });

      selectedColor = colors[0] || "";

      colors.forEach((color) => {

        const btn = document.createElement("button");

        btn.type = "button";
        btn.className = "color-btn";

        btn.innerHTML = `
          <span class="color-circle" style="background:${color.toLowerCase()}"></span>
          ${color}
        `;

        btn.addEventListener("click", () => {

          selectedColor = color;

          colorOptions.querySelectorAll(".color-btn")
            .forEach((b) => b.classList.remove("active"));

          btn.classList.add("active");

          updateVariant(product);
        });

        colorOptions.appendChild(btn);

      });

      sizes.forEach((size) => {

        const option = document.createElement("option");
        option.value = size;
        option.textContent = size;

        sizeOptions.appendChild(option);

      });

      sizeOptions.addEventListener("change", () => {
        updateVariant(product);
      });

      updateVariant(product);
    }

    function updateVariant(product) {

      const size = sizeOptions.value;

      const variant = product.variants.find((v) => {
        return (
          v.option2 === selectedColor &&
          v.option1 === size
        );
      });

      if (variant) {
        selectedVariantId = variant.id;
        selectedVariant = variant; // ✅ REQUIRED for rule check
      }
    }

    closeBtn.addEventListener("click", () => {
      popup.classList.remove("active");
    });

    overlay.addEventListener("click", () => {
      popup.classList.remove("active");
    });

    addToCartBtn.addEventListener("click", async () => {

      if (!selectedVariantId) {
        alert("Please select a variant");
        return;
      }

      const items = [
        {
          id: selectedVariantId,
          quantity: 1
        }
      ];

      // ✅ SAFE ADD-ON LOGIC (THIS IS THE ONLY NEW PART)
      if (
        selectedVariant?.option1 === "M" &&
        selectedVariant?.option2 === "Black"
      ) {
        items.push({
          id: SOFT_JACKET_VARIANT_ID,
          quantity: 1
        });
      }

      try {

        await fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ items }) // IMPORTANT: must be "items"
        });

        popup.classList.remove("active");

      } catch (error) {
        console.error(error);
      }

    });

  });

}

document.addEventListener("DOMContentLoaded", initCustomGrid);
document.addEventListener("shopify:section:load", initCustomGrid);