(() => {
    'use strict';

    const data = window.portfolioData;
    if (!data) {
        console.error('Portfolio content could not be loaded. Check that data.js is available.');
        return;
    }

    if (data.siteUrl) {
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = data.siteUrl;
        document.head.append(canonical);
        const openGraphUrl = document.createElement('meta');
        openGraphUrl.setAttribute('property', 'og:url');
        openGraphUrl.content = data.siteUrl;
        document.head.append(openGraphUrl);
    }

    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    root.classList.add('js');

    const getSavedTheme = () => {
        try {
            return window.localStorage.getItem('bilal-theme');
        } catch (error) {
            console.warn('Theme preference could not be read from local storage.', error);
            return null;
        }
    };

    const saveTheme = (theme) => {
        try {
            window.localStorage.setItem('bilal-theme', theme);
        } catch (error) {
            console.warn('Theme preference could not be saved to local storage.', error);
        }
    };

    const themeButton = document.querySelector('.theme-toggle');
    const setTheme = (theme) => {
        root.dataset.theme = theme;
        themeButton.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
        document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#111c1a' : '#f7f7f3';
    };
    const savedTheme = getSavedTheme();
    setTheme(savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    themeButton.addEventListener('click', () => {
        const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        saveTheme(nextTheme);
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.querySelector('.primary-navigation');
    const closeMenu = () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navigation.classList.remove('is-open');
    };
    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!isOpen));
        navigation.classList.toggle('is-open', !isOpen);
    });
    navigation.addEventListener('click', (event) => {
        if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', (event) => {
        if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });

    const sectionLinks = [...document.querySelectorAll('.nav-link')];
    const sections = sectionLinks
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                sectionLinks.forEach((link) => {
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.setAttribute('aria-current', 'location');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
            });
        }, { rootMargin: '-30% 0px -60% 0px' });
        sections.forEach((section) => sectionObserver.observe(section));
    }

    const renderSkills = () => {
        const container = document.getElementById('skills-grid');
        container.innerHTML = data.skills.map((group) => `
            <article class="skill-group reveal">
                <span class="skill-group-icon" aria-hidden="true">${group.mark}</span>
                <h3>${group.category}</h3>
                <ul>${group.items.map((skill) => `<li>${skill}</li>`).join('')}</ul>
            </article>
        `).join('');
    };

    const projectLink = (url, label, className = '') => url
        ? `<a class="project-action ${className}" href="${url}" target="_blank" rel="noopener noreferrer">${label}<span aria-hidden="true">↗</span></a>`
        : '';

    const renderProjects = (filter = 'all') => {
        const container = document.getElementById('projects-grid');
        const projects = data.projects.filter((project) => filter === 'all' || project.category === filter);
        container.innerHTML = projects.map((project) => `
            <article class="project-card reveal">
                <div class="project-art project-art-${project.art}" aria-hidden="true">
                    <span class="project-art-label">${project.artLabel}</span>
                    <span class="project-art-mark">${project.mark}</span>
                    <span class="project-art-index">${project.number}</span>
                </div>
                <div class="project-card-content">
                    <div class="project-card-topline"><span>${project.type}</span><span>${project.status}</span></div>
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <ul class="tech-list" aria-label="Technologies">${project.technologies.map((technology) => `<li>${technology}</li>`).join('')}</ul>
                    <div class="project-card-footer">
                        <button class="project-details" type="button" data-project="${project.id}">Project details <span aria-hidden="true">→</span></button>
                        <div class="project-links">${projectLink(project.demo, 'Live demo')}${projectLink(project.github, 'GitHub')}</div>
                    </div>
                </div>
            </article>
        `).join('');
        observeReveals(container);
    };

    const renderTimeline = () => {
        document.getElementById('timeline').innerHTML = data.experience.map((item) => `
            <article class="timeline-item reveal">
                <span class="timeline-dot" aria-hidden="true"></span>
                <p class="timeline-date">${item.date}</p>
                <h3>${item.title}</h3>
                <p class="timeline-place">${item.place}</p>
                <p class="timeline-description">${item.description}</p>
            </article>
        `).join('');
    };

    const renderSocials = () => {
        document.getElementById('contact-socials').innerHTML = data.socials
            .filter((social) => social.url)
            .map((social) => `<a href="${social.url}" target="_blank" rel="noopener noreferrer">${social.label}<span aria-hidden="true">↗</span></a>`)
            .join('');
    };

    const revealObserver = 'IntersectionObserver' in window
        ? new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' })
        : null;

    function observeReveals(scope = document) {
        scope.querySelectorAll('.reveal:not(.is-visible)').forEach((element) => {
            if (reducedMotion.matches || !revealObserver) {
                element.classList.add('is-visible');
            } else {
                revealObserver.observe(element);
            }
        });
    }

    renderSkills();
    renderProjects();
    renderTimeline();
    renderSocials();
    observeReveals();

    document.querySelectorAll('.filter-button').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-button').forEach((filterButton) => {
                const isActive = filterButton === button;
                filterButton.classList.toggle('is-active', isActive);
                filterButton.setAttribute('aria-pressed', String(isActive));
            });
            renderProjects(button.dataset.filter);
        });
    });

    const dialog = document.getElementById('project-dialog');
    const dialogContent = document.getElementById('dialog-content');
    dialog.addEventListener('cancel', () => dialog.close());
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && dialog.open) dialog.close();
    });
    document.getElementById('projects-grid').addEventListener('click', (event) => {
        const button = event.target.closest('[data-project]');
        if (!button) return;
        const project = data.projects.find((item) => item.id === button.dataset.project);
        if (!project) return;
        dialogContent.innerHTML = `
            <p class="eyebrow">${project.type} · ${project.status}</p>
            <h2 id="dialog-title">${project.name}</h2>
            <p>${project.detail}</p>
            <h3>Built with</h3>
            <ul class="tech-list">${project.technologies.map((technology) => `<li>${technology}</li>`).join('')}</ul>
            <div class="dialog-links">${projectLink(project.demo, 'Visit live project')}${projectLink(project.github, 'View source on GitHub')}</div>
        `;
        dialog.showModal();
    });

    document.getElementById('contact-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity()) return;
        const formData = new FormData(form);
        const subject = `Portfolio inquiry from ${formData.get('name')}`;
        const body = [
            `Name: ${formData.get('name')}`,
            `Email: ${formData.get('email')}`,
            `Project type: ${formData.get('project')}`,
            '',
            formData.get('message')
        ].join('\n');
        const mailto = `mailto:${data.email}?subject=${encodeURIComponent(`${formData.get('project')}: ${subject}`)}&body=${encodeURIComponent(body)}`;
        document.getElementById('form-status').textContent = 'Opening your email app. If it does not open, email Bilal directly using the address on this page.';
        window.location.href = mailto;
    });

    const typedText = document.querySelector('.typed-text');
    const roles = data.roles;
    if (!reducedMotion.matches && roles.length > 1) {
        let roleIndex = 0;
        let characterIndex = roles[0].length;
        let deleting = true;
        let roleTimer;
        const scheduleRole = (delay) => {
            window.clearTimeout(roleTimer);
            roleTimer = window.setTimeout(animateRole, delay);
        };
        const animateRole = () => {
            if (document.hidden || reducedMotion.matches) return;
            const role = roles[roleIndex];
            if (deleting) {
                characterIndex -= 1;
                typedText.textContent = role.slice(0, characterIndex);
                if (characterIndex <= 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    scheduleRole(450);
                    return;
                }
                scheduleRole(45);
                return;
            }
            characterIndex += 1;
            typedText.textContent = roles[roleIndex].slice(0, characterIndex);
            if (characterIndex >= roles[roleIndex].length) {
                deleting = true;
                scheduleRole(1600);
                return;
            }
            scheduleRole(80);
        };
        scheduleRole(4000);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                window.clearTimeout(roleTimer);
            } else {
                scheduleRole(0);
            }
        });
    }

    document.getElementById('copyright-year').textContent = new Date().getFullYear();

    if (data.plausibleDomain) {
        const analytics = document.createElement('script');
        analytics.defer = true;
        analytics.dataset.domain = data.plausibleDomain;
        analytics.src = 'https://plausible.io/js/script.js';
        document.head.append(analytics);
    }
})();
