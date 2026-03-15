/**
* Template Name: iPortfolio
* Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
* Updated: Jun 29 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Header toggle
   */
  const headerToggleBtn = document.querySelector('.header-toggle');

  function headerToggle() {
    document.querySelector('#header').classList.toggle('header-show');
    headerToggleBtn.classList.toggle('bi-list');
    headerToggleBtn.classList.toggle('bi-x');
  }
  headerToggleBtn.addEventListener('click', headerToggle);

  const skillsModal = document.querySelector('#skills-modal');
  const skillsModalBody = skillsModal?.querySelector('.skills-modal-body') ?? null;
  const journeyModal = document.querySelector('#journey-modal');
  const journeyModalBody = journeyModal?.querySelector('.journey-modal-body') ?? null;

  // Keep modals outside the main stacking context so they always cover the fixed sidebar.
  if (skillsModal) {
    document.body.appendChild(skillsModal);
  }
  if (journeyModal) {
    document.body.appendChild(journeyModal);
  }

  function closeSkillModal() {
    if (!skillsModal || !skillsModalBody) return;
    skillsModal.classList.remove('is-open');
    skillsModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('skills-modal-open');
    skillsModalBody.innerHTML = '';
  }

  function openSkillModal(templateId) {
    if (!skillsModal || !skillsModalBody) return;

    const template = document.querySelector(`#${templateId}`);
    if (!(template instanceof HTMLTemplateElement)) return;

    closeJourneyModal();
    skillsModalBody.innerHTML = template.innerHTML;
    const modalTitle = skillsModalBody.querySelector('h3');
    if (modalTitle) {
      modalTitle.id = 'skills-modal-title';
    }

    skillsModal.classList.add('is-open');
    skillsModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('skills-modal-open');
  }

  function closeJourneyModal() {
    if (!journeyModal || !journeyModalBody) return;
    journeyModal.classList.remove('is-open');
    journeyModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('skills-modal-open');
    journeyModalBody.innerHTML = '';
  }

  function openJourneyModal(templateId) {
    if (!journeyModal || !journeyModalBody) return;

    const template = document.querySelector(`#${templateId}`);
    if (!(template instanceof HTMLTemplateElement)) return;

    closeSkillModal();
    journeyModalBody.innerHTML = template.innerHTML;
    const modalTitle = journeyModalBody.querySelector('h3');
    if (modalTitle) {
      modalTitle.id = 'journey-modal-title';
    }

    journeyModal.classList.add('is-open');
    journeyModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('skills-modal-open');
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      closeSkillModal();
      closeJourneyModal();

      if (navmenu.hash) {
        const targetSection = document.querySelector(navmenu.hash);
        if (targetSection && targetSection.classList.contains('expandable-section')) {
          openExpandableSection(targetSection);
        }
      }

      if (document.querySelector('.header-show')) {
        headerToggle();
      }
    });

  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    if (anchor.closest('#navmenu')) return;

    anchor.addEventListener('click', () => {
      if (!anchor.hash) return;

      const targetSection = document.querySelector(anchor.hash);
      if (targetSection && targetSection.classList.contains('expandable-section')) {
        openExpandableSection(targetSection, {
          scrollIntoView: true
        });
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Expandable menu sections
   */
  const expandableSections = Array.from(document.querySelectorAll('.expandable-section'));

  function refreshExpandableAnimations() {
    if (window.AOS) {
      if (typeof AOS.refreshHard === 'function') {
        AOS.refreshHard();
      } else if (typeof AOS.refresh === 'function') {
        AOS.refresh();
      }
    }
  }

  function buildExpandableSection(section, index) {
    const titleBlock = section.querySelector(':scope > .container.section-title');
    if (!titleBlock) return;

    const title = titleBlock.querySelector('h2')?.textContent.trim() ?? section.id;
    const summary = titleBlock.querySelector('p')?.textContent.trim() ?? '';
    const menuLabel = section.dataset.expandableLabel ?? `Node ${String(index + 1).padStart(2, '0')}`;
    const panelId = `${section.id}-panel`;

    const menuContainer = document.createElement('div');
    menuContainer.className = 'container expandable-section-menu';

    const button = document.createElement('button');
    button.className = 'expandable-section-toggle';
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', panelId);

    const kicker = document.createElement('span');
    kicker.className = 'expandable-section-kicker';
    kicker.textContent = menuLabel;

    const main = document.createElement('span');
    main.className = 'expandable-section-main';

    const titleWrap = document.createElement('span');
    titleWrap.className = 'expandable-section-title-wrap';

    const titleElement = document.createElement('span');
    titleElement.className = 'expandable-section-title';
    titleElement.textContent = title;

    const summaryElement = document.createElement('span');
    summaryElement.className = 'expandable-section-summary';
    summaryElement.textContent = summary;

    titleWrap.append(titleElement, summaryElement);

    const state = document.createElement('span');
    state.className = 'expandable-section-state';

    const stateText = document.createElement('span');
    stateText.className = 'expandable-section-state-text';
    stateText.textContent = 'Apri';

    const stateIcon = document.createElement('i');
    stateIcon.className = 'bi bi-plus-lg';
    stateIcon.setAttribute('aria-hidden', 'true');

    state.append(stateText, stateIcon);
    main.append(titleWrap, state);
    button.append(kicker, main);
    menuContainer.appendChild(button);

    const panel = document.createElement('div');
    panel.className = 'expandable-section-panel';
    panel.id = panelId;
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('inert', '');

    const panelInner = document.createElement('div');
    panelInner.className = 'expandable-section-panel-inner';

    const panelChildren = Array.from(section.children).filter((child) => child !== titleBlock);
    titleBlock.remove();
    panelChildren.forEach((child) => panelInner.appendChild(child));

    panel.appendChild(panelInner);
    section.append(menuContainer, panel);
    section.classList.add('is-collapsed');

    section._expandableButton = button;
    section._expandablePanel = panel;
    section._expandableStateText = stateText;
    section._expandableStateIcon = stateIcon;

    button.addEventListener('click', () => {
      const shouldExpand = !section.classList.contains('is-expanded');
      if (shouldExpand) {
        openExpandableSection(section, {
          scrollIntoView: true
        });
      } else {
        setExpandableState(section, false);
      }
    });
  }

  function setExpandableState(section, expanded) {
    const button = section._expandableButton;
    const panel = section._expandablePanel;
    const stateText = section._expandableStateText;
    const stateIcon = section._expandableStateIcon;

    if (!button || !panel || !stateText || !stateIcon) return;

    section.classList.toggle('is-expanded', expanded);
    section.classList.toggle('is-collapsed', !expanded);
    button.setAttribute('aria-expanded', String(expanded));
    panel.setAttribute('aria-hidden', String(!expanded));
    stateText.textContent = expanded ? 'Chiudi' : 'Apri';
    stateIcon.classList.toggle('bi-plus-lg', !expanded);
    stateIcon.classList.toggle('bi-dash-lg', expanded);

    if (expanded) {
      panel.removeAttribute('inert');
    } else {
      panel.setAttribute('inert', '');
      if (section.id === 'skills') {
        closeSkillModal();
      }
      if (section.id === 'resume') {
        closeJourneyModal();
      }
    }
  }

  function openExpandableSection(section, options = {}) {
    const {
      scrollIntoView = false
    } = options;

    expandableSections.forEach((item) => {
      setExpandableState(item, item === section);
    });

    refreshExpandableAnimations();

    if (scrollIntoView) {
      setTimeout(() => {
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 140);
    }
  }

  expandableSections.forEach(buildExpandableSection);

  /**
   * Skill modal triggers
   */
  document.querySelectorAll('.skill-path-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const templateId = trigger.getAttribute('data-skill-modal-target');
      if (templateId) {
        openSkillModal(templateId);
      }
    });
  });

  document.querySelectorAll('[data-skill-modal-close]').forEach((element) => {
    element.addEventListener('click', closeSkillModal);
  });

  document.querySelectorAll('.journey-route-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const templateId = trigger.getAttribute('data-journey-modal-target');
      if (templateId) {
        openJourneyModal(templateId);
      }
    });
  });

  document.querySelectorAll('[data-journey-modal-close]').forEach((element) => {
    element.addEventListener('click', closeJourneyModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (skillsModal?.classList.contains('is-open')) {
        closeSkillModal();
      }
      if (journeyModal?.classList.contains('is-open')) {
        closeJourneyModal();
      }
    }
  });

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          if (section.classList.contains('expandable-section')) {
            openExpandableSection(section);
          }
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();
