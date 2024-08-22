document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('language-select');
    const pitchInput = document.getElementById('pitch-input');
    const rateInput = document.getElementById('rate-input');
    const speakButton = document.getElementById('speak-button');
    const flagImage = document.getElementById('flag');

    let voices = [];
    let selectedVoiceIndex = 0; // Armazena o índice da voz selecionada

    // Mapeamento de código de idioma para bandeira (apenas alguns exemplos)
    const flagMap = {
        'en-US': 'us',
        'es-ES': 'es',
        'fr-FR': 'fr',
        'pt-BR': 'br',
        'de-DE': 'de',
        'it-IT': 'it',
        'ja-JP': 'jp',
        'zh-CN': 'cn'
        // Adicione mais mapeamentos conforme necessário
    };

    function populateVoiceList() {
        voices = speechSynthesis.getVoices();
        languageSelect.innerHTML = '';

        // Cria uma lista única de idiomas e vozes disponíveis
        const uniqueVoices = voices.reduce((acc, voice) => {
            if (!acc.find(v => v.lang === voice.lang && v.name === voice.name)) {
                acc.push(voice);
            }
            return acc;
        }, []);

        // Preenche a lista de idiomas e vozes
        uniqueVoices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute('data-lang', voice.lang);
            languageSelect.appendChild(option);
        });

        // Seleciona a voz armazenada ou a primeira por padrão
        if (uniqueVoices.length > 0) {
            languageSelect.selectedIndex = selectedVoiceIndex;
            updateFlag();
        }
    }

    function speak() {
        const text = document.getElementById('text-input').value;
        if (text.trim() === '') {
            alert('Por favor, digite um texto!');
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoice = voices[selectedVoiceIndex] || voices[0];
        utterance.voice = selectedVoice;

        utterance.pitch = parseFloat(pitchInput.value);
        utterance.rate = parseFloat(rateInput.value);

        console.log(`Pitch: ${utterance.pitch}, Rate: ${utterance.rate}`); // Debug: Verifique se os valores estão corretos

        window.speechSynthesis.speak(utterance);
    }

    function updateFlag() {
        const selectedOption = languageSelect.options[languageSelect.selectedIndex];
        const langCode = selectedOption.getAttribute('data-lang');
        const countryCode = flagMap[langCode] || 'default'; // Use 'default' se não houver bandeira mapeada
        const flagUrl = `https://flagcdn.com/256x192/${countryCode.toLowerCase()}.png`; // URL para bandeiras

        flagImage.src = flagUrl;
        flagImage.alt = `Bandeira do Idioma ${langCode}`;
        flagImage.onerror = () => {
            // Exibir uma bandeira padrão se não for encontrada a bandeira
            flagImage.src = 'https://flagcdn.com/256x192/default.png'; 
            flagImage.alt = 'Bandeira não encontrada';
        };
    }

    speechSynthesis.onvoiceschanged = populateVoiceList;
    populateVoiceList();
    speakButton.addEventListener('click', speak);

    languageSelect.addEventListener('change', () => {
        selectedVoiceIndex = languageSelect.value; // Atualiza o índice da voz selecionada
        updateFlag();
    });
});
