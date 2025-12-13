// Function to load header and set active state
function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(html => {
            // Insert header before main or body content
            const body = document.body;
            const main = document.querySelector('main');
            
            if (main) {
                main.insertAdjacentHTML('beforebegin', html);
            } else {
                body.insertAdjacentHTML('afterbegin', html);
            }
            
            // Set active state and handle links based on current page
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const isIndexPage = currentPage === 'index.html' || currentPage === '';
            
            if (isIndexPage) {
                // On index page, remove links and set active state
                const shopItem = document.getElementById('header-shop');
                const spireItem = document.getElementById('header-spire');
                
                if (shopItem) {
                    const parentLink = shopItem.closest('a');
                    if (parentLink) {
                        parentLink.replaceWith(shopItem);
                    }
                    shopItem.classList.add('active');
                }
                
                if (spireItem) {
                    const parentLink = spireItem.closest('a');
                    if (parentLink) {
                        parentLink.replaceWith(spireItem);
                    }
                }
            }
            
            // Check if we're on a product page
            const isProductPage = /^p\d+\.html$/.test(currentPage);
            
            if (isProductPage) {
                // Setup title reveal for product pages
                setupTitleReveal();
            } else {
                // Setup clock for index page
                setupClockReveal();
            }
            
            // Dispatch custom event to signal header is loaded
            window.dispatchEvent(new CustomEvent('headerLoaded'));
        })
        .catch(error => {
            console.error('Error loading header:', error);
            // Still dispatch event even on error so animations can proceed
            window.dispatchEvent(new CustomEvent('headerLoaded'));
        });
}

// Clock reveal function
function setupClockReveal() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;

    const firstSegmentDelay = 0.08;
    const secondSegmentDelay = 0.18;
    const thirdSegmentDelay = 0.40;

    clockElement.innerHTML = '';
    
    const now = new Date();
    const initialHours = String(now.getHours()).padStart(2, '0');
    const initialMinutes = String(now.getMinutes()).padStart(2, '0');
    const initialSeconds = String(now.getSeconds()).padStart(2, '0');
    
    const hoursSpan = document.createElement('span');
    hoursSpan.className = 'time-segment hours';
    hoursSpan.textContent = initialHours;
    const hoursCover = document.createElement('span');
    hoursCover.className = 'cover-rectangle';
    hoursCover.style.animationDelay = `${firstSegmentDelay}s`;
    hoursSpan.appendChild(hoursCover);
    clockElement.appendChild(hoursSpan);
    
    clockElement.appendChild(document.createTextNode(':'));
    
    const minutesSpan = document.createElement('span');
    minutesSpan.className = 'time-segment minutes';
    minutesSpan.textContent = initialMinutes;
    const minutesCover = document.createElement('span');
    minutesCover.className = 'cover-rectangle';
    minutesCover.style.animationDelay = `${secondSegmentDelay}s`;
    minutesSpan.appendChild(minutesCover);
    clockElement.appendChild(minutesSpan);
    
    clockElement.appendChild(document.createTextNode(':'));
    
    const secondsSpan = document.createElement('span');
    secondsSpan.className = 'time-segment seconds';
    secondsSpan.textContent = initialSeconds;
    const secondsCover = document.createElement('span');
    secondsCover.className = 'cover-rectangle';
    secondsCover.style.animationDelay = `${thirdSegmentDelay}s`;
    secondsSpan.appendChild(secondsCover);
    clockElement.appendChild(secondsSpan);

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        hoursSpan.textContent = hours;
        minutesSpan.textContent = minutes;
        secondsSpan.textContent = seconds;
    }

    setInterval(updateClock, 1000);
}

// Title reveal function for product pages
function setupTitleReveal() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;

    // Get the current page name (e.g., "p1.html")
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageMatch = currentPage.match(/^p(\d+)\.html$/);
    
    if (!pageMatch) return;
    
    const pageNumber = pageMatch[1];
    const pagePrefix = String(pageNumber).padStart(2, '0'); // e.g., "01", "02", etc.
    
    // Try to get the second word from the product name on the page
    const productNameElement = document.querySelector('.product-name');
    let secondWord = 'memory'; // default
    
    if (productNameElement) {
        const productName = productNameElement.textContent.trim();
        const words = productName.split(/\s+/);
        if (words.length >= 2) {
            secondWord = words[1]; // Get the second word (e.g., "memory" from "01 memory")
        }
    }
    
    // Construct the title (e.g., "01 memory")
    const titleText = `${pagePrefix} ${secondWord}`;
    const words = titleText.split(/\s+/);
    
    // Change the class from clock to title
    clockElement.classList.remove('clock');
    clockElement.classList.add('title');
    clockElement.innerHTML = '';
    
    // Create word segments with cover rectangles
    words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = `word-segment word-${index + 1}`;
        wordSpan.textContent = word;
        
        const coverRect = document.createElement('span');
        coverRect.className = 'cover-rectangle';
        
        // Set animation delay - first word reveals first, second word reveals after
        const firstWordDelay = 0.08;
        const delayBetweenWords = 0.18;
        coverRect.style.animationDelay = `${firstWordDelay + (index * delayBetweenWords)}s`;
        
        wordSpan.appendChild(coverRect);
        clockElement.appendChild(wordSpan);
        
        // Add space between words (except after last word)
        if (index < words.length - 1) {
            const spaceNode = document.createTextNode('\u0020'); // Explicit space character
            clockElement.appendChild(spaceNode);
        }
    });
}

// Load header when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
} else {
    loadHeader();
}

