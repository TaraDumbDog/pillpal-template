

// Might want to ignore this for now 


const LOCAL_STORAGE_KEY = "pillpal_pills_v1";

/** @type {Array<{id:string,name:string,dosage:string,notes:string,times:string[],enabled:boolean}>} */
let pills = [];
let alertedToday = {};
let lastAlertDateStr = null;


function safeParseJSON(raw, fallback) {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
}

function loadPills() {
  const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return [];
  return safeParseJSON(raw, []);
}

function savePills(nextPills) {
  pills = nextPills;
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pills));
}

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function pad(num) {
  return num.toString().padStart(2, "0");
}

function getCurrentTimeHHMM() {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function getTodayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function isSameTime(t1, t2) {
  return t1 === t2;
}


function qs(selector) {
  return document.querySelector(selector);
}

function createTimeInputRow(value = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "flex items-center gap-2";

  const input = document.createElement("input");
  input.type = "time";
  input.required = true;
  input.value = value;
  input.className =
    "block w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className =
    "inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-slate-300";
  removeBtn.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>';

  removeBtn.addEventListener("click", () => {
    const container = wrapper.parentElement;
    if (!container) return;
    if (container.querySelectorAll("input[type='time']").length <= 1) {
      input.value = "";
      return;
    }
    wrapper.remove();
  });

  wrapper.appendChild(input);
  wrapper.appendChild(removeBtn);
  return wrapper;
}

function clearMessages() {
  const errorEl = qs("#form-error");
  const successEl = qs("#form-success");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  }
  if (successEl) {
    successEl.textContent = "";
    successEl.classList.add("hidden");
  }
}

function showError(msg) {
  const errorEl = qs("#form-error");
  const successEl = qs("#form-success");
  if (successEl) {
    successEl.textContent = "";
    successEl.classList.add("hidden");
  }
  if (!errorEl) return;
  errorEl.textContent = msg;
  errorEl.classList.remove("hidden");
}

function showSuccess(msg) {
  const errorEl = qs("#form-error");
  const successEl = qs("#form-success");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
  }
  if (!successEl) return;
  successEl.textContent = msg;
  successEl.classList.remove("hidden");
}



function renderEmptyState() {
  const emptyState = qs("#empty-state");
  const list = qs("#pill-list");
  if (!emptyState || !list) return;
  if (pills.length === 0) {
    emptyState.classList.remove("hidden");
    list.classList.add("hidden");
  } else {
    emptyState.classList.add("hidden");
    list.classList.remove("hidden");
  }
}

function renderPills() {
  const list = qs("#pill-list");
  if (!list) return;
  list.innerHTML = "";

  pills.forEach((pill) => {
    const card = document.createElement("article");
    card.className =
      "rounded-xl border border-slate-200 bg-white/90 shadow-sm px-4 py-3 text-xs flex flex-col gap-2";

    if (!pill.enabled) {
      card.classList.add("opacity-60");
    }

    const header = document.createElement("div");
    header.className = "flex items-start justify-between gap-2";

    const left = document.createElement("div");

    const titleRow = document.createElement("div");
    titleRow.className = "flex items-center gap-2";

    const nameEl = document.createElement("h3");
    nameEl.className = "text-sm font-semibold text-slate-900";
    nameEl.textContent = pill.name || "Unnamed pill";

    const badge = document.createElement("span");
    badge.className =
      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium " +
      (pill.enabled
        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
        : "bg-slate-100 text-slate-500 border border-slate-200");
    badge.textContent = pill.enabled ? "Active" : "Paused";

    titleRow.appendChild(nameEl);
    titleRow.appendChild(badge);

    left.appendChild(titleRow);

    if (pill.dosage) {
      const dosageEl = document.createElement("p");
      dosageEl.className = "mt-0.5 text-[11px] text-slate-500";
      dosageEl.textContent = pill.dosage;
      left.appendChild(dosageEl);
    }

    if (pill.notes) {
      const notesEl = document.createElement("p");
      notesEl.className = "mt-0.5 text-[11px] text-slate-400";
      notesEl.textContent = pill.notes;
      left.appendChild(notesEl);
    }

    header.appendChild(left);

    const actions = document.createElement("div");
    actions.className = "flex flex-col items-end gap-1";

    const toggleLabel = document.createElement("label");
    toggleLabel.className = "inline-flex items-center gap-1.5 cursor-pointer";

    const toggleInput = document.createElement("input");
    toggleInput.type = "checkbox";
    toggleInput.checked = pill.enabled;
    toggleInput.className =
      "h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary";
    toggleInput.addEventListener("change", () => {
      const nextPills = pills.map((p) =>
        p.id === pill.id ? { ...p, enabled: toggleInput.checked } : p
      );
      savePills(nextPills);
      renderPills();
    });

    const toggleText = document.createElement("span");
    toggleText.className = "text-[10px] text-slate-500";
    toggleText.textContent = pill.enabled ? "On" : "Off";

    toggleLabel.appendChild(toggleInput);
    toggleLabel.appendChild(toggleText);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className =
      "inline-flex items-center justify-center rounded-md border border-red-100 bg-red-50 px-2 py-1 text-[10px] font-medium text-red-600 hover:bg-red-100 focus:outline-none focus:ring-1 focus:ring-red-300";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      const confirmed = window.confirm(
        `Delete pill "${pill.name || "Unnamed pill"}" and its reminders?`
      );
      if (!confirmed) return;
      const nextPills = pills.filter((p) => p.id !== pill.id);
      savePills(nextPills);
      renderPills();
    });

    actions.appendChild(toggleLabel);
    actions.appendChild(deleteBtn);
    header.appendChild(actions);

    const timesRow = document.createElement("div");
    timesRow.className = "flex flex-wrap gap-1 mt-1";

    pill.times.forEach((timeStr) => {
      const chip = document.createElement("span");
      chip.className =
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100";
      chip.textContent = timeStr;
      timesRow.appendChild(chip);
    });

    card.appendChild(header);
    card.appendChild(timesRow);

    list.appendChild(card);
  });

  renderEmptyState();
}

