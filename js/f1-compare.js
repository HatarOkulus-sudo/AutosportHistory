(function () {
  const root = document.querySelector("[data-f1-compare]");
  if (!root) return;

  const tbody = root.querySelector("[data-f1-compare-tbody]");
  if (!tbody) return;

  const ROW_KEYS = [
    { key: "engine", label: "Двигатель" },
    { key: "rpm", label: "Обороты" },
    { key: "power", label: "Мощность" },
    { key: "speed", label: "Скорость на длинной прямой" },
    { key: "weight", label: "Минимальный вес машины" },
    { key: "fuel", label: "Топливо" },
    { key: "extra", label: "Электрика и турбина" },
  ];

  const ERAS = {
    "1950": {
      colTitle: "1950",
      engine: "4,5 л без турбины или 1,5 л с турбонаддувом",
      rpm: "Общего лимита по оборотам не было",
      power: "Около 400 л.с. у сильнейших машин",
      speed: "До примерно 290 км/ч",
      weight: "Часто около 600 кг; единого минимума почти не было",
      fuel: "Обычный гоночный бензин",
      extra: "Только бензиновый мотор, без батареи",
    },
    "1961": {
      colTitle: "1961",
      engine: "До 1,5 л, без турбины",
      rpm: "До примерно 10 000 об/мин",
      power: "Примерно 150–230 л.с.",
      speed: "До примерно 270 км/ч",
      weight: "Заметно легче современных машин",
      fuel: "Бензин по правилам чемпионата",
      extra: "Без батареи",
    },
    "1966": {
      colTitle: "1966",
      engine: "До 3 л, чаще всего 8–12 цилиндров",
      rpm: "До примерно 12 000 об/мин",
      power: "Примерно 350–420 л.с.",
      speed: "До примерно 320 км/ч",
      weight: "Легче современных",
      fuel: "Бензин",
      extra: "Без батареи; турбина почти не встречалась",
    },
    "1988": {
      colTitle: "1988",
      engine: "1,5 л с турбиной",
      rpm: "До примерно 13 000 об/мин",
      power: "Около 600–700 л.с. в гонке",
      speed: "До примерно 330 км/ч",
      weight: "Сильно легче нынешних",
      fuel: "Бензин, лимит на заправку в турбо-эру",
      extra: "Турбина, без батареи",
    },
    "1994": {
      colTitle: "1994",
      engine: "3,5 л, без турбины",
      rpm: "До примерно 16 000 об/мин",
      power: "До примерно 800 л.с. у лучших",
      speed: "До примерно 340 км/ч",
      weight: "Ниже, чем у сегодняшних машин",
      fuel: "Безсвинцовый бензин",
      extra: "Без батареи",
    },
    "2006": {
      colTitle: "2006",
      engine: "2,4 л, 8 цилиндров V",
      rpm: "С 2007 года — не выше 19 000 об/мин",
      power: "Около 700–750 л.с.",
      speed: "До примерно 350 км/ч",
      weight: "Около 600 кг вместе с пилотом (по правилам тех лет)",
      fuel: "Бензин",
      extra: "Только мотор; буст от батареи — с 2009 года",
    },
    "2014": {
      colTitle: "2014",
      engine: "1,6 л турбо, 6 цилиндров V + батарея",
      rpm: "Не выше 15 000 об/мин",
      power: "Около 800 л.с. всего",
      speed: "До примерно 360 км/ч",
      weight: "Около 690 кг без топлива (на старте этих правил)",
      fuel: "Бензин, расход ограничен",
      extra: "Батарея и отбор энергии из выхлопа",
    },
    "2024": {
      colTitle: "2024",
      engine: "1,6 л турбо, 6 цилиндров V + батарея",
      rpm: "15 000 об/мин",
      power: "Около 1000 л.с. у лидеров",
      speed: "До примерно 360 км/ч и выше с открытым DRS",
      weight: "798 кг без топлива",
      fuel: "Бензин с 10% этанола",
      extra: "Батарея и отбор от турбины",
    },
    "2026": {
      colTitle: "2026",
      engine: "1,6 л, 6 цилиндров V, с турбиной",
      rpm: "До 15 000 об/мин",
      power: "Около 1000 л.с. вместе мотор и электрика",
      speed: "До примерно 350 км/ч",
      weight: "Не менее 768 кг (без топлива в баке)",
      fuel: "Полностью синтетическое «зелёное» топливо",
      extra: "Сильная батарея на колёсах; турбина без отбора энергии из выхлопа",
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
    label.setAttribute("for", `f1-compare-${role}`);
    label.textContent = role === "left" ? "Первый год для сравнения" : "Второй год для сравнения";

    const select = document.createElement("select");
    select.id = `f1-compare-${role}`;
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
