document.addEventListener("DOMContentLoaded", () => {

        // Custom cursor
        const cursor = document.createElement('div');
        cursor.classList.add('cursor');
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // TODO: Custom right-click menu 
        const menu = document.getElementById("custom-menu");
        document.addEventListener("contextmenu", (e) => e.preventDefault());
        document.addEventListener("click", () => {
            if (menu) menu.style.display = "none";
        });

        // Music and link buttons 
        const bgMusic = document.getElementById('bg-music');
        let playing = false;

        const buttons = document.querySelectorAll('.music-btn');
        const spacing = 20;

        buttons.forEach((btn, index) => {
            btn.style.position = "fixed";
            btn.style.right = "20px";
            btn.style.bottom = `${20 + index * (btn.offsetHeight + spacing)}px`;

            const action = btn.getAttribute('data-action');

            btn.addEventListener('click', () => {
                if (action === 'music') {
                    if (!playing) {
                        bgMusic.play();
                        btn.style.fontSize = "1rem";
                        btn.textContent = "Now Playing - Resonance ⏸";
                    } else {
                        bgMusic.pause();
                        btn.textContent = "▶";
                    }
                    playing = !playing;
                } else if (action === 'link') {
                    window.open("https://github.com/Typhoonz0/personal-website", "_blank");
                }
            });
        });

        // scrolling title effect
        const siteName = "Liam's Website - ";
        let scrollTitle = siteName;
        const scrollTitleFunc = () => {
            document.title = scrollTitle;
            scrollTitle = scrollTitle.slice(1) + scrollTitle.charAt(0);
            setTimeout(scrollTitleFunc, 150);
        };
        scrollTitleFunc();

        const desktopVideo = document.getElementById("bg-desktop");
        const poster = document.getElementById("video-poster");
        const titleElement = document.querySelector(".tagfr .about-title");

        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

        let bgElement = poster;

        if (isMobile) {
            if (desktopVideo) desktopVideo.style.display = "none";
            if (poster) {
                poster.style.display = "block";
                bgElement = poster;
                applyBlur(poster);
                titleElement.textContent = "Liam's Website"; 
            }
        } else {
            if (poster) {
                poster.style.display = "block";
                bgElement = poster;
                if (typeof applyBlur === "function") {
                    applyBlur(poster);
                }
                titleElement.textContent = "Liam's Website (loading movie, reload if frozen)";
            }

            if (desktopVideo) {
                desktopVideo.style.display = "none";

                const reloaded = sessionStorage.getItem("videoReloaded");

                // ai code
                if (desktopVideo.readyState >= 3) {
                    poster.style.display = "none";
                    desktopVideo.style.display = "block";
                    desktopVideo.play().catch(() => {});
                    bgElement = desktopVideo;
                    if (typeof applyBlur === "function") {
                        applyBlur(desktopVideo);
                    }
                    titleElement.textContent = "Liam's Website";
                } else {
                    // Wait for video readiness
                    desktopVideo.addEventListener("canplaythrough", () => {
                        poster.style.display = "none";
                        desktopVideo.style.display = "block";
                        desktopVideo.play().catch(() => {});
                        bgElement = desktopVideo;
                        if (typeof applyBlur === "function") {
                            applyBlur(desktopVideo);
                        }
                        titleElement.textContent = "Liam's Website";
                    }, { once: true });

                    // Reload once if it’s stuck
                    setTimeout(() => {
                        if (desktopVideo.readyState < 3 && !reloaded) {
                            sessionStorage.setItem("videoReloaded", "true");
                            location.reload();
                        }
                    }, 2000);
                }
            }

        }




        // Blur effect 
        function applyBlur(element) {
            if (!element) return;

            const updateBlur = () => {
                const scrollY = window.scrollY;
                const blurAmount = Math.min(scrollY / 50, 10);  
                const darkAmount = Math.min(scrollY / 500, 0.3); 
                element.style.filter = `blur(${blurAmount}px) brightness(${1 - darkAmount})`;
            };


            updateBlur(); // init blur

            let ticking = false;
            window.addEventListener("scroll", () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateBlur();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }

        // Paralax mouse move fx
        if (bgElement) {
            let targetX = 0, targetY = 0;
            let currentX = 0, currentY = 0;

            document.addEventListener("mousemove", (e) => {
                targetX = (e.clientX / window.innerWidth - 0.1) * 18;
                targetY = (e.clientY / window.innerHeight - 0.1) * 18;
            });

            const animateParallax = () => {
                currentX += (targetX - currentX) * 0.1;
                currentY += (targetY - currentY) * 0.1;
                bgElement.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.05)`;
                requestAnimationFrame(animateParallax);
            };
            animateParallax();
        }
    });