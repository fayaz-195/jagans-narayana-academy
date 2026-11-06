const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  }));
}
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
document.querySelectorAll(".nav-drop").forEach(button => {
  button.addEventListener("click", event => {
    event.stopPropagation();
    const item = button.closest(".nav-item");
    const willOpen = !item.classList.contains("open");
    document.querySelectorAll(".nav-item.open").forEach(openItem => {
      openItem.classList.remove("open");
      openItem.querySelector(".nav-drop")?.setAttribute("aria-expanded","false");
    });
    if (willOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded","true");
    }
  });
});
document.addEventListener("click", event => {
  if (!event.target.closest(".nav-item")) {
    document.querySelectorAll(".nav-item.open").forEach(item => {
      item.classList.remove("open");
      item.querySelector(".nav-drop")?.setAttribute("aria-expanded","false");
    });
  }
});


// Premium navigation: compact on scroll and close mobile menus after selection.
const siteHeader = document.querySelector(".site-header");
const updateHeader = () => {
  if (siteHeader) siteHeader.classList.toggle("scrolled", window.scrollY > 24);
};
updateHeader();
window.addEventListener("scroll", updateHeader, {passive:true});

// Reveal page sections smoothly as visitors scroll.
const revealTargets = document.querySelectorAll(
  ".section, .quick-strip, .class-card, .step, .contact-panel, .page-hero, .content-section, .info-card"
);
revealTargets.forEach((element, index) => {
  element.classList.add("js-reveal");
  if (element.classList.contains("class-card") || element.classList.contains("info-card")) {
    element.style.transitionDelay = (index % 5) * 70 + "ms";
  }
});
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.12,rootMargin:"0px 0px -35px 0px"});
  revealTargets.forEach(element => revealObserver.observe(element));
} else {
  revealTargets.forEach(element => element.classList.add("is-visible"));
}


// Automatically select today's Indian special day or the next upcoming festival.
(() => {
  const track = document.querySelector(".delivery-track");
  if (!track) return;
  const calendar = window.JNA_CALENDAR;
  if (!calendar) { track.hidden = true; return; }

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const part = type => parts.find(item => item.type === type)?.value;
  const todayKey = part("year") + "-" + part("month") + "-" + part("day");
  const todayUtc = Date.UTC(Number(part("year")), Number(part("month")) - 1, Number(part("day")));
  const year = Number(part("year"));
  const events = [];

  (calendar.annual || []).forEach(([title, monthDay, category]) => {
    const [month, day] = monthDay.split("-").map(Number);
    [year, year + 1].forEach(y => {
      const key = y + "-" + String(month).padStart(2,"0") + "-" + String(day).padStart(2,"0");
      events.push({title, key, category});
    });
  });
  (calendar.dated || []).forEach(([title, key, category]) => events.push({title, key, category}));

  const candidates = events.map(event => ({
    ...event,
    days: Math.round((Date.UTC(...event.key.split("-").map(Number).map((n,i)=>i===1?n-1:n)) - todayUtc) / 86400000)
  })).filter(event => event.days >= 0 && event.days <= (calendar.showWithinDays || 21))
    .sort((a,b) => a.days - b.days);

  const chosen = candidates[0];
  if (!chosen) { track.hidden = true; return; }

  const titleWords = chosen.title.toUpperCase().split(/\\s+/);
  let line1 = "", line2 = "";
  titleWords.forEach(word => {
    if (!line1 || (line1 + " " + word).length <= 15) line1 = (line1 + " " + word).trim();
    else line2 = (line2 + " " + word).trim();
  });
  if (!line2) line2 = chosen.days === 0 ? "TODAY" : chosen.category.toUpperCase();

  const line1El = document.getElementById("van-event-line-1");
  const line2El = document.getElementById("van-event-line-2");
  const dateEl = document.getElementById("van-event-date");
  if (line1El) line1El.textContent = line1;
  if (line2El) line2El.textContent = line2;
  if (dateEl) {
    const readableDate = new Date(chosen.key + "T12:00:00").toLocaleDateString("en-IN", {
      day:"numeric", month:"short", timeZone:"Asia/Kolkata"
    }).toUpperCase();
    dateEl.textContent = chosen.days === 0 ? "TODAY · " + readableDate : "UP NEXT · " + readableDate;
  }
  track.hidden = false;
  track.setAttribute("role","link");
  track.setAttribute("tabindex","0");
  track.setAttribute("aria-label", chosen.title + (chosen.days === 0 ? " today" : " upcoming") + ". Open academy updates.");
  const openUpdates = () => { window.location.href = "news-events.html"; };
  track.addEventListener("click", openUpdates);
  track.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openUpdates(); }
  });
})();

