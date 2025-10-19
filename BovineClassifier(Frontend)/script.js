// Global variables
let currentLang = "en";
let buffaloCount = 0;
let cattleCount = 0;
let buffaloHistory = [];
let cattleHistory = [];
let userId = null;

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api'; // Change this for production

// Complete multi-language translations
const translations = {
  en: {
    ui: {
      title: "Buffalo & Cattle Breed Recognition",
      heroTitle: "AI-Powered Breed Identification System",
      heroDesc: "Quickly and accurately identify the breeds of Indian cattle and buffaloes using images. Keep track of breed history, measurements, productivity, and other essential data for effective farm management and research.",
      feature1Title: "✅ Accurate & Fast",
      feature1Desc: "AI-powered image recognition ensures reliable breed identification in seconds.",
      feature2Title: "📊 Historical Tracking", 
      feature2Desc: "Maintain a complete history of animal uploads including measurements and productivity.",
      feature3Title: "🔒 Privacy & Control",
      feature3Desc: "Clear your upload history anytime to ensure your data is secure.",
      getStarted: "Get Started",
      returnHome: "Return to Home",
      exportData: "Export Data",
      importData: "Import Data",
      dataManagement: "Data Management",
      deleteEntry: "Delete",
      action: "Action",
      home: "Home",
      export: "Export",
      import: "Import",
      buffaloSection: "Buffalo Section",
      cattleSection: "Cattle Section",
      reUpload: "Re-upload",
      measurements: "Measurements",
      breedInformation: "Breed Information",
      cattleMeasurements: "Cattle Measurements", 
      cattleBreedInfo: "Cattle Breed Info",
      uploadHistory: "Upload History",
      clearHistory: "Clear All History",
      bodyLength: "Body Length",
      height: "Height",
      chestWidth: "Chest Width",
      rumpAngle: "Rump Angle",
      breedName: "Breed Name",
      originState: "Origin State",
      keyFeatures: "Key Features",
      productivity: "Productivity",
      fatPercent: "Fat%",
      confidence: "Confidence",
      image: "Image"
    },
    buffalo: {
      bodyLength: "150 cm", height: "140 cm", chestWidth: "60 cm", rumpAngle: "30°",
      breedName: "Murrah", origin: "Punjab", features: "High milk yield, jet black color",
      productivity: "3000 liters/year", fat: "7%", confidence: "95%"
    },
    cattle: {
      bodyLength: "160 cm", height: "130 cm", chestWidth: "55 cm", rumpAngle: "25°",
      breedName: "Gir", origin: "Gujarat", features: "High milk yield, red coat",
      productivity: "1500–2500 L", confidence: "95%"
    }
  },
  ta: {
    ui: {
      title: "எருமை மற்றும் கால்நடை இன அடையாளம்",
      heroTitle: "AI-இயங்கும் இன அடையாள அமைப்பு",
      heroDesc: "படங்களைப் பயன்படுத்தி இந்திய கால்நடைகள் மற்றும் எருமைகளின் இனங்களை விரைவாகவும் துல்லியமாகவும் அடையாளம் காணுங்கள். பண்ணை மேலாண்மை மற்றும் ஆராய்ச்சிக்கு இன வரலாறு, அளவீடுகள், உற்பத்தித்திறன் மற்றும் பிற அத்தியாவசிய தரவுகளைக் கண்காணிக்கவும்.",
      feature1Title: "✅ துல்லியமான மற்றும் வேகமான",
      feature1Desc: "AI-இயங்கும் படம் அடையாளம் காணல் நொடிகளில் நம்பகமான இன அடையாளத்தை உறுதி செய்கிறது.",
      feature2Title: "📊 வரலாற்று கண்காணிப்பு",
      feature2Desc: "அளவீடுகள் மற்றும் உற்பத்தித்திறன் உட்பட விலங்கு பதிவேற்றங்களின் முழுமையான வரலாற்றைப் பராமரிக்கவும்.",
      feature3Title: "🔒 தனியுரிமை மற்றும் கட்டுப்பாடு",
      feature3Desc: "உங்கள் தரவு பாதுகாப்பாக இருப்பதை உறுதிசெய்ய எந்த நேரத்திலும் உங்கள் பதிவேற்ற வரலாற்றை அழிக்கவும்.",
      getStarted: "தொடங்குங்கள்",
      returnHome: "வீட்டிற்கு திரும்பு",
      exportData: "தரவு ஏற்றுமதி",
      importData: "தரவு இறக்குமதி",
      dataManagement: "தரவு மேலாண்மை",
      deleteEntry: "அழிக்கவும்",
      action: "செயல்",
      home: "வீடு",
      export: "ஏற்றுமதி",
      import: "இறக்குமதி",
      buffaloSection: "எருமை பிரிவு",
      cattleSection: "கால்நடை பிரிவு", 
      reUpload: "மீண்டும் பதிவேற்றவும்",
      measurements: "அளவீடுகள்",
      breedInformation: "இன தகவல்",
      cattleMeasurements: "கால்நடை அளவீடுகள்",
      cattleBreedInfo: "கால்நடை இன தகவல்",
      uploadHistory: "பதிவேற்ற வரலாறு",
      clearHistory: "அனைத்து வரலாற்றையும் அழிக்கவும்",
      bodyLength: "உடல் நீளம்",
      height: "உயரம்",
      chestWidth: "மார்பு அகலம்",
      rumpAngle: "இடுப்பு கோணம்",
      breedName: "இன பெயர்",
      originState: "தோற்ற மாநிலம்",
      keyFeatures: "முக்கிய அம்சங்கள்",
      productivity: "உற்பத்தித்திறன்",
      fatPercent: "கொழுப்பு%",
      confidence: "நம்பிக்கை",
      image: "படம்"
    },
    buffalo: {
      bodyLength: "150 செ.மீ", height: "140 செ.மீ", chestWidth: "60 செ.மீ", rumpAngle: "30°",
      breedName: "முர்ரா", origin: "பஞ்சாப்", features: "அதிக பால் உற்பத்தி, கருப்பு நிறம்",
      productivity: "3000 லிட்டர்/ஆண்டு", fat: "7%", confidence: "95%"
    },
    cattle: {
      bodyLength: "160 செ.மீ", height: "130 செ.மீ", chestWidth: "55 செ.மீ", rumpAngle: "25°",
      breedName: "கிர்", origin: "குஜராத்", features: "அதிக பால் உற்பத்தி, சிவப்பு நிறம்",
      productivity: "1500–2500 லி", confidence: "95%"
    }
  },
  hi: {
    ui: {
      title: "भैंस और पशु नस्ल पहचान",
      heroTitle: "AI-संचालित नस्ल पहचान प्रणाली",
      heroDesc: "छवियों का उपयोग करके भारतीय पशुओं और भैंसों की नस्लों को जल्दी और सटीक रूप से पहचानें। प्रभावी खेत प्रबंधन और अनुसंधान के लिए नस्ल इतिहास, माप, उत्पादकता और अन्य आवश्यक डेटा का ट्रैक रखें।",
      feature1Title: "✅ सटीक और तेज़",
      feature1Desc: "AI-संचालित छवि पहचान सेकंडों में विश्वसनीय नस्ल पहचान सुनिश्चित करती है।",
      feature2Title: "📊 ऐतिहासिक ट्रैकिंग",
      feature2Desc: "माप और उत्पादकता सहित पशु अपलोड का पूरा इतिहास बनाए रखें।",
      feature3Title: "🔒 गोपनीयता और नियंत्रण",
      feature3Desc: "अपने डेटा की सुरक्षा सुनिश्चित करने के लिए कभी भी अपना अपलोड इतिहास साफ़ करें।",
      getStarted: "शुरू करें",
      returnHome: "घर वापस जाएं",
      exportData: "डेटा निर्यात करें",
      importData: "डेटा आयात करें",
      dataManagement: "डेटा प्रबंधन",
      deleteEntry: "हटाएं",
      action: "कार्य",
      home: "घर",
      export: "निर्यात",
      import: "आयात",
      buffaloSection: "भैंस अनुभाग",
      cattleSection: "पशु अनुभाग",
      reUpload: "पुनः अपलोड करें",
      measurements: "माप",
      breedInformation: "नस्ल की जानकारी",
      cattleMeasurements: "पशु माप",
      cattleBreedInfo: "पशु नस्ल जानकारी",
      uploadHistory: "अपलोड इतिहास",
      clearHistory: "सभी इतिहास साफ़ करें",
      bodyLength: "शरीर की लंबाई",
      height: "ऊंचाई",
      chestWidth: "छाती की चौड़ाई",
      rumpAngle: "कूल्हे का कोण",
      breedName: "नस्ल का नाम",
      originState: "मूल राज्य",
      keyFeatures: "मुख्य विशेषताएं",
      productivity: "उत्पादकता",
      fatPercent: "वसा%",
      confidence: "विश्वास",
      image: "छवि"
    },
    buffalo: {
      bodyLength: "150 सेमी", height: "140 सेमी", chestWidth: "60 सेमी", rumpAngle: "30°",
      breedName: "मुर्रा", origin: "पंजाब", features: "उच्च दूध उत्पादन, काला रंग",
      productivity: "3000 लीटर/वर्ष", fat: "7%", confidence: "95%"
    },
    cattle: {
      bodyLength: "160 सेमी", height: "130 सेमी", chestWidth: "55 सेमी", rumpAngle: "25°",
      breedName: "गिर", origin: "गुजरात", features: "उच्च दूध उत्पादन, लाल रंग",
      productivity: "1500–2500 ली", confidence: "95%"
    }
  },
  ml: {
    ui: {
      title: "എരുമയും കന്നുകാലി ഇന തിരിച്ചറിയൽ",
      heroTitle: "AI-പവർഡ് ഇന തിരിച്ചറിയൽ സിസ്റ്റം",
      heroDesc: "ചിത്രങ്ങൾ ഉപയോഗിച്ച് ഇന്ത്യൻ കന്നുകാലികളുടെയും എരുമകളുടെയും ഇനങ്ങൾ വേഗത്തിലും കൃത്യമായും തിരിച്ചറിയുക. ഫലപ്രദമായ കൃഷി മാനേജ്മെന്റിനും ഗവേഷണത്തിനുമായി ഇന ചരിത്രം, അളവുകൾ, ഉൽപ്പാദനക്ഷമത, മറ്റ് അത്യാവശ്യ ഡാറ്റ എന്നിവ ട്രാക്ക് ചെയ്യുക.",
      feature1Title: "✅ കൃത്യവും വേഗത്തിലുള്ളതും",
      feature1Desc: "AI-പവർഡ് ഇമേജ് റെക്കഗ്നിഷൻ സെക്കൻഡുകൾക്കുള്ളിൽ വിശ്വസനീയമായ ഇന തിരിച്ചറിയൽ ഉറപ്പാക്കുന്നു.",
      feature2Title: "📊 ചരിത്രപരമായ ട്രാക്കിംഗ്",
      feature2Desc: "അളവുകളും ഉൽപ്പാദനക്ഷമതയും ഉൾപ്പെടെ മൃഗങ്ങളുടെ അപ്‌ലോഡുകളുടെ പൂർണ്ണമായ ചരിത്രം പരിപാലിക്കുക.",
      feature3Title: "🔒 സ്വകാര്യതയും നിയന്ത്രണവും",
      feature3Desc: "നിങ്ങളുടെ ഡാറ്റ സുരക്ഷിതമാണെന്ന് ഉറപ്പാക്കാൻ എപ്പോൾ വേണമെങ്കിലും നിങ്ങളുടെ അപ്‌ലോഡ് ചരിത്രം മായ്ക്കുക.",
      getStarted: "ആരംഭിക്കുക",
      returnHome: "വീട്ടിലേക്ക് മടങ്ങുക",
      exportData: "ഡാറ്റ എക്സ്പോർട്ട് ചെയ്യുക",
      importData: "ഡാറ്റ ഇമ്പോർട്ട് ചെയ്യുക",
      dataManagement: "ഡാറ്റ മാനേജ്മെന്റ്",
      deleteEntry: "ഇല്ലാതാക്കുക",
      action: "പ്രവർത്തനം",
      home: "വീട്",
      export: "എക്സ്പോർട്ട്",
      import: "ഇമ്പോർട്ട്",
      buffaloSection: "എരുമ വിഭാഗം",
      cattleSection: "കന്നുകാലി വിഭാഗം",
      reUpload: "വീണ്ടും അപ്‌ലോഡ് ചെയ്യുക",
      measurements: "അളവുകൾ",
      breedInformation: "ഇന വിവരങ്ങൾ",
      cattleMeasurements: "കന്നുകാലി അളവുകൾ",
      cattleBreedInfo: "കന്നുകാലി ഇന വിവരങ്ങൾ",
      uploadHistory: "അപ്‌ലോഡ് ചരിത്രം",
      clearHistory: "എല്ലാ ചരിത്രവും മായ്ക്കുക",
      bodyLength: "ശരീര നീളം",
      height: "ഉയരം",
      chestWidth: "നെഞ്ചിന്റെ വീതി",
      rumpAngle: "കടിപ്രദേശത്തിന്റെ കോൺ",
      breedName: "ഇനത്തിന്റെ പേര്",
      originState: "ഉത്ഭവ സംസ്ഥാനം",
      keyFeatures: "പ്രധാന സവിശേഷതകൾ",
      productivity: "ഉൽപ്പാദനക്ഷമത",
      fatPercent: "കൊഴുപ്പ്%",
      confidence: "ആത്മവിശ്വാസം",
      image: "ചിത്രം"
    },
    buffalo: {
      bodyLength: "150 സെ.മീ", height: "140 സെ.മീ", chestWidth: "60 സെ.മീ", rumpAngle: "30°",
      breedName: "മുറാ", origin: "പഞ്ചാബ്", features: "ഉയർന്ന പാൽ ഉത്പാദനം, കറുത്ത നിറം",
      productivity: "3000 ലിറ്റർ/വർഷം", fat: "7%", confidence: "95%"
    },
    cattle: {
      bodyLength: "160 സെ.മീ", height: "130 സെ.മീ", chestWidth: "55 സെ.മീ", rumpAngle: "25°",
      breedName: "ഗിർ", origin: "ഗുജറാത്ത്", features: "ഉയർന്ന പാൽ ഉത്പാദനം, ചുവന്ന നിറം",
      productivity: "1500–2500 ലി", confidence: "95%"
    }
  }
};

