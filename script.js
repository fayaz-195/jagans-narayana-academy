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


// Horizontal image slider controls for the homepage learning pathways.
(() => {
  const track=document.querySelector(".pathway-track");
  if(!track)return;
  const move=direction=>track.scrollBy({left:direction*Math.min(track.clientWidth*.86,760),behavior:"smooth"});
  document.querySelector(".pathway-prev")?.addEventListener("click",()=>move(-1));
  document.querySelector(".pathway-next")?.addEventListener("click",()=>move(1));
})();


/* JNA smart hero slider: auto-advance, arrows, dots, pause and keyboard-friendly controls. */
(() => {
  const root = document.querySelector(".jna-smart-slider");
  if (!root) return;
  const slides = [
    {
      kicker: "SCHOOLING  |  INTERMEDIATE  |  IIT-JEE  |  NEET  |  CA  |  CMA",
      title: "One Academy.",
      accent: "Every Ambition.",
      description: "From strong school foundations to focused entrance preparation and professional courses, discover a learning pathway for your brighter future.",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=90",
      alt: "Students learning together in a classroom",
      primary: "Explore Programmes",
      primaryHref: "#programmes",
      secondary: "Explore Campus",
      secondaryHref: "gallery.html"
    },
    {
      kicker: "BUILD STRONG FOUNDATIONS",
      title: "Learn with",
      accent: "Confidence.",
      description: "Explore school education for Classes 1–10 with a focus on understanding, practice and steady academic progress.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1800&q=90",
      alt: "School students learning together in a bright classroom",
      primary: "Explore Schooling",
      primaryHref: "schooling.html",
      secondary: "Make an Enquiry",
      secondaryHref: "#smart-enquiry"
    },
    {
      kicker: "A CLEAR PATH TO YOUR NEXT GOAL",
      title: "Prepare for",
      accent: "What's Next.",
      description: "Discover Intermediate MPC, BiPC, MEC and CEC, alongside IIT-JEE, NEET, CA and CMA learning pathways.",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=90",
      alt: "College students studying together at a table",
      primary: "View Programmes",
      primaryHref: "#programmes",
      secondary: "Admission Enquiry",
      secondaryHref: "#smart-enquiry"
    }
  ];
  const byId = id => document.getElementById(id);
  const image = byId("jnaSlideImage");
  const dots = [...root.querySelectorAll("[data-slide]")];
  const progress = byId("jnaSlideProgress");
  let current = 0;
  let timer = null;
  let paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let touchStartX = 0;
  const render = index => {
    current = (index + slides.length) % slides.length;
    const slide = slides[current];
    byId("jnaSlideKicker").textContent = slide.kicker;
    byId("jnaSlideTitle").textContent = slide.title;
    byId("jnaSlideAccent").textContent = slide.accent;
    byId("jnaSlideDescription").textContent = slide.description;
    const primary = byId("jnaSlidePrimary");
    primary.childNodes[0].textContent = slide.primary + " ";
    primary.href = slide.primaryHref;
    const secondary = byId("jnaSlideSecondary");
    secondary.lastChild.textContent = " " + slide.secondary;
    secondary.href = slide.secondaryHref;
    image.classList.add("is-changing");
    const nextImage = new Image();
    nextImage.onload = () => {
      image.src = slide.image;
      image.alt = slide.alt;
      requestAnimationFrame(() => image.classList.remove("is-changing"));
    };
    nextImage.onerror = () => image.classList.remove("is-changing");
    nextImage.src = slide.image;
    byId("jnaSlideCount").textContent = String(current + 1).padStart(2,"0");
    dots.forEach((dot,i) => {
      const active = i === current;
      dot.classList.toggle("active",active);
      if(active) dot.setAttribute("aria-current","true");
      else dot.removeAttribute("aria-current");
    });
    if(progress) {
      progress.style.transition = "none";
      progress.style.width = "0%";
      requestAnimationFrame(() => requestAnimationFrame(() => {
        progress.style.transition = paused ? "none" : "width 6s linear";
        progress.style.width = paused ? "0%" : "100%";
      }));
    }
  };
  const stop = () => { if(timer) window.clearInterval(timer); timer = null; };
  const start = () => {
    stop();
    if(paused) return;
    timer = window.setInterval(() => render(current + 1),6000);
    if(progress) {
      progress.style.transition = "none";
      progress.style.width = "0%";
      requestAnimationFrame(() => {
        progress.style.transition = "width 6s linear";
        progress.style.width = "100%";
      });
    }
  };
  const go = index => { render(index); start(); };
  byId("jnaSlidePrev")?.addEventListener("click",() => go(current - 1));
  byId("jnaSlideNext")?.addEventListener("click",() => go(current + 1));
  dots.forEach(dot => dot.addEventListener("click",() => go(Number(dot.dataset.slide))));
  byId("jnaSlidePause")?.addEventListener("click",event => {
    paused = !paused;
    event.currentTarget.textContent = paused ? "▶" : "Ⅱ";
    event.currentTarget.setAttribute("aria-label",paused ? "Resume automatic slider" : "Pause automatic slider");
    start();
  });
  root.addEventListener("mouseenter",stop);
  root.addEventListener("mouseleave",start);
  root.addEventListener("focusin",stop);
  root.addEventListener("focusout",event => { if(!root.contains(event.relatedTarget)) start(); });
  root.addEventListener("touchstart",event => { touchStartX = event.changedTouches[0].clientX; stop(); },{passive:true});
  root.addEventListener("touchend",event => {
    const delta = event.changedTouches[0].clientX - touchStartX;
    if(Math.abs(delta) > 45) render(current + (delta < 0 ? 1 : -1));
    start();
  },{passive:true});
  document.addEventListener("visibilitychange",() => document.hidden ? stop() : start());
  render(0);
  start();
})();
