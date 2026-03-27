const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'Project-1', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// The marker text from that section
let markerIdx = html.indexOf('Locally Sourced Ingredients');
if (markerIdx === -1) {
    console.log("Error: Could not find 'Locally Sourced Ingredients'");
    process.exit(1);
}

// Find the CTA after the marker
let ctaIdx = html.indexOf('Make a Reservation', markerIdx);
if (ctaIdx === -1) {
    ctaIdx = html.indexOf('button-primary', markerIdx); // fallback
}

// Find the image right after the CTA. This is the mockup image.
let imgIdx = html.indexOf('<img', ctaIdx);
let imgEndIdx = html.indexOf('>', imgIdx) + 1;

let imgTag = html.substring(imgIdx, imgEndIdx);
// Replace the entire tag with our new phones mockup
let newImgTag = '<img src="images/phones mockup.png" alt="Phones Mockup" class="image-72" style="max-width: 100%; display: block; margin: 0 auto; padding-top: 40px;">';
html = html.substring(0, imgIdx) + newImgTag + html.substring(imgEndIdx);
console.log("Mockup image successfully replaced.");

// Now, remove the background image from this section.
// Find the nearest <div class="section..." or <section before the markerIdx
let sectionIdx = html.lastIndexOf('<section', markerIdx);
if (sectionIdx === -1) sectionIdx = html.lastIndexOf('<div class="section', markerIdx);

if (sectionIdx !== -1) {
    let sectionEndIdx = html.indexOf('>', sectionIdx);
    let sectionTag = html.substring(sectionIdx, sectionEndIdx + 1);
    
    // Inject style="background-image: none !important;"
    if (sectionTag.includes('style="')) {
        sectionTag = sectionTag.replace('style="', 'style="background-image: none !important; ');
    } else {
        sectionTag = sectionTag.replace('>', ' style="background-image: none !important;">');
    }
    
    // Also remove any existing background pattern classes entirely just in case
    sectionTag = sectionTag.replace(/bg-pattern-\d+/g, '');
    
    html = html.substring(0, sectionIdx) + sectionTag + html.substring(sectionEndIdx + 1);
    console.log("Background image removed from the phones section.");
}

// Finally, manually copy the "phones mockup.png" to the images folder
const srcMockup = path.join(__dirname, 'Project-1', 'NEW IMAGES', 'phones mockup.png');
const destMockup = path.join(__dirname, 'Project-1', 'images', 'phones mockup.png');
try {
    fs.copyFileSync(srcMockup, destMockup);
    console.log("phones mockup.png copied to images folder.");
} catch(e) {
    console.log("Mockup image not found in NEW IMAGES.");
}

// Ensure the dotted pattern is explicitly stripped globally in the CSS file to be absolutely safe
const cssPath = path.join(__dirname, 'Project-1', 'css', 'instanttraining.webflow.shared.d549b54c8.css');
let css = fs.readFileSync(cssPath, 'utf8');
css = css.replace(/url\([^)]+Background [Pp]attern 2 \.svg['"]?\)/g, 'none');
fs.writeFileSync(cssPath, css);

fs.writeFileSync(htmlPath, html);
