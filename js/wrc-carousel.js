(function () {
  function initCarousel(root) {
    const track = root.querySelector("[data-wrc-carousel-track]");
    const slides = root.querySelectorAll("[data-wrc-carousel-slide]");
    const btnPrev = root.querySelector("[data-wrc-carousel-prev]");
    const btnNext = root.querySelector("[data-wrc-carousel-next]");
    if (!track || !slides.length || !btnPrev || !btnNext) return;

    let index = 0;
    const n = slides.length;

    function update() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      slides.forEach((el, i) => {
        el.setAttribute("aria-hidden", i === index ? "false" : "true");
      });
    }

    btnPrev.addEventListener("click", () => {
      index = (index - 1 + n) % n;
      update();
    });
    btnNext.addEventListener("click", () => {
      index = (index + 1) % n;
      update();
    });

    update();
  }

  document.querySelectorAll("[data-wrc-carousel]").forEach(initCarousel);
})();
