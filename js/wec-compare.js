(function () {
  const root = document.querySelector("[data-wec-compare]");
  if (!root) return;

  const tbody = root.querySelector("[data-wec-compare-tbody]");
  if (!tbody) return;

  const ROW_KEYS = [
    { key: "look", label: "Облик" },
    { key: "engine", label: "Мотор" },
    { key: "power", label: "Мощность" },
    { key: "speed", label: "Прямая, км/ч" },
    { key: "weight", label: "Вес, кг" },
    { key: "fuel", label: "Топливо" },
    { key: "electric", label: "Электрика" },
  ];

  const ERAS = {
    "1970": {
      colTitle: "1970",
      look: "Прототип — длинный низкий кузов",
      engine: "от 3 л, бензин, мотор обычно сзади",
      power: "450–600 л.с. у самых быстрых",
      speed: "~320",
      weight: "700–800, частый диапазон",
      fuel: "Бензин",
      electric: "Нет, только бензиновый мотор",
    },
    "1990": {
      colTitle: "1990",
      look: "Прототип — большие крылья для прижима",
      engine: "3,5 л, бензин, без турбины",
      power: "~600 л.с. у лидеров",
      speed: "~330",
      weight: "от 900 — зависит от класса",
      fuel: "Бензин",
      electric: "Нет",
    },
    "2006": {
      colTitle: "2006",
      look: "Прототип — закрытая кабина",
      engine: "10–12 цил., бензин или турбодизель",
      power: "600–650 л.с.",
      speed: "330–340",
      weight: "~900",
      fuel: "Бензин или дизель — по классу",
      electric: "Нет",
    },
    "2014": {
      colTitle: "2014",
      look: "Прототип — узкий, сильный прижим",
      engine: "2,0 л, V6, турбо",
      power: "~1000 л.с. вместе с батареей",
      speed: ">330 на длинных прямых",
      weight: "~870",
      fuel: "Бензин, лимит на гонку",
      electric: "Да, заметная доля тяги",
    },
    "2020": {
      colTitle: "2020",
      look: "Прототип — ещё «стрела», без старых гибридов",
      engine: "~4 л, бензин",
      power: "~700 л.с.",
      speed: "~340",
      weight: "~930, тяжелее гибридной эры",
      fuel: "Бензин, лимит расхода",
      electric: "Почти нет у лидеров класса",
    },
    "2025": {
      colTitle: "2025",
      look: "Суперкар — силуэт ближе к серийным маркам",
      engine: "До 4 л, часто с гибридом по правилам класса",
      power: "~700 л.с.; соперников выравнивают по скорости",
      speed: "~340 на самых длинных прямых",
      weight: "от 1030 — минимум для верхнего класса",
      fuel: "Бензин, сколько можно израсходовать — по регламенту",
      electric: "Да: торможение и толчок при разгоне",
    },
  };

  const eraKeys = Object.keys(ERAS);
  let leftKey = "2014";
  let rightKey = "2025";
  let parameterTitle = "Параметр";

  function buildPicker(role, selectedKey) {
    const wrap = document.createElement("div");
    wrap.className = "compare-picker";

    const label = document.createElement("label");
    label.className = "visually-hidden";
    label.setAttribute("for", `wec-compare-${role}`);
    label.textContent = role === "left" ? "Первый год для сравнения WEC" : "Второй год для сравнения WEC";

    const select = document.createElement("select");
    select.id = `wec-compare-${role}`;
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
