document.addEventListener('DOMContentLoaded', () => {
    const c4fFeatures = {
        'none': [false, 'none'],
        'lining figures': [false, 'lnum'],
        'oldstyle figures': [false, 'onum'],
        'case sensitive': [false, 'case'],
        'short ascenders': [false, 'ss01'],
        'ligatures': [true, 'liga']
    };
    const benFeatures = {
        'none': [false, 'none'],
        'localized forms': [false, 'locl'],
        'superscript': [false, 'sups'],
        'fractions': [false, 'frac'],
        'ordinals': [false, 'ordn'],
        'ligatures': [true, 'liga'],
        'contextual alternates': [true, 'calt'],
        'SS01 (alternate "u")': [false, 'ss01']
    };

    const c4fOpszVals = {
        'text regular': [true, 'text regular'],
        'regular': [false, 'regular'],
        'display regular': [false, 'display regular']
    }
    const benOpszVals = {
        'black': [true, 'black']
    }

    const OPSZ_VALUES = {
        'text regular': 10,
        'regular': 30,
        'display regular': 50
    };

    // Tunable ranges for "+ Add Text Area" — adjust these to change how wild
    // or subtle the randomly-generated boxes feel. Nothing else in the file
    // needs to change when these values are edited.
    const RANDOM_BOUNDS = {
        c4f: {
            size: { min: 40, max: 140 },
            leading: { min: -20, max: 30 },
            opsz: ['text regular', 'regular', 'display regular'],
            alignment: ['left', 'center', 'right']
        },
        ben: {
            size: { min: 40, max: 140 },
            leading: { min: -20, max: 30 },
            alignment: ['left', 'center', 'right']
        }
    };

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function pickRandom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    let currFont = '';
    let dynamicFontAreaCount = 0;
    // Alternates typeface on each new box; the last static section (font-area-3)
    // starts as Cake4Freaks, so the first dynamically-added box is Benmania.
    let nextRandomFont = 'ben';

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

    // Initialize features on load
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

        // Strip any Copy HTML button copied over from the template —
        // wireFontArea() will attach a fresh one for this section below.
        const copiedCopyBtn = clone.querySelector('.copy-font-area');
        if (copiedCopyBtn) copiedCopyBtn.remove();

        // Remove control so dynamically-added boxes can be cleared out again.
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

        container.appendChild(clone);
        allFonts.push(clone);
        wireFontArea(clone);
        initFeatures([clone]);
        initOpszVals([clone]);

        // Alternate typeface from whichever was used last time.
        const chosenFont = nextRandomFont;
        nextRandomFont = nextRandomFont === 'c4f' ? 'ben' : 'c4f';
        updateFont(clone, textArea, chosenFont);

        // Randomize size, leading, (opsz for c4f), and alignment within
        // the configured bounds, and keep the sliders in sync with them.
        const bounds = RANDOM_BOUNDS[chosenFont];
        const size = randomInt(bounds.size.min, bounds.size.max);
        const leading = randomInt(bounds.leading.min, bounds.leading.max);

        const sizeSlider = clone.querySelector('.size-option input');
        const leadingSlider = clone.querySelector('.leading-option input');
        sizeSlider.value = size;
        leadingSlider.value = leading;

        if (chosenFont === 'c4f') {
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
        }

        updateFeatures(clone, textArea);
        autoResize(textArea);

        dynamicFontAreaCount++;
    }

    // Helper Functions

    function initFeatures(allFonts) {
        allFonts.forEach((fontSection) => {
            const features = fontSection.querySelector('.features-dropdown');
            const titleElement = fontSection.querySelector('.title');
            if (!titleElement) {
                console.error('Title element not found in fontSection', fontSection);
                return;
            }
            currFont = titleElement.classList.contains('ben') ? 'ben' : 'c4f';
            features.innerHTML = '';
            if (currFont === 'c4f') {
                appendFeatures(features, c4fFeatures);
                features.classList.add('c4f');
                features.classList.remove('ben');
            } else if (currFont === 'ben') {
                appendFeatures(features, benFeatures);
                features.classList.add('ben');
                features.classList.remove('c4f');
            }
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
    function initOpszVals(allFonts) {
        allFonts.forEach((fontSection) => {
            const opszVals = fontSection.querySelector('.opsz-dropdown');
            const opszValsben = fontSection.querySelector('.opsz-dropdown-ben');
            const titleElement = fontSection.querySelector('.title');

            if (!titleElement) {
                console.error('Title element not found in fontSection', fontSection);
                return;
            }

            currFont = titleElement.classList.contains('ben') ? 'ben' : 'c4f';
            if (currFont === 'c4f') {
                // Set initial values
                const activeOpsz = Object.entries(c4fOpszVals).find(([_, value]) => value[0])?.[0] || 'text regular';
                const value = OPSZ_VALUES[activeOpsz.toLowerCase()];
                const displayName = activeOpsz.split(' ').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');

                updateAllOpszElements(
                    fontSection,
                    activeOpsz,
                    displayName,
                    value
                );

                appendOpszVals(opszVals, c4fOpszVals);
                opszVals.classList.remove('hidden');
                opszValsben.classList.add('hidden');
            } else if (currFont === 'ben') {
                opszVals.classList.add('hidden');
                opszValsben.classList.remove('hidden');
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
        if (classList.contains('ben') && !classList.contains('font-input')) {
            currFont = 'ben';
            updateFont(fontArea, textArea, 'ben');
        } else if (classList.contains('c4f')) {
            currFont = 'c4f';
            updateFont(fontArea, textArea, 'c4f');
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
        let benCheckbox = fontArea.querySelector('p.ben span');
        let c4fCheckbox = fontArea.querySelector('p.c4f span');
        // Buy-link container is scoped to this section, whatever number it's suffixed with
        // (buy-link, buy-link-2, buy-link-3, ...), so duplicating a section keeps working.
        const buyLinkContainer = fontArea.querySelector('[class*="buy-link"]');
        if (!titleElement) {
            console.error('Title element not found in updateFont', fontArea);
            return;
        }
        const windowWidth = window.innerWidth;
        if (chosenFont === 'ben') {
            let opszDropdown = fontArea.querySelector('.opsz-dropdown');
            let opszDropdownben = fontArea.querySelector('.opsz-dropdown-ben');
            benCheckbox.classList.add('show-title-check');
            benCheckbox.classList.remove('hide-title-check');
            c4fCheckbox.classList.remove('show-title-check');
            c4fCheckbox.classList.add('hide-title-check');
            opszDropdown.classList.add('hidden');
            opszDropdownben.classList.remove('hidden');
            fontArea.querySelector('.opsz-option').style.opacity = '0';
            titleElement.innerHTML = 'Benmania &#x2195;&nbsp;';
            textArea.style.fontFamily = 'Benmania-Black';
            titleElement.classList.add('ben');
            titleElement.classList.remove('c4f');
            if (windowWidth >= 768) {
                textArea.innerText = "And the Rock Cried Out, No Hiding Place";
            }
            fontArea.querySelector('.opsz-option').classList.add('hidden')
            fontArea.querySelector('.opsz-option').style.display = 'none'
            if (buyLinkContainer) {
                let link = buyLinkContainer.querySelector('a');
                link.href = 'https://www.futurefonts.com/bea-korsh/benmania';
                link.innerHTML = 'Buy/$20 ↗';
            }
            appendOpszVals(opszDropdown, benOpszVals);
        } else if (chosenFont === 'c4f') {
            let opszDropdown = fontArea.querySelector('.opsz-dropdown');
            let opszDropdownben = fontArea.querySelector('.opsz-dropdown-ben');
            opszDropdown.classList.remove('hidden');
            opszDropdownben.classList.add('hidden');
            benCheckbox.classList.add('hide-title-check');
            benCheckbox.classList.remove('show-title-check');
            c4fCheckbox.classList.remove('hide-title-check');
            c4fCheckbox.classList.add('show-title-check');
            fontArea.querySelector('.opsz-option').style.opacity = '1';
            titleElement.innerHTML = 'Cake4Freaks &#x2195;&nbsp;';
            if (windowWidth < 768) {
                fontArea.querySelector('.opsz-option').classList.remove('hidden')
                fontArea.querySelector('.opsz-option').style.display = 'flex'
                fontArea.querySelector('.opsz-option').style.visibility = 'visible'
            } else {
                fontArea.querySelector('.opsz-option').classList.remove('hidden')
                fontArea.querySelector('.opsz-option').style.display = 'flex'
                fontArea.querySelector('.opsz-option').style.visibility = 'visible'
            }
            // Initialize with default optical size
            const activeOpsz = Object.entries(c4fOpszVals).find(([_, value]) => value[0])?.[0] || 'text regular';
            const value = OPSZ_VALUES[activeOpsz.toLowerCase()];
            const displayName = activeOpsz.split(' ').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');

            // Update all optical size elements
            updateAllOpszElements(
                fontArea,
                activeOpsz,
                displayName,
                value
            );

            textArea.style.fontFamily = 'Cake4Freaks-Optical';
            titleElement.classList.add('c4f');
            titleElement.classList.remove('ben');
            if (windowWidth >= 768) {
                textArea.innerText = "Ceremonies of Light and Dark";
            }
            if (buyLinkContainer) {
                let link = buyLinkContainer.querySelector('a');
                link.href = 'https://www.futurefonts.com/bea-korsh/cake4freaks';
                link.innerHTML = 'Buy/$15 ↗';
            }

            // Reinitialize the optical size dropdown
            appendOpszVals(opszDropdown, c4fOpszVals);
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
        const titleElement = fontArea.querySelector('.title');
        if (!titleElement) {
            console.error('Title element not found in updateFeatures', fontArea);
            return;
        }

        let activeFeatures = [];
        let featureSet;

        if (titleElement.classList.contains('c4f')) {
            featureSet = c4fFeatures;
        } else if (titleElement.classList.contains('ben')) {
            featureSet = benFeatures;
        }

        if (!featureSet) {
            console.error('Feature set not found');
            return;
        }

        Object.entries(featureSet).forEach(([featureName, featureValue]) => {
            if (featureValue[0]) {
                activeFeatures.push(featureValue[1]);
            }
        });

        textArea.style.fontFeatureSettings = activeFeatures.map(feature => `'${feature}'`).join(', ');
        updateCheckMarks(featureSet, fontArea);
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

        // Determine the section's current font from its title element's class
        // ('c4f' or 'ben'), which is always kept accurate — rather than the
        // inline fontFamily style, which stays unset until the user manually
        // switches fonts and would otherwise wrongly default every section
        // to the Benmania phrase on load/resize.
        const fontArea = textarea.closest('.font-area');
        const titleElement = fontArea ? fontArea.querySelector('.title') : null;
        const isCake4Freaks = titleElement
            ? titleElement.classList.contains('c4f')
            : textarea.style.fontFamily === 'Cake4Freaks-Optical';

        textarea.innerText = isCake4Freaks
            ? "Ceremonies of Light and Dark"
            : "And the Rock Cried Out, No Hiding Place";
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
