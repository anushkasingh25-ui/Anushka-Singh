

const typingText = document.getElementById("typing-text");

const words = [
    "Full Stack Developer",
    "Frontend Developer",
    "Software Developer"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
    if (!typingText) return;

    const currentWord = words[wordIndex];

    if (deleting) {
        charIndex--;
    } else {
        charIndex++;
    }

    typingText.textContent = currentWord.substring(0, charIndex);

    let speed = deleting ? 45 : 90;

    if (!deleting && charIndex === currentWord.length) {
        deleting = true;
        speed = 1400;
    } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 350;
    }

    window.setTimeout(typeEffect, speed);
}

if (typingText) {
    typingText.textContent = "";
    typeEffect();
}


/* 2. NAVIGATION ACTIVE LINK */

const navLinks = document.querySelectorAll(".nav-links a");

function updateActiveLink() {
    const sections = document.querySelectorAll(
        "#home, #about, #skills, #projects, #contact"
    );

    let currentSection = "home";

    sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop <= 150) {
            currentSection = section.id;
        }
    });

    navLinks.forEach((link) => {
        const target = link.getAttribute("href");

        link.classList.toggle(
            "active",
            target === "#" + currentSection
        );
    });
}

window.addEventListener("scroll", updateActiveLink, {
    passive: true
});

updateActiveLink();


/* 3. SMOOTH NAVIGATION */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            event.preventDefault();

            targetElement.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });

            if (window.location.hash !== targetId) {
                history.replaceState(null, "", targetId);
            }
        }
    });
});


/* 4. PROJECT CARD ENTRANCE ANIMATION */

const projectCards = document.querySelectorAll(".project-card");

if ("IntersectionObserver" in window) {
    const projectObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("project-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    projectCards.forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(18px)";
        card.style.transition =
            "opacity 0.5s ease, transform 0.5s ease";

        projectObserver.observe(card);
    });

    const projectStyle = document.createElement("style");

    projectStyle.textContent = `
        .project-card.project-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;

    document.head.appendChild(projectStyle);
}


/* 5. FOOTER YEAR */

const footerText = document.querySelector(".footer p");

if (footerText) {
    footerText.textContent =
        `© ${new Date().getFullYear()} Anushka Singh. Built with passion and code 💜`;
}


/* ==========================================
   6. INTERACTIVE ANIMATED BACKGROUND
========================================== */

const ambientCanvas = document.getElementById("ambient-canvas");
const cursorGlow = document.getElementById("cursor-glow");

if (ambientCanvas) {
    const ctx = ambientCanvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];

    const mouse = {
        x: -1000,
        y: -1000,
        active: false
    };

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        ambientCanvas.width = width * dpr;
        ambientCanvas.height = height * dpr;

        ambientCanvas.style.width = width + "px";
        ambientCanvas.style.height = height + "px";

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const particleCount = Math.min(
            100,
            Math.max(35, Math.floor((width * height) / 13000))
        );

        particles = Array.from(
            { length: particleCount },
            () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                radius: Math.random() * 2 + 1
            })
        );
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    /* Mouse position */

    window.addEventListener("pointermove", (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.active = true;

        if (cursorGlow) {
            cursorGlow.style.left = mouse.x + "px";
            cursorGlow.style.top = mouse.y + "px";
        }
    }, { passive: true });

    window.addEventListener("pointerleave", () => {
        mouse.active = false;

        if (cursorGlow) {
            cursorGlow.style.opacity = "0";
        }
    });

    window.addEventListener("pointerenter", () => {
        if (cursorGlow) {
            cursorGlow.style.opacity = "1";
        }
    });

    /* Animate particles */

    function animateBackground() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((particle, index) => {
            if (!reduceMotion) {
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Wrap particles around screen edges
                if (particle.x < 0) particle.x = width;
                if (particle.x > width) particle.x = 0;
                if (particle.y < 0) particle.y = height;
                if (particle.y > height) particle.y = 0;

                // Mouse attraction / repulsion
                if (mouse.active) {
                    const dx = mouse.x - particle.x;
                    const dy = mouse.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150 && distance > 0) {
                        const force = (150 - distance) / 150;

                        particle.x -= (dx / distance) * force * 0.8;
                        particle.y -= (dy / distance) * force * 0.8;
                    }
                }
            }

            // Connect nearby particles
            for (let j = index + 1; j < particles.length; j++) {
                const other = particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 115) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);

                    ctx.strokeStyle =
                        `rgba(168, 85, 247, ${0.22 * (1 - distance / 115)})`;

                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }

            // Particle glow
            ctx.beginPath();
            ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = index % 3 === 0
                ? "#67e8f9"
                : "#c084fc";

            ctx.shadowBlur = 10;
            ctx.shadowColor = ctx.fillStyle;
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // Draw mouse connection lines
        if (mouse.active) {
            particles.forEach((particle) => {
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 145) {
                    ctx.beginPath();
                    ctx.moveTo(mouse.x, mouse.y);
                    ctx.lineTo(particle.x, particle.y);

                    ctx.strokeStyle =
                        `rgba(103, 232, 249, ${0.35 * (1 - distance / 145)})`;

                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
        }

        requestAnimationFrame(animateBackground);
    }

    animateBackground();
}


/* ==========================================
   7. INTERACTIVE SKILL AND PROJECT CARDS
========================================== */

const interactiveCards = document.querySelectorAll(
    ".skill-card, .project-card, .detail-card"
);

interactiveCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
        if (event.pointerType !== "mouse") return;

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;

        card.style.setProperty("--mouse-x", `${percentX}%`);
        card.style.setProperty("--mouse-y", `${percentY}%`);
    });
});

console.log("Interactive portfolio background loaded 💜");



