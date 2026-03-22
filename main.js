document.addEventListener('DOMContentLoaded', () => {
    const c4fFeatures = {
        'None': [false, 'none'],
        'Lining Figures': [false, 'lnum'],
        'Oldstyle Figures': [false, 'onum'],
        'Case Sensitive': [false, 'case'],
        'Short Ascenders': [false, 'ss01'],
        'Ligatures': [true, 'liga']
    };
    const benFeatures = {
        'None': [false, 'none'],
        'Localized Forms': [false, 'locl'],
        'Superscript': [false, 'sups'],
        'Fractions': [false, 'frac'],
        'Ordinals': [false, 'ordn'],
        'Ligatures': [true, 'liga'],
        'Contextual Alternates': [true, 'calt'],
        'SS01 (Alternate “u”)': [false, 'ss01']
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

    let currFont = '';

    // DOM Elements
    let body = document.getElementsByTagName('body')[0];
    const sun = document.getElementById('sun');
    const moon = document.getElementById('moon');
    const fontArea1 = document.querySelector('.font-area-1');
    const fontArea2 = document.querySelector('.font-area-2');
    const allFonts = [...document.querySelectorAll('.all-fonts section.font-area')];
    const buyLink = document.querySelector('.buy-link');
    const buyLink2 = document.querySelector('.buy-link-2');

    // Event Listeners
    sun.addEventListener('click', updateMode);
    moon.addEventListener('click', updateMode);
    fontArea1.addEventListener('click', (event) => updateTextArea(fontArea1, event));
    fontArea2.addEventListener('click', (event) => updateTextArea(fontArea2, event));
    fontArea1.addEventListener('input', (event) => updateTextArea(fontArea1, event));
    fontArea2.addEventListener('input', (event) => updateTextArea(fontArea2, event));
    fontArea1.addEventListener('touchstart', (event) => updateTextArea(fontArea1, event));
    fontArea2.addEventListener('touchstart', (event) => updateTextArea(fontArea2, event));

    // Initialize features on load
    initFeatures(allFonts);
    initOpszVals(allFonts);

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
        if (!titleElement) {
            console.error('Title element not found in updateFont', fontArea);
            return;
        }
        const windowWidth = window.innerWidth;
        if (chosenFont === 'ben') {
            let opszDropdown = fontArea.querySelector('.opsz-dropdown');
            let opszDropdownben = fontArea.querySelector('.opsz-dropdown-ben');
            console.log('test:', benCheckbox, c4fCheckbox);
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
                fontArea.querySelector('.opsz-option').style.visibility = 'hidden'
                fontArea.querySelector('.opsz-option').style.display = 'flex'
            } else {
                fontArea.querySelector('.opsz-option').classList.add('hidden')
                fontArea.querySelector('.opsz-option').style.display = 'none'
            }
            if (fontArea.classList.contains('font-area-1')) {
                let link = buyLink.querySelector('a');
                link.href = 'https://www.futurefonts.com/bea-korsh/benmania';
                link.innerHTML = 'Buy/$20 ↗';
            }
            if (fontArea.classList.contains('font-area-2')) {
                let link2 = buyLink2.querySelector('a');
                link2.href = 'https://www.futurefonts.com/bea-korsh/benmania';
                link2.innerHTML = 'Buy/$20 ↗';
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
            if (fontArea.classList.contains('font-area-1')) {
                let link = buyLink.querySelector('a');
                link.href = 'https://www.futurefonts.com/bea-korsh/cake4freaks';
                link.innerHTML = 'Buy/$15 ↗';
            }
            if (fontArea.classList.contains('font-area-2')) {
                let link2 = buyLink2.querySelector('a');
                link2.href = 'https://www.futurefonts.com/bea-korsh/cake4freaks';
                link2.innerHTML = 'Buy/$15 ↗';
            }

            // Reinitialize the optical size dropdown
            appendOpszVals(opszDropdown, c4fOpszVals);
        }
    }

    function updateSize(textArea, fontSize) {
        textArea.style.fontSize = `${fontSize}px`;
        const optionsContainer = textArea.parentElement.querySelector('.options');
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
    const textarea1 = document.getElementById('first-input');
    const textarea2 = document.getElementById('second-input');
    const windowWidth = window.innerWidth;
    if (windowWidth < 768) {
        textarea1.innerText = "Abc...";
        textarea2.innerText = "Abc...";
    } else if (windowWidth >= 768) {
        if (textarea1.style.fontFamily === 'Cake4Freaks-Optical') {
            textarea1.innerText = "Ceremonies of Light and Dark";
        } else {
            textarea1.innerText = "And the Rock Cried Out, No Hiding Place";
        }
        if (textarea2.style.fontFamily === 'Benmania-Black') {
            textarea2.innerText = "And the Rock Cried Out, No Hiding Place";
        } else {
            textarea2.innerText = "Ceremonies of Light and Dark";
        }
    }
}

function autoResize(textArea) {
    const windowWidth = window.innerWidth;
    const textarea1 = document.getElementById('first-input');
    const textarea2 = document.getElementById('second-input');
    if (windowWidth < 768) {
        textarea1.style.height = '152px';
        textarea2.style.height = '152px';
        textarea1.style.height = textarea1.scrollHeight + 'px';
        textarea2.style.height = textarea2.scrollHeight + 'px';
    } else if (windowWidth >= 768) {
        textarea1.style.height = 'auto';;
        textarea2.style.height = 'auto';
        textarea1.style.height = (textarea1.scrollHeight + 2) + 'px';
        textarea2.style.height = (textarea2.scrollHeight + 2) + 'px';
    }
}