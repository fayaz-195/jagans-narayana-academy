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


// Show the confirmed active academy event on the moving JNA van.
(() => {
  const event = window.JNA_EVENT;
  const track = document.querySelector(".delivery-track");
  if (!track) return;
  if (!event || event.active !== true || !event.title) {
    track.hidden = true;
    return;
  }
  const clean = String(event.title).trim().replace(/\s+/g, " ");
  const words = clean.split(" ");
  let first = "";
  let second = "";
  for (const word of words) {
    if ((first + " " + word).trim().length <= 15 || !first) {
      first = (first + " " + word).trim();
    } else {
      second = (second + " " + word).trim();
    }
  }
  const line1 = document.getElementById("van-event-line-1");
  const line2 = document.getElementById("van-event-line-2");
  const date = document.getElementById("van-event-date");
  if (line1) line1.textContent = first.toUpperCase();
  if (line2) line2.textContent = second.toUpperCase();
  if (date) date.textContent = event.date ? String(event.date).toUpperCase() : "JNA · EVENT UPDATE";
  track.hidden = false;
  track.style.cursor = "pointer";
  track.addEventListener("click", () => {
    window.location.href = event.link || "news-events.html";
  });
})();