// Navigation functions
function startApp() {
  document.getElementById("landingPage").classList.add("hidden");
  document.getElementById("mainPage").classList.remove("hidden");
  document.getElementById("navbar").classList.remove("hidden");
  document.getElementById("returnToTop").classList.remove("hidden");
  document.body.classList.add("navbar-visible");
  updateUILanguage();
}

function returnHome() {
  document.getElementById("mainPage").classList.add("hidden");
  document.getElementById("landingPage").classList.remove("hidden");
  document.getElementById("navbar").classList.add("hidden");
  document.getElementById("returnToTop").classList.add("hidden");
  document.body.classList.remove("navbar-visible");
}

// Scroll to top function
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Show/hide return to top button based on scroll position
function handleScroll() {
  const returnToTopBtn = document.getElementById("returnToTop");
  const isMainPageVisible = !document.getElementById("mainPage").classList.contains("hidden");
  
  // Only show return to top button on main page and when scrolled down
  if (isMainPageVisible && window.pageYOffset > 300) {
    returnToTopBtn.classList.add("show");
  } else {
    returnToTopBtn.classList.remove("show");
  }
}

// Individual delete functions
function deleteBuffaloEntry(index) {
  if (confirm('Are you sure you want to delete this entry?')) {
    buffaloHistory.splice(index, 1);
    buffaloCount = buffaloHistory.length;
    saveToLocalStorage();
    rebuildHistoryTables();
  }
}

