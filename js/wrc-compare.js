(function () {
  const root = document.querySelector("[data-wrc-compare]");
  if (!root) return;

  const tbody = root.querySelector("[data-wrc-compare-tbody]");
  if (!tbody) return;

  const ROW_KEYS = [
    { key: "rules", label: "Регламент" },
    { key: "engine", label: "Двигатель" },
    { key: "power", label: "Мощность (ориентир)" },
    { key: "drive", label: "Привод" },
    { key: "weight", label: "Минимальный вес" },
    { key: "chassis", label: "Кузов и аэродинамика" },
    { key: "extra", label: "Особенности" },
  ];

  const ERAS = {
    "1980": {
      colTitle: "1980",
      rules: "Group 4 (допуск по серийной базе)",
      engine: "Атмосферные 2+ л или ранние турбо; объём по формуле FIA к серии",
      power: "Часто 250–350 л.с. у заводских машин",
      drive: "Задний у многих моделей; Audi quattro уже с полным приводом",
      weight: "Около 900–1150 кг в зависимости от модели",
      chassis: "Ближе к дорожному кузову, мало чистой аэродинамики",
      extra: "Без гибрида; механика и простая электроника",
    },
    "1985": {
      colTitle: "1985",
      rules: "Group B (минимальная серия для омологации)",
      engine: "До ~3 л, широко турбонаддув",
      power: "450–600+ л.с. у самых быстрых прототипов класса",
      drive: "Полный привод у лидеров (Audi, Peugeot, Lancia S4 и др.)",
      weight: "Очень лёгкие машины — порядка 890–1000 кг у топ-кейсов",
      chassis: "Короткая база, крылья и диффузоры; мало ограничений по форме",
      extra: "Без гибрида; зрелищность и риск привели к запрету класса в 1986",
    },
    "1995": {
      colTitle: "1995",
      rules: "Group A WRC (гоночная версия серийного авто)",
      engine: "2,0 л турбо с воздушным restrictor",
      power: "Около 300 л.с. у заводских машин (лимит по «дырке»)",
      drive: "Полный привод у всех заводских команд",
      weight: "Тяжелее Group B: гомологация и балласт, часто 1200+ кг",
      chassis: "Серийный силуэт с усилениями; умеренные крылья",
      extra: "Активные дифференциалы в начале эпохи; без гибрида",
    },
    "2006": {
      colTitle: "2006",
      rules: "WRC (двухлитровая турбо-эра)",
      engine: "2,0 л турбо по регламенту WRC",
      power: "Около 300 л.с. с restrictor",
      drive: "Полный привод",
      weight: "Порядка 1230 кг и выше с эволюцией правил",
      chassis: "Широкие арки, усиленная безопасность, антилаг в пелотоне",
      extra: "Секвентальная коробка; электроника диффов ужесточалась по годам",
    },
    "2017": {
      colTitle: "2017",
      rules: "WRC (новое поколение до Rally1)",
      engine: "1,6 л турбо",
      power: "До порядка 380 л.с.",
      drive: "Полный привод",
      weight: "Около 1170 кг в духе правил того цикла",
      chassis: "Заметно шире кузов, больше прижимной силы и аэродеталей",
      extra: "Центральный водяной радиатор; без гибрида; гидравлический ручник",
    },
    "2024": {
      colTitle: "2024",
      rules: "Rally1",
      engine: "1,6 л турбо + гибридный модуль FIA",
      power: "ДВС ~380 л.с. + краткие фазы тяги от гибрида",
      drive: "Полный привод",
      weight: "Около 1260 кг с гибридом",
      chassis: "Как у нынешнего Rally1: купе, клетка, крупная аэродинамика",
      extra: "Обязательный гибрид; электроручник; спринт- и классические форматы",
    },
    "2026": {
      colTitle: "Rally1 2026",
      rules: "Rally1 (чемпионат мира WRC)",
      engine: "1,6 л турбо + стандартный гибридный модуль FIA",
      power: "Около 380 л.с. ДВС + кратковременный буст гибрида (~100 кВт)",
      drive: "Полный привод, дифференциалы по регламенту FIA",
      weight: "Около 1260 кг с гибридом и гоночным оснащением",
      chassis: "Жёсткое купе на базе серийной модели, клетка, крупные крылья",
      extra: "Гибрид обязателен; электроручник; сервис только в отведённых парках",
    },
  };

  const eraKeys = Object.keys(ERAS);
  let leftKey = "2024";
  let rightKey = "2026";
  let parameterTitle = "Параметр";

  function buildPicker(role, selectedKey) {
    const wrap = document.createElement("div");
    wrap.className = "compare-picker";

    const label = document.createElement("label");
    label.className = "visually-hidden";
    label.setAttribute("for", `wrc-compare-${role}`);
    label.textContent = role === "left" ? "Первый год для сравнения WRC" : "Второй год для сравнения WRC";

    const select = document.createElement("select");
    select.id = `wrc-compare-${role}`;
    select.className = "f1-compare-select compare-picker-select";

    eraKeys.forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = ERAS[key].colTitle;
      option.selected = key === selectedKey;
      select.appendChild(option);
    });

    wrap.appendChild(label);
    wrap.appendChild(select);
    return { wrap, select };
  }

  function render() {
    const leftEra = ERAS[leftKey];
    const rightEra = ERAS[rightKey];
    if (!leftEra || !rightEra) return;

    tbody.textContent = "";

    const pickerRow = document.createElement("tr");
    pickerRow.className = "compare-picker-row";

    const pickerHeader = document.createElement("th");
    pickerHeader.scope = "row";
    pickerHeader.className = "compare-parameter-header";

    const parameterInput = document.createElement("input");
    parameterInput.type = "text";
    parameterInput.className = "compare-parameter-input";
    parameterInput.value = parameterTitle;
    parameterInput.setAttribute("aria-label", "Название строки параметров");
    parameterInput.addEventListener("input", () => {
      parameterTitle = parameterInput.value;
    });
    pickerHeader.appendChild(parameterInput);

    const leftCell = document.createElement("td");
    const leftPicker = buildPicker("left", leftKey);
    leftPicker.select.addEventListener("change", () => {
      leftKey = leftPicker.select.value;
      render();
    });
    leftCell.appendChild(leftPicker.wrap);

    const rightCell = document.createElement("td");
    const rightPicker = buildPicker("right", rightKey);
    rightPicker.select.addEventListener("change", () => {
      rightKey = rightPicker.select.value;
      render();
    });
    rightCell.appendChild(rightPicker.wrap);

    pickerRow.appendChild(pickerHeader);
    pickerRow.appendChild(leftCell);
    pickerRow.appendChild(rightCell);
    tbody.appendChild(pickerRow);

    ROW_KEYS.forEach(({ key, label }) => {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.scope = "row";
      th.textContent = label;

      const tdLeft = document.createElement("td");
      tdLeft.textContent = leftEra[key];

      const tdRight = document.createElement("td");
      tdRight.textContent = rightEra[key];

      tr.appendChild(th);
      tr.appendChild(tdLeft);
      tr.appendChild(tdRight);
      tbody.appendChild(tr);
    });
  }

  render();
})();
