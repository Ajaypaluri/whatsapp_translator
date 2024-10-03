// Function to fetch languages from the LibreTranslate API
async function fetchLanguages() {
    try {
        const response = await fetch('https://libretranslate.com/languages');
        const languages = await response.json();

        // Get the dropdown elements
        const inputDropdown = document.getElementById('input-lang');
        const outputDropdown = document.getElementById('output-lang');

        // Populate input and output dropdowns with languages
        languages.forEach(language => {
            const inputOption = document.createElement('option');
            inputOption.value = language.code;
            inputOption.textContent = language.name;
            inputDropdown.appendChild(inputOption);

            const outputOption = document.createElement('option');
            outputOption.value = language.code;
            outputOption.textContent = language.name;
            outputDropdown.appendChild(outputOption);
        });
    } catch (error) {
        console.error('Error fetching languages:', error);
        alert('Failed to load languages. Please try again later.');
    }
}

// Call fetchLanguages when popup is loaded
document.addEventListener('DOMContentLoaded', fetchLanguages);

// When the user clicks "Save", store the selected languages in Chrome's local storage
document.getElementById('save').addEventListener('click', () => {
    const inputLang = document.getElementById('input-lang').value;
    const outputLang = document.getElementById('output-lang').value;

    chrome.storage.sync.set({ inputLang, outputLang }, () => {
        alert('Language settings saved!');
    });
});
