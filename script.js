/* Wild Florida 6th Grade Field Trip */
(function () {
  "use strict";

  // All times are Eastern (EST is UTC-5 in Nov and Dec).
  var PAY_CLOSE = new Date("2026-12-01T23:59:59-05:00");
  var FORMS_DUE = new Date("2026-12-04T23:59:59-05:00");
  var TRIP_START = new Date("2026-12-11T08:30:00-05:00");
  var TRIP_END = new Date("2026-12-11T16:00:00-05:00");

  // Preview other dates with ?now=2026-12-02T10:00:00-05:00
  function now() {
    try {
      var p = new URLSearchParams(window.location.search).get("now");
      if (p) {
        var d = new Date(p);
        if (!isNaN(d)) return d;
      }
    } catch (e) { /* ignore */ }
    return new Date();
  }

  /* ---------- Image placeholders ---------- */
  function makePlaceholder(img) {
    var label = img.getAttribute("data-placeholder") || "Image";
    var file = (img.getAttribute("src") || "").split("/").pop();
    var box = document.createElement("div");
    box.className = "placeholder" + (img.classList.contains("seal") ? " seal-placeholder" : "");
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", label + " coming soon");
    var s = document.createElement("strong");
    s.textContent = label + " coming soon";
    var f = document.createElement("span");
    f.textContent = file;
    box.appendChild(s);
    box.appendChild(f);
    img.replaceWith(box);

    var trigger = box.closest("[data-lightbox]");
    if (trigger) {
      trigger.setAttribute("aria-disabled", "true");
      trigger.setAttribute("data-missing", "");
      trigger.style.cursor = "default";
      var hint = trigger.querySelector(".map-hint");
      if (hint) hint.remove();
    }
  }

  document.querySelectorAll("img[data-placeholder]").forEach(function (img) {
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) {
      makePlaceholder(img);
    } else {
      img.addEventListener("error", function () { makePlaceholder(img); }, { once: true });
    }
  });

  /* ---------- Missing download files ---------- */
  if (/^https?:$/.test(window.location.protocol) && window.fetch) {
    document.querySelectorAll("a[data-check]").forEach(function (a) {
      fetch(a.getAttribute("href"), { method: "HEAD", cache: "no-store" })
        .then(function (r) { if (!r.ok) markMissing(a); })
        .catch(function () { /* offline: leave the link alone */ });
    });
  }
  function markMissing(a) {
    if (a.classList.contains("is-missing")) return;
    a.classList.add("is-missing");
    a.setAttribute("aria-disabled", "true");
    a.removeAttribute("download");
    var tag = document.createElement("span");
    tag.className = "missing-tag";
    tag.textContent = "(coming soon)";
    a.appendChild(tag);
    a.addEventListener("click", function (e) { e.preventDefault(); });
  }

  /* ---------- Countdown ---------- */
  var cd = document.getElementById("countdown");
  var cdTitle = cd.querySelector(".countdown-title");
  var cdNote = cd.querySelector(".countdown-note");
  var cdNums = {};
  cd.querySelectorAll("[data-unit]").forEach(function (el) { cdNums[el.getAttribute("data-unit")] = el; });
  var lastPhase = "";

  function phaseFor(t) {
    if (t <= PAY_CLOSE) return { id: "pay", target: PAY_CLOSE, title: "Payment closes in", note: "Tue, Dec 1. No late payments." };
    if (t <= FORMS_DUE) return { id: "forms", target: FORMS_DUE, title: "Permission slips are due in", note: "Fri, Dec 4. Send the signed slip back to school." };
    if (t < TRIP_START) return { id: "trip", target: TRIP_START, title: "Trip day is in", note: "Fri, Dec 11. Buses leave SSCS at 8:30 AM." };
    if (t < TRIP_END) return { id: "today", done: true, title: "Today's the day!", note: "We're at Wild Florida. Pickup is at SSCS at 4:00 PM." };
    return { id: "after", done: true, title: "Thank you, families!", note: "Thanks for helping make our Wild Florida trip happen. I hope your kid came home with great stories." };
  }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function tick() {
    var t = now();
    var ph = phaseFor(t);
    if (ph.id !== lastPhase) {
      cdTitle.textContent = ph.title;
      cdNote.textContent = ph.note;
      cd.classList.toggle("is-done", !!ph.done);
      lastPhase = ph.id;
      updatePayState(t);
    }
    if (!ph.done) {
      var s = Math.max(0, Math.floor((ph.target - t) / 1000));
      cdNums.days.textContent = Math.floor(s / 86400);
      cdNums.hours.textContent = pad(Math.floor((s % 86400) / 3600));
      cdNums.minutes.textContent = pad(Math.floor((s % 3600) / 60));
      cdNums.seconds.textContent = pad(s % 60);
    }
  }

  /* ---------- Payment open or closed ---------- */
  var paymentOpen = true;
  function updatePayState(t) {
    paymentOpen = t <= PAY_CLOSE;
    var note = document.querySelector(".pay-closed-note");
    if (note) note.hidden = paymentOpen;
  }

  tick();
  setInterval(tick, 1000);


  /* ---------- Calendar ---------- */
  var EVENTS = {
    "2026-11-20": { cls: "is-note", lbl: "Flyers go home", text: "Fri, Nov 20: Flyers go home." },
    "2026-11-23": { cls: "is-break", lbl: "Break", text: "Mon, Nov 23: Thanksgiving break, no school (Nov 23 to 27)." },
    "2026-11-24": { cls: "is-break", lbl: "", text: "Tue, Nov 24: Thanksgiving break, no school." },
    "2026-11-25": { cls: "is-break", lbl: "", text: "Wed, Nov 25: Thanksgiving break, no school." },
    "2026-11-26": { cls: "is-break", lbl: "", text: "Thu, Nov 26: Happy Thanksgiving! No school." },
    "2026-11-27": { cls: "is-break", lbl: "", text: "Fri, Nov 27: Thanksgiving break, no school." },
    "2026-11-30": { cls: "is-note", lbl: "Back to school", text: "Mon, Nov 30: Back to school." },
    "2026-12-01": { cls: "is-pay", lbl: "Payment closes", text: "Tue, Dec 1: Payment closes on SchoolPay." },
    "2026-12-04": { cls: "is-forms", lbl: "Forms due", text: "Fri, Dec 4: Permission slips are due. Pay first, then turn in the slip." },
    "2026-12-11": { cls: "is-trip", lbl: "Trip day!", text: "Fri, Dec 11: Trip day! Buses leave SSCS at 8:30 AM. Pickup at SSCS at 4:00 PM." }
  };
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var DAYS = [["Sun", "Sunday"], ["Mon", "Monday"], ["Tue", "Tuesday"], ["Wed", "Wednesday"], ["Thu", "Thursday"], ["Fri", "Friday"], ["Sat", "Saturday"]];

  function todayKeyET() {
    try {
      var parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now());
      var o = {};
      parts.forEach(function (p) { o[p.type] = p.value; });
      return o.year + "-" + o.month + "-" + o.day;
    } catch (e) {
      var d = now();
      return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    }
  }

  function buildCalendar() {
    var host = document.getElementById("calendar");
    var detail = document.getElementById("cal-detail");
    if (!host) return;
    var today = todayKeyET();

    var table = document.createElement("table");
    table.className = "cal-table";
    var cap = document.createElement("caption");
    cap.className = "visually-hidden";
    cap.textContent = "November 15 to December 12, 2026";
    table.appendChild(cap);

    var thead = document.createElement("thead");
    var hr = document.createElement("tr");
    DAYS.forEach(function (d) {
      var th = document.createElement("th");
      th.scope = "col";
      th.innerHTML = '<abbr title="' + d[1] + '">' + d[0] + "</abbr>";
      th.querySelector("abbr").style.textDecoration = "none";
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    var start = new Date(2026, 10, 15); // Sun, Nov 15 (local date math only)
    var tr;
    var buttons = [];
    for (var i = 0; i < 28; i++) {
      var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      if (i % 7 === 0) { tr = document.createElement("tr"); tbody.appendChild(tr); }
      var key = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
      var ev = EVENTS[key];
      var td = document.createElement("td");
      var el = document.createElement(ev ? "button" : "div");
      el.className = "day";
      if (d.getDay() === 0 || d.getDay() === 6) el.classList.add("is-weekend");
      if (ev) el.classList.add(ev.cls);
      var isToday = key === today;
      if (isToday) el.classList.add("is-today");

      var showMonth = i === 0 || d.getDate() === 1;
      var top = '<span class="day-top"><span class="n">' + d.getDate() + "</span>" +
        (showMonth ? '<span class="m" aria-hidden="true">' + MONTHS[d.getMonth()] + "</span>" : "") + "</span>";
      var bottom = "";
      if (ev && ev.lbl) bottom = '<span class="lbl" aria-hidden="true">' + ev.lbl + "</span>" + (ev.cls === "is-break" ? "" : '<span class="dot" aria-hidden="true"></span>');
      el.innerHTML = top + bottom;

      var full = DAYS[d.getDay()][1] + ", " + MONTHS[d.getMonth()] + " " + d.getDate();
      if (ev) {
        el.type = "button";
        el.setAttribute("aria-pressed", "false");
        el.setAttribute("aria-label", full + ". " + ev.text.split(": ").slice(1).join(": ") + (isToday ? " Today." : ""));
        el.dataset.text = ev.text;
        buttons.push(el);
      } else {
        el.setAttribute("aria-label", full + (isToday ? ". Today." : ""));
        el.setAttribute("role", "img");
      }
      td.appendChild(el);
      tr.appendChild(td);
    }
    table.appendChild(tbody);
    host.appendChild(table);

    function select(btn) {
      buttons.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
      detail.textContent = btn.dataset.text + (btn.classList.contains("is-today") ? " (That's today!)" : "");
    }
    buttons.forEach(function (b) { b.addEventListener("click", function () { select(b); }); });

    // Start with the next important date selected.
    var upcoming = ["2026-12-01", "2026-12-04", "2026-12-11"].filter(function (k) { return k >= today; })[0];
    var first = buttons.filter(function (b) {
      return upcoming && b.getAttribute("aria-label").indexOf(MONTHS[+upcoming.slice(5, 7) - 1] + " " + (+upcoming.slice(8))) > -1;
    })[0];
    if (first) select(first);
  }
  buildCalendar();

  /* ---------- Packing checklist ---------- */
  var KEY = "wildfl-pack-v1";
  var boxes = Array.prototype.slice.call(document.querySelectorAll("#checklist input[type=checkbox]"));
  var countEl = document.getElementById("check-count");
  function load() {
    try { return JSON.parse(window.localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  function save() {
    var o = {};
    boxes.forEach(function (b) { if (b.checked) o[b.value] = true; });
    try { window.localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* storage blocked: still works for this visit */ }
  }
  function count() {
    var n = boxes.filter(function (b) { return b.checked; }).length;
    countEl.textContent = n === boxes.length ? "All packed. Nice work!" : n + " of " + boxes.length + " packed";
  }
  var saved = load();
  boxes.forEach(function (b) {
    b.checked = !!saved[b.value];
    b.addEventListener("change", function () { save(); count(); });
  });
  count();

  /* ---------- Lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbStage = document.getElementById("lb-stage");
  var lbZoom = document.getElementById("lb-zoom");
  var lbClose = document.getElementById("lb-close");
  var opener = null;

  function setZoom(on) {
    lbStage.classList.toggle("is-zoomed", on);
    lbZoom.setAttribute("aria-pressed", on ? "true" : "false");
    lbZoom.textContent = on ? "Zoom out" : "Zoom in";
  }
  function openLightbox(src, alt, trigger) {
    opener = trigger;
    lbImg.src = src;
    lbImg.alt = alt || "";
    setZoom(false);
    if (typeof lb.showModal === "function") {
      lb.showModal();
      document.body.style.overflow = "hidden";
      lbClose.focus();
    } else {
      window.open(src, "_blank", "noopener");
    }
  }
  function closeLightbox() {
    if (lb.open) lb.close();
  }
  lb.addEventListener("close", function () {
    document.body.style.overflow = "";
    lbImg.removeAttribute("src");
    if (opener) opener.focus();
  });
  lbClose.addEventListener("click", closeLightbox);
  lbZoom.addEventListener("click", function () { setZoom(!lbStage.classList.contains("is-zoomed")); });
  lbImg.addEventListener("click", function (e) { e.stopPropagation(); setZoom(!lbStage.classList.contains("is-zoomed")); });
  lbStage.addEventListener("click", function (e) { if (e.target === lbStage) closeLightbox(); });

  document.querySelectorAll("[data-lightbox]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.hasAttribute("data-missing")) return;
      openLightbox(btn.getAttribute("data-lightbox"), btn.getAttribute("data-lightbox-alt"), btn);
    });
  });
})();
