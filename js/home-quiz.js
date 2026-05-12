(function () {
  var root = document.querySelector("[data-home-quiz]");
  if (!root) return;

  var optionsRoot = root.querySelector("[data-quiz-options]");
  var questionEl = root.querySelector("[data-quiz-question]");
  var progressEl = root.querySelector("[data-quiz-progress]");
  var nextBtn = root.querySelector("[data-quiz-next]");

  if (!optionsRoot || !questionEl) return;

  var QUESTIONS = [
    {
      question:
        "Какая из трёх серий на главной странице обычно связывается с этапами на выносливость, Себрингом, Спа и Лё-Маном?",
      options: [
        { text: "Formula 1", correct: false },
        { text: "WEC (FIA World Endurance Championship)", correct: true },
        { text: "WRC", correct: false },
        { text: "Ни одна из перечисленных", correct: false },
      ],
    },
    {
      question: "В каком году по сайту стартовал первый сезон чемпионата мира Формулы-1?",
      options: [
        { text: "1946", correct: false },
        { text: "1950", correct: true },
        { text: "1958", correct: false },
        { text: "1966", correct: false },
      ],
    },
    {
      question: "Где по тексту страницы F1 прошёл старт первого чемпионата мира Формулы-1?",
      options: [
        { text: "Сильверстоун", correct: true },
        { text: "Монако", correct: false },
        { text: "Спа-Франкоршам", correct: false },
        { text: "Монца", correct: false },
      ],
    },
    {
      question: "В каком году на странице WEC назван старт официального чемпионата мира FIA по выносливости (WEC)?",
      options: [
        { text: "2004", correct: false },
        { text: "2012", correct: true },
        { text: "2016", correct: false },
        { text: "1998", correct: false },
      ],
    },
    {
      question: "С какого года по вводному на странице WEC проводятся «24 часа Лё-Мана» (как историческая опора до WEC)?",
      options: [
        { text: "1923", correct: true },
        { text: "1950", correct: false },
        { text: "1973", correct: false },
        { text: "2012", correct: false },
      ],
    },
    {
      question: "Какая команда на странице F1 названа единственной, выступающей в чемпионате мира со всех сезонов с 1950 года?",
      options: [
        { text: "McLaren", correct: false },
        { text: "Ferrari", correct: true },
        { text: "Mercedes", correct: false },
        { text: "Williams", correct: false },
      ],
    },
    {
      question: "С какого года по странице WRC существует чемпионат мира по ралли (WRC)?",
      options: [
        { text: "1973", correct: true },
        { text: "1982", correct: false },
        { text: "1911", correct: false },
        { text: "1986", correct: false },
      ],
    },
    {
      question: "В какие годы на странице WRC указана «золотая» эпоха Group B?",
      options: [
        { text: "1982–1986", correct: true },
        { text: "1987–1996", correct: false },
        { text: "1973–1981", correct: false },
        { text: "1997–2004", correct: false },
      ],
    },
    {
      question: "Какая марка на странице WRC названа рекордсменом по числу титулов среди марок в чемпионате мира?",
      options: [
        { text: "Toyota", correct: false },
        { text: "Citroën", correct: false },
        { text: "Lancia", correct: true },
        { text: "Ford", correct: false },
      ],
    },
    {
      question: "С какого года на странице WEC отсчитывается заводская программа Toyota Gazoo Racing в WEC?",
      options: [
        { text: "2012", correct: true },
        { text: "2017", correct: false },
        { text: "2006", correct: false },
        { text: "2014", correct: false },
      ],
    },
  ];

  var index = 0;
  var resolved = false;

  function setProgress() {
    if (progressEl) {
      progressEl.textContent = "Вопрос " + (index + 1) + " из " + QUESTIONS.length;
    }
  }

  function clearOptions() {
    optionsRoot.innerHTML = "";
  }

  function showQuestion(i) {
    var q = QUESTIONS[i];
    if (!q) return;

    resolved = false;
    index = i;
    questionEl.textContent = q.question;
    setProgress();

    if (nextBtn) nextBtn.hidden = true;

    clearOptions();

    q.options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.textContent = opt.text;
      btn.setAttribute("data-correct", opt.correct ? "true" : "false");
      optionsRoot.appendChild(btn);
    });
  }

  optionsRoot.addEventListener("click", function (ev) {
    if (resolved) return;
    var btn = ev.target.closest(".quiz-option");
    if (!btn || optionsRoot.contains(btn) === false) return;

    var correct = btn.getAttribute("data-correct") === "true";
    if (correct) {
      resolved = true;
      btn.classList.add("is-correct");
      btn.setAttribute("aria-pressed", "true");
      optionsRoot.querySelectorAll(".quiz-option").forEach(function (b) {
        b.disabled = true;
        b.classList.add("is-locked");
      });
      btn.classList.remove("is-locked");

      if (nextBtn) nextBtn.hidden = false;
    } else {
      btn.classList.add("is-wrong");
      btn.disabled = true;
      btn.setAttribute("aria-pressed", "true");
    }
  });

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      if (index >= QUESTIONS.length - 1) {
        showQuestion(0);
      } else {
        showQuestion(index + 1);
      }
    });
  }

  showQuestion(0);
})();
