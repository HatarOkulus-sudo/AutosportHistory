(function () {
  const root = document.querySelector("[data-timeline]");
  if (!root) return;

  const events = window.__TIMELINE_EVENTS;
  if (!Array.isArray(events) || !events.length) return;

  const dotsEl = root.querySelector("[data-timeline-dots]");
  const panel = root.querySelector("[data-timeline-panel]");
  if (!dotsEl || !panel) return;

  let active = 0;

  function renderBody(body) {
    if (Array.isArray(body)) {
      return body
        .map((p) => "<p>" + escapeHtml(String(p)) + "</p>")
        .join("");
    }
    return "<p>" + escapeHtml(String(body || "")) + "</p>";
  }

  function renderPanel(index) {
    const e = events[index];
    if (!e) return;
    panel.innerHTML =
      "<h3>" +
      escapeHtml(String(e.year)) +
      (e.title ? " — " + escapeHtml(String(e.title)) : "") +
      "</h3>" +
      renderBody(e.body);
    panel.setAttribute("aria-live", "polite");
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  events.forEach((e, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "timeline-dot";
    btn.textContent = String(e.year);
    btn.setAttribute("aria-label", "Год " + e.year);
    btn.addEventListener("click", () => setActive(index));
    dotsEl.appendChild(btn);
  });

  const dotButtons = () => dotsEl.querySelectorAll(".timeline-dot");

  function setActive(index) {
    active = index;
    dotButtons().forEach((b, j) => {
      b.setAttribute("aria-current", j === index ? "true" : "false");
    });
    renderPanel(index);
  }

  setActive(0);
})();
