document.addEventListener('DOMContentLoaded', () => {

    const c4fFeatures = {
        'normal': [true, 'none'],
        'lining figures': [false, 'lnum'],
        'oldstyle figures': [false, 'onum'],
        'case sensitive': [false, 'case'],
        'short ascenders': [false, 'ss01']
    };
    const henFeatures = {
        'normal': [true, 'none'],
        'contextual alternate': [false, 'calt'],
        'ligatures': [false, 'liga']
    };

    let activeFeaturesC4f = [];
    let activeFeaturesHen = [];

    // DOM Elements
    let body = document.getElementsByTagName('body')[0];
    const sun = document.getElementById('sun');
    const moon = document.getElementById('moon');
    const fontArea1 = document.querySelector('.font-area-1');
    const fontArea2 = document.querySelector('.font-area-2');
    const allFonts = [...document.querySelectorAll('.all-fonts section.font-area')];
    // Event Listeners
    sun.addEventListener('click', updateMode);
    moon.addEventListener('click', updateMode);
    fontArea1.addEventListener('click', (event) => updateTextArea(fontArea1, event));
    fontArea2.addEventListener('click', (event) => updateTextArea(fontArea2, event));

    // Helper Functions

    // initialize features
    function initFeatures(allFonts) {
        allFonts.forEach((fontSection) => {
            const features = fontSection.querySelector('.features-dropdown');
            const currFont = fontSection.querySelector('.title .wip').classList[1];
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
        });
    }
    

    // switch between light and dark mode
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
            console.log(classList);
            updateFont(fontArea, textArea, 'hen');
            initFeatures(allFonts);
        } else if (classList.contains('c4f')) {
            console.log(classList);
            updateFont(fontArea, textArea, 'c4f');
            initFeatures(allFonts);
        }

        if (elementId === 'font-size') {
            updateSize(textArea, event.target.value);
        }

        if (elementId === 'font-leading') {
            updateLeading(textArea, event.target.value);
        }

        if (event.target.classList.contains('fas')) {
            updateAlignment(textArea, classList);
        }

        if (event.target.classList.contains('feature')) {
            updateFeatures(fontArea, textArea, classList);
        }
        autoResize(textArea);
    }

    // update textArea
    function updateFont(fontArea, textArea, chosenFont) {
        const titleElement = fontArea.querySelector('.title');
        if (chosenFont === 'hen') {
            console.log(chosenFont)
            titleElement.innerHTML = 'Henmania <span class="wip hen">(wip) </span>&#x2195;';
            textArea.style.fontFamily = 'Henmania-Black';
        } else if (chosenFont === 'c4f') {
            console.log(chosenFont)
            titleElement.innerHTML = 'Cake4Freaks <span class="wip c4f">(wip) </span>&#x2195;';
            textArea.style.fontFamily = 'Cake4Freaks-Regular';
        }
    }
    function updateSize(textArea, fontSize) {
        textArea.style.fontSize = `${fontSize}px`;
    }
    function updateLeading(textArea, leadingVal) {
        textArea.style.letterSpacing = `${leadingVal}px`;
    }
    function updateAlignment(textArea, classList) {
        if (classList[2] === 'right') {
            textArea.style.textAlign = 'right';
        } else if (classList.contains('center')) {
            textArea.style.textAlign = 'center';
        } else if (classList.contains('left')) {
            textArea.style.textAlign = 'left';
        }
    }

    function toggleFeature(features, activeFeatures, fontCode) {
        // Check if 'normal' (i.e., 'none') is clicked
        if (fontCode === 'none') {
            // Set 'normal' to true and all other features to false
            Object.keys(features).forEach(featureName => {
                if (features[featureName][1] === 'none') {
                    features['normal'][0] = true;
                } else {
                    features[featureName][0] = false; // Set all other features to false
                }
            });
    
            // Clear the activeFeatures and set only 'none'
            activeFeatures = ['none'];
        } else {
            // Toggle the specific feature based on the font code
            Object.entries(features).forEach(([featureName, featureValue]) => {
                if (fontCode === featureValue[1] && !featureValue[0]) {
                    features[featureName][0] = true;
                    features['normal'][0] = false;
                } else if (fontCode === featureValue[1] && featureValue[0]) {
                    features[featureName][0] = false;
                }
            });
    
            // Manage the active features
            let hasOtherActiveFeatures = false;
    
            for (const [key, [isActive, featureCode]] of Object.entries(features)) {
                const featureString = `${featureCode}`;
    
                if (isActive && featureString !== 'none' && !activeFeatures.includes(featureString)) {
                    activeFeatures.push(featureString);
                } else if (!isActive && activeFeatures.includes(featureString)) {
                    activeFeatures = activeFeatures.filter(item => item !== featureString);
                }
    
                if (isActive && featureString !== 'none') {
                    hasOtherActiveFeatures = true;
                }
            }
    
            // Handle 'none' visibility: Remove 'none' if any other feature is active
            if (hasOtherActiveFeatures) {
                activeFeatures = activeFeatures.filter(item => item !== 'none'); // Remove 'none' if any other feature is active
            } else if (!activeFeatures.includes('none')) {
                activeFeatures.push('none');  // Add 'none' if no other feature is active
                features['normal'][0] = true;
            }
        }
        console.log(activeFeatures)
        return activeFeatures;
    }
    
    function updateFeatures(fontArea, textArea, classList) {
        const titleElement = fontArea.querySelector('.title .wip');
        const fontCode = [...classList][1];
    
        let featureSet;
        if (titleElement.classList.contains('c4f')) {
            activeFeaturesC4f = toggleFeature(c4fFeatures, activeFeaturesC4f, fontCode);
            featureSet = c4fFeatures;
        } else if (titleElement.classList.contains('hen')) {
            activeFeaturesHen = toggleFeature(henFeatures, activeFeaturesHen, fontCode);
            featureSet = henFeatures;
        }
    
        // Update the font feature settings
        const activeFeatures = titleElement.classList.contains('c4f') ? activeFeaturesC4f : activeFeaturesHen;
        textArea.style.fontFeatureSettings = activeFeatures.map(feature => `'${feature}'`).join(', ');
    
        // Update the visibility of check marks dynamically
        updateCheckMarks(featureSet, fontArea);
    }

    function updateCheckMarks(featureSet, fontArea) {
        Object.entries(featureSet).forEach(([featureName, featureValue]) => {
            const [isActive, featureCode] = featureValue;
    
            // Find the feature element by its data attribute
            const featureElement = fontArea.querySelector(`.feature[data-feature-code="${featureCode}"] .check`);
    
            // Update the visibility class based on whether the feature is active
            if (featureElement) {  // Ensure featureElement exists before trying to update it
                if (isActive) {
                    featureElement.classList.remove('invisible');
                    featureElement.classList.add('visible');
                } else {
                    featureElement.classList.remove('visible');
                    featureElement.classList.add('invisible');
                }
            }
        });
    }

    initFeatures(allFonts);
});

function autoResize(textarea) {
    textarea.style.height = '204.5px'; // Reset the height
    textarea.style.height = textarea.scrollHeight + 'px'; // Adjust based on content
}

function updatePlaceholder() {
    const textarea1 = document.getElementById('first-input');
    const textarea2 = document.getElementById('second-input');
    const windowWidth = window.innerWidth;
    if (windowWidth < 768) {
      textarea1.innerText = "Abc...";
      textarea2.innerText = "Abc...";
    } else if (windowWidth >= 768) {
      textarea1.innerText = "Alpha Quadrant";
      textarea2.innerText = "Alpha Quadrant";
    }
  }

  // Call the function on window resize
  window.addEventListener('resize', updatePlaceholder);

  // Call the function on initial load
  window.addEventListener('load', updatePlaceholder);