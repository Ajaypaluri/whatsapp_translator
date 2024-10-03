// Function to translate text using the LibreTranslate API
async function translateMessage(text, inputLang, outputLang) {
    try {
        const response = await fetch('https://libretranslate.com/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: inputLang,
                target: outputLang,
                format: 'text',
            }),
        });

        if (!response.ok) throw new Error('Translation API error');
        
        const result = await response.json();
        return result.translatedText;
    } catch (error) {
        console.error('Error translating message:', error);
        return text; // Return original text if there's an error
    }
}

// Function to create the "Translate All" button in the chat header
const createTranslateAllButton = () => {
    const observer = new MutationObserver(() => {
        console.log('MutationObserver triggered'); // Debugging message
        const chatHeader = document.querySelector('header[role="banner"]'); // Locate the chat header

        if (chatHeader && !document.getElementById('translate-all-btn')) {
            console.log('Chat header found. Creating button.'); // Debugging message
            
            // Create the "Translate All" button
            const translateAllButton = document.createElement('button');
            translateAllButton.id = 'translate-all-btn';
            translateAllButton.innerText = 'Translate All';
            translateAllButton.style.marginLeft = '10px';
            translateAllButton.style.backgroundColor = '#25D366'; // WhatsApp green color
            translateAllButton.style.color = '#fff';
            translateAllButton.style.border = 'none';
            translateAllButton.style.borderRadius = '5px';
            translateAllButton.style.cursor = 'pointer';
            translateAllButton.style.padding = '5px 10px';

            // Insert the button into the chat header
            chatHeader.appendChild(translateAllButton);

            // Add click event listener to the button
            translateAllButton.addEventListener('click', async () => {
                try {
                    const messages = document.querySelectorAll('div[class*="message-text"]'); // Get all message elements

                    if (!messages || messages.length === 0) {
                        console.log('No messages found for translation.');
                        return;
                    }

                    // Retrieve both input and output languages from Chrome's storage
                    chrome.storage.sync.get(['inputLang', 'outputLang'], async (data) => {
                        const inputLang = data.inputLang || 'en'; // Default to English if not set
                        const outputLang = data.outputLang || 'es'; // Default to Spanish if not set

                        // Loop through each message and translate it
                        for (const message of messages) {
                            const originalText = message.innerText; // Get original message text

                            // Translate the message
                            const translatedText = await translateMessage(originalText, inputLang, outputLang);

                            // Replace the original message with the translated one
                            message.innerText = translatedText;
                        }
                    });
                } catch (error) {
                    console.error('Error during translation:', error);
                }
            });

            observer.disconnect(); // Stop observing once the button is added
        }
    });

    // Start observing the chat interface for changes
    observer.observe(document.body, { childList: true, subtree: true });
};

// Call the function to add the "Translate All" button to the chat interface
createTranslateAllButton();
