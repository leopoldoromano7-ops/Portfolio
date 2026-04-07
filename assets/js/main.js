(function() {
  "use strict";

  /**
   * Header toggle
   */
  const header = document.querySelector('#header');
  const headerToggleBtn = document.querySelector('.header-toggle');
  const headerToggleLabel = headerToggleBtn?.querySelector('[data-header-toggle-label]') ?? null;
  const headerToggleIcon = headerToggleBtn?.querySelector('[data-header-toggle-icon]') ?? null;

  function isDesktopViewport() {
    return window.innerWidth >= 992;
  }

  function setHeaderState(isOpen) {
    if (!header || !headerToggleBtn) return;

    header.classList.toggle('header-show', isOpen);
    document.body.classList.toggle('sidebar-open', isOpen);
    headerToggleBtn.classList.toggle('is-open', isOpen);
    headerToggleBtn.setAttribute('aria-expanded', String(isOpen));
    headerToggleBtn.setAttribute('aria-label', isOpen ? 'Chiudi navigazione' : 'Apri navigazione');

    if (headerToggleLabel) {
      headerToggleLabel.textContent = isOpen ? 'Chiudi' : 'Menu';
    }

    if (headerToggleIcon) {
      headerToggleIcon.classList.toggle('bi-grid-3x3-gap-fill', !isOpen);
      headerToggleIcon.classList.toggle('bi-x-lg', isOpen);
    }

    if (isOpen && !isDesktopViewport()) {
      header.scrollTop = 0;
    }
  }

  function headerToggle(forceState) {
    if (!header) return;
    const nextState = typeof forceState === 'boolean' ? forceState : !header.classList.contains('header-show');
    setHeaderState(nextState);
  }

  headerToggleBtn?.addEventListener('click', () => headerToggle());
  setHeaderState(false);

  const skillsModal = document.querySelector('#skills-modal');
  const skillsModalBody = skillsModal?.querySelector('.skills-modal-body') ?? null;
  const journeyModal = document.querySelector('#journey-modal');
  const journeyModalBody = journeyModal?.querySelector('.journey-modal-body') ?? null;
  const journeyModalDialog = journeyModal?.querySelector('.skills-modal-dialog') ?? null;
  const projectModal = document.querySelector('#project-modal');
  const projectModalBody = projectModal?.querySelector('.project-modal-body') ?? null;
  const projectModalDialog = projectModal?.querySelector('.skills-modal-dialog') ?? null;

  // Keep modals outside the main stacking context so they always cover the fixed sidebar.
  if (skillsModal) {
    document.body.appendChild(skillsModal);
  }
  if (journeyModal) {
    document.body.appendChild(journeyModal);
  }
  if (projectModal) {
    document.body.appendChild(projectModal);
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
    closeProjectModal();
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
    clearTimeout(journeyModal._modalScrollStateTimer);
    journeyModal.classList.remove('modal-needs-scroll');
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
    closeProjectModal();
    journeyModalBody.innerHTML = template.innerHTML;
    const modalTitle = journeyModalBody.querySelector('h3');
    if (modalTitle) {
      modalTitle.id = 'journey-modal-title';
    }

    journeyModal.classList.add('is-open');
    journeyModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('skills-modal-open');
    syncModalScrollStateLater(journeyModal, journeyModalBody, journeyModalDialog);
  }

  function closeProjectModal() {
    if (!projectModal || !projectModalBody) return;
    clearTimeout(projectModal._modalScrollStateTimer);
    projectModal.classList.remove('modal-needs-scroll');
    projectModal.classList.remove('is-open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('skills-modal-open');
    projectModalBody.innerHTML = '';
  }

  function openProjectModal(templateId) {
    if (!projectModal || !projectModalBody) return;

    const template = document.querySelector(`#${templateId}`);
    if (!(template instanceof HTMLTemplateElement)) return;

    closeSkillModal();
    closeJourneyModal();
    projectModalBody.innerHTML = template.innerHTML;
    const modalTitle = projectModalBody.querySelector('h3');
    if (modalTitle) {
      modalTitle.id = 'project-modal-title';
    }

    projectModal.classList.add('is-open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('skills-modal-open');
    syncModalScrollStateLater(projectModal, projectModalBody, projectModalDialog);
  }

  function syncModalScrollState(modal, body, dialog) {
    if (!modal || !body || !dialog) return;
    const needsScroll = body.scrollHeight - body.clientHeight > 6;
    modal.classList.toggle('modal-needs-scroll', needsScroll);
  }

  function syncModalScrollStateLater(modal, body, dialog) {
    if (!modal) return;

    clearTimeout(modal._modalScrollStateTimer);
    modal._modalScrollStateTimer = window.setTimeout(() => {
      syncModalScrollState(modal, body, dialog);
    }, 40);
  }

  function handleExpandableHashNavigation(event, hash, options = {}) {
    if (!hash) return false;

    const targetSection = document.querySelector(hash);
    if (!targetSection || !targetSection.classList.contains('expandable-section')) {
      return false;
    }

    event.preventDefault();
    openExpandableSection(targetSection, {
      scrollIntoView: true,
      ...options
    });

    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash);
    }

    return true;
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', (event) => {
      closeSkillModal();
      closeJourneyModal();
      closeProjectModal();

      handleExpandableHashNavigation(event, navmenu.hash);

      if (!isDesktopViewport() && header?.classList.contains('header-show')) {
        headerToggle(false);
      }
    });

  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    if (anchor.closest('#navmenu')) return;

    anchor.addEventListener('click', (event) => {
      handleExpandableHashNavigation(event, anchor.hash);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header?.classList.contains('header-show')) {
      headerToggle(false);
    }
  });

  window.addEventListener('resize', () => {
    if (journeyModal?.classList.contains('is-open')) {
      syncModalScrollStateLater(journeyModal, journeyModalBody, journeyModalDialog);
    }
    if (projectModal?.classList.contains('is-open')) {
      syncModalScrollStateLater(projectModal, projectModalBody, projectModalDialog);
    }
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
  const EXPANDABLE_SCROLL_SYNC_DELAY = 160;
  const EXPANDABLE_SCROLL_SETTLE_DELAY = 460;

  function refreshExpandableAnimations() {
    if (window.AOS) {
      if (typeof AOS.refreshHard === 'function') {
        AOS.refreshHard();
      } else if (typeof AOS.refresh === 'function') {
        AOS.refresh();
      }
    }
  }

  function triggerSkillsOrbitAnimation(section) {
    if (section.id !== 'skills') return;

    clearTimeout(section._skillsOrbitAnimationTimer);
    section.classList.remove('is-orbit-animating');
    void section.offsetWidth;
    section.classList.add('is-orbit-animating');

    section._skillsOrbitAnimationTimer = window.setTimeout(() => {
      section.classList.remove('is-orbit-animating');
    }, 1500);
  }

  function triggerJourneyHubAnimation(section) {
    if (section.id !== 'resume') return;

    clearTimeout(section._journeyHubAnimationTimer);
    section.classList.remove('is-journey-animating');
    void section.offsetWidth;
    section.classList.add('is-journey-animating');

    section._journeyHubAnimationTimer = window.setTimeout(() => {
      section.classList.remove('is-journey-animating');
    }, 1200);
  }

  function triggerPortfolioArchiveAnimation(section) {
    if (section.id !== 'portfolio') return;

    clearTimeout(section._portfolioArchiveAnimationTimer);
    section.classList.remove('is-portfolio-animating');
    void section.offsetWidth;
    section.classList.add('is-portfolio-animating');

    section._portfolioArchiveAnimationTimer = window.setTimeout(() => {
      section.classList.remove('is-portfolio-animating');
    }, 1400);
  }

  function getSectionScrollTop(section) {
    const scrollMarginTop = Number.parseInt(getComputedStyle(section).scrollMarginTop, 10) || 0;
    return section.getBoundingClientRect().top + window.scrollY - scrollMarginTop;
  }

  function scrollSectionIntoView(section, behavior = 'smooth') {
    window.scrollTo({
      top: getSectionScrollTop(section),
      behavior
    });
  }

  function scheduleExpandableSectionScroll(section, needsSettlePass = false) {
    clearTimeout(section._expandableScrollTimer);
    clearTimeout(section._expandableScrollSettleTimer);

    section._expandableScrollTimer = window.setTimeout(() => {
      scrollSectionIntoView(section, 'smooth');
    }, EXPANDABLE_SCROLL_SYNC_DELAY);

    if (needsSettlePass) {
      section._expandableScrollSettleTimer = window.setTimeout(() => {
        scrollSectionIntoView(section, 'smooth');
      }, EXPANDABLE_SCROLL_SETTLE_DELAY);
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
      if (section.id === 'skills') {
        triggerSkillsOrbitAnimation(section);
      }
      if (section.id === 'resume') {
        triggerJourneyHubAnimation(section);
      }
      if (section.id === 'portfolio') {
        triggerPortfolioArchiveAnimation(section);
      }
    } else {
      panel.setAttribute('inert', '');
      if (section.id === 'skills') {
        clearTimeout(section._skillsOrbitAnimationTimer);
        section.classList.remove('is-orbit-animating');
        closeSkillModal();
      }
      if (section.id === 'resume') {
        clearTimeout(section._journeyHubAnimationTimer);
        section.classList.remove('is-journey-animating');
        closeJourneyModal();
      }
      if (section.id === 'portfolio') {
        clearTimeout(section._portfolioArchiveAnimationTimer);
        section.classList.remove('is-portfolio-animating');
        closeProjectModal();
      }
      clearTimeout(section._expandableScrollTimer);
      clearTimeout(section._expandableScrollSettleTimer);
    }
  }

  function openExpandableSection(section, options = {}) {
    const {
      scrollIntoView = false
    } = options;
    const targetIndex = expandableSections.indexOf(section);
    const hadExpandedSectionAbove = expandableSections.some((item, index) =>
      index < targetIndex && item.classList.contains('is-expanded')
    );

    expandableSections.forEach((item) => {
      setExpandableState(item, item === section);
    });

    refreshExpandableAnimations();

    if (scrollIntoView) {
      scheduleExpandableSectionScroll(section, hadExpandedSectionAbove);
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

  document.querySelectorAll('.project-demo-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const templateId = trigger.getAttribute('data-project-modal-target');
      if (templateId) {
        openProjectModal(templateId);
      }
    });
  });

  document.querySelectorAll('[data-project-modal-close]').forEach((element) => {
    element.addEventListener('click', closeProjectModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (skillsModal?.classList.contains('is-open')) {
        closeSkillModal();
      }
      if (journeyModal?.classList.contains('is-open')) {
        closeJourneyModal();
      }
      if (projectModal?.classList.contains('is-open')) {
        closeProjectModal();
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
          scrollSectionIntoView(section, 'smooth');
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
