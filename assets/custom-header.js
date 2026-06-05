function initCustomHeader() {
  document.querySelectorAll(".custom-header").forEach((header) => {
    
    const btn = header.querySelector(".custom-header__hamburger");

    if (!btn) return;

    if (btn.dataset.bound === "true") return;
    btn.dataset.bound = "true";

    btn.addEventListener("click", () => {
      const isOpen = header.classList.contains("menu-open");

      if (isOpen) {
        header.classList.remove("menu-open");
        btn.innerHTML = "☰";
      } else {
        header.classList.add("menu-open");
        btn.innerHTML = "✕";
      }
    });

  });
}

document.addEventListener("DOMContentLoaded", initCustomHeader);
document.addEventListener("shopify:section:load", initCustomHeader);