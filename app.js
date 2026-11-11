const detail = document.querySelector('#project-detail');
function enableLightbox(image) {
  image.dataset.lightbox = 'true';
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `View full photograph: ${image.alt}`);
  image.setAttribute('aria-haspopup', 'dialog');
}
// Preserve old project URLs without a separate data request.
if (detail?.dataset.legacy === 'true') {
  const slug = new URLSearchParams(window.location.search).get('project');
  if (slug) {
    const canonicalSlug = slug === 'radiance-in-bloom' ? 'rajasree-pellikuthuru' : slug;
    const projects = new Set(['the-eternal-root', 'the-eternal-sanctuary', 'the-palace-of-petals', 'crystalline-whimsy', 'red-revelry', 'the-crimson-olive-gallery', 'rajasree-pellikuthuru', 'the-earthy-haldi', 'traces-of-tradition']);
    if (projects.has(canonicalSlug)) {
      window.location.replace('celebrations/' + canonicalSlug + '.html');
    } else {
      document.querySelector('#detail-title').textContent = 'Celebration not found';
      document.querySelector('#detail-description').textContent = 'This celebration is unavailable. Explore our portfolio to find your inspiration.';
    }
  }
}

detail?.querySelectorAll('.project-gallery img').forEach(enableLightbox);

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const header = document.querySelector('.header');
function updateStickyHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 32);
}
window.addEventListener('scroll', updateStickyHeader, { passive: true });
updateStickyHeader();
new ResizeObserver(() => {
  document.documentElement.style.setProperty('--header-offset', `${header.offsetHeight + 16}px`);
}).observe(header);
const mobileMenu = window.matchMedia('(max-width:650px)');
const menuDrawer = document.createElement('dialog');
menuDrawer.className = 'menu-drawer';
menuDrawer.id = 'mobile-navigation';
menuDrawer.setAttribute('aria-labelledby', 'drawer-title');
const drawerHeader = document.createElement('div');
drawerHeader.className = 'drawer-header';
const drawerTitle = document.createElement('p');
drawerTitle.id = 'drawer-title';
drawerTitle.className = 'sr-only';
drawerTitle.textContent = 'Two Fold Destiny';
const drawerClose = document.createElement('button');
drawerClose.className = 'drawer-close';
drawerClose.type = 'button';
drawerClose.textContent = '\u00d7';
drawerClose.setAttribute('aria-label', 'Close navigation');
const drawerBrand = document.createElement('a');
drawerBrand.className = 'drawer-brand';
drawerBrand.href = header.querySelector('.wordmark').getAttribute('href');
drawerBrand.setAttribute('aria-label', 'Two Fold Destiny home');
const drawerLogo = document.createElement('img');
drawerLogo.src = header.querySelector('.logo-brown').getAttribute('src');
drawerLogo.alt = 'Two Fold Destiny';
drawerLogo.width = 675;
drawerLogo.height = 299;
drawerBrand.append(drawerLogo);
drawerHeader.append(drawerTitle, drawerClose, drawerBrand);
const drawerLinks = navigation.cloneNode(true);
drawerLinks.removeAttribute('id');
drawerLinks.className = 'drawer-links';
drawerLinks.setAttribute('aria-label', 'Mobile navigation');
const drawerEnquiry = document.createElement('a');
drawerEnquiry.className = 'button drawer-enquiry';
drawerEnquiry.href = new URL('contact.html', drawerBrand.href).href;
drawerEnquiry.textContent = 'Enquire now';
const drawerDescription = document.createElement('p');
drawerDescription.className = 'drawer-description';
drawerDescription.textContent = 'Where two stories meet, and become one experience.';
const drawerSocial = document.createElement('div');
drawerSocial.className = 'drawer-social';
const drawerSocialLinks = [
  {label:'Instagram',href:'https://www.instagram.com/twofolddestiny.co/',icon:'fa-instagram'},
  {label:'Email',href:'mailto:twofolddestiny@gmail.com',icon:'fa-envelope-o'},
  {label:'WhatsApp',href:'https://wa.me/918179578884',icon:'fa-whatsapp'}
];
drawerSocialLinks.forEach(item => {
  const link = document.createElement('a');
  link.href = item.href;
  link.setAttribute('aria-label', item.label);
  if (item.href.startsWith('https:')) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
  const icon = document.createElement('i');
  icon.className = 'fa ' + item.icon;
  icon.setAttribute('aria-hidden', 'true');
  link.append(icon);
  drawerSocial.append(link);
});
menuDrawer.append(drawerHeader, drawerLinks, drawerDescription, drawerEnquiry, drawerSocial);
document.body.append(menuDrawer);
function closeMenu() {
  if (menuDrawer.open) menuDrawer.close();
}
function syncMenuTarget() {
  menu.setAttribute('aria-controls', mobileMenu.matches ? menuDrawer.id : navigation.id);
  if (!mobileMenu.matches) closeMenu();
}
menu.addEventListener('click', () => {
  if (!mobileMenu.matches || menuDrawer.open) return;
  menuDrawer.showModal();
  menu.setAttribute('aria-expanded', 'true');
  document.body.classList.add('drawer-open');
});
drawerClose.addEventListener('click', closeMenu);
menuDrawer.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
menuDrawer.addEventListener('close', () => {
  document.body.classList.remove('drawer-open');
  menu.setAttribute('aria-expanded', 'false');
  if (mobileMenu.matches) menu.focus({ preventScroll: true });
});
menuDrawer.addEventListener('click', event => {
  if (event.target !== menuDrawer) return;
  const bounds = menuDrawer.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeMenu();
});
mobileMenu.addEventListener('change', syncMenuTarget);
syncMenuTarget();
if (typeof menuDrawer.showModal === 'function') header.classList.add('has-menu-drawer');

