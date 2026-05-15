(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Active nav link */
  function setActiveNav() {
    var path = window.location.pathname.replace(/\/$/, "") || "/";
    document.querySelectorAll(".page-header .btn").forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;
      var linkPath = href.replace(/\/$/, "") || "/";
      link.classList.toggle("is-active", linkPath === path);
    });
  }

  /* Scroll reveal */
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* Animated counters */
  function animateCounter(el, target, suffix, duration) {
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.floor(eased * target);
      el.textContent = value + (suffix || "");
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + (suffix || "");
      }
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    if (prefersReducedMotion) return;

    var cards = document.querySelectorAll(".stat-card[data-count]");
    if (!cards.length || !("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var card = entry.target;
          var valueEl = card.querySelector(".stat-value");
          if (!valueEl || card.dataset.animated) return;
          card.dataset.animated = "true";
          var target = parseInt(card.dataset.count, 10);
          var suffix = card.dataset.suffix || "";
          animateCounter(valueEl, target, suffix, 1400);
          observer.unobserve(card);
        });
      },
      { threshold: 0.5 }
    );

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  /* Typing effect */
  function initTyping() {
    var el = document.getElementById("typing-role");
    if (!el) return;

    var phrases = [];
    try {
      phrases = JSON.parse(el.dataset.phrases || "[]");
    } catch (e) {
      return;
    }
    if (!phrases.length) return;

    if (prefersReducedMotion) {
      el.textContent = phrases[0];
      return;
    }

    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var current = phrases[phraseIndex];
      if (!deleting) {
        el.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 2200);
          return;
        }
        setTimeout(tick, 70 + Math.random() * 40);
      } else {
        el.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 35);
      }
    }

    tick();
  }

  /* Skill pill ripple on click */
  function initSkillPills() {
    document.querySelectorAll(".skill-pill").forEach(function (pill) {
      pill.addEventListener("click", function () {
        pill.style.transform = "scale(0.92)";
        setTimeout(function () {
          pill.style.transform = "";
        }, 150);
      });
    });
  }

  setActiveNav();
  initReveal();
  initCounters();
  initTyping();
  initSkillPills();
})();
