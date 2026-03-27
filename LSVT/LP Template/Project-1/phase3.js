const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlPath = path.join(__dirname, 'index.html');
const cssPath = path.join(__dirname, 'css', 'instanttraining.webflow.shared.d549b54c8.css');

let html = fs.readFileSync(htmlPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');

const OLD_ORANGE = '#C2410C';
const NEW_COPPER = '#D36B28';

// 1. Color and Font Replacements Globally
css = css.replace(new RegExp(OLD_ORANGE, 'gi'), NEW_COPPER);
html = html.replace(new RegExp(OLD_ORANGE, 'gi'), NEW_COPPER);
css = css.replace(/#c2410c/gi, NEW_COPPER); 
html = html.replace(/#c2410c/gi, NEW_COPPER);

css = css.replace(/Playfair Display/gi, 'Cormorant Garamond');
html = html.replace(/Playfair Display/gi, 'Cormorant Garamond');

css = css.replace(/Inter/gi, 'Lato');
html = html.replace(/Inter/gi, 'Lato');

// 2. HTML Cheerio Manipulations
const $ = cheerio.load(html, { decodeEntities: false });

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

$('link[href*="fonts.googleapis.com"]').attr('href', 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');
$('link[rel="shortcut icon"]').attr('href', 'NEW IMAGES/logo1.png');
$('link[rel="apple-touch-icon"]').attr('href', 'NEW IMAGES/logo1.png');

$('svg').each(function() {
    let svgHtml = $(this).html();
    if (svgHtml && (svgHtml.includes('LightSpeed') || svgHtml.includes('radialGradient') || ($(this).attr('class') && $(this).attr('class').includes('background')))) {
        if ($(this).attr('width') > 200 || !$(this).attr('width')) {
            $(this).remove();
        }
    }
});

$('div').each(function() {
    let style = $(this).attr('style') || '';
    if (style.includes('filter: blur') || style.includes('radial-gradient')) {
        if (style.includes('blur')) {
            $(this).attr('style', style.replace(/filter:\s*blur[^;]+;?/gi, ''));
        }
        if (style.includes('radial-gradient')) {
            $(this).css('background-image', 'none');
        }
    }
});

$('img').each(function() {
    let src = $(this).attr('src') || '';
    if (src.includes('icons-blue-01.svg') || src.includes('noun-design')) {
        $(this).attr('src', 'fonts/697d21b6190dfcf9c26adb3e_noun-design-7945271.svg');
    } else if (src.includes('icons-blue-04.svg') || src.includes('noun-data')) {
        $(this).attr('src', 'fonts/697d21b6190dfcf9c26adb42_noun-data-7826207.svg');
    } else if (src.includes('new1-03.svg') || src.includes('noun-practices')) {
        $(this).attr('src', 'fonts/697d21b6190dfcf9c26adb3d_noun-practices-7999906.svg');
    } else if (src.includes('new1-04.svg') || src.includes('noun-execute')) {
        $(this).attr('src', 'fonts/697d21b6190dfcf9c26adb79_noun-execute-6604245.svg');
    }
});

html = $.html();

css += '\n/* PHASE 3 REFINEMENTS */\n' +
'.w-button, .button, .button-primary, .button-secondary {\n' +
'    border: none !important;\n' +
'    outline: none !important;\n' +
'    box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important;\n' +
'    transition: all 0.3s ease;\n' +
'}\n' +
'.navbar-main {\n' +
'    background-color: rgba(255, 255, 255, 0.85) !important;\n' +
'    backdrop-filter: blur(15px) !important;\n' +
'    -webkit-backdrop-filter: blur(15px) !important;\n' +
'    border: none !important;\n' +
'    box-shadow: none !important;\n' +
'}\n' +
'.image-115, .footer-logo, .footer-image {\n' +
'    opacity: 1 !important;\n' +
'    filter: none !important;\n' +
'    mix-blend-mode: normal !important;\n' +
'    transform: none !important;\n' +
'}\n' +
'.blur, .bg-blur, [class*="blur"] {\n' +
'    filter: none !important;\n' +
'    opacity: 0 !important;\n' +
'    display: none !important;\n' +
'}\n' +
'.section, .hero-section {\n' +
'    background-image: none !important;\n' +
'}\n' +
'path {\n' +
'    fill: ' + NEW_COPPER + ' !important;\n' +
'}\n';

fs.writeFileSync(htmlPath, html);
fs.writeFileSync(cssPath, css);
console.log('Phase 3 CSS/DOM cleanups applied.');