const enquiry = document.querySelector('#enquiry');
// Netlify handles the native POST after deployment. Local previews cannot save enquiries.
if (enquiry && ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)) {
  enquiry.addEventListener('submit', event => {
    event.preventDefault();
    document.querySelector('#form-status').textContent = 'Form submissions will work after deployment to Netlify. You can contact us directly using the links alongside this form.';
  });
}
document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelectorAll('.photo-ribbon').forEach((track, carouselIndex) => {
  const slides = Array.from(track.children);
  if (slides.length < 2) return;

  const carousel = document.createElement('section');
  carousel.className = 'photo-carousel';
  carousel.setAttribute('aria-label', 'Celebration photographs');
  carousel.setAttribute('aria-roledescription', 'carousel');
  track.before(carousel);
  carousel.append(track);
  track.id = `photo-carousel-${carouselIndex}`;
  track.tabIndex = 0;
  track.setAttribute('aria-label', 'Swipe or use arrow keys to explore photographs');
  slides.forEach((slide, index) => {
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${slides.length}`);
  });
  // Keep a complete copy on either side so wrapping never exposes an edge.
  function copySlides() {
    return slides.map(slide => {
      const copy = slide.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.inert = true;
      copy.removeAttribute('id');
      copy.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
      return copy;
    });
  }
  track.prepend(...copySlides());
  track.append(...copySlides());
  const allSlides = Array.from(track.children);
  const count = slides.length;
  let currentIndex = Math.floor(count / 2);
  let settleTimer;

  const controls = document.createElement('div');
  controls.className = 'carousel-controls';
  const previous = document.createElement('button');
  previous.type = 'button';
  previous.textContent = '\u2190';
  previous.setAttribute('aria-label', 'Previous photo grid');
  const next = document.createElement('button');
  next.type = 'button';
  next.textContent = '\u2192';
  next.setAttribute('aria-label', 'Next photo grid');
  previous.setAttribute('aria-controls', track.id);
  next.setAttribute('aria-controls', track.id);
  const status = document.createElement('span');
  status.className = 'carousel-status';
  controls.append(previous, status, next);
  carousel.append(controls);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function nearestSlide() {
    const centre = track.scrollLeft + track.clientWidth / 2;
    return allSlides.reduce((nearest, slide, index) =>
      Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - centre) <
      Math.abs(allSlides[nearest].offsetLeft + allSlides[nearest].offsetWidth / 2 - centre)
        ? index : nearest, 0);
  }
  function updateControls() {
    currentIndex = nearestSlide() % count;
    status.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
  }
  function moveTo(index, instant = false) {
    const slide = allSlides[index];
    if (!slide) return;
    track.scrollTo({
      left: slide.offsetLeft + slide.offsetWidth / 2 - track.clientWidth / 2,
      behavior: instant || reducedMotion.matches ? 'instant' : 'smooth'
    });
  }
  function settle() {
    clearTimeout(settleTimer);
    const index = nearestSlide();
    if (index < count || index >= count * 2) {
      const equivalent = count + index % count;
      // Preserve the exact visual offset when returning to the middle copy.
      track.scrollTo({
        left: track.scrollLeft + allSlides[equivalent].offsetLeft - allSlides[index].offsetLeft,
        behavior: 'instant'
      });
    }
    updateControls();
  }
  previous.addEventListener('click', () => moveTo(nearestSlide() - 1));
  next.addEventListener('click', () => moveTo(nearestSlide() + 1));
  track.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') moveTo(count);
    else if (event.key === 'End') moveTo(count * 2 - 1);
    else moveTo(nearestSlide() + (event.key === 'ArrowRight' ? 1 : -1));
  });
  track.addEventListener('scroll', () => {
    updateControls();
    clearTimeout(settleTimer);
    settleTimer = setTimeout(settle, 160);
  }, { passive: true });
  track.addEventListener('scrollend', settle);
  new ResizeObserver(() => {
    clearTimeout(settleTimer);
    moveTo(count + currentIndex, true);
    updateControls();
  }).observe(track);
  moveTo(count + currentIndex, true);
  updateControls();
});

if (detail) {
const lightbox = document.createElement('dialog');
lightbox.className = 'lightbox';
lightbox.setAttribute('aria-label', 'Photograph viewer');
const lightboxImage = document.createElement('img');
const lightboxControls = document.createElement('div');
lightboxControls.className = 'lightbox-controls';
function lightboxButton(label, text) {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', label);
  button.textContent = text;
  return button;
}
const lightboxPrevious = lightboxButton('Previous photograph', '\u2190');
const lightboxNext = lightboxButton('Next photograph', '\u2192');
const lightboxClose = lightboxButton('Close photograph viewer', 'Close \u00d7');
const lightboxStatus = document.createElement('span');
lightboxStatus.setAttribute('aria-live', 'polite');
lightboxControls.append(lightboxPrevious, lightboxStatus, lightboxNext, lightboxClose);
lightbox.append(lightboxImage, lightboxControls);
document.body.append(lightbox);
let lightboxImages = [], lightboxIndex = 0, lightboxTrigger;
function showLightboxImage(index) {
  lightboxIndex = (index + lightboxImages.length) % lightboxImages.length;
  const image = lightboxImages[lightboxIndex];
  lightboxImage.src = image.getAttribute('src');
  lightboxImage.alt = image.alt;
  lightboxStatus.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
  lightboxPrevious.hidden = lightboxNext.hidden = lightboxImages.length < 2;
}
function openLightbox(image) {
  const group = image.closest('#project-detail .project-gallery');
  if (!group) return;
  lightboxImages = Array.from(group.querySelectorAll('img[data-lightbox]'));
  lightboxTrigger = image;
  showLightboxImage(Math.max(0, lightboxImages.indexOf(image)));
  lightbox.showModal();
  document.body.classList.add('modal-open');
}
lightboxClose.addEventListener('click', () => lightbox.close());
lightboxPrevious.addEventListener('click', () => showLightboxImage(lightboxIndex - 1));
lightboxNext.addEventListener('click', () => showLightboxImage(lightboxIndex + 1));
lightbox.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  lightboxImage.removeAttribute('src');
  lightboxTrigger?.focus({ preventScroll: true });
});
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showLightboxImage(lightboxIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
document.addEventListener('click', event => {
  const image = event.target.closest('#project-detail .project-gallery img[data-lightbox]');
  if (!image) return;
  event.preventDefault();
  openLightbox(image);
});
document.addEventListener('keydown', event => {
  if (!(event.target instanceof HTMLImageElement) || !event.target.dataset.lightbox) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openLightbox(event.target);
  }
});





}

const journeySections = Array.from(document.querySelectorAll('.process-section'));
if (journeySections.length) {
  const journeyMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const journeyMobile = window.matchMedia('(max-width:760px)');
  const clampJourney = value => Math.min(1, Math.max(0, value));
  let journeyFrame = 0;
  const journeys = journeySections.map(section => ({
    section,
    body: section.querySelector('.process-journey'),
    svg: section.querySelector('.journey-svg'),
    guide: section.querySelector('.journey-guide'),
    trail: section.querySelector('.journey-trail'),
    plane: section.querySelector('.journey-plane'),
    stops: section.querySelector('.journey-stops'),
    chapters: Array.from(section.querySelectorAll('.process-chapter')),
    length: 0
  }));
  function measureJourneys() {
    journeys.forEach(journey => {
      const {section, body, svg, guide, trail, stops, chapters} = journey;
      section.classList.toggle('has-journey-motion', !journeyMotion.matches);
      if (journeyMotion.matches) return;
      const width = body.clientWidth;
      const mobile = journeyMobile.matches;
      const height = mobile ? body.clientHeight : 150;
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      let route, points;
      if (mobile) {
        const top = body.getBoundingClientRect().top;
        points = chapters.map(chapter => {
          const photo = chapter.querySelector('.chapter-photo').getBoundingClientRect();
          return {x:12,y:photo.top - top + photo.height/2};
        });
        route = `M12 ${points[0].y} ${points.slice(1).map((point,index) => {
          const before = points[index].y;
          return `C 4 ${before + (point.y-before)/3}, 20 ${before + (point.y-before)*2/3}, 12 ${point.y}`;
        }).join(' ')}`;
      } else {
        const bodyLeft = body.getBoundingClientRect().left;
        points = chapters.map(chapter => {
          const bounds = chapter.getBoundingClientRect();
          return {x:bounds.left - bodyLeft + bounds.width/2,y:80};
        });
        route = `M${points[0].x} 80 ${points.slice(1).map((point,index) => {
          const before = points[index].x;
          const third = (point.x-before)/3;
          return `C ${before+third} 20, ${point.x-third} 140, ${point.x} 80`;
        }).join(' ')}`;
      }
      guide.setAttribute('d',route);
      trail.setAttribute('d',route);
      journey.length = trail.getTotalLength();
      trail.style.strokeDasharray = journey.length;
      stops.replaceChildren();
      points.forEach(point => {
        if (!mobile) {
          const line = document.createElementNS('http://www.w3.org/2000/svg','line');
          line.setAttribute('x1',point.x);line.setAttribute('x2',point.x);
          line.setAttribute('y1',point.y+7);line.setAttribute('y2',140);stops.append(line);
        }
        const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
        dot.setAttribute('cx',point.x);dot.setAttribute('cy',point.y);dot.setAttribute('r',mobile ? 3 : 4);stops.append(dot);
      });
    });
    updateJourneys();
  }
  function updateJourneys() {
    journeyFrame = 0;
    if (journeyMotion.matches) return;
    journeys.forEach(({body, trail, plane, stops, chapters, length}) => {
      const rect = body.getBoundingClientRect();
      const mobile = journeyMobile.matches;
      const progress = clampJourney((window.innerHeight*.82 - rect.top) / Math.max(1,mobile ? rect.height-window.innerHeight*.2 : rect.height*.85));
      const distance = progress*length;
      trail.style.strokeDashoffset = length-distance;
      const point=trail.getPointAtLength(distance);
      const before=trail.getPointAtLength(Math.max(0,distance-1));
      const after=trail.getPointAtLength(Math.min(length,distance+1));
      const angle=Math.atan2(after.y-before.y,after.x-before.x)*180/Math.PI;
      plane.setAttribute('transform',`translate(${point.x} ${point.y}) rotate(${angle}) scale(${mobile ? .6 : 1})`);
      chapters.forEach((chapter,index) => {
        const arrival = mobile
          ? clampJourney((window.innerHeight*.82-chapter.getBoundingClientRect().top)/(Math.min(chapter.offsetHeight,window.innerHeight)*.6))
          : clampJourney((progress-index/Math.max(1,chapters.length-1)+.24)/.24);
        chapter.style.setProperty('--arrival',arrival);
      });
      stops.querySelectorAll('circle').forEach((dot,index)=>dot.classList.toggle('is-passed', progress >= index/Math.max(1,chapters.length-1)));
    });
  }
  function scheduleJourney() {
    if (!journeyFrame) journeyFrame=requestAnimationFrame(updateJourneys);
  }
  window.addEventListener('scroll',scheduleJourney,{passive:true});
  window.addEventListener('resize',measureJourneys);
  journeyMotion.addEventListener('change',measureJourneys);
  const journeyResize=new ResizeObserver(measureJourneys);
  journeys.forEach(({body})=>journeyResize.observe(body));
  measureJourneys();
}

const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
  const toggle = document.querySelector('.hero-video-toggle');
  const videoMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const videoMobile = window.matchMedia('(max-width:650px)');
  const connection = navigator.connection;
  let userPaused = false;
  function updateVideoControl() {
    const paused = heroVideo.paused;
    toggle.classList.toggle('is-paused', paused);
    toggle.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
    toggle.title = paused ? 'Play video' : 'Pause video';
  }
  function startHeroVideo() {
    if (videoMotion.matches || connection?.saveData) {
      heroVideo.pause();
      heroVideo.removeAttribute('src');
      heroVideo.load();
      heroVideo.classList.remove('is-playing');
      toggle.hidden = true;
      return;
    }
    const source = videoMobile.matches ? heroVideo.dataset.mobile : heroVideo.dataset.desktop;
    heroVideo.poster = videoMobile.matches ? 'assets/video/hero-poster-mobile.jpg' : 'assets/video/hero-poster.jpg';
    if (heroVideo.getAttribute('src') !== source) {
      heroVideo.src = source;
      heroVideo.muted = true;
      heroVideo.load();
    }
    toggle.hidden = false;
    if (!userPaused && !document.hidden) heroVideo.play().catch(updateVideoControl);
  }
  heroVideo.addEventListener('playing', () => {
    heroVideo.classList.add('is-playing');
    updateVideoControl();
  });
  heroVideo.addEventListener('pause', updateVideoControl);
  heroVideo.addEventListener('error', () => {
    heroVideo.classList.remove('is-playing');
    toggle.hidden = true;
  });
  toggle.addEventListener('click', () => {
    userPaused = !heroVideo.paused;
    if (userPaused) heroVideo.pause();
    else heroVideo.play().catch(updateVideoControl);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) heroVideo.pause();
    else startHeroVideo();
  });
  videoMotion.addEventListener('change', startHeroVideo);
  videoMobile.addEventListener('change', startHeroVideo);
  connection?.addEventListener('change', startHeroVideo);
  startHeroVideo();
}

if (document.body.classList.contains('story-page') && 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const storyRevealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      storyRevealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
  document.querySelectorAll('.story-editorial-photo, .story-editorial-copy, .story-philosophy > h2, .story-page .page-cta').forEach(element => {
    element.classList.add('story-reveal-ready');
    storyRevealObserver.observe(element);
    element.addEventListener('focusin', () => {
      element.classList.add('is-revealed');
      storyRevealObserver.unobserve(element);
    }, { once: true });
  });
}

// Shared direct WhatsApp action; no message is sent until the visitor chooses to send.
const floatingWhatsApp = document.createElement('a');
floatingWhatsApp.className = 'floating-whatsapp';
floatingWhatsApp.href = 'https://wa.me/918179578884';
floatingWhatsApp.target = '_blank';
floatingWhatsApp.rel = 'noopener noreferrer';
floatingWhatsApp.setAttribute('aria-label', 'Chat with Two Fold Destiny on WhatsApp');
floatingWhatsApp.title = 'Chat on WhatsApp';
const floatingWhatsAppIcon = document.createElement('i');
floatingWhatsAppIcon.className = 'fa fa-whatsapp';
floatingWhatsAppIcon.setAttribute('aria-hidden', 'true');
const floatingWhatsAppLabel = document.createElement('span');
floatingWhatsAppLabel.className = 'floating-whatsapp-label';
floatingWhatsAppLabel.textContent = 'Chat with us';
floatingWhatsApp.append(floatingWhatsAppLabel, floatingWhatsAppIcon);
document.body.append(floatingWhatsApp);
