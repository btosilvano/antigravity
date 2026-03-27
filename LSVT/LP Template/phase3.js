const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlPath = path.join(__dirname, 'Project-1', 'index.html');
const cssPath = path.join(__dirname, 'Project-1', 'css', 'instanttraining.webflow.shared.d549b54c8.css');

let html = fs.readFileSync(htmlPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');

const OLD_ORANGE = '#C2410C';
const NEW_COPPER = '#D36B28';

// 1. Color and Font Replacements Globally
css = css.replace(new RegExp(OLD_ORANGE, 'gi'), NEW_COPPER);
html = html.replace(new RegExp(OLD_ORANGE, 'gi'), NEW_COPPER);

css = css.replace(/Playfair Display/gi, 'Cormorant Garamond');
html = html.replace(/Playfair Display/gi, 'Cormorant Garamond');

css = css.replace(/Inter/gi, 'Lato');
html = html.replace(/Inter/gi, 'Lato');

// 2. HTML Cheerio Manipulations
const $ = cheerio.load(html, { decodeEntities: false });

// Deep Copy Sweep for B2B terms
$('*').contents().filter(function() {
    return this.nodeType === 3 && $(this).text().trim().length > 0;
}).each(function() {
    let text = $(this).text();
    let lower = text.toLowerCase();
    let dirty = false;

    if (lower.includes('sop') || lower.includes('sops')) {
        text = "Our culinary perfection is achieved through meticulous sourcing and passionate dedication.";
        dirty = true;
    }
    if (lower.includes('what your instant')) {
        text = "What the Ember & Salt menu features:";
        dirty = true;
    }
    if (lower.includes('training') || lower.includes('managers') || lower.includes('reports') || lower.includes('tribal knowledge')) {
        if (!lower.includes('ember') && !lower.includes('culinary')) {
            text = "Every detail is curated to provide an unforgettable evening of taste and atmosphere.";
            dirty = true;
        }
    }
    if (lower.includes('\\n') || lower.includes('/n')) {
        // the user complained about a literal "\n" or "/n" visible on the page before hero section
        if (text.trim() === '\\n' || text.trim() === '/n' || text.trim() === 'n' || text.trim() === '\\\\n') {
            text = '';
            dirty = true;
        } else {
            text = text.replace(/\\\\n/g, '').replace(/\\\/n/g, '').replace(/\\n/g, '');
            dirty = true;
        }
    }

    if (dirty) {
        $(this).replaceWith(text);
    }
});

// Update the Google Fonts link explicitly for Cormorant Garamond and Lato
$('link[href*="fonts.googleapis.com"]').attr('href', 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');

// Favicon updates to use the elegant logo
$('link[rel="shortcut icon"]').attr('href', 'NEW IMAGES/logo1.png');
$('link[rel="apple-touch-icon"]').attr('href', 'NEW IMAGES/logo1.png');

// Remove LightSpeed VT SVG hidden backgrounds if they exist directly in HTML as svg tags
$('svg').each(function() {
    let svgHtml = $(this).html();
    if (svgHtml && (svgHtml.includes('LightSpeed') || svgHtml.includes('radialGradient') || $(this).attr('class') && $(this).attr('class').includes('background'))) {
        // If it's a huge background logo
        if ($(this).attr('width') > 200 || !$(this).attr('width')) {
            $(this).remove();
        }
    }
});

// Remove any div that looks like a pure blur divider or pure background logo
$('div').each(function() {
    let style = $(this).attr('style') || '';
    let bgImage = $(this).css('background-image') || '';
    if (style.includes('filter: blur') || style.includes('radial-gradient') || bgImage.includes('radial-gradient')) {
        // Safe to remove the blur entirely
        if (style.includes('blur')) {
            $(this).attr('style', style.replace(/filter:\s*blur[^;]+;?/gi, ''));
        }
        if (style.includes('radial-gradient')) {
            $(this).css('background-image', 'none');
        }
    }
});

html = $.html();

// 3. CSS Refinements
// Overriding button borders and fixing blurs/backgrounds
css += `
/* PHASE 3 REFINEMENTS */
.w-button, .button, .button-primary, .button-secondary {
    border: none !important;
    outline: none !important;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important;
    transition: all 0.3s ease;
}

/* Ensure Navbar is unbordered and blurred properly */
.navbar-main {
    background-color: rgba(255, 255, 255, 0.85) !important;
    backdrop-filter: blur(15px) !important;
    -webkit-backdrop-filter: blur(15px) !important;
    border: none !important;
    box-shadow: none !important;
}

/* Force footer logo clear and visible */
.image-115, .footer-logo {
    opacity: 1 !important;
    filter: none !important;
    mix-blend-mode: normal !important;
    transform: none !important;
}

/* Aggressively remove any leftover Webflow template blurs and black gradients */
.blur, .bg-blur, [class*="blur"] {
    filter: none !important;
    opacity: 0 !important;
    display: none !important;
}

/* Ensure no radial gradient covers the background */
.section {
    background-image: none !important;
}
.hero-section {
    background-image: none !important;
}

/* Fix any remaining SVG that has the wrong orange */
path {
    fill: ${NEW_COPPER} !important;
}
`;

fs.writeFileSync(htmlPath, html);
fs.writeFileSync(cssPath, css);
console.log('Phase 3 CSS/DOM cleanups applied.');
