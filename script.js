/* ─────────────────────────────────────────────────────────────
   DINESH SRIRAM VELAN — Portfolio  |  script.js
   Responsive Sidebar Navigation, Smooth Scrolling, Scroll Reveal,
   Active Navigation Spy & EmailJS Contact Form
───────────────────────────────────────────────────────────── */

/* ── 1. Loading Screen ──────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 350);
  }
});

/* ── 2. Top Navbar & Mobile Menu Toggle ─────────────────────── */
const hamburger = document.getElementById('hamburger');
const topNavbar = document.getElementById('navbar');
const navBackdrop = document.getElementById('nav-backdrop');

function closeMobileMenu() {
  if (hamburger) {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
  if (topNavbar) {
    topNavbar.classList.remove('menu-open');
  }
  if (navBackdrop) {
    navBackdrop.classList.remove('active');
  }
  document.body.style.overflow = '';
}

function openMobileMenu() {
  if (hamburger) {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }
  if (topNavbar) {
    topNavbar.classList.add('menu-open');
  }
  if (navBackdrop) {
    navBackdrop.classList.add('active');
  }
  if (window.innerWidth <= 860) {
    document.body.style.overflow = 'hidden';
  }
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
}

if (navBackdrop) {
  navBackdrop.addEventListener('click', closeMobileMenu);
}

// Close mobile menu whenever any navigation link or mobile button is clicked
document.querySelectorAll('.navbar-nav .nav-link, .mobile-nav .nav-link, .mobile-menu .btn').forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});

// Close mobile menu on ESC key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && topNavbar && topNavbar.classList.contains('menu-open')) {
    closeMobileMenu();
  }
});

// Reset body overflow if resized to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 860) {
    closeMobileMenu();
  }
}, { passive: true });

/* ── 3. Active Nav Link on Scroll (Scroll Spy) & Navbar Scrolled State ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .mobile-nav .nav-link');

function updateActiveNav() {
  const scrollPosition = window.scrollY + 110;
  let currentSectionId = '';

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollPosition >= top && scrollPosition < top + height) {
      currentSectionId = id;
    }
  });

  // Default to hero if at top of page
  if (window.scrollY < 80) {
    currentSectionId = 'hero';
  }

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === `#${currentSectionId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Toggle subtle navbar elevation shadow on scroll
  if (topNavbar) {
    if (window.scrollY > 20) {
      topNavbar.classList.add('scrolled');
    } else {
      topNavbar.classList.remove('scrolled');
    }
  }
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
// Trigger once on init
updateActiveNav();

/* ── 4. Smooth Scroll for Anchor Links ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 5. Scroll Reveal Animations ────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Stagger children of grid containers
      const parentGrid = entry.target.closest('.skills-grid, .projects-grid, .why-grid, .cert-grid');
      const delay = parentGrid
        ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 70
        : 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── 6. EmailJS Initialisation ──────────────────────────────── */
const EMAILJS_PUBLIC_KEY = 'puQa53yHBr3zy2uMG';
const EMAILJS_SERVICE_ID = 'service_qxckmrk';
const EMAILJS_TEMPLATE_ID = 'template_g67xsrk';

if (typeof emailjs !== 'undefined') {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

/* ── 7. Contact Form Submission ─────────────────────────────── */
const form = document.getElementById('contact-form');
const formNotice = document.getElementById('form-notice');
const submitBtn = document.getElementById('form-submit-btn');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (formNotice) {
      formNotice.className = 'form-notice';
      formNotice.textContent = '';
    }

    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    // Basic validation
    if (!name || !email || !message) {
      showNotice('Please fill in all fields.', 'error');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showNotice('Please enter a valid email address.', 'error');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
    }

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
      to_name: 'Dinesh',
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
        }
        showNotice(`Thanks ${name}! Your message has been sent. I'll reply to ${email} soon. ✅`, 'success');
        form.reset();
      })
      .catch(err => {
        console.error('EmailJS error:', err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
        }
        const errMsg = err && err.text ? err.text : (err && err.status ? `Error ${err.status}` : JSON.stringify(err));
        showNotice(`Error: ${errMsg}`, 'error');
      });
  });
}

function showNotice(message, type) {
  if (formNotice) {
    formNotice.textContent = message;
    formNotice.className = `form-notice ${type}`;
  }
}

/* ── 8. Legacy hireMe() Function (Safe fallback) ─────────────── */
function hireMe() {
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  }
}