function deleteCattleEntry(index) {
  if (confirm('Are you sure you want to delete this entry?')) {
    cattleHistory.splice(index, 1);
    cattleCount = cattleHistory.length;
    saveToLocalStorage();
    rebuildHistoryTables();
  }
}

// Language functions
function changeLanguage() {
  currentLang = document.getElementById("languageSelect").value;
  updateUILanguage();
  saveToLocalStorage(); // Save language preference
}

function updateUILanguage() {
  const t = translations[currentLang].ui;
  
  // Update all translatable elements
  const elements = {
    'app-title': t.title,
    'main-app-title': t.title,
    'hero-title': t.heroTitle,
    'hero-desc': t.heroDesc,
    'feature1-title': t.feature1Title,
    'feature1-desc': t.feature1Desc,
    'feature2-title': t.feature2Title,
    'feature2-desc': t.feature2Desc,
    'feature3-title': t.feature3Title,
    'feature3-desc': t.feature3Desc,
    'get-started-btn': t.getStarted,
    'return-home-btn': t.returnHome,
    'export-data-btn': t.exportData,
    'import-data-btn': t.importData,
    'buffalo-section-title': t.buffaloSection,
    'cattle-section-title': t.cattleSection,
    'buffalo-reupload-btn': t.reUpload,
    'cattle-reupload-btn': t.reUpload,
    'measurements-title': t.measurements,
    'breed-info-title': t.breedInformation,
    'cattle-measurements-title': t.cattleMeasurements,
    'cattle-breed-info-title': t.cattleBreedInfo,
    'buffalo-history-title': t.uploadHistory + ' (' + t.buffaloSection + ')',
    'cattle-history-title': t.uploadHistory + ' (' + t.cattleSection + ')',
    'buffalo-clear-btn': t.clearHistory,
    'cattle-clear-btn': t.clearHistory
  };

  // Update table headers and labels
  const labels = {
    'body-length-label': t.bodyLength,
    'height-label': t.height,
    'chest-width-label': t.chestWidth,
    'rump-angle-label': t.rumpAngle,
    'breed-name-label': t.breedName,
    'origin-state-label': t.originState,
    'key-features-label': t.keyFeatures,
    'productivity-label': t.productivity,
    'fat-percent-label': t.fatPercent,
    'confidence-label': t.confidence,
    'c-body-length-label': t.bodyLength,
    'c-height-label': t.height,
    'c-chest-width-label': t.chestWidth,
    'c-rump-angle-label': t.rumpAngle,
    'c-breed-name-label': t.breedName,
    'c-origin-state-label': t.originState,
    'c-key-features-label': t.keyFeatures,
    'c-productivity-label': t.productivity,
    'c-confidence-label': t.confidence
  };

  // Update navigation bar with language-specific shortened titles
  const navTitles = {
    'en': 'Breed Recognition System',
    'ta': 'இன அடையாள அமைப்பு',
    'hi': 'नस्ल पहचान प्रणाली',
    'ml': 'ഇന തിരിച്ചറിയൽ സിസ്റ്റം'
  };
  
  const navElements = {
    'nav-brand': navTitles[currentLang] || navTitles['en'],
    'nav-home-btn': `<span>🏠</span> ${t.home}`,
    'nav-export-btn': `<span>📤</span> ${t.export}`,
    'nav-import-btn': `<span>📥</span> ${t.import}`
  };

  // Update history table headers
  const historyHeaders = {
    'buffalo-history-headers': `
      <tr>
        <th>#</th><th>${t.image}</th><th>${t.bodyLength}</th><th>${t.height}</th>
        <th>${t.chestWidth}</th><th>${t.rumpAngle}</th><th>${t.breedName}</th>
        <th>${t.originState}</th><th>${t.keyFeatures}</th><th>${t.productivity}</th>
        <th>${t.fatPercent}</th><th>${t.confidence}</th><th>${t.action}</th>
      </tr>`,
    'cattle-history-headers': `
      <tr>
        <th>#</th><th>${t.image}</th><th>${t.bodyLength}</th><th>${t.height}</th>
        <th>${t.chestWidth}</th><th>${t.rumpAngle}</th><th>${t.breedName}</th>
        <th>${t.originState}</th><th>${t.keyFeatures}</th><th>${t.productivity}</th>
        <th>${t.fatPercent}</th><th>${t.confidence}</th><th>${t.action}</th>
      </tr>`
  };

  // Apply translations
  Object.keys(elements).forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = elements[id];
  });

  Object.keys(labels).forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = labels[id];
  });

  Object.keys(navElements).forEach(id => {
    const element = document.getElementById(id);
    if (element) element.innerHTML = navElements[id];
  });

  Object.keys(historyHeaders).forEach(id => {
    const element = document.getElementById(id);
    if (element) element.innerHTML = historyHeaders[id];
  });
  
  // Rebuild history tables to update delete button text
  rebuildHistoryTables();
}

