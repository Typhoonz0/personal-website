const osuCursor = document.getElementById("osu-cursor");
const trailCanvas = document.getElementById("cursor-trail");
const ctx = trailCanvas.getContext("2d");

let mouseX = innerWidth / 2;
let mouseY = innerHeight / 2;
let trailX = mouseX;
let trailY = mouseY;

trailCanvas.width = innerWidth;
trailCanvas.height = innerHeight;

const trailPoints = [];
const trailLength = 10;

let hoveringLink = false;
let scale = 1;
let targetScale = 1;
let colorT = 0; 

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const el = document.elementFromPoint(e.clientX, e.clientY);
    hoveringLink = !!(el && el.closest("a"));

    targetScale = hoveringLink ? 0.75 : 1;
    colorT = hoveringLink ? 1 : 0;
});

document.addEventListener("contextmenu", (e) => e.preventDefault());

const lerp = (a, b, t) => ( a + (b - a) * t);

const animateCursor = () => {
    trailX += (mouseX - trailX) * 0.3;
    trailY += (mouseY - trailY) * 0.3;

    scale = lerp(scale, targetScale, 0.15);

    osuCursor.style.left = `${trailX}px`;
    osuCursor.style.top = `${trailY}px`;
    osuCursor.style.transform =
        `translate(-50%, -50%) scale(${scale})`;

    trailPoints.push({ x: trailX, y: trailY });
    if (trailPoints.length > trailLength) trailPoints.shift();

    ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    ctx.beginPath();

    if (trailPoints.length) {
        ctx.moveTo(trailPoints[0].x, trailPoints[0].y);
        for (let i = 1; i < trailPoints.length; i++) {
            ctx.lineTo(trailPoints[i].x, trailPoints[i].y);
        }
    }

    const r = lerp(255, 132, colorT);
    const g = lerp(255, 203, colorT);
    const b = lerp(255, 250, colorT);

    const color = `rgba(${r}, ${g}, ${b}, 0.7)`;

    osuCursor.style.borderColor = color;
    ctx.strokeStyle = color;

    ctx.lineWidth = 1.5;
    ctx.stroke();

    requestAnimationFrame(animateCursor);
}

animateCursor();

addEventListener("resize", () => {
    trailCanvas.width = innerWidth;
    trailCanvas.height = innerHeight;
});


const desktopVideo = document.getElementById("bg-desktop");
const poster = document.getElementById("video-poster");

const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

const showPoster = () => {
    if (!poster) return;
    poster.style.display = "block";
    if (typeof applyBlur === "function") applyBlur(poster);
}

const showVideo = () => {
    if (!desktopVideo) return;

    poster.style.display = "none";
    desktopVideo.style.display = "block";

    desktopVideo.muted = true;
    desktopVideo.loop = true;
    desktopVideo.playsInline = true;

    desktopVideo.play().catch(() => { });
    if (typeof applyBlur === "function") applyBlur(desktopVideo);
}

if (isMobile) {
    if (desktopVideo) desktopVideo.style.display = "none";
    showPoster();
} else {
    showPoster();

    desktopVideo.preload = "metadata";

    desktopVideo.addEventListener(
        "canplay",
        () => {
            showVideo();
        },
        { once: true }
    );

    setTimeout(() => {
        if (desktopVideo.readyState >= 2) {
            showVideo();
        }
    }, 1000);
}

const siteName = "Liam's Website - ";
let scrollTitle = siteName;
const scrollTitleFunc = () => {
    document.title = scrollTitle;
    scrollTitle = scrollTitle.slice(1) + scrollTitle.charAt(0);
    setTimeout(scrollTitleFunc, 150);
};
scrollTitleFunc();