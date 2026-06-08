// ==UserScript==
// @name         Copter Royale Combined Tweaks
// @namespace    http://tampermonkey.net/
// @version      2.0
// @match https://copterroyale2.coolmathgames.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const TARGET = "https://xliam.xyz/archive/copter2.js";

    window.showTracers = true;

    const obs = new MutationObserver((mutations) => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (
                    node.tagName === "SCRIPT" &&
                    node.src &&
                    node.src.includes("scripts.js")
                ) {
                    node.type = "javascript/blocked";
                    node.remove();
                }
            }
        }
    });

    obs.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    fetch(TARGET)
        .then(r => r.text())
        .then(code => {
            const s = document.createElement("script");
            s.textContent = code;
            document.documentElement.appendChild(s);
        });


    var adjectives = ["Awesome","Formidable","Exalted","Colorful","Frantic","Majestic","Exuberant","Merry","Impressive","Adorable","Alert","Amusing","Bored","Brave","Calm","Carefree","Careless","Chilly","Clever","Clumsy","Cranky","Crazy","Excited","Fantastic","Foolish","Friendly","Fussy","Fuzzy","Generous","Glowing","Crafty","Lumpy","Messy","Mighty","Peppy","Nimble","Blithering","Optimistic","Terrible","Polite","Proud","Quick","Quiet","Treacherous","Rusty","Shining","Silly","Sizzling","Sleepy","Slimy","Sloppy","Smooth","Sparkling","Speedy","Splendid","Ambitious","Steaming","Stinky","Strict","Sturdy","Surprised","Tough","Tricky","Wild","Wise","Wonderful","Worried","Vigorous","Delightful","Haunted","Colossal","Vivacious","Infuriating","Rebellious","Slippery","Vengeful","Fierce","Maniacal","Affluent","Decrepit","Glamorous","Opulent","Saucy","Calamitous","Egregious","Feckless","Insidious","Irksome","Judicious","Nefarious","Pernicious","Petulant","Tenacious","Famous","Flabbergasted","Feral","Sinister","Fresh","Adventurous","Spoony","Noisy","Whimsical","Amazing","Delicate","Hairless","Classy","Gangly","Disguised","Juicy","Ancient","Frosty","Savage","Fiery","Enraged","Surly","Dastardly","Cantankerous","Helpful","Hazardous","Dramatic","Boisterous","Simple","Feisty","Artisinal","Impolite","Toasty","Enlightened","Romantic","Giggling","Joyful","Euphoric","Humble","Gregarious","Persnickety","Extreme","Charming","Chivalrous","Grumpy","Fabulous","Snoozy","Sarcastic","Perfidious","Infamous","Enchanted","Disarming","Sneaky","Wholesome","Cheeky","Sheepish","Shrewd","Cunning","Graceful","Respectful","Precocious"];

    var nouns = ["Turtle","Fox","Hawk","Falcon","Eagle","Jester","Joker","Potato","Goldfish","Ace","Flyer","Driver","Turkey","Chicken","Donkey","Goat","Llama","Antelope","Defender","Weasel","Hedgehog","Koala","Wolf","Groundhog","Stranger","Wolverine","Honey Badger","Chameleon","Cook","Hippie","Boss","Goose","Crawdad","Ham Sandwich","Toaster","Jackhammer","Pineapple","Hot Dog","Aardvark","Salt Shaker","Wizard","Waistcoat","Professor","Unicorn","Pinecone","Ninja","Samurai","Cowboy","Buccaneer","Vampire","Werewolf","Pirate","Ogre","Princess","Mentor","Narwhal","Cactus","Bigfoot","Farmer","Knight","Ghost","Rapscallion","BLT","Sorceror","Dinosaur","Songbird","Baby","Phoenix","Detective","Investigator","Eyeball","Hamster","Toad","Wombat","Worm","Hare","Zombie","Mutant","Mime","Sheriff","Concoction","Toast","Lollipop","Pancake","Milkshake","Plumber","Chainsaw","Ice Cream","Penguin","Hammer","Panda","Octopus","Wallaby","Lemur","Orangutan","Zillionaire","Burrito","Avenger","Bobcat","Platypus","Kangaroo","Donut","Marshmallow","Cheesecake","Cobra","Pufferfish","Yodeler","Diva","Armadillo","Blobfish","Coconut","Sasquatch","Jackrabbit","Moose","Raccoon","Tiger","Walrus","Buttercup"];

    const MAX_SESSIONID = "coe5EetgWMiIoiUT8Df6QmC3QYXF15RRDZFmZsmL";

    function injectMenu(container) {
        if (!container) return;

        container.innerHTML = `
            <div style="padding:10px;color:white;font-family:sans-serif;">
                <h3>Copter Royale Tweaks</h3>
                <p>For most things you will have to reload the page.</p>
                <div>Username:</div>
                <select id="d1"></select>
                <select id="d2"></select>

                <div>
                    <input type="checkbox" id="anon">
                    <label>Anonymize</label>
                </div>

                <button id="setName">Set Username</button>

                <div style="margin-top:10px;">
                    <input type="checkbox" id="maxLvl">
                    <label>High/Max Level</label>
                </div>

                <div style="margin-top:10px;">
                    <input type="checkbox" id="tracers">
                    <label>Tracers + Radar Spoof (Hotkey is T)</label>
                </div>

                <div id="status" style="margin-top:10px;color:yellow;"></div>
            </div>
        `;

        const dd1 = container.querySelector('#d1');
        const dd2 = container.querySelector('#d2');
        const anon = container.querySelector('#anon');
        const maxLvl = container.querySelector('#maxLvl');
        const tracers = container.querySelector('#tracers');
        const status = container.querySelector('#status');

        adjectives.forEach(a => dd1.appendChild(new Option(a, a)));
        nouns.forEach(n => dd2.appendChild(new Option(n, n)));

        document.querySelector('#setName').onclick = () => {
            let name = dd1.value + " " + dd2.value;
            if (anon.checked) name = Math.floor(Math.random() * 1e8).toString();
            localStorage.setItem("username", name);
            status.textContent = "Username set: " + name;
        };

        maxLvl.onchange = () => {
            if (maxLvl.checked) {
                localStorage.setItem("sessionId", MAX_SESSIONID);
                status.textContent = "Max level enabled";
            }
        };

        tracers.onchange = () => {
            window.showTracers = tracers.checked;
            status.textContent = "Show players: " + window.showTracers;
        };
    }

    function tryInject() {
        const el = document.querySelector('.news.scrollbar-black');
        if (el && !el.dataset.injected) {
            el.dataset.injected = "1";
            injectMenu(el);
        }
    }

    const uiObs = new MutationObserver(() => {
        const el = document.querySelector('.news.scrollbar-black');

        if (el && !el.dataset.injected) {
            el.dataset.injected = "1";
            injectMenu(el);
        }
    });

    function waitForBody() {
        if (document.body) {
            uiObs.observe(document.body, {
                childList: true,
                subtree: true
            });
            return;
        }
        requestAnimationFrame(waitForBody);
    }

    waitForBody();
    tryInject();

})();