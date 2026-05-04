document.addEventListener('DOMContentLoaded', () => {

  // ===== BURGER =====
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const body = document.body;
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  body.appendChild(overlay);

  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('burger--active');
      nav.classList.toggle('nav--open');
      overlay.classList.toggle('overlay--active');
      body.style.overflow = nav.classList.contains('nav--open') ? 'hidden' : '';
    });
    overlay.addEventListener('click', () => {
      burger.classList.remove('burger--active');
      nav.classList.remove('nav--open');
      overlay.classList.remove('overlay--active');
      body.style.overflow = '';
    });
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('burger--active');
        nav.classList.remove('nav--open');
        overlay.classList.remove('overlay--active');
        body.style.overflow = '';
      });
    });
  }

  // ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ВАЛИДАЦИИ =====

  function applyPhoneMask(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.startsWith('375')) {
      value = value.substring(3);
    }
    if (value.length > 9) value = value.substring(0, 9);
    let formatted = '+375';
    if (value.length > 0) formatted += ' ' + value.substring(0, 2);
    if (value.length > 2) formatted += ' ' + value.substring(2, 5);
    if (value.length > 5) formatted += '-' + value.substring(5, 7);
    if (value.length > 7) formatted += '-' + value.substring(7, 9);
    input.value = formatted;
  }

  function validateDates(checkin, checkout) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cin = new Date(checkin);
    const cout = new Date(checkout);
    cin.setHours(0, 0, 0, 0);
    cout.setHours(0, 0, 0, 0);
    if (cin < today) return 'Дата заезда не может быть в прошлом.';
    if (cout <= cin) return 'Дата выезда должна быть позже даты заезда.';
    return null;
  }

  function validatePhone(value) {
    const cleaned = value.replace(/\s/g, '').replace(/-/g, '');
    if (!/^\+375\d{9}$/.test(cleaned)) return 'Введите корректный номер телефона (формат: +375 29 686-03-07).';
    return null;
  }

  function validateEmail(value) {
    if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(value)) return 'Введите корректный email (английские буквы, @ и точка).';
    return null;
  }

  function validatePhoneOrEmail(value) {
    if (!value.trim()) return 'Введите телефон или email.';
    if (value.includes('@')) return validateEmail(value);
    return validatePhone(value);
  }

  function showFieldError(field, message) {
    const existing = field.parentElement.querySelector('.field-error');
    if (existing) existing.remove();
    const error = document.createElement('span');
    error.className = 'field-error';
    error.style.cssText = 'color:#c0392b;font-size:0.8rem;display:block;margin-top:2px;';
    error.textContent = message;
    field.parentElement.appendChild(error);
    field.style.borderColor = '#c0392b';
    setTimeout(() => {
      field.style.borderColor = '#e0e0e0';
      if (error.parentElement) error.remove();
    }, 4000);
  }

  function clearFieldErrors(form) {
    form.querySelectorAll('.field-error').forEach(e => e.remove());
    form.querySelectorAll('input, select, textarea').forEach(f => f.style.borderColor = '#e0e0e0');
  }

  // ===== HEADER BAR BOOKING =====
  const hbSubmit = document.getElementById('hb-submit');
  const hbSuccess = document.getElementById('hb-success');
  if (hbSubmit && hbSuccess) {
    hbSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      const checkin = document.getElementById('hb-checkin');
      const checkout = document.getElementById('hb-checkout');
      const guests = document.getElementById('hb-guests');
      const room = document.getElementById('hb-room');
      clearFieldErrors(checkin.closest('form') || document);
      let hasError = false;
      if (!checkin.value) { showFieldError(checkin, 'Выберите дату заезда.'); hasError = true; }
      if (!checkout.value) { showFieldError(checkout, 'Выберите дату выезда.'); hasError = true; }
      if (checkin.value && checkout.value) {
        const dateErr = validateDates(checkin.value, checkout.value);
        if (dateErr) { showFieldError(checkout, dateErr); hasError = true; }
      }
      if (!room.value) { showFieldError(room, 'Выберите тип номера.'); hasError = true; }
      if (hasError) return;
      const bar = document.getElementById('headerBar');
      const fields = bar ? bar.querySelectorAll('.header__bar-field') : null;
      if (fields) fields.forEach(f => f.style.display = 'none');
      if (hbSubmit) hbSubmit.style.display = 'none';
      hbSuccess.style.display = 'block';
      setTimeout(() => {
        hbSuccess.style.display = 'none';
        if (fields) fields.forEach(f => f.style.display = '');
        if (hbSubmit) hbSubmit.style.display = '';
        checkin.value = '';
        checkout.value = '';
        if (guests) guests.selectedIndex = 0;
        room.selectedIndex = 0;
      }, 3000);
    });
  }

  // ===== MAIN BOOKING FORM =====
  const mainForm = document.getElementById('mainBookingForm');
  const mainSuccess = document.getElementById('bookingFormSuccess');
  if (mainForm && mainSuccess) {
    mainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFieldErrors(mainForm);
      const checkin = document.getElementById('book-checkin');
      const checkout = document.getElementById('book-checkout');
      const room = document.getElementById('book-room');
      const contact = document.getElementById('book-contact');
      let hasError = false;
      if (!checkin.value) { showFieldError(checkin, 'Выберите дату заезда.'); hasError = true; }
      if (!checkout.value) { showFieldError(checkout, 'Выберите дату выезда.'); hasError = true; }
      if (checkin.value && checkout.value) {
        const dateErr = validateDates(checkin.value, checkout.value);
        if (dateErr) { showFieldError(checkout, dateErr); hasError = true; }
      }
      if (!room.value) { showFieldError(room, 'Выберите тип номера.'); hasError = true; }
      if (!contact.value.trim()) {
        showFieldError(contact, 'Введите телефон или email.');
        hasError = true;
      } else {
        const contactErr = validatePhoneOrEmail(contact.value);
        if (contactErr) { showFieldError(contact, contactErr); hasError = true; }
      }
      if (hasError) return;
      mainForm.style.display = 'none';
      mainSuccess.style.display = 'block';
      setTimeout(() => {
        mainForm.reset();
        mainForm.style.display = '';
        mainSuccess.style.display = 'none';
        mainForm.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
      }, 4000);
    });
  }

  // ===== CONTACT FORM =====
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactFormSuccess');
  if (contactForm && contactSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFieldErrors(contactForm);
      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');
      const phone = document.getElementById('contact-phone');
      const message = document.getElementById('contact-message');
      let hasError = false;
      if (!name.value.trim()) { showFieldError(name, 'Введите имя.'); hasError = true; }
      if (!email.value.trim()) {
        showFieldError(email, 'Введите email.');
        hasError = true;
      } else {
        const emailErr = validateEmail(email.value);
        if (emailErr) { showFieldError(email, emailErr); hasError = true; }
      }
      if (phone.value.trim()) {
        const phoneErr = validatePhone(phone.value);
        if (phoneErr) { showFieldError(phone, phoneErr); hasError = true; }
      }
      if (!message.value.trim()) { showFieldError(message, 'Введите сообщение.'); hasError = true; }
      if (hasError) return;
      contactForm.style.display = 'none';
      contactSuccess.style.display = 'block';
      setTimeout(() => {
        contactForm.reset();
        contactForm.style.display = '';
        contactSuccess.style.display = 'none';
      }, 4000);
    });
  }

  // ===== ОЧИСТКА ОШИБОК ПРИ ВВОДЕ =====
  document.addEventListener('input', (e) => {
    if (e.target.closest('form')) {
      const err = e.target.parentElement.querySelector('.field-error');
      if (err) err.remove();
      e.target.style.borderColor = '#e0e0e0';
    }
    if (e.target.id === 'contact-phone' || e.target.id === 'book-contact') {
      if (e.target.value.includes('@')) return;
      applyPhoneMask(e.target);
    }
  });

  // ===== NEWS SLIDER =====
  let newsData = [];
  let currentNews = 0;
  const track = document.getElementById('newsTrack');
  const dots = document.getElementById('newsDots');
  const prev = document.getElementById('newsPrev');
  const next = document.getElementById('newsNext');

  function renderNews() {
    if (!track) return;
    track.innerHTML = '';
    dots.innerHTML = '';
    newsData.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'news__card' + (i === 0 ? ' news__card--active' : '');
      card.innerHTML = `
        <div class="news__card-image"><img src="${item.image}" alt="${item.title}" loading="lazy"></div>
        <div class="news__card-body">
          <span class="news__card-badge">${item.badge}</span>
          <h3 class="news__card-title">${item.title}</h3>
          <p class="news__card-desc">${item.desc}</p>
          <a href="about.html" class="news__card-link">Подробнее →</a>
        </div>`;
      track.appendChild(card);
      const dot = document.createElement('span');
      dot.className = 'news__dot' + (i === 0 ? ' news__dot--active' : '');
      dot.addEventListener('click', () => goToNews(i));
      dots.appendChild(dot);
    });
  }

  function goToNews(index) {
    const cards = track ? track.querySelectorAll('.news__card') : [];
    const allDots = dots ? dots.querySelectorAll('.news__dot') : [];
    if (!cards.length) return;
    cards[currentNews].classList.remove('news__card--active');
    if (allDots.length) allDots[currentNews].classList.remove('news__dot--active');
    currentNews = ((index % newsData.length) + newsData.length) % newsData.length;
    cards[currentNews].classList.add('news__card--active');
    if (allDots.length) allDots[currentNews].classList.add('news__dot--active');
  }

  if (prev) prev.addEventListener('click', () => goToNews(currentNews - 1));
  if (next) next.addEventListener('click', () => goToNews(currentNews + 1));

  // ===== LOAD NEWS XML =====
  loadXML('data/news.xml', (xml) => {
    const items = xml.querySelectorAll('news > item');
    newsData = [];
    items.forEach(item => {
      newsData.push({
        title: item.querySelector('title').textContent,
        desc: item.querySelector('description').textContent,
        badge: item.querySelector('badge').textContent,
        image: item.querySelector('image').textContent
      });
    });
    renderNews();
  });

  // ===== LOAD SERVICES XML =====
  loadXML('data/services.xml', (xml) => {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    const items = xml.querySelectorAll('services > service');
    grid.innerHTML = '';
    items.forEach(item => {
      const name = item.querySelector('name').textContent;
      const desc = item.querySelector('description').textContent;
      const icon = item.querySelector('icon').textContent;
      const bg = item.querySelector('bg').textContent;
      const procedures = item.querySelectorAll('procedure');
      let procHTML = '';
      procedures.forEach(p => { procHTML += `<li>${p.textContent}</li>`; });
      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = `
        <div class="service-card__bg">
          <img src="${bg}" alt="" loading="lazy">
          <div class="service-card__overlay-box">
            <div class="service-card__icon"><img src="${icon}" alt=""></div>
            <h3 class="service-card__title">${name}</h3>
          </div>
        </div>
        <div class="service-card__body">
          <p class="service-card__desc">${desc}</p>
          <ul class="service-card__list">${procHTML}</ul>
        </div>`;
      grid.appendChild(card);
    });
  });

  // ===== LOAD ROOMS XML =====
  loadXML('data/rooms.xml', (xml) => {
    const grid = document.getElementById('roomsGrid');
    if (!grid) return;
    const items = xml.querySelectorAll('rooms > room');
    grid.innerHTML = '';
    items.forEach(item => {
      const name = item.querySelector('name').textContent;
      const price = item.querySelector('price').textContent;
      const size = item.querySelector('size').textContent;
      const capacity = item.querySelector('capacity').textContent;
      const desc = item.querySelector('description').textContent;
      const image = item.querySelector('image').textContent;
      const amenityNodes = item.querySelectorAll('amenity');
      let amenitiesHTML = '';
      amenityNodes.forEach(a => { amenitiesHTML += `<span><img src="icons/check.svg" alt=""> ${a.textContent}</span>`; });
      const badge = item.querySelector('badge') ? item.querySelector('badge').textContent : '';
      const card = document.createElement('div');
      card.className = 'room-card';
      card.innerHTML = `
        <div class="room-card__image">
          <img src="${image}" alt="${name}" loading="lazy">
          ${badge ? `<span class="room-card__badge">${badge}</span>` : ''}
        </div>
        <div class="room-card__body">
          <p class="room-card__price">от ${price} BYN <span>/ ночь</span></p>
          <h3 class="room-card__name">${name}</h3>
          <p class="room-card__meta">${size} • ${capacity}</p>
          <p class="room-card__desc">${desc}</p>
          <div class="room-card__amenities">${amenitiesHTML}</div>
          <a href="booking.html" class="btn btn--green room-card__btn">Бронировать</a>
        </div>`;
      grid.appendChild(card);
    });
  });

  // ===== HELPER =====
  function loadXML(url, callback) {
    fetch(url)
      .then(r => { if (!r.ok) throw new Error('XML not loaded'); return r.text(); })
      .then(str => { callback(new DOMParser().parseFromString(str, 'application/xml')); })
      .catch(err => console.warn('XML load error:', err));
  }
});