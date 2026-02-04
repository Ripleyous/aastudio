(function () {
  'use strict';

  /* ----- Mobile menu ----- */
  var nav = document.getElementById('main-nav');
  var toggle = document.getElementById('menu-toggle');
  var links = nav ? nav.querySelectorAll('a[href^="#"]') : [];

  function openMenu() {
    if (!nav || !toggle) return;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (nav.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (toggle) {
    toggle.addEventListener('click', toggleMenu);
  }

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav && nav.classList.contains('is-open')) {
      closeMenu();
    }
  });

  /* ----- Hero parallax ----- */
  var parallaxBg = document.querySelector('[data-parallax-bg]');
  var hero = document.getElementById('hero');

  function updateParallax() {
    if (!parallaxBg || !hero) return;
    var rect = hero.getBoundingClientRect();
    var centerY = rect.top + rect.height / 2;
    var viewportCenter = window.innerHeight / 2;
    var offset = (centerY - viewportCenter) * 0.15;
    parallaxBg.style.transform = 'translate3d(0, ' + offset + 'px, 0)';
  }

  if (parallaxBg && hero) {
    window.addEventListener('scroll', function () {
      requestAnimationFrame(updateParallax);
    });
    window.addEventListener('resize', updateParallax);
    updateParallax();
  }

  /* ----- Gallery lightbox ----- */
  var galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');
  var lightbox = document.getElementById('gallery-lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxPrev = document.getElementById('lightbox-prev');
  var lightboxNext = document.getElementById('lightbox-next');
  var galleryUrls = [];
  var currentIndex = 0;

  if (galleryItems.length) {
    galleryItems.forEach(function (item) {
      var img = item.querySelector('img');
      var src = img ? img.src : item.getAttribute('href');
      if (src) galleryUrls.push(src);
    });
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImg || !galleryUrls[index]) return;
    currentIndex = index;
    lightboxImg.src = galleryUrls[currentIndex];
    lightboxImg.alt = 'AA Studio – cvičení';
    lightbox.setAttribute('aria-hidden', 'false');
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  function lightboxPrevImg() {
    currentIndex = currentIndex <= 0 ? galleryUrls.length - 1 : currentIndex - 1;
    openLightbox(currentIndex);
  }

  function lightboxNextImg() {
    currentIndex = currentIndex >= galleryUrls.length - 1 ? 0 : currentIndex + 1;
    openLightbox(currentIndex);
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      openLightbox(index);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', lightboxPrevImg);
  }
  if (lightboxNext) {
    lightboxNext.addEventListener('click', lightboxNextImg);
  }

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || lightbox.getAttribute('aria-hidden') === 'true') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrevImg();
    if (e.key === 'ArrowRight') lightboxNextImg();
  });

  /* ----- Reviews slider (moderní auto-play) ----- */
  var reviewsSlider = document.getElementById('reviews-slider');
  var reviewsTrack = document.getElementById('reviews-track');
  var reviewsPrev = document.getElementById('reviews-prev');
  var reviewsNext = document.getElementById('reviews-next');
  var reviewsDotsEl = document.getElementById('reviews-dots');
  var slides = document.querySelectorAll('.review-slide');
  var totalSlides = slides.length;
  var currentSlide = 0;
  var reviewsAutoTimer = null;
  var REVIEWS_AUTO_INTERVAL = 6000;

  function setActiveSlide(index) {
    var cards = document.querySelectorAll('.review-card');
    cards.forEach(function (card, i) {
      card.classList.toggle('is-active', i === index);
    });
  }

  function goToSlide(index, smooth) {
    if (!reviewsTrack || totalSlides === 0) return;
    currentSlide = (index + totalSlides) % totalSlides;
    var offset = -currentSlide * 100;
    
    if (smooth === false) {
      reviewsTrack.style.transition = 'none';
      reviewsTrack.style.transform = 'translateX(' + offset + '%)';
      requestAnimationFrame(function() {
        reviewsTrack.style.transition = '';
      });
    } else {
      reviewsTrack.style.transform = 'translateX(' + offset + '%)';
    }
    
    updateDots();
    setActiveSlide(currentSlide);
  }

  function updateDots() {
    if (!reviewsDotsEl) return;
    var dots = reviewsDotsEl.querySelectorAll('.reviews-dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === currentSlide);
      dot.setAttribute('aria-current', i === currentSlide ? 'true' : 'false');
    });
  }

  function startReviewsAuto() {
    stopReviewsAuto();
    reviewsAutoTimer = setInterval(function () {
      goToSlide(currentSlide + 1);
    }, REVIEWS_AUTO_INTERVAL);
  }

  function stopReviewsAuto() {
    if (reviewsAutoTimer) {
      clearInterval(reviewsAutoTimer);
      reviewsAutoTimer = null;
    }
  }

  if (reviewsTrack && totalSlides) {
    for (var i = 0; i < totalSlides; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'reviews-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Reference ' + (i + 1));
      dot.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      (function (idx) {
        dot.addEventListener('click', function () {
          goToSlide(idx);
          startReviewsAuto();
        });
      })(i);
      reviewsDotsEl.appendChild(dot);
    }
    setActiveSlide(0);
    startReviewsAuto();
  }

  if (reviewsSlider) {
    reviewsSlider.addEventListener('mouseenter', stopReviewsAuto);
    reviewsSlider.addEventListener('mouseleave', startReviewsAuto);
    reviewsSlider.addEventListener('focusin', stopReviewsAuto);
    reviewsSlider.addEventListener('focusout', startReviewsAuto);
  }

  if (reviewsPrev) {
    reviewsPrev.addEventListener('click', function () {
      goToSlide(currentSlide - 1);
      startReviewsAuto();
    });
  }
  if (reviewsNext) {
    reviewsNext.addEventListener('click', function () {
      goToSlide(currentSlide + 1);
      startReviewsAuto();
    });
  }

  /* ----- Booking form ----- */
  var bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = bookingForm.querySelector('[name="name"]');
      var email = bookingForm.querySelector('[name="email"]');
      var phone = bookingForm.querySelector('[name="phone"]');
      var lesson = bookingForm.querySelector('[name="lesson"]');
      var message = bookingForm.querySelector('[name="message"]');
      var subject = 'Rezervace lekce: ' + (lesson && lesson.value ? lesson.value : 'AA Studio');
      var body = 'Dobrý den,\n\nrád/a bych rezervoval/a lekci.\n\n';
      if (name && name.value) body += 'Jméno: ' + name.value + '\n';
      if (email && email.value) body += 'E-mail: ' + email.value + '\n';
      if (phone && phone.value) body += 'Telefon: ' + phone.value + '\n';
      if (lesson && lesson.value) body += 'Lekce: ' + lesson.value + '\n';
      if (message && message.value) body += '\nZpráva: ' + message.value + '\n';
      var mailto = 'mailto:aastudiokladno@seznam.cz?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
    });
  }
})();