// Upload and data handling functions
function reUploadBuffalo() {
  document.getElementById("imageUpload").value = "";
  document.getElementById("imageContainer").innerHTML = "";
  const fields = [
    "bodyLength", "height", "chestWidth", "rumpAngle",
    "breedName", "origin", "features", "productivity", "fat", "confidence"
  ];
  fields.forEach(id => document.getElementById(id).value = "");
}

function clearHistoryBuffalo() {
  document.getElementById("historyTable").innerHTML = "";
  buffaloHistory = [];
  buffaloCount = 0;
  saveToLocalStorage();
}

function reUploadCattle() {
  document.getElementById("cattleUpload").value = "";
  document.getElementById("cattleImageContainer").innerHTML = "";
  const fields = [
    "c_bodyLength", "c_height", "c_chestWidth", "c_rumpAngle",
    "c_breedName", "c_origin", "c_features", "c_productivity", "c_confidence"
  ];
  fields.forEach(id => document.getElementById(id).value = "");
}

function clearHistoryCattle() {
  document.getElementById("cattleHistoryTable").innerHTML = "";
  cattleHistory = [];
  cattleCount = 0;
  saveToLocalStorage();
}

// Data export/import functions
function exportData() {
  const data = {
    buffaloHistory: buffaloHistory,
    cattleHistory: cattleHistory,
    buffaloCount: buffaloCount,
    cattleCount: cattleCount,
    currentLang: currentLang,
    exportDate: new Date().toISOString(),
    version: "1.0"
  };
  
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `breed-recognition-data-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
      try {
        const importedData = JSON.parse(event.target.result);
        
        // Validate data structure
        if (importedData.buffaloHistory && importedData.cattleHistory) {
          buffaloHistory = importedData.buffaloHistory || [];
          cattleHistory = importedData.cattleHistory || [];
          buffaloCount = importedData.buffaloCount || buffaloHistory.length;
          cattleCount = importedData.cattleCount || cattleHistory.length;
          
          if (importedData.currentLang) {
            currentLang = importedData.currentLang;
            document.getElementById("languageSelect").value = currentLang;
          }
          
          saveToLocalStorage();
          rebuildHistoryTables();
          updateUILanguage();
          
          alert('Data imported successfully!');
        } else {
          alert('Invalid file format. Please select a valid backup file.');
        }
      } catch (error) {
        alert('Error reading file. Please make sure it\'s a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };
  
  input.click();
}

// API Helper Functions
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// User Management
async function initializeUser() {
  try {
    const existingUserId = localStorage.getItem('userId');
    const result = await apiCall('/user/init', {
      method: 'POST',
      body: JSON.stringify({ existingUserId })
    });
    
    userId = result.userId;
    localStorage.setItem('userId', userId);
    
    if (result.settings) {
      currentLang = result.settings.currentLang || 'en';
    }
    
    return result;
  } catch (error) {
    console.error('Failed to initialize user:', error);
    // Fallback to localStorage if API fails
    userId = localStorage.getItem('userId') || 'offline_user_' + Date.now();
    localStorage.setItem('userId', userId);
    return { userId, offline: true };
  }
}

async function updateUserSettings() {
  if (!userId) return;
  
  try {
    await apiCall(`/user/${userId}/settings`, {
      method: 'PUT',
      body: JSON.stringify({ currentLang })
    });
  } catch (error) {
    console.error('Failed to update user settings:', error);
  }
}

// Cloud Data Functions
async function loadBuffaloHistory() {
  if (!userId) return;
  
  try {
    const history = await apiCall(`/buffalo/${userId}`);
    buffaloHistory = history;
    buffaloCount = history.length;
  } catch (error) {
    console.error('Failed to load buffalo history:', error);
    // Fallback to localStorage
    loadFromLocalStorage();
  }
}

async function loadCattleHistory() {
  if (!userId) return;
  
  try {
    const history = await apiCall(`/cattle/${userId}`);
    cattleHistory = history;
    cattleCount = history.length;
  } catch (error) {
    console.error('Failed to load cattle history:', error);
    // Fallback to localStorage
    loadFromLocalStorage();
  }
}

async function saveBuffaloEntry(entryData) {
  if (!userId) return;
  
  try {
    const newEntry = await apiCall(`/buffalo/${userId}`, {
      method: 'POST',
      body: JSON.stringify(entryData)
    });
    return newEntry;
  } catch (error) {
    console.error('Failed to save buffalo entry:', error);
    // Fallback to localStorage
    saveToLocalStorage();
    throw error;
  }
}

async function saveCattleEntry(entryData) {
  if (!userId) return;
  
  try {
    const newEntry = await apiCall(`/cattle/${userId}`, {
      method: 'POST',
      body: JSON.stringify(entryData)
    });
    return newEntry;
  } catch (error) {
    console.error('Failed to save cattle entry:', error);
    // Fallback to localStorage
    saveToLocalStorage();
    throw error;
  }
}

async function deleteBuffaloEntryCloud(entryId) {
  if (!userId) return;
  
  try {
    await apiCall(`/buffalo/${userId}/${entryId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Failed to delete buffalo entry:', error);
    throw error;
  }
}

