const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlPath = path.join(__dirname, 'index.html');
const cssPath = path.join(__dirname, 'css', 'instanttraining.webflow.shared.d549b54c8.css');

let html = fs.readFileSync(htmlPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Color Replacement
const OLD_COPPER = '#D36B28';
const OLD_COPPER_LOWER = '#d36b28';
const BRASAL_RED = '#8A151B';

css = css.replace(new RegExp(OLD_COPPER, 'gi'), BRASAL_RED);
html = html.replace(new RegExp(OLD_COPPER, 'gi'), BRASAL_RED);

// 2. Font Replacement
css = css.replace(/Cormorant Garamond/gi, 'Montserrat');
html = html.replace(/Cormorant Garamond/gi, 'Montserrat');

// Update Google Fonts URL
html = html.replace(/family=Cormorant\+Garamond[^&"'<>]+/, 'family=Montserrat:wght@400;600;800');

// 3. Name Replacement
html = html.replace(/Ember &amp; Salt/gi, 'Brasal');
html = html.replace(/Ember & Salt/gi, 'Brasal');
html = html.replace(/Ember &amp; salt/gi, 'Brasal');
html = html.replace(/Ember and Salt/gi, 'Brasal');
html = html.replace(/Ember &amp; Salt/gi, 'Brasal Parrilla'); // Additional checks just in case

// 4. Logo Injection (since we don't have a transparent PNG for Brasal, we use a CSS text logo)
const $ = cheerio.load(html, { decodeEntities: false });

const logoHTML = '<div class="brasal-logo" style="font-family: \'Montserrat\', sans-serif; font-weight: 800; font-size: 28px; line-height: 1; color: #111; letter-spacing: 2px; text-transform: uppercase;">BRASAL<div style="font-size: 10px; font-weight: 600; letter-spacing: 4px; color: ' + BRASAL_RED + '; margin-top: 4px;">Parrilla Gourmet</div></div>';

$('img[src*="logo2.png"]').replaceWith(logoHTML);
$('img[src*="logo1.png"]').replaceWith(logoHTML);

html = $.html();

fs.writeFileSync(htmlPath, html);
fs.writeFileSync(cssPath, css);

console.log('Successfully pivoted brand to Brasal Parrilla.');