function updateCurrentTimeLabel() {
  const label = qs("#current-time-label");
  if (!label) return;
  const now = new Date();
  label.textContent = `${now.toLocaleDateString()} • ${now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}


function resetTimeInputs() {
  const container = qs("#time-inputs");
  if (!container) return;
  container.innerHTML = "";
  container.appendChild(createTimeInputRow());
}

function collectTimes() {
  const container = qs("#time-inputs");
  if (!container) return [];
  const inputs = Array.from(container.querySelectorAll("input[type='time']"));
  const times = inputs
    .map((input) => (input.value || "").trim())
    .filter((v) => v.length > 0);
  return Array.from(new Set(times));
}

function handleFormSubmit(event) {
  event.preventDefault();
  clearMessages();

  const nameInput = qs("#pill-name");
  const dosageInput = qs("#pill-dosage");
  const notesInput = qs("#pill-notes");
  const enabledInput = qs("#pill-enabled");

  if (!nameInput) return;

  const name = (nameInput.value || "").trim();
  const dosage = (dosageInput?.value || "").trim();
  const notes = (notesInput?.value || "").trim();
  const enabled = !!enabledInput?.checked;

  const times = collectTimes();

  if (!name) {
    showError("Please enter a pill name.");
    return;
  }

  if (times.length === 0) {
    showError("Please add at least one reminder time.");
    return;
  }

  const newPill = {
    id: generateId(),
    name,
    dosage,
    notes,
    times,
    enabled,
  };

  const nextPills = [...pills, newPill];
  savePills(nextPills);
  renderPills();

  nameInput.value = "";
  if (dosageInput) dosageInput.value = "";
  if (notesInput) notesInput.value = "";
  if (enabledInput) enabledInput.checked = true;
  resetTimeInputs();

  showSuccess("Pill saved. Reminders will trigger at the specified times.");
}


function maybeResetAlertedToday(todayStr) {
  if (lastAlertDateStr !== todayStr) {
    alertedToday = {};
    lastAlertDateStr = todayStr;
  }
}

function checkReminders() {
  const currentTime = getCurrentTimeHHMM();
  const todayStr = getTodayStr();
  maybeResetAlertedToday(todayStr);

  pills.forEach((pill) => {
    if (!pill.enabled) return;
    (pill.times || []).forEach((timeStr) => {
      if (!isSameTime(timeStr, currentTime)) return;
      const key = `${pill.id}|${timeStr}`;
      if (alertedToday[key] === todayStr) return;

      // Trigger browser alert
      const dosageText = pill.dosage ? pill.dosage : "as prescribed";
      const messageLines = [
        `Time to take: ${pill.name || "your pill"}`,
        `Dosage: ${dosageText}`,
      ];
      if (pill.notes) {
        messageLines.push(`Notes: ${pill.notes}`);
      }
      window.alert(messageLines.join("\n"));

      alertedToday[key] = todayStr;
    });
  });
}


function init() {
  pills = loadPills();

  const form = qs("#pill-form");
  const addTimeBtn = qs("#add-time-btn");
  const scrollToFormBtn = qs("#scroll-to-form-btn");

  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  if (addTimeBtn) {
    addTimeBtn.addEventListener("click", () => {
      const container = qs("#time-inputs");
      if (!container) return;
      container.appendChild(createTimeInputRow());
    });
  }

  if (scrollToFormBtn && form) {
    scrollToFormBtn.addEventListener("click", () => {
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  resetTimeInputs();
  renderPills();
  updateCurrentTimeLabel();
  setInterval(updateCurrentTimeLabel, 60 * 1000);
  checkReminders(); 
  setInterval(checkReminders, 30 * 1000);
}

document.addEventListener("DOMContentLoaded", init);