async function deleteCattleEntryCloud(entryId) {
  if (!userId) return;
  
  try {
    await apiCall(`/cattle/${userId}/${entryId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Failed to delete cattle entry:', error);
    throw error;
  }
}

async function clearBuffaloHistoryCloud() {
  if (!userId) return;
  
  try {
    await apiCall(`/buffalo/${userId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Failed to clear buffalo history:', error);
    throw error;
  }
}

async function clearCattleHistoryCloud() {
  if (!userId) return;
  
  try {
    await apiCall(`/cattle/${userId}`, {
      method: 'DELETE'
    });
  } catch (error) {
    console.error('Failed to clear cattle history:', error);
    throw error;
  }
}

// LocalStorage functions (fallback)
function saveToLocalStorage() {
  const data = {
    buffaloHistory: buffaloHistory,
    cattleHistory: cattleHistory,
    buffaloCount: buffaloCount,
    cattleCount: cattleCount,
    currentLang: currentLang,
    userId: userId
  };
  localStorage.setItem('breedRecognitionData', JSON.stringify(data));
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem('breedRecognitionData');
  if (savedData) {
    const data = JSON.parse(savedData);
    buffaloHistory = data.buffaloHistory || [];
    cattleHistory = data.cattleHistory || [];
    buffaloCount = data.buffaloCount || 0;
    cattleCount = data.cattleCount || 0;
    currentLang = data.currentLang || "en";
    userId = data.userId || userId;
  }
  
  // Also check for language preference from home page
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang) {
    currentLang = savedLang;
  }
}

function rebuildHistoryTables() {
  const t = translations[currentLang].ui;
  
  // Rebuild buffalo history
  const buffaloTableBody = document.getElementById("historyTable");
  buffaloTableBody.innerHTML = "";
  buffaloHistory.forEach((entry, index) => {
    const row = `<tr>
      <td>${index + 1}</td>
      <td><img src="${entry.image}" class="thumb"></td>
      <td>${entry.bodyLength}</td>
      <td>${entry.height}</td>
      <td>${entry.chestWidth}</td>
      <td>${entry.rumpAngle}</td>
      <td>${entry.breedName}</td>
      <td>${entry.origin}</td>
      <td>${entry.features}</td>
      <td>${entry.productivity}</td>
      <td>${entry.fat}</td>
      <td>${entry.confidence}</td>
      <td><button class="delete-btn" onclick="deleteBuffaloEntry(${index})">${t.deleteEntry}</button></td>
    </tr>`;
    buffaloTableBody.insertAdjacentHTML("beforeend", row);
  });

  // Rebuild cattle history
  const cattleTableBody = document.getElementById("cattleHistoryTable");
  cattleTableBody.innerHTML = "";
  cattleHistory.forEach((entry, index) => {
    const row = `<tr>
      <td>${index + 1}</td>
      <td><img src="${entry.image}" class="thumb"></td>
      <td>${entry.bodyLength}</td>
      <td>${entry.height}</td>
      <td>${entry.chestWidth}</td>
      <td>${entry.rumpAngle}</td>
      <td>${entry.breedName}</td>
      <td>${entry.origin}</td>
      <td>${entry.features}</td>
      <td>${entry.productivity}</td>
      <td>-</td>
      <td>${entry.confidence}</td>
      <td><button class="delete-btn" onclick="deleteCattleEntry(${index})">${t.deleteEntry}</button></td>
    </tr>`;
    cattleTableBody.insertAdjacentHTML("beforeend", row);
  });
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Load saved data on page load
  loadFromLocalStorage();
  updateUILanguage();
  
  // Add scroll event listener for return to top button
  window.addEventListener('scroll', handleScroll);
  // Buffalo Upload Handler
  document.getElementById("imageUpload").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (ev) {
      const imgSrc = ev.target.result;
      document.getElementById("imageContainer").innerHTML = 
        `<img src="${imgSrc}" style="max-width:300px; border-radius:10px;">`;

      const data = translations[currentLang].buffalo;
      document.getElementById("bodyLength").value = data.bodyLength;
      document.getElementById("height").value = data.height;
      document.getElementById("chestWidth").value = data.chestWidth;
      document.getElementById("rumpAngle").value = data.rumpAngle;
      document.getElementById("breedName").value = data.breedName;
      document.getElementById("origin").value = data.origin;
      document.getElementById("features").value = data.features;
      document.getElementById("productivity").value = data.productivity;
      document.getElementById("fat").value = data.fat;
      document.getElementById("confidence").value = data.confidence;

      // Create history entry
      const historyEntry = {
        image: imgSrc,
        bodyLength: data.bodyLength,
        height: data.height,
        chestWidth: data.chestWidth,
        rumpAngle: data.rumpAngle,
        breedName: data.breedName,
        origin: data.origin,
        features: data.features,
        productivity: data.productivity,
        fat: data.fat,
        confidence: data.confidence,
        timestamp: new Date().toISOString()
      };

      buffaloHistory.push(historyEntry);
      buffaloCount++;

      const t = translations[currentLang].ui;
      const row = `<tr>
        <td>${buffaloCount}</td>
        <td><img src="${imgSrc}" class="thumb"></td>
        <td>${data.bodyLength}</td>
        <td>${data.height}</td>
        <td>${data.chestWidth}</td>
        <td>${data.rumpAngle}</td>
        <td>${data.breedName}</td>
        <td>${data.origin}</td>
        <td>${data.features}</td>
        <td>${data.productivity}</td>
        <td>${data.fat}</td>
        <td>${data.confidence}</td>
        <td><button class="delete-btn" onclick="deleteBuffaloEntry(${buffaloHistory.length - 1})">${t.deleteEntry}</button></td>
      </tr>`;
      document.getElementById("historyTable").insertAdjacentHTML("beforeend", row);

      // Save to localStorage
      saveToLocalStorage();
    };
    reader.readAsDataURL(file);
  });

  // Cattle Upload Handler
  document.getElementById("cattleUpload").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (ev) {
      const imgSrc = ev.target.result;
      document.getElementById("cattleImageContainer").innerHTML = 
        `<img src="${imgSrc}" style="max-width:300px; border-radius:10px;">`;

      const data = translations[currentLang].cattle;
      document.getElementById("c_bodyLength").value = data.bodyLength;
      document.getElementById("c_height").value = data.height;
      document.getElementById("c_chestWidth").value = data.chestWidth;
      document.getElementById("c_rumpAngle").value = data.rumpAngle;
      document.getElementById("c_breedName").value = data.breedName;
      document.getElementById("c_origin").value = data.origin;
      document.getElementById("c_features").value = data.features;
      document.getElementById("c_productivity").value = data.productivity;
      document.getElementById("c_confidence").value = data.confidence;

      // Create history entry
      const historyEntry = {
        image: imgSrc,
        bodyLength: data.bodyLength,
        height: data.height,
        chestWidth: data.chestWidth,
        rumpAngle: data.rumpAngle,
        breedName: data.breedName,
        origin: data.origin,
        features: data.features,
        productivity: data.productivity,
        confidence: data.confidence,
        timestamp: new Date().toISOString()
      };

      cattleHistory.push(historyEntry);
      cattleCount++;

      const t = translations[currentLang].ui;
      const row = `<tr>
        <td>${cattleCount}</td>
        <td><img src="${imgSrc}" class="thumb"></td>
        <td>${data.bodyLength}</td>
        <td>${data.height}</td>
        <td>${data.chestWidth}</td>
        <td>${data.rumpAngle}</td>
        <td>${data.breedName}</td>
        <td>${data.origin}</td>
        <td>${data.features}</td>
        <td>${data.productivity}</td>
        <td>-</td>
        <td>${data.confidence}</td>
        <td><button class="delete-btn" onclick="deleteCattleEntry(${cattleHistory.length - 1})">${t.deleteEntry}</button></td>
      </tr>`;
      document.getElementById("cattleHistoryTable").insertAdjacentHTML("beforeend", row);

      // Save to localStorage
      saveToLocalStorage();
    };
    reader.readAsDataURL(file);
  });
});