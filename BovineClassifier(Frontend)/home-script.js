// Global variables for home page
let currentLang = "en";

// Multi-language translations for home page
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
      getStarted: "Get Started"
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
      getStarted: "தொடங்குங்கள்"
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
      getStarted: "शुरू करें"
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
      getStarted: "ആരംഭിക്കുക"
    }
  }
};

// Navigation function
function startApp() {
  // Save current language to localStorage before navigating
  localStorage.setItem('selectedLanguage', currentLang);
  // Navigate to app page
  window.location.href = 'app.html';
}

// Language functions
function changeLanguage() {
  currentLang = document.getElementById("languageSelect").value;
  updateUILanguage();
  // Save language preference
  localStorage.setItem('selectedLanguage', currentLang);
}

function updateUILanguage() {
  const t = translations[currentLang].ui;
  
  // Update all translatable elements
  const elements = {
    'app-title': t.title,
    'hero-title': t.heroTitle,
    'hero-desc': t.heroDesc,
    'feature1-title': t.feature1Title,
    'feature1-desc': t.feature1Desc,
    'feature2-title': t.feature2Title,
    'feature2-desc': t.feature2Desc,
    'feature3-title': t.feature3Title,
    'feature3-desc': t.feature3Desc,
    'get-started-btn': t.getStarted
  };

  // Apply translations
  Object.keys(elements).forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = elements[id];
  });
}

// Load saved language on page load
function loadLanguagePreference() {
  const savedLang = localStorage.getItem('selectedLanguage');
  if (savedLang) {
    currentLang = savedLang;
    document.getElementById("languageSelect").value = currentLang;
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  loadLanguagePreference();
  updateUILanguage();
});