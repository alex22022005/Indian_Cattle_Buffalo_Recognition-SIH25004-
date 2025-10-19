// app-script.js
let currentLang = "en";
let buffaloHistory = [];
let cattleHistory = [];
let lastIdentifiedBreedName = null;
let lastUploadedFile = null;

const translations = {
  en: {
    ui: {
      title: "Buffalo & Cattle Breed Recognition", returnHome: "Return to Home", deleteEntry: "Delete", 
      action: "Action", home: "Home", reUpload: "Re-upload", measurements: "Measurements", 
      breedInformation: "Breed Information", uploadHistory: "Upload History", clearHistory: "Clear All History", 
      bodyLength: "Body Length", height: "Height", chestWidth: "Chest Width", rumpAngle: "Rump Angle", 
      breedName: "Breed Name", originState: "Origin State", keyFeatures: "Key Features", 
      productivity: "Productivity", fatPercent: "Fat%", confidence: "Confidence", image: "Image", 
      animalType: "Animal Type"
    }
  },
  ta: {
    ui: {
      title: "எருமை மற்றும் கால்நடை இன அடையாளம்", returnHome: "வீட்டிற்கு திரும்பு", deleteEntry: "அழிக்கவும்",
      action: "செயல்", home: "வீடு", reUpload: "மீண்டும் பதிவேற்றவும்", measurements: "அளவீடுகள்",
      breedInformation: "இன தகவல்", uploadHistory: "பதிவேற்ற வரலாறு", clearHistory: "அனைத்து வரலாற்றையும் அழிக்கவும்",
      bodyLength: "உடல் நீளம்", height: "உயரம்", chestWidth: "மார்பு அகலம்", rumpAngle: "இடுப்பு கோணம்",
      breedName: "இன பெயர்", originState: "தோற்ற மாநிலம்", keyFeatures: "முக்கிய அம்சங்கள்",
      productivity: "உற்பத்தித்திறன்", fatPercent: "கொழுப்பு%", confidence: "நம்பிக்கை", image: "படம்",
      animalType: "விலங்கு வகை"
    }
  },
  hi: {
    ui: {
        title: "भैंस और पशु नस्ल पहचान", returnHome: "घर वापस जाएं", deleteEntry: "हटाएं",
        action: "कार्य", home: "घर", reUpload: "पुनः अपलोड करें", measurements: "माप",
        breedInformation: "नस्ल की जानकारी", uploadHistory: "अपलोड इतिहास", clearHistory: "सभी इतिहास साफ़ करें",
        bodyLength: "शरीर की लंबाई", height: "ऊंचाई", chestWidth: "छाती की चौड़ाई",
        rumpAngle: "कूल्हे का कोण", breedName: "नस्ल का नाम", originState: "मूल राज्य",
        keyFeatures: "मुख्य विशेषताएं", productivity: "उत्पादकता", fatPercent: "वसा%",
        confidence: "विश्वास", image: "छवि", animalType: "पशु का प्रकार"
    }
  },
  ml: {
    ui: {
        title: "എരുമയും കന്നുകാലി ഇന തിരിച്ചറിയൽ", returnHome: "വീട്ടിലേക്ക് മടങ്ങുക", deleteEntry: "ഇല്ലാതാക്കുക",
        action: "പ്രവർത്തനം", home: "വീട്", reUpload: "വീണ്ടും അപ്‌ലോഡ് ചെയ്യുക", measurements: "അളവുകൾ",
        breedInformation: "ഇന വിവരങ്ങൾ", uploadHistory: "അപ്‌ലോഡ് ചരിത്രം", clearHistory: "എല്ലാ ചരിത്രവും മായ്ക്കുക",
        bodyLength: "ശരീര നീളം", height: "ഉയരം", chestWidth: "നെഞ്ചിന്റെ വീതി",
        rumpAngle: "കടിപ്രദേശത്തിന്റെ കോൺ", breedName: "ഇനത്തിന്റെ പേര്", originState: "ഉത്ഭവ സംസ്ഥാനം",
        keyFeatures: "പ്രധാന സവിശേഷതകൾ", productivity: "ഉൽപ്പാദനക്ഷമത", fatPercent: "കൊഴുപ്പ്%",
        confidence: "ആത്മവിശ്വാസം", image: "ചിത്രം", animalType: "മൃഗത്തിന്റെ തരം"
    }
  }
};


function getBrowserId() {
    let browserId = localStorage.getItem('browserId');
    if (!browserId) {
        browserId = `browser_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('browserId', browserId);
    }
    return browserId;
}

async function sendDataToServer(payload) {
    try {
        await fetch('http://localhost:3000/api/saveUpload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error('Error sending data to server:', error);
    }
}

async function classifyImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    try {
        const response = await fetch('http://localhost:5000/api/classify', {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error classifying image:', error);
        alert(`Classification failed: ${error.message}`);
        return null;
    }
}

async function getLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) return "Unknown";
        const data = await response.json();
        return `${data.city}, ${data.country_name}`;
    } catch (error) {
        console.error("Could not fetch location:", error);
        return "Unknown";
    }
}


function returnHome() { window.location.href = 'index.html'; }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

function clearForm() {
    document.getElementById("imageUpload").value = "";
    document.getElementById("imageContainer").innerHTML = "";
    const fields = ["bodyLength", "height", "chestWidth", "rumpAngle", "breedName", "origin", "features", "productivity", "fat", "confidence", "animalType"];
    fields.forEach(id => document.getElementById(id).value = "");
    lastIdentifiedBreedName = null;
    lastUploadedFile = null;
}

function reUploadImage() {
    if (lastUploadedFile) {
        processImageFile(lastUploadedFile);
    } else {
        alert("Please upload an image first.");
    }
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all local history?')) {
        buffaloHistory = [];
        cattleHistory = [];
        saveToLocalStorage();
        rebuildHistoryTables();
    }
}

function deleteHistoryEntry(timestamp) {
    if (confirm('Are you sure you want to delete this entry?')) {
        buffaloHistory = buffaloHistory.filter(entry => entry.timestamp !== timestamp);
        cattleHistory = cattleHistory.filter(entry => entry.timestamp !== timestamp);
        saveToLocalStorage();
        rebuildHistoryTables();
    }
}

function saveToLocalStorage() {
    const data = { buffaloHistory, cattleHistory, currentLang };
    localStorage.setItem('breedRecognitionData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('breedRecognitionData');
    if (savedData) {
        const data = JSON.parse(savedData);
        buffaloHistory = data.buffaloHistory || [];
        cattleHistory = data.cattleHistory || [];
        currentLang = data.currentLang || "en";
    }
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
        currentLang = savedLang;
    }
}

function populateDataCards(breedName, details, confidence) {
    document.getElementById("breedName").value = details.breedName || breedName;
    document.getElementById("confidence").value = confidence;
    document.getElementById("animalType").value = details.animalType;
    document.getElementById("origin").value = details.origin;
    document.getElementById("features").value = details.features;
    document.getElementById("productivity").value = details.productivity;
    document.getElementById("fat").value = details.fat || "N/A";
    document.getElementById("bodyLength").value = details.bodyLength || "N/A";
    document.getElementById("height").value = details.height || "N/A";
    document.getElementById("chestWidth").value = details.chestWidth || "N/A";
    document.getElementById("rumpAngle").value = details.rumpAngle || "N/A";
}

function updateUILanguage() {
    const t = translations[currentLang].ui;
    const elementsToTranslate = {
        'nav-brand': {en: 'Breed Recognition System', ta: 'இன அடையாள அமைப்பு', hi: 'नस्ल पहचान प्रणाली', ml: 'ഇന തിരിച്ചറിയൽ സിസ്റ്റം'}[currentLang],
        'main-app-title': t.title,
        'breed-section-title': t.title,
        'reupload-btn': t.reUpload,
        'measurements-title': t.measurements,
        'breed-info-title': t.breedInformation,
        'history-title': t.uploadHistory,
        'clear-history-btn': t.clearHistory,
        'th-body-length': t.bodyLength, 'th-height': t.height, 'th-chest-width': t.chestWidth, 'th-rump-angle': t.rumpAngle,
        'th-breed-name': t.breedName, 'th-origin-state': t.originState, 'th-key-features': t.keyFeatures,
        'th-productivity': t.productivity, 'th-fat-percent': t.fatPercent, 'th-confidence': t.confidence, 'th-animal-type': t.animalType
    };
    Object.keys(elementsToTranslate).forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = elementsToTranslate[id];
    });
    document.getElementById('nav-home-btn').innerHTML = `<span>🏠</span> ${t.home}`;
    
    if (lastIdentifiedBreedName && breedData[lastIdentifiedBreedName]) {
        const details = breedData[lastIdentifiedBreedName][currentLang];
        const confidence = document.getElementById('confidence').value;
        if (details) {
            populateDataCards(lastIdentifiedBreedName, details, confidence);
        }
    }
    rebuildHistoryTables();
}

function rebuildHistoryTables() {
    const t = translations[currentLang].ui;
    const table = document.querySelector(".history-box table");
    if (!table) return;
    table.innerHTML = `<thead><tr><th>#</th><th>${t.image}</th><th>${t.bodyLength}</th><th>${t.height}</th><th>${t.breedName}</th><th>${t.originState}</th><th>${t.keyFeatures}</th><th>${t.productivity}</th><th>${t.fatPercent}</th><th>${t.confidence}</th><th>${t.animalType}</th><th>${t.action}</th></tr></thead><tbody id="historyTable"></tbody>`;
    const tableBody = document.getElementById("historyTable");
    const combinedHistory = [...buffaloHistory, ...cattleHistory];
    combinedHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    combinedHistory.forEach((entry, index) => {
        const detailsInCurrentLang = (breedData[entry.breedName] && breedData[entry.breedName][currentLang]) ? breedData[entry.breedName][currentLang] : (breedData[entry.breedName] ? breedData[entry.breedName]['en'] : {});
        const row = `<tr><td>${index + 1}</td><td><img src="${entry.image}" class="thumb"></td><td>${detailsInCurrentLang.bodyLength || 'N/A'}</td><td>${detailsInCurrentLang.height || 'N/A'}</td><td>${detailsInCurrentLang.breedName || entry.breedName}</td><td>${detailsInCurrentLang.origin}</td><td>${detailsInCurrentLang.features}</td><td>${detailsInCurrentLang.productivity}</td><td>${detailsInCurrentLang.fat || '-'}</td><td>${entry.confidence}</td><td>${detailsInCurrentLang.animalType}</td><td><button class="delete-btn" onclick="deleteHistoryEntry('${entry.timestamp}')">${t.deleteEntry}</button></td></tr>`;
        tableBody.insertAdjacentHTML("beforeend", row);
    });
}

async function processImageFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (ev) => {
        document.getElementById("imageContainer").innerHTML = `<img src="${ev.target.result}" style="max-width:300px; border-radius:10px;">`;
    };
    
    document.getElementById('breedName').value = "Classifying...";
    ['confidence', 'animalType', 'origin', 'features', 'productivity', 'fat', 'bodyLength', 'height', 'chestWidth', 'rumpAngle'].forEach(id => {
        document.getElementById(id).value = "...";
    });

    const result = await classifyImage(file);
    if (!result || !result.breedName) {
        clearForm();
        return;
    }

    lastIdentifiedBreedName = result.breedName;
    const detailsForDisplay = breedData[lastIdentifiedBreedName] ? breedData[lastIdentifiedBreedName][currentLang] : null;
    
    if (!detailsForDisplay) {
        alert(`Breed "${lastIdentifiedBreedName}" identified, but no details found in data.js.`);
        clearForm();
        return;
    }
    
    populateDataCards(lastIdentifiedBreedName, detailsForDisplay, result.confidence);

    const historyEntry = {
        image: document.querySelector("#imageContainer img").src,
        breedName: lastIdentifiedBreedName,
        confidence: result.confidence,
        timestamp: new Date().toISOString()
    };
    
    const animalTypeForHistory = (breedData[lastIdentifiedBreedName]['en'].animalType || "Cattle").toLowerCase();
    if (animalTypeForHistory === 'buffalo') {
        buffaloHistory.push(historyEntry);
    } else {
        cattleHistory.push(historyEntry);
    }
    saveToLocalStorage();
    rebuildHistoryTables();

    const location = await getLocation();
    const languageMap = { en: 'English', hi: 'Hindi', ta: 'Tamil', ml: 'Malayalam' };
    const searchedLanguage = languageMap[currentLang] || currentLang;
    const englishAnimalType = breedData[lastIdentifiedBreedName]['en'].animalType;

    const uploadData = {
        breedName: lastIdentifiedBreedName,
        confidence: result.confidence,
        animalType: englishAnimalType,
        timestamp: historyEntry.timestamp,
        searchedLanguage: searchedLanguage,
        location: location
    };
    
    const payloadToServer = {
        browserId: getBrowserId(),
        upload: uploadData
    };
    sendDataToServer(payloadToServer);
}

document.addEventListener("DOMContentLoaded", function () {
    loadFromLocalStorage();
    updateUILanguage();
    const clearBtn = document.getElementById("clear-history-btn");
    if (clearBtn) clearBtn.addEventListener("click", clearHistory);
    const reuploadBtn = document.getElementById("reupload-btn");
    if (reuploadBtn) reuploadBtn.addEventListener("click", reUploadImage);
    const homeBtn = document.getElementById("nav-home-btn");
    if (homeBtn) homeBtn.addEventListener("click", returnHome);
    const imageUpload = document.getElementById("imageUpload");
    if (imageUpload) {
        imageUpload.addEventListener("change", function (e) {
            const file = e.target.files[0];
            if (!file) return;
            lastUploadedFile = file;
            processImageFile(file);
        });
    }
});