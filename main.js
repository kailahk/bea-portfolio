document.addEventListener('DOMContentLoaded', () => {
    const c4fFeatures = {
        'none': [false, 'none'],
        'lining figures': [false, 'lnum'],
        'oldstyle figures': [false, 'onum'],
        'case sensitive': [false, 'case'],
        'short ascenders': [false, 'ss01'],
        'ligatures': [true, 'liga']
    };
    const henFeatures = {
        'none': [false, 'none'],
        'contextual alternate': [false, 'calt'],
        'ligatures': [true, 'liga']
    };

    let activeFeaturesC4f = [];
    let activeFeaturesHen = [];
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

    // Helper Functions

    function initFeatures(allFonts) {
        allFonts.forEach((fontSection) => {
            const features = fontSection.querySelector('.features-dropdown');
            const titleElement = fontSection.querySelector('.title');
            if (!titleElement) {
                console.error('Title element not found in fontSection', fontSection);
                return;
            }
            currFont = titleElement.classList.contains('hen') ? 'hen' : 'c4f';
            features.innerHTML = '';
            if (currFont === 'c4f') {
                appendFeatures(features, c4fFeatures);
                features.classList.add('c4f');
                features.classList.remove('hen');
            } else if (currFont === 'hen') {
                appendFeatures(features, henFeatures);
                features.classList.add('hen');
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
        if (classList.contains('hen') && !classList.contains('font-input')) {
            currFont = 'hen';
            updateFont(fontArea, textArea, 'hen');
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
        if (!titleElement) {
            console.error('Title element not found in updateFont', fontArea);
            return;
        }
        const windowWidth = window.innerWidth;
        if (chosenFont === 'hen') {
            titleElement.innerHTML = 'Henmania &#x2195;';
            textArea.style.fontFamily = 'Henmania-Black';
            titleElement.classList.add('hen');
            titleElement.classList.remove('c4f');
            if (windowWidth >= 768) {
                textArea.innerText = "And the Rock Cried Out, No Hiding Place";
            }
            if (fontArea.classList.contains('font-area-1')) {
                let link = buyLink.querySelector('a');
                link.href = 'https://www.futurefonts.xyz/bea-korsh/henmania';
                link.innerHTML = 'Buy/$15 ↗';
            }
            if (fontArea.classList.contains('font-area-2')) {
                let link2 = buyLink2.querySelector('a');
                link2.href = 'https://www.futurefonts.xyz/bea-korsh/henmania';
                link2.innerHTML = 'Buy/$15 ↗';
            }
        } else if (chosenFont === 'c4f') {
            updateOpsz(textArea, `opsz ${fontArea.querySelector('.opsz-option')}`);
            titleElement.innerHTML = 'Cake4Freaks &#x2195;';
            titleElement.style.marginBottom = '2px';
            titleElement.style.paddingBottom = '5px';
            textArea.style.fontFamily = 'Cake4Freaks-Optical';
            titleElement.classList.add('c4f');
            titleElement.classList.remove('hen');
            if (windowWidth >= 768) {
                textArea.innerText = "Ceremonies of Light and Dark";
            }
            if (fontArea.classList.contains('font-area-1')) {
                let link = buyLink.querySelector('a');
                link.href = 'https://www.futurefonts.xyz/bea-korsh/cake4freaks?v=0.1';
                link.innerHTML = 'Buy/$10 ↗';
            }
            if (fontArea.classList.contains('font-area-2')) {
                let link2 = buyLink2.querySelector('a');
                link2.href = 'https://www.futurefonts.xyz/bea-korsh/cake4freaks?v=0.1';
                link2.innerHTML = 'Buy/$10 ↗';
            }
        }
    }

    function updateSize(textArea, fontSize) {
        textArea.style.fontSize = `${fontSize}px`;
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
    function updateOpsz(textArea, opszVal) {
        textArea.style.fontVariationSettings = `"opsz" ${opszVal}`;
        console.log(textArea, textArea.style.fontVariationSettings);
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
                    features['none'][0] = false; // Ensure 'none' is cleared when any other feature is activated
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
        } else if (titleElement.classList.contains('hen')) {
            featureSet = henFeatures;
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
        console.log(textArea.style.fontFeatureSettings);
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
        if (textarea2.style.fontFamily === 'Henmania-Black') {
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
        textarea1.style.height = '204px';
        textarea2.style.height = '204px';
        textarea1.style.height = textarea1.scrollHeight + 'px';
        textarea2.style.height = textarea2.scrollHeight + 'px';
    }
}