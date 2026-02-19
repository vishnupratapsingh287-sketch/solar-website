// ===== MOBILE MENU =====
function toggleMenu() {
  const nav = document.querySelector('.nav-links');
  nav.classList.toggle('open');
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== CONTACT FORM SUBMISSION =====
document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const formData = {
    name: this.name.value,
    email: this.email.value,
    phone: this.phone.value,
    service: this.service.value,
    message: this.message.value,
  };

  const msgBox = document.getElementById('formMsg');
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const res = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      msgBox.className = 'form-msg success';
      msgBox.textContent = '✅ Message sent! We\'ll contact you within 24 hours.';
      this.reset();
    } else {
      throw new Error(data.message || 'Something went wrong');
    }
  } catch (err) {
    msgBox.className = 'form-msg error';
    msgBox.textContent = '❌ ' + err.message + '. Please try again or email us directly.';
  }

  btn.textContent = 'Send Message ✉️';
  btn.disabled = false;
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.why-card, .service-card, .product-card, .testimonial-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});