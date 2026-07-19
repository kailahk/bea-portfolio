// ---------------------------------------------------------------------------
// Font registry — every typeface available in the title-dropdown ("Cake4Freaks
// ⇕") and in the "+ Add Text Area" random pool is described here. To add
// another font later:
//   1. Add an @font-face rule (and a ".key.font-input { font-family: ... }"
//      rule) for it in style.css.
//   2. Add an entry below with that same key, and a matching entry in
//      RANDOM_BOUNDS.
// Nothing else in this file needs to change — the dropdown, the feature
// list, the optical-size UI, the buy link, and the "+" button's random pool
// all read from this registry.
// ---------------------------------------------------------------------------
const c4fFeatures = {
    'none': [false, 'none'],
    'lining figures': [false, 'lnum'],
    'oldstyle figures': [false, 'onum'],
    'case sensitive': [false, 'case'],
    'short ascenders': [false, 'ss01'],
    'ligatures': [true, 'liga'],
    'All Caps': [false, 'allcaps']
};
const benFeatures = {
    'none': [false, 'none'],
    'localized forms': [false, 'locl'],
    'superscript': [false, 'sups'],
    'fractions': [false, 'frac'],
    'ordinals': [false, 'ordn'],
    'ligatures': [true, 'liga'],
    'contextual alternates': [true, 'calt'],
    'SS01 (alternate "u")': [false, 'ss01'],
    'All Caps': [false, 'allcaps']
};
// Feature sets below were read directly out of each font's GSUB table, so
// only tags each font actually supports are offered as toggles. "All Caps"
// isn't a real OpenType feature — it's a plain text-transform toggle — but
// it's added to every font here so it shows up alongside the rest and is
// handled the same way (see updateFeatures()).
const blockvarFeatures = {
    'none': [true, 'none'],
    'SS01 (alternate)': [false, 'ss01'],
    'All Caps': [false, 'allcaps']
};
const cmdcutFeatures = {
    'none': [false, 'none'],
    'localized forms': [false, 'locl'],
    'superscript': [false, 'sups'],
    'fractions': [false, 'frac'],
    'ordinals': [false, 'ordn'],
    'ligatures': [true, 'liga'],
    'SS01 (alternate)': [false, 'ss01'],
    'All Caps': [false, 'allcaps']
};
const cursiveFeatures = {
    'none': [false, 'none'],
    'ligatures': [true, 'liga'],
    'SS01 (alternate)': [false, 'ss01'],
    'All Caps': [false, 'allcaps']
};
const squarecapFeatures = {
    'none': [false, 'none'],
    'contextual alternates': [true, 'calt'],
    'All Caps': [false, 'allcaps']
};
const sweetbabyFeatures = {
    'none': [false, 'none'],
    'ligatures': [true, 'liga'],
    'All Caps': [false, 'allcaps']
};

const c4fOpszVals = {
    'text regular': [true, 'text regular'],
    'regular': [false, 'regular'],
    'display regular': [false, 'display regular']
};
const OPSZ_VALUES = {
    'text regular': 10,
    'regular': 30,
    'display regular': 50
};

// Every typeface on the site, keyed by the short id also used as its CSS
// class (".c4f", ".ben", ".blockvar", ...). `hasOpsz: true` is reserved for
// Cake4Freaks, the only font with a real optical-size axis wired into the
// UI; every other font instead shows a single static style label
// (`staticLabel`) in that same slot.
const FONTS = {
    c4f: {
        displayName: 'Cake4Freaks',
        family: 'Cake4Freaks-Optical',
        defaultText: 'Ceremonies of Light and Dark',
        hasOpsz: true,
        features: c4fFeatures,
        buyLink: { url: 'https://www.futurefonts.com/bea-korsh/cake4freaks', label: 'Buy/$15 ↗' }
    },
    ben: {
        displayName: 'Benmania',
        family: 'Benmania-Black',
        defaultText: 'And the Rock Cried Out, No Hiding Place',
        hasOpsz: false,
        staticLabel: 'Black',
        features: benFeatures,
        buyLink: { url: 'https://www.futurefonts.com/bea-korsh/benmania', label: 'Buy/$20 ↗' }
    },
    blockvar: {
        displayName: 'Block Condensed',
        family: 'BlockVariable-Condensed',
        defaultText: 'Concrete Blocks Stacked Tall',
        hasOpsz: false,
        staticLabel: 'Condensed',
        features: blockvarFeatures,
        buyLink: null
    },
    cmdcut: {
        displayName: 'Cmd Cut Black',
        family: 'CmdCut-Black',
        defaultText: 'Execute Command Now',
        hasOpsz: false,
        staticLabel: 'Regular',
        features: cmdcutFeatures,
        buyLink: null
    },
    cursive: {
        displayName: 'Cursive',
        family: 'Cursive-Regular',
        defaultText: 'Handwritten Notes and Letters',
        hasOpsz: false,
        staticLabel: 'Regular',
        features: cursiveFeatures,
        buyLink: null
    },
    squarecap: {
        displayName: 'Square Capitals',
        family: 'SquareCapitals-Regular',
        defaultText: 'ALL CAPS ALL SQUARE',
        hasOpsz: false,
        staticLabel: 'Regular',
        features: squarecapFeatures,
        buyLink: null
    },
    sweetbaby: {
        displayName: 'Sweet Baby Boy Bold',
        family: 'SweetBabyBoy-Bold',
        defaultText: 'Sweet Dreams Little One',
        hasOpsz: false,
        staticLabel: 'Regular',
        features: sweetbabyFeatures,
        buyLink: null
    }
};
const FONT_KEYS = Object.keys(FONTS);

// Tunable ranges for "+ Add Text Area" — adjust these to change how wild
// or subtle the randomly-generated boxes feel. Nothing else in the file
// needs to change when these values are edited.
// `size` is split by which kind of Frankenstein snippet the box ends up
// with: a single sentence reads fine set large, while a full paragraph
// needs to run smaller or it overwhelms the box. See pickRandomFrankensteinText
// and createRandomFontArea below.
const RANDOM_BOUNDS = {
    c4f: {
        size: { sentence: { min: 55, max: 95 }, paragraph: { min: 20, max: 42 } },
        leading: { min: -20, max: 30 },
        opsz: ['text regular', 'regular', 'display regular'],
        alignment: ['left', 'center', 'right']
    },
    ben: {
        size: { sentence: { min: 55, max: 95 }, paragraph: { min: 20, max: 42 } },
        leading: { min: -20, max: 30 },
        alignment: ['left', 'center', 'right']
    },
    blockvar: {
        size: { sentence: { min: 55, max: 95 }, paragraph: { min: 20, max: 42 } },
        leading: { min: -20, max: 30 },
        alignment: ['left', 'center', 'right']
    },
    cmdcut: {
        size: { sentence: { min: 55, max: 95 }, paragraph: { min: 20, max: 42 } },
        leading: { min: -20, max: 30 },
        alignment: ['left', 'center', 'right']
    },
    cursive: {
        size: { sentence: { min: 55, max: 95 }, paragraph: { min: 20, max: 42 } },
        leading: { min: -20, max: 30 },
        alignment: ['left', 'center', 'right']
    },
    squarecap: {
        size: { sentence: { min: 55, max: 95 }, paragraph: { min: 20, max: 42 } },
        leading: { min: -20, max: 30 },
        alignment: ['left', 'center', 'right']
    },
    sweetbaby: {
        size: { sentence: { min: 55, max: 95 }, paragraph: { min: 20, max: 42 } },
        leading: { min: -20, max: 30 },
        alignment: ['left', 'center', 'right']
    }
};

// Picks a random snippet from the Frankenstein pool (loaded via
// assets/frankenstein-text.js) for the "+ Add Text Area" button — a 50/50
// coin flip between a single sentence and a full paragraph each time.
// Returns { text, kind } where kind is 'sentence' or 'paragraph' (used to
// pick a matching font-size range), or null if that file hasn't loaded for
// some reason, so callers can fall back to the font's normal sample phrase.
function pickRandomFrankensteinText() {
    const pool = window.FRANKENSTEIN_TEXT;
    if (!pool) return null;
    const kind = Math.random() < 0.5 ? 'sentence' : 'paragraph';
    const list = kind === 'sentence' ? pool.sentences : pool.paragraphs;
    if (!list || !list.length) return null;
    return { text: list[Math.floor(Math.random() * list.length)], kind };
}

// Reads which font a given .font-area is currently set to, straight off its
// <h3 class="title KEY"> element — this is the single source of truth used
// everywhere below instead of tracking font state separately.
function getFontKey(fontArea) {
    const titleElement = fontArea.querySelector('.title');
    if (!titleElement) return null;
    return FONT_KEYS.find((key) => titleElement.classList.contains(key)) || null;
}

document.addEventListener('DOMContentLoaded', () => {
    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function pickRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    let dynamicFontAreaCount = 0;

    // DOM Elements
    let body = document.getElementsByTagName('body')[0];
    const sun = document.getElementById('sun');
    const moon = document.getElementById('moon');
    const allFonts = [...document.querySelectorAll('.all-fonts section.font-area')];

    // Event Listeners
    sun.addEventListener('click', updateMode);
    moon.addEventListener('click', updateMode);

    function wireFontArea(fontArea) {
        const handler = (event) => updateTextArea(fontArea, event);
        fontArea.addEventListener('click', handler);
        fontArea.addEventListener('input', handler);
        fontArea.addEventListener('touchstart', handler);
        addCopyButton(fontArea);
    }

    function ensureToolbar(fontArea) {
        // The Copy/Remove controls now live inline in the sidebar, in the
        // same cluster as Features and Paragraph, rather than as a floating
        // top-right toolbar.
        return fontArea.querySelector('.options.top');
    }

    function addCopyButton(fontArea) {
        const toolbar = ensureToolbar(fontArea);
        if (!toolbar || toolbar.querySelector('.copy-font-area')) return;
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'copy-font-area';
        copyBtn.innerHTML = 'Copy HTML &#x2193;';
        copyBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            copyFontAreaHtml(fontArea, copyBtn);
        });
        toolbar.appendChild(copyBtn);
    }

    function copyFontAreaHtml(fontArea, triggerBtn) {
        const clone = fontArea.cloneNode(true);

        // Strip the Copy/Remove controls out of the exported markup.
        clone.querySelectorAll('.copy-font-area, .remove-font-area').forEach(el => el.remove());

        // A typed value only ever lives in the textarea's live "value"
        // property, never in its HTML source — so bake the current live
        // text in as real text content before serializing, or a pasted
        // copy would always revert to the box's original default phrase.
        const liveTextArea = fontArea.querySelector('.font-input');
        const cloneTextArea = clone.querySelector('.font-input');
        if (liveTextArea && cloneTextArea) {
            cloneTextArea.textContent = liveTextArea.value;
        }

        // Likewise, bake each slider's current live position in as its
        // "value" attribute, so the pasted markup starts in the same state
        // instead of resetting to each slider's original default.
        const liveSliders = fontArea.querySelectorAll('input[type="range"]');
        const cloneSliders = clone.querySelectorAll('input[type="range"]');
        cloneSliders.forEach((input, i) => {
            input.setAttribute('value', liveSliders[i].value);
        });

        const html = clone.outerHTML;

        navigator.clipboard.writeText(html).then(() => {
            const original = triggerBtn.innerHTML;
            triggerBtn.textContent = 'Copied!';
            setTimeout(() => { triggerBtn.innerHTML = original; }, 1500);
        }).catch(() => {
            const original = triggerBtn.innerHTML;
            triggerBtn.textContent = 'Copy failed';
            setTimeout(() => { triggerBtn.innerHTML = original; }, 1500);
        });
    }

    // Wire up every font-area section found on the page (not just two),
    // so duplicating/adding sections "just works".
    allFonts.forEach(wireFontArea);

    // Build the font-switcher dropdown, the feature list, and the
    // optical-size UI for every section on load.
    buildTitlesDropdown(allFonts);
    initFeatures(allFonts);
    initOpszVals(allFonts);

    // "+ Add Text Area" button
    const addFontAreaBtn = document.getElementById('add-font-area');
    if (addFontAreaBtn) {
        addFontAreaBtn.addEventListener('click', createRandomFontArea);
    }

    function createRandomFontArea() {
        const container = document.querySelector('.all-fonts');
        const template = container.querySelector('section.font-area');
        const clone = template.cloneNode(true);

        // Drop any numbered font-area-N class from the source template and
        // mark this section as dynamically added (its own mobile spacing rule).
        clone.classList.remove('font-area-1', 'font-area-2', 'font-area-3');
        clone.classList.add('font-area-dynamic');

        // Give the textarea a fresh, unique id and clear any inline styles
        // (size/leading/opsz/alignment/custom text) copied from the template.
        const textArea = clone.querySelector('.font-input');
        textArea.id = `dynamic-input-${dynamicFontAreaCount}`;
        textArea.removeAttribute('style');
        // Strip any stray font-key class the template's textarea happened to
        // carry (Benmania's static textarea has one baked in) so a clone
        // never starts out mismatched with whatever font is picked below.
        FONT_KEYS.forEach((key) => textArea.classList.remove(key));

        // Strip any Copy HTML button copied over from the template —
        // wireFontArea() will attach a fresh one for this section below.
        const copiedCopyBtn = clone.querySelector('.copy-font-area');
        if (copiedCopyBtn) copiedCopyBtn.remove();

        container.appendChild(clone);
        allFonts.push(clone);
        wireFontArea(clone);

        // Remove control so dynamically-added boxes can be cleared out
        // again — appended after wireFontArea() so it lands below the
        // Copy HTML button it just attached, not above it.
        const toolbar = ensureToolbar(clone);
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-font-area';
        removeBtn.innerHTML = '&#x2715; Remove';
        removeBtn.addEventListener('click', () => {
            clone.remove();
            allFonts.splice(allFonts.indexOf(clone), 1);
        });
        toolbar.appendChild(removeBtn);

        // Pick a font at random from every typeface in FONTS — the random
        // pool draws from all of them, not just the original two — and
        // apply it before rebuilding the feature list, so that list matches
        // whichever font actually got picked.
        const chosenFont = pickRandom(FONT_KEYS);
        updateFont(clone, textArea, chosenFont);

        // Randomly flip "All Caps" on or off for this new box — a coin
        // flip independent of everything else being randomized here. Like
        // every other feature, "All Caps" is stored per font rather than
        // per box, so this also updates any other box currently on the
        // same font, same as clicking the checkbox by hand would.
        const allCapsEntry = FONTS[chosenFont].features['All Caps'];
        if (allCapsEntry) {
            allCapsEntry[0] = Math.random() < 0.5;
        }

        initFeatures([clone]);

        // Pull a random sentence-or-paragraph from Frankenstein for this
        // box's sample text instead of the font's usual canned phrase.
        // Tagging it on the element (rather than just setting the text
        // once) means updatePlaceholder() can keep re-applying this same
        // snippet on future resizes instead of falling back to the plain
        // per-font default the way it does for every other box.
        const randomText = pickRandomFrankensteinText();
        if (randomText) {
            textArea.dataset.randomText = randomText.text;
        }

        // Randomize size, leading, (opsz for Cake4Freaks), and alignment
        // within the configured bounds, and keep the sliders in sync. Size
        // depends on which kind of snippet this box got: a single sentence
        // can run big, a full paragraph needs to run smaller to still fit
        // comfortably — fonts without a Frankenstein snippet (pool failed
        // to load) just fall back to the sentence-sized range.
        const bounds = RANDOM_BOUNDS[chosenFont];
        const sizeBounds = bounds.size[randomText ? randomText.kind : 'sentence'];
        const size = randomInt(sizeBounds.min, sizeBounds.max);
        const leading = randomInt(bounds.leading.min, bounds.leading.max);

        const sizeSlider = clone.querySelector('.size-option input');
        const leadingSlider = clone.querySelector('.leading-option input');
        sizeSlider.value = size;
        leadingSlider.value = leading;

        if (FONTS[chosenFont].hasOpsz && bounds.opsz) {
            const opszName = pickRandom(bounds.opsz);
            const opszValue = OPSZ_VALUES[opszName];
            const displayName = opszName.split(' ').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            updateAllOpszElements(clone, opszName, displayName, opszValue);
        }

        updateSize(textArea, size);
        updateLeading(textArea, leading, clone);

        const alignment = pickRandom(bounds.alignment);
        textArea.style.textAlign = alignment;

        if (window.innerWidth < 768) {
            textArea.innerText = "Abc...";
        } else if (randomText) {
            textArea.innerText = randomText.text;
        }

        updateFeatures(clone, textArea);
        autoResize(textArea);

        dynamicFontAreaCount++;
    }

    // Helper Functions

    // Populates each section's font-switcher dropdown with one row per font
    // in FONTS, checkmarking whichever one that section is currently set to.
    function buildTitlesDropdown(fontAreas) {
        fontAreas.forEach((fontArea) => {
            const container = fontArea.querySelector('.titles.dropdown-content');
            if (!container) return;
            const currentKey = getFontKey(fontArea);
            container.innerHTML = '';
            FONT_KEYS.forEach((key) => {
                const font = FONTS[key];
                const isActive = key === currentKey;
                const p = document.createElement('p');
                p.className = key;
                p.innerHTML = `<span class="${isActive ? 'show-title-check' : 'hide-title-check'}">&#x2713; </span>${font.displayName}`;
                container.appendChild(p);
            });
        });
    }

    // Toggles the checkmark next to whichever row in the font-switcher
    // dropdown matches the newly-chosen font.
    function updateTitleChecks(fontArea, chosenFont) {
        fontArea.querySelectorAll('.titles p').forEach((p) => {
            const span = p.querySelector('span');
            if (!span) return;
            const isActive = p.classList.contains(chosenFont);
            span.classList.toggle('show-title-check', isActive);
            span.classList.toggle('hide-title-check', !isActive);
        });
    }

    function initFeatures(fontAreas) {
        fontAreas.forEach((fontArea) => {
            const features = fontArea.querySelector('.features-dropdown');
            const key = getFontKey(fontArea);
            const font = key ? FONTS[key] : null;
            if (!font) {
                console.error('Could not determine font for section', fontArea);
                return;
            }
            features.innerHTML = '';
            appendFeatures(features, font.features);
            FONT_KEYS.forEach((k) => features.classList.remove(k));
            features.classList.add(key);
        });
    }

    function appendFeatures(container, featureSet) {
        Object.entries(featureSet).forEach(([featureName, featureValue]) => {
            const [isActive, featureCode] = featureValue;

            const fontFeature = document.createElement('div');
            fontFeature.setAttribute('class', `feature ${featureCode}`);
            fontFeature.setAttribute('data-feature-code', featureCode); // Set the data attribute

            // Set the visibility class based on whether the feature is active
            const visibilityClass = isActive ? 'visible' : 'invisible';

            fontFeature.innerHTML = `<span class="check ${visibilityClass}">&#x2713; </span>${featureName}`;

            container.appendChild(fontFeature);

            // Add event listener for feature toggling
            fontFeature.addEventListener('click', () => {
                toggleFeature(featureSet, featureCode);
                updateFeatures(container.closest('.font-area'), container.closest('.font-area').querySelector('.font-input'));
            });
        });
    }

    function appendOpszVals(container, opszVals) {
        const dropdownTitle = container.querySelector('.opsz-title');
        const dropdownContent = container.querySelector('.dropdown-content');
        const fontArea = container.closest('.font-area');
        const slider = fontArea.querySelector('.opsz-option input');

        dropdownContent.innerHTML = '';

        Object.entries(opszVals).forEach(([opszName, opszValue]) => {
            const [isActive, displayName] = opszValue;
            const visibilityClass = isActive ? 'visible' : 'invisible';

            const opszOption = document.createElement('p');
            opszOption.setAttribute('id', opszName.replace(/\s+/g, '-').toLowerCase());
            opszOption.innerHTML = `<span class="check ${visibilityClass}">&#x2713; </span>${displayName}`;

            opszOption.addEventListener('click', () => {
                updateAllOpszElements(
                    fontArea,
                    opszName,
                    displayName,
                    OPSZ_VALUES[opszName.toLowerCase()]
                );
            });

            dropdownContent.appendChild(opszOption);
        });

        // Add slider event listener
        slider.addEventListener('input', () => {
            const value = parseInt(slider.value);
            const closestOpsz = findOpszName(value);
            updateAllOpszElements(
                fontArea,
                closestOpsz.name,
                closestOpsz.displayName,
                value
            );
        });

        dropdownTitle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownContent.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            dropdownContent.classList.add('hidden');
        });
    }

    function updateAllOpszElements(fontArea, opszName, displayName, value) {
        // 1. Update the title after Cake4Freaks
        const titleElement = fontArea.querySelector('.title');
        if (titleElement.classList.contains('c4f')) {
            titleElement.innerHTML = `Cake4Freaks &#x2195;&nbsp;</span>`;
        }

        // 2. Update dropdown title and checkmarks
        const dropdownTitle = fontArea.querySelector('.opsz-title');
        dropdownTitle.innerHTML = `${displayName} &#x2195;`;

        // Update active state in c4fOpszVals
        Object.keys(c4fOpszVals).forEach(key => {
            c4fOpszVals[key][0] = (key.toLowerCase() === opszName.toLowerCase());
        });

        // Update checkmarks visibility in dropdown
        const dropdownContent = fontArea.querySelector('.opsz-dropdown .dropdown-content');
        const checkmarks = dropdownContent.querySelectorAll('.check');
        checkmarks.forEach(check => {
            const optionName = check.parentElement.id.replace(/-/g, ' ');
            check.classList.toggle('visible', optionName === opszName.toLowerCase());
            check.classList.toggle('invisible', optionName !== opszName.toLowerCase());
        });

        // 3. Update slider value
        const slider = fontArea.querySelector('.opsz-option input');
        slider.value = value;

        // 4. Update font-variation-settings
        const textArea = fontArea.querySelector('.font-input');
        textArea.style.fontVariationSettings = `"opsz" ${value}`;
    }

    function findOpszName(value) {
        let name;

        if (value === 10) {
            name = 'text regular';
        } else if (value >= 11 && value <= 29) {
            name = 'custom';
        } else if (value === 30) {
            name = 'regular';
        } else if (value >= 31 && value <= 49) {
            name = 'custom';
        } else if (value === 50) {
            name = 'display regular';
        } else {
            name = 'unknown'; // Fallback for values outside the range
        }

        return {
            name,
            displayName: name.split(' ').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')
        };
    }

    function initOpszVals(fontAreas) {
        fontAreas.forEach((fontArea) => {
            const opszDropdown = fontArea.querySelector('.opsz-dropdown');
            const opszDropdownStatic = fontArea.querySelector('.opsz-dropdown-ben');
            const key = getFontKey(fontArea);
            const font = key ? FONTS[key] : null;

            if (!font) {
                console.error('Could not determine font for section', fontArea);
                return;
            }

            if (font.hasOpsz) {
                // Set initial values
                const activeOpsz = Object.entries(c4fOpszVals).find(([_, value]) => value[0])?.[0] || 'text regular';
                const value = OPSZ_VALUES[activeOpsz.toLowerCase()];
                const displayName = activeOpsz.split(' ').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');

                updateAllOpszElements(fontArea, activeOpsz, displayName, value);

                appendOpszVals(opszDropdown, c4fOpszVals);
                opszDropdown.classList.remove('hidden');
                opszDropdownStatic.classList.add('hidden');
            } else {
                // Fonts without a real optical-size axis just show a single
                // static style label (e.g. "Black", "Regular", "Condensed")
                // in the same UI slot — no slider, no dropdown listeners.
                const staticTitle = opszDropdownStatic.querySelector('.opsz-title');
                const staticEntry = opszDropdownStatic.querySelector('.dropdown-content p');
                if (staticTitle) staticTitle.innerHTML = `${font.staticLabel} &#x2195;`;
                if (staticEntry) staticEntry.innerHTML = `&#x2713; ${font.staticLabel}`;

                opszDropdown.classList.add('hidden');
                opszDropdownStatic.classList.remove('hidden');
            }
        });
    }

    function updateMode(event) {
        if (event.target.id === 'sun') {
            body.setAttribute('class', 'light-mode');
        } else if (event.target.id === 'moon') {
            body.setAttribute('class', 'dark-mode');
        }
    }

    function updateTextArea(fontArea, event) {
        const classList = event.target.classList;
        const elementId = event.target.id;
        const textArea = fontArea.querySelector('.font-input');

        // Match whichever font-switcher row (or title) was clicked, but
        // never treat the textarea's own classes as a click on a row — a
        // couple of fonts (e.g. Benmania) bake their key straight onto
        // their default textarea, and clicking/typing there shouldn't
        // re-trigger a font switch.
        const clickedFont = FONT_KEYS.find((key) => classList.contains(key) && !classList.contains('font-input'));
        if (clickedFont) {
            updateFont(fontArea, textArea, clickedFont);
        }

        if (elementId === 'font-size') {
            updateSize(textArea, event.target.value);
            let lineHeight = parseInt(fontArea.querySelector('.leading-option input').value);
            updateLeading(textArea, lineHeight, fontArea);
        }

        if (elementId === 'font-leading') {
            updateLeading(textArea, event.target.value, fontArea);
        }
        /*
        if (elementId === 'font-tracking') {
            updateTracking(textArea, event.target.value);
        }
        */
        if (elementId === 'font-opsz') {
            updateOpsz(textArea, event.target.value);
        }
        if (event.target.classList.contains('fas')) {
            updateAlignment(textArea, classList);
        }
        initFeatures(allFonts);
        updateFeatures(fontArea, textArea);
        autoResize(textArea);
    }

    function updateFont(fontArea, textArea, chosenFont) {
        const titleElement = fontArea.querySelector('.title');
        const font = FONTS[chosenFont];
        if (!titleElement || !font) {
            console.error('Unknown font or missing title element', fontArea, chosenFont);
            return;
        }

        // A manual font switch always falls back to that font's own sample
        // phrase, so drop any random Frankenstein snippet this box had been
        // tagged with (see createRandomFontArea / updatePlaceholder) — it
        // no longer applies once the font itself has changed underneath it.
        delete textArea.dataset.randomText;

        // Buy-link container is scoped to this section, whatever number it's
        // suffixed with (buy-link, buy-link-2, buy-link-3, ...), so
        // duplicating a section keeps working.
        const buyLinkContainer = fontArea.querySelector('[class*="buy-link"]');
        const opszDropdown = fontArea.querySelector('.opsz-dropdown');
        const opszDropdownStatic = fontArea.querySelector('.opsz-dropdown-ben');
        const opszOption = fontArea.querySelector('.opsz-option');
        const windowWidth = window.innerWidth;

        // 1. Title text + class — this drives every ".title.KEY" and
        // ".KEY.font-input" rule in style.css.
        titleElement.innerHTML = `${font.displayName} &#x2195;`;
        FONT_KEYS.forEach((key) => titleElement.classList.remove(key));
        titleElement.classList.add(chosenFont);

        // 2. Checkmark in the font-switcher dropdown
        updateTitleChecks(fontArea, chosenFont);

        // 3. Optical-size UI: only Cake4Freaks has a real opsz axis wired
        // up; every other font shows a single static style label instead.
        if (font.hasOpsz) {
            opszDropdown.classList.remove('hidden');
            opszDropdownStatic.classList.add('hidden');
            opszOption.style.opacity = '1';
            opszOption.classList.remove('hidden');
            opszOption.style.display = 'flex';
            opszOption.style.visibility = 'visible';

            const activeOpsz = Object.entries(c4fOpszVals).find(([_, value]) => value[0])?.[0] || 'text regular';
            const value = OPSZ_VALUES[activeOpsz.toLowerCase()];
            const displayName = activeOpsz.split(' ').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');

            updateAllOpszElements(fontArea, activeOpsz, displayName, value);
            appendOpszVals(opszDropdown, c4fOpszVals);
        } else {
            opszDropdown.classList.add('hidden');
            opszDropdownStatic.classList.remove('hidden');
            opszOption.style.opacity = '0';
            opszOption.classList.add('hidden');
            opszOption.style.display = 'none';

            const staticTitle = opszDropdownStatic.querySelector('.opsz-title');
            const staticEntry = opszDropdownStatic.querySelector('.dropdown-content p');
            if (staticTitle) staticTitle.innerHTML = `${font.staticLabel} &#x2195;`;
            if (staticEntry) staticEntry.innerHTML = `&#x2713; ${font.staticLabel}`;
        }

        // 4. Family + sample text
        textArea.style.fontFamily = font.family;
        if (windowWidth >= 768) {
            textArea.innerText = font.defaultText;
        }

        // 5. Buy link — hidden entirely for fonts without a storefront page
        if (buyLinkContainer) {
            if (font.buyLink) {
                buyLinkContainer.style.display = '';
                const link = buyLinkContainer.querySelector('a');
                link.href = font.buyLink.url;
                link.innerHTML = font.buyLink.label;
            } else {
                buyLinkContainer.style.display = 'none';
            }
        }
    }

    function updateSize(textArea, fontSize) {
        textArea.style.fontSize = `${fontSize}px`;
        const fontArea = textArea.closest('.font-area');
        const optionsContainer = fontArea ? fontArea.querySelector('.options') : null;
        if (!optionsContainer) {
            console.error("No '.options' sibling found.");
        } else {
            const opszSlider = optionsContainer.querySelector('.opsz-option .slider');
            if (!opszSlider) {
                console.error("No '.slider' found inside '.opsz-option'.");
            } else {
                textArea.style.fontVariationSettings = `"opsz" ${opszSlider.value}`;
            }
        }
    }

    function updateLeading(textArea, leadingVal, fontArea) {
        let lineHeight = parseInt(fontArea.querySelector('.size-option input').value) * 1.2 + parseInt(leadingVal) + 'px';
        textArea.style.lineHeight = lineHeight;
    }
    /*
    function updateTracking(textArea, trackingVal) {
        textArea.style.letterSpacing = `${trackingVal}px`;
    }
    */
    function updateOpsz(textArea, value) {
        textArea.style.fontVariationSettings = `"opsz" ${value}`;
    }
    function updateAlignment(textArea, classList) {
        if (classList.contains('right')) {
            textArea.style.textAlign = 'right';
        } else if (classList.contains('center')) {
            textArea.style.textAlign = 'center';
        } else if (classList.contains('left')) {
            textArea.style.textAlign = 'left';
        }
    }

    function toggleFeature(features, fontCode) {
        if (fontCode === 'none') {
            Object.keys(features).forEach(featureName => {
                features[featureName][0] = featureName === 'none';
            });
        } else {
            Object.entries(features).forEach(([featureName, featureValue]) => {
                if (fontCode === featureValue[1]) {
                    features[featureName][0] = !featureValue[0];
                    features['none'][0] = false; // Ensure 'none' is cleared wben any other feature is activated
                }
            });

            // Handle mutually exclusive features
            if (features['lining figures'] && features['oldstyle figures']) {
                if (fontCode === 'lnum' && features['oldstyle figures'][0]) {
                    features['oldstyle figures'][0] = false;
                } else if (fontCode === 'onum' && features['lining figures'][0]) {
                    features['lining figures'][0] = false;
                }
            }
        }
    }

    function updateFeatures(fontArea, textArea) {
        const key = getFontKey(fontArea);
        const font = key ? FONTS[key] : null;

        if (!font) {
            console.error('Could not determine font for section', fontArea);
            return;
        }

        const activeFeatures = [];
        let allCapsActive = false;
        Object.entries(font.features).forEach(([featureName, featureValue]) => {
            const [isActive, featureCode] = featureValue;
            // "All Caps" is a text-transform toggle, not a real OpenType
            // feature — pull it out here instead of feeding it into
            // fontFeatureSettings below.
            if (featureCode === 'allcaps') {
                allCapsActive = isActive;
                return;
            }
            if (isActive) {
                activeFeatures.push(featureCode);
            }
        });

        textArea.style.fontFeatureSettings = activeFeatures.map(feature => `'${feature}'`).join(', ');
        textArea.style.textTransform = allCapsActive ? 'uppercase' : '';
        updateCheckMarks(font.features, fontArea);
    }

    function updateCheckMarks(featureSet, fontArea) {
        Object.entries(featureSet).forEach(([featureName, featureValue]) => {
            const [isActive, featureCode] = featureValue;
            const featureElement = fontArea.querySelector(`.feature[data-feature-code="${featureCode}"] .check`);

            if (featureElement) {
                featureElement.classList.toggle('visible', isActive);
                featureElement.classList.toggle('invisible', !isActive);
            }
        });
    }

    window.addEventListener('resize', updatePlaceholder);
    window.addEventListener('resize', autoResize);
    window.addEventListener('load', updatePlaceholder);
    window.addEventListener('load', autoResize);
});

function updatePlaceholder() {
    // Runs for every .font-input textarea on the page, however many there are.
    const textareas = document.querySelectorAll('.font-input');
    const windowWidth = window.innerWidth;
    textareas.forEach((textarea) => {
        if (windowWidth < 768) {
            textarea.innerText = "Abc...";
            return;
        }

        // A box created via "+ Add Text Area" is tagged with the random
        // Frankenstein snippet it was given, so a resize restores that
        // instead of quietly swapping it out for the font's plain sample
        // phrase — that swap-back only happens for boxes without a tag
        // (the two original sections, or any box whose font was since
        // switched manually via the dropdown, which clears the tag).
        if (textarea.dataset.randomText) {
            textarea.innerText = textarea.dataset.randomText;
            return;
        }

        // Determine the section's current font from its title element's
        // class (kept accurate by updateFont/getFontKey) rather than the
        // inline fontFamily style, which stays unset until the user
        // manually switches fonts.
        const fontArea = textarea.closest('.font-area');
        const key = fontArea ? getFontKey(fontArea) : null;
        const font = key ? FONTS[key] : null;

        if (font) {
            textarea.innerText = font.defaultText;
        }
    });
}

function autoResize() {
    // Runs for every .font-input textarea on the page, however many there are.
    const windowWidth = window.innerWidth;
    const textareas = document.querySelectorAll('.font-input');
    textareas.forEach((textarea) => {
        if (windowWidth < 768) {
            textarea.style.height = '152px';
            textarea.style.height = textarea.scrollHeight + 'px';
        } else {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight + 2) + 'px';
        }
    });
}
