const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// Navbar ao rolar
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 30);
});

// Menu mobile
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  document.body.classList.toggle("menu-open");

  const icon = menuToggle.querySelector("i");
  icon.className = navLinks.classList.contains("open")
    ? "bi bi-x-lg"
    : "bi bi-list";
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.querySelector("i").className = "bi bi-list";
  });
});

// Animação ao aparecer na tela
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

// Contadores
const counters = document.querySelectorAll(".counter");
let countersStarted = false;

const metricSection = document.querySelector(".metrics-section");

const counterObserver = new IntersectionObserver(
  (entries) => {
    if (!entries[0].isIntersecting || countersStarted) return;

    countersStarted = true;

    counters.forEach((counter) => {
      const target = Number(counter.dataset.target);
      const duration = 1300;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });

    counterObserver.disconnect();
  },
  { threshold: 0.5 }
);

if (metricSection) {
  counterObserver.observe(metricSection);
}

// Carrosséis
document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".slide")];
  const prevButton = carousel.querySelector(".prev");
  const nextButton = carousel.querySelector(".next");
  const dotsContainer = carousel.querySelector(".carousel-dots");

  let current = 0;
  let timer;

  // Se uma imagem não existir, mostra o placeholder.
  slides.forEach((slide) => {
    const img = slide.querySelector("img");
    const placeholder = slide.querySelector(".slide-placeholder");

    img.addEventListener("error", () => {
      img.style.display = "none";
      placeholder.style.zIndex = "1";
    });
  });

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.className = `carousel-dot ${index === 0 ? "active" : ""}`;
    dot.setAttribute("aria-label", `Ir para imagem ${index + 1}`);

    dot.addEventListener("click", () => {
      showSlide(index);
      restartAutoPlay();
    });

    dotsContainer.appendChild(dot);
    return dot;
  });

  function showSlide(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");

    current = (index + slides.length) % slides.length;

    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  function nextSlide() {
    showSlide(current + 1);
  }

  function prevSlide() {
    showSlide(current - 1);
  }

  function startAutoPlay() {
    timer = setInterval(nextSlide, 4500);
  }

  function restartAutoPlay() {
    clearInterval(timer);
    startAutoPlay();
  }

  nextButton.addEventListener("click", () => {
    nextSlide();
    restartAutoPlay();
  });

  prevButton.addEventListener("click", () => {
    prevSlide();
    restartAutoPlay();
  });

  carousel.addEventListener("mouseenter", () => clearInterval(timer));
  carousel.addEventListener("mouseleave", startAutoPlay);

  startAutoPlay();
});

// FAQ
document.querySelectorAll(".faq-item").forEach((item) => {
  const button = item.querySelector(".faq-question");

  button.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    document.querySelectorAll(".faq-item").forEach((faq) => {
      faq.classList.remove("active");
    });

    if (!isActive) {
      item.classList.add("active");
    }
  });
});

// Ano automático
document.getElementById("currentYear").textContent = new Date().getFullYear();


// Progresso de leitura no topo
const scrollProgress = document.createElement("div");
scrollProgress.className = "scroll-progress";
document.body.appendChild(scrollProgress);

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  scrollProgress.style.width = `${Math.min(progress, 100)}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

// Destaca automaticamente a seção atual na navegação
const navSectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const observedSections = navSectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navSectionLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${visible.target.id}`
      );
    });
  },
  { rootMargin: "-35% 0px -50% 0px", threshold: [0, .2, .5] }
);

observedSections.forEach((section) => activeSectionObserver.observe(section));
