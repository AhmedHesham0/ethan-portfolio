document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // LENIS SMOOTH SCROLLING
    // ==========================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth scroll to section on nav link click
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            lenis.scrollTo(target, { offset: -80, duration: 1.4 }); // -80 accounts for fixed navbar height
        });
    });


    // ==========================================
    // CUSTOM CURSOR
    // ==========================================
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    const hoverTargets = document.querySelectorAll('.hover-target');

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    // Follower easing
    gsap.ticker.add(() => {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        
        gsap.set(cursorFollower, { x: followerX, y: followerY });
        gsap.set(cursor, { x: mouseX, y: mouseY });
    });

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
            cursorFollower.classList.add('hovered');
            
            // If project card with play button
            if(target.hasAttribute('data-cursor-text')) {
                cursorFollower.setAttribute('data-text', target.getAttribute('data-cursor-text'));
            } else {
                cursorFollower.setAttribute('data-text', '');
            }
        });

        target.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursorFollower.classList.remove('hovered');
            cursorFollower.setAttribute('data-text', '');
        });
    });




    // ==========================================
    // GSAP ANIMATIONS
    // ==========================================
    gsap.registerPlugin(ScrollTrigger);

    // Initial page load reveal
    const tl = gsap.timeline();
    
    // Loader body class removal
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 500);

    tl.from('.navbar', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    })
    .from('.hero-title .word', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out"
    }, "-=0.5")
    .from('.hero-subtitle', {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.7")
    .from('.scroll-indicator', {
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.5");


    // Project Cards Reveal
    const projects = gsap.utils.toArray('.project-card');
    projects.forEach(project => {
        gsap.from(project, {
            scrollTrigger: {
                trigger: project,
                start: "top 85%",
                end: "bottom center",
                toggleActions: "play none none reverse"
            },
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Section Titles Light Up Effect
    gsap.utils.toArray('.section-title').forEach(title => {
        ScrollTrigger.create({
            trigger: title,
            start: "top 80%", // triggers when title crosses 80% from top of screen
            onEnter: () => title.classList.add('lit-up'),
            onLeaveBack: () => title.classList.remove('lit-up') // turn off if scrolled back up
        });
    });


    // About Section Parallax and Reveal
    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about-section',
            start: "top 70%",
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });

    gsap.from('.skill-tag', {
        scrollTrigger: {
            trigger: '.skills',
            start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
    });

    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about-section',
            start: "top 70%",
        },
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });


    // ==========================================
    // REELS SLIDER — DRAG + ARROWS
    // ==========================================
    const track = document.getElementById('sliderTrack');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');

    if (track) {
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;

        track.addEventListener('mousedown', (e) => {
            isDragging = true;
            track.classList.add('dragging');
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.parentElement.scrollLeft;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            track.classList.remove('dragging');
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 1.5;
            track.parentElement.scrollLeft = scrollLeft - walk;
        });

        // Touch support
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - track.offsetLeft;
            scrollLeft = track.parentElement.scrollLeft;
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - track.offsetLeft;
            const walk = (x - startX) * 1.5;
            track.parentElement.scrollLeft = scrollLeft - walk;
        }, { passive: true });

        // Arrow buttons
        const cardWidth = 340 + 30; // card width + gap
        prevBtn.addEventListener('click', () => {
            track.parentElement.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            track.parentElement.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
        });
    }

    // Contact Section
    gsap.from('.big-text', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: "top 80%",
        },
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power4.out"
    });
});
