// ==UserScript==
// @name         Copter Royale Inline Tweaks
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Inline GUI in news-scrollbar-black / update-box.scrollbar-black
// @match        *://copterroyale2.coolmathgames.com/*

// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var adjectives=["Awesome","Formidable","Exalted","Colorful","Frantic","Majestic","Exuberant","Merry","Impressive","Adorable","Alert","Amusing","Bored","Brave","Calm","Carefree","Careless","Chilly","Clever","Clumsy","Cranky","Crazy","Excited","Fantastic","Foolish","Friendly","Fussy","Fuzzy","Generous","Glowing","Crafty","Lumpy","Messy","Mighty","Peppy","Nimble","Blithering","Optimistic","Terrible","Polite","Proud","Quick","Quiet","Treacherous","Rusty","Shining","Silly","Sizzling","Sleepy","Slimy","Sloppy","Smooth","Sparkling","Speedy","Splendid","Ambitious","Steaming","Stinky","Strict","Sturdy","Surprised","Tough","Tricky","Wild","Wise","Wonderful","Worried","Vigorous","Delightful","Haunted","Colossal","Vivacious","Infuriating","Rebellious","Slippery","Vengeful","Fierce","Maniacal","Affluent","Decrepit","Glamorous","Opulent","Saucy","Calamitous","Egregious","Feckless","Insidious","Irksome","Judicious","Nefarious","Pernicious","Petulant","Tenacious","Famous","Flabbergasted","Feral","Sinister","Fresh","Adventurous","Spoony","Noisy","Whimsical","Amazing","Delicate","Hairless","Classy","Gangly","Disguised","Juicy","Ancient","Frosty","Savage","Fiery","Enraged","Surly","Dastardly","Cantankerous","Helpful","Hazardous","Dramatic","Boisterous","Simple","Feisty","Artisinal","Impolite","Toasty","Enlightened","Romantic","Giggling","Joyful","Euphoric","Humble","Gregarious","Persnickety","Extreme","Charming","Chivalrous","Grumpy","Fabulous","Snoozy","Sarcastic","Perfidious","Infamous","Enchanted","Disarming","Sneaky","Wholesome","Cheeky","Sheepish","Shrewd","Cunning","Graceful","Respectful","Precocious"];
    var nouns=["Turtle","Fox","Hawk","Falcon","Eagle","Jester","Joker","Potato","Goldfish","Ace","Flyer","Driver","Turkey","Chicken","Donkey","Goat","Llama","Antelope","Defender","Weasel","Hedgehog","Koala","Wolf","Groundhog","Stranger","Wolverine","Honey Badger","Chameleon","Cook","Hippie","Boss","Goose","Crawdad","Ham Sandwich","Toaster","Jackhammer","Pineapple","Hot Dog","Aardvark","Salt Shaker","Wizard","Waistcoat","Professor","Unicorn","Pinecone","Ninja","Samurai","Cowboy","Buccaneer","Vampire","Werewolf","Pirate","Ogre","Princess","Mentor","Narwhal","Cactus","Bigfoot","Farmer","Knight","Ghost","Rapscallion","BLT","Sorceror","Dinosaur","Songbird","Baby","Phoenix","Detective","Investigator","Eyeball","Hamster","Toad","Wombat","Worm","Hare","Zombie","Mutant","Mime","Sheriff","Concoction","Toast","Lollipop","Pancake","Milkshake","Plumber","Chainsaw","Ice Cream","Penguin","Hammer","Panda","Octopus","Wallaby","Lemur","Orangutan","Zillionaire","Burrito","Avenger","Bobcat","Platypus","Kangaroo","Donut","Marshmallow","Cheesecake","Cobra","Pufferfish","Yodeler","Diva","Armadillo","Blobfish","Coconut","Sasquatch","Jackrabbit","Moose","Raccoon","Tiger","Walrus","Buttercup"];


    const MAX_SESSIONID = "coe5EetgWMiIoiUT8Df6QmC3QYXF15RRDZFmZsmL";

    function injectMenu(container) {
        if (!container) return;
        container.innerHTML = `
            <div style="padding:10px;color:white;font-family:sans-serif;">
                <h3>Copter Royale Tweaks</h3>
                <div style="margin-bottom:5px;">Set Username:</div>
                <select id="dropdown1"></select>
                <select id="dropdown2"></select>
                <div style="margin-top:5px;">
                    <input type="checkbox" id="anonymizeChk">
                    <label for="anonymizeChk">Anonymize (random numbers)</label>
                </div>
                <button id="combineBtn" style="margin-top:5px;">Set Username</button>
                <div style="margin-top:10px;">
                    <input type="checkbox" id="maxLevelChk">
                    <label for="maxLevelChk">Set Max Level</label>
                </div>
                <div style="margin-top:10px;color:yellow;font-weight:bold;" id="statusMsg"></div>
            </div>
        `;

        const dd1 = container.querySelector('#dropdown1');
        const dd2 = container.querySelector('#dropdown2');
        const anonymizeChk = container.querySelector('#anonymizeChk');
        const maxLevelChk = container.querySelector('#maxLevelChk');
        const combineBtn = container.querySelector('#combineBtn');
        const statusMsg = container.querySelector('#statusMsg');

        adjectives.forEach(a => { const o = document.createElement('option'); o.textContent = a; dd1.appendChild(o); });
        nouns.forEach(n => { const o = document.createElement('option'); o.textContent = n; dd2.appendChild(o); });

        combineBtn.addEventListener('click', () => {
            let username = dd1.value + ' ' + dd2.value;
            if(anonymizeChk.checked) username = Math.floor(Math.random() * 1e8).toString();
            localStorage.setItem('username', username);
            statusMsg.textContent = `Username set to: ${username}`;
        });

        maxLevelChk.addEventListener('change', () => {
            if(maxLevelChk.checked) {
                localStorage.setItem('sessionId', MAX_SESSIONID);
                statusMsg.textContent = "XP set for max level!";
            }
        });
    }

    // Initial injection
    const container = document.querySelector('.news.scrollbar-black');
    injectMenu(container);

    // Observe changes and re-inject if emptied
    const observer = new MutationObserver(() => {
        const el = document.querySelector('.news.scrollbar-black');
        if (el && el.children.length === 0) injectMenu(el);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Override logo
    const oldImageSrc = "img/logo.png";
    const newImageSrc = "https://i.imgur.com/fYmECiZ.png";
    document.querySelectorAll('img').forEach(img => {
        if(img.src.endsWith(oldImageSrc)) img.src = newImageSrc;
    });

    // Override green buttons to blue
    const style = document.createElement('style');
    style.textContent = `
        .green.button {
            background-color: #007bff !important;
            box-shadow: 0 2px 10px rgba(0,0,0,.2),0 4px 0 #0056b3 !important;
        }
        .green.button:hover {
            background-color: #3399ff !important;
            box-shadow: 0 2px 10px rgba(0,0,0,.2),0 4px 0 #003d80 !important;
        }
    `;
    document.head.appendChild(style);

})();
