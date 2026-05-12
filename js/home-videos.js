(function () {
  const layers = document.querySelectorAll("[data-video-cycle]");
  if (!layers.length) return;

  const HOLD_MS = 8000;

  layers.forEach((layer) => {
    const videos = layer.querySelectorAll("video");
    if (!videos.length) return;

    let i = Math.floor(Math.random() * videos.length);
    let timerId = null;
    let seriesHoverDepth = 0;

    function show(idx) {
      i = idx;
      videos.forEach((v, j) => {
        const active = j === idx;
        v.classList.toggle("is-active", active);
        if (active) {
          try {
            v.currentTime = 0;
          } catch (_) {}
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    }

    function startCycle() {
      if (timerId) clearInterval(timerId);
      timerId = setInterval(() => {
        i = (i + 1) % videos.length;
        show(i);
      }, HOLD_MS);
    }

    function stopCycle() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    function indexForSeries(series) {
      if (!series) return i;
      const matches = [];
      videos.forEach((v, j) => {
        if (v.dataset.videoSeries === series) matches.push(j);
      });
      if (!matches.length) return i;
      return matches[Math.floor(Math.random() * matches.length)];
    }

    const hero = layer.closest(".home-hero");
    const seriesCards = hero ? hero.querySelectorAll(".series-card[data-bg-series]") : [];

    seriesCards.forEach((card) => {
      card.addEventListener("pointerenter", () => {
        if (seriesHoverDepth === 0) stopCycle();
        seriesHoverDepth += 1;
        show(indexForSeries(card.dataset.bgSeries));
      });
      card.addEventListener("pointerleave", () => {
        seriesHoverDepth = Math.max(0, seriesHoverDepth - 1);
        if (seriesHoverDepth === 0) startCycle();
      });
    });

    show(i);
    startCycle();
  });
})();
