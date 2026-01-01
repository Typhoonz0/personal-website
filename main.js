for(let i=0; i<55; i++){
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random()*window.innerWidth + 'px';
    p.style.top = window.innerHeight + Math.random()*400 + 'px';
    p.style.width = 2 + Math.random()*4 + 'px';
    p.style.height = p.style.width;
    p.style.animationDuration = 6 + Math.random()*6 + 's';
    p.style.setProperty('--drift',(Math.random()-0.5)*2);
    document.body.appendChild(p);
}

const osuCursor = document.getElementById('osu-cursor');
const trailCanvas = document.getElementById('cursor-trail');
const ctx = trailCanvas.getContext('2d');

let mouseX = innerWidth/2, mouseY = innerHeight/2;
let trailX = mouseX, trailY = mouseY;
trailCanvas.width = innerWidth;
trailCanvas.height = innerHeight;

const trailPoints = [];
const trailLength = 10;

document.addEventListener('mousemove', e=>{
    mouseX = e.clientX;
    mouseY = e.clientY;
});
document.addEventListener("contextmenu", (e) => e.preventDefault());

function animate(){
    trailX += (mouseX-trailX)*0.3;
    trailY += (mouseY-trailY)*0.3;

    osuCursor.style.left = trailX+'px';
    osuCursor.style.top = trailY+'px';

    trailPoints.push({x:trailX,y:trailY});
    if(trailPoints.length>trailLength) trailPoints.shift();

    ctx.clearRect(0,0,trailCanvas.width,trailCanvas.height);
    ctx.beginPath();
    if(trailPoints.length>0){
        ctx.moveTo(trailPoints[0].x,trailPoints[0].y);
        for(let i=1;i<trailPoints.length;i++) ctx.lineTo(trailPoints[i].x,trailPoints[i].y);
    }
    ctx.strokeStyle='rgba(255,255,255,.6)';
    ctx.lineWidth=2;
    ctx.stroke();

    requestAnimationFrame(animate);
}
animate();

addEventListener('resize',()=>{
    trailCanvas.width = innerWidth;
    trailCanvas.height = innerHeight;
});

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
                btn.textContent = "Now Playing - KORE ⏸";
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
const desktopVideo = document.getElementById("bg-desktop");
const poster = document.getElementById("video-poster");
const titleElement = document.querySelector(".tagfr .about-title");

const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
let bgElement = poster;

function showPoster() {
    if (!poster) return;
    poster.style.display = "block";
    if (typeof applyBlur === "function") applyBlur(poster);
}

function showVideo() {
    if (!desktopVideo) return;
    poster.style.display = "none";
    desktopVideo.style.display = "block";
    desktopVideo.play().catch(()=>{});
    if (typeof applyBlur === "function") applyBlur(desktopVideo);
    titleElement.textContent = "Liam's Website";
}

if (isMobile) {
    if (desktopVideo) desktopVideo.style.display = "none";
    showPoster();
    titleElement.textContent = "Liam's Website";
}

else {
    const reloaded = sessionStorage.getItem("videoReloaded");

    showPoster();
    titleElement.textContent = "Liam's Website (loading movie, reload if frozen)";

    if (desktopVideo) {
        desktopVideo.preload = "auto";

        const waitUntilFullyBuffered = setInterval(() => {
            if (
                desktopVideo.readyState >= 3 &&
                desktopVideo.buffered.length &&
                desktopVideo.buffered.end(0) >= desktopVideo.duration - 0.1
            ) {
                clearInterval(waitUntilFullyBuffered);
                showVideo();
            }
        }, 200);

        setTimeout(() => {
            if (desktopVideo.readyState < 3 && !reloaded) {
                sessionStorage.setItem("videoReloaded", "true");
                location.reload();
            }
        }, 4000);
    }
}
const bgElement2 = document.getElementById('parallax-wrapper'); 

let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

document.addEventListener("mousemove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.1) * 10;
    targetY = (e.clientY / window.innerHeight - 0.1) * 10;
});

const siteName = "Liam's Website - ";
let scrollTitle = siteName;
const scrollTitleFunc = () => {
    document.title = scrollTitle;
    scrollTitle = scrollTitle.slice(1) + scrollTitle.charAt(0);
    setTimeout(scrollTitleFunc, 150);
};
scrollTitleFunc();


const animateParallax = () => {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;
    bgElement2.style.transform = `translate(${currentX}px, ${currentY}px) scale(1.05)`;
    requestAnimationFrame(animateParallax);
};

animateParallax();