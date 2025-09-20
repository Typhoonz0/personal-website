// Check if user credentials exist
let credentials = JSON.parse(localStorage.getItem('credentials'));
let loggedIn =  'true';

const loginScreen = document.getElementById('login-screen');
const sigmaOS = document.getElementById('sigmaOS');

// Show the appropriate screen based on login state
function showLoginScreen() {
    loginScreen.style.display = 'flex';
    sigmaOS.style.display = 'none';
}

function showsigmaOS() {
    loginScreen.style.display = 'none';
    sigmaOS.style.display = 'block';
}

// Initial UI setup
if (loggedIn) {
    showsigmaOS();
    addLogoutButton();
} else {
    showLoginScreen();
}

// Handle login button click
document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!credentials) {
        // If no credentials exist, store them
        if (username && password) {
            localStorage.setItem('credentials', JSON.stringify({
                username,
                password
            }));
            alert('Credentials saved! Please reload the page.');
            return;
        } else {
            alert('Please enter both username and password to create an account.');
            return;
        }
    }

    // Authenticate credentials
    if (username === credentials.username && password === credentials.password) {
        sessionStorage.setItem('loggedin', 'true');
        loggedIn = true;
        loginScreen.style.display = 'none';
        setTimeout(1);
        showsigmaOS();
    } else {
        alert('Invalid credentials. Please try again.');
    }
});

// Add Logout Button
function addLogoutButton() {
    const logoutButton = document.createElement('button');
    logoutButton.innerText = 'Logout';
    logoutButton.id = 'logout-btn';
    logoutButton.style = "font-family: msfont, sans-serif";
    logoutButton.onclick = () => {
        sessionStorage.removeItem('loggedin');
        loggedIn = false;
        showLoginScreen();
    };
    document.getElementById('start-menu').appendChild(logoutButton);
}

// Wait for the DOM to load and set wallpaper if stored in localStorage
window.addEventListener('DOMContentLoaded', () => {
    const wallpaperSettings = localStorage.getItem('wallpaperSettings');
    if (wallpaperSettings) {
        const {
            property,
            value
        } = JSON.parse(wallpaperSettings);
        document.body.style[property] = value;
    }
});

// Get references for taskbar and template
const taskbar = document.getElementById('taskbar');
const template = document.getElementById('template');
let zIndex = 10; // Track z-index for draggable windows

// Add Start Button to Taskbar
const startButton = document.createElement('button');
startButton.innerText = 'Start';

startButton.style.marginRight = '2px';
startButton.style.fontFamily = "msfont, sans-serif";
startButton.onclick = () => {
    
    const startMenu = document.getElementById('start-menu');
    if (startMenu.classList.contains('hidden')) {
        // Position the Start Menu just above the Start button
        const rect = startButton.getBoundingClientRect();
        startMenu.style.left = `${rect.left}px`;
        startMenu.style.bottom = `${window.innerHeight - rect.top + 10}px`;
        startMenu.classList.remove('hidden');
        
    } else {
      
        startMenu.classList.add('hidden');
    }
};
taskbar.insertBefore(startButton, taskbar.firstChild);

// Run Program Function - Triggered by "Run" button in the Start Menu
function runProgram() {
    const url = prompt('Type a URL or included HTML file and sigmaOS will run it for you:');
    if (url) openProgram(url, url);
}

function openProgram(url, title) {
    // Clone the template window
    const newWindow = template.cloneNode(true);
    newWindow.classList.remove('hidden');
    newWindow.classList.add('window', 'opening'); // Add opening animation class
    newWindow.querySelector('.window-title').innerText = title;
    newWindow.querySelector('iframe').src = url;

    document.body.appendChild(newWindow);

    // Remove 'opening' class after animation ends
    newWindow.addEventListener('animationend', () => {
        newWindow.classList.remove('opening');
    });

    // Add taskbar item
    const taskbarItem = document.createElement('button');
    taskbarItem.innerText = title;
    taskbarItem.dataset.windowId = newWindow;
    taskbar.appendChild(taskbarItem);

    // Bring window to front on taskbar click
    taskbarItem.addEventListener('click', () => {
        newWindow.classList.add('window', 'opening'); // Add opening animation class
        // Remove 'opening' class after animation ends
        newWindow.addEventListener('animationend', () => {
            newWindow.classList.remove('opening');
        });
        newWindow.style.zIndex = ++zIndex;
        newWindow.style.display = 'block'; // Bring back minimized windows
    });

    // Close button
    newWindow.querySelector('.close-button').addEventListener('click', () => {
        // Add closing animation and remove window after animation ends
        newWindow.classList.add('closing');
        newWindow.addEventListener('animationend', () => {
            newWindow.remove();
            taskbarItem.remove();
        });
    });

    // Minimize button
    newWindow.querySelector('.minimize').addEventListener('click', () => {
        newWindow.classList.add('window', 'closing'); // Add closing animation class
        // Remove 'closing' class after animation ends
        newWindow.addEventListener('animationend', () => {
            newWindow.classList.remove('closing');
        });
        newWindow.style.display = 'none';
    });

    // Maximize button
    newWindow.querySelector('.maximize').addEventListener('click', () => {
        newWindow.classList.add('window', 'opening'); // Add opening animation class
        // Remove 'opening' class after animation ends
        newWindow.addEventListener('animationend', () => {
            newWindow.classList.remove('opening');
        });
        if (newWindow.style.width !== '100%') {
            newWindow.style.width = '100%';
            newWindow.style.height = 'calc(100% - 40px)';
            newWindow.style.top = '0';
            newWindow.style.left = '0';
        } else {
            newWindow.style.width = '400px';
            newWindow.style.height = '300px';
            newWindow.style.top = '100px';
            newWindow.style.left = '100px';
        }
    });

    // Make window draggable
    makeDraggable(newWindow);
}

// Make window draggable functionality
function makeDraggable(element) {
    const header = element.querySelector('.header');
    let offsetX = 0,
        offsetY = 0,
        isDragging = false;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

function updateClock() {
    const clock = document.getElementById('taskbar-clock');
    const now = new Date();
    const time = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    const date = now.toLocaleDateString();
    clock.textContent = `${time} | ${date}`;
}

// Initialize and update the clock every second
updateClock();
setInterval(updateClock, 1000);

