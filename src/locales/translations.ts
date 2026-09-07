import { LanguageCode } from '../types/procurement';

export interface Translations {
  appTitle: string;
  tagline: string;
  greeting: string;
  centreName: string;
  centreStatus: string;
  
  // Simplified crowd states (Section 6 & 8)
  goodTimeToVisit: string;
  goodTimeExplanation: string;
  moderateCrowd: string;
  moderateCrowdExplanation: string;
  highCrowd: string;
  highCrowdExplanation: string;

  // 3 Core Questions
  whatIsHappening: string;
  whatShouldIDo: string;
  whenShouldICome: string;

  // Core Metrics in Simple Terms
  currentCrowdLabel: string;
  farmersWaiting: string;
  expectedSoonLabel: string;
  recommendedTimeTitle: string;
  recommendedTimeValue: string;
  recommendedTimeAdvice: string;

  // Voice & Audio
  listen: string;
  listening: string;
  stopVoice: string;
  speakQuery: string;

  // Connectivity & Offline
  lastUpdated: string;
  refresh: string;
  retry: string;
  workingOffline: string;

  // SMS Fallback
  viewAsSms: string;
  smsFormat: string;
  copySms: string;
  copied: string;
  smsHeader: string;

  // Navigation (Only 4 tabs)
  navHome: string;
  navBooking: string;
  navAlerts: string;
  navHelp: string;

  // Booking
  myBooking: string;
  tokenNumber: string;
  bookingStatus: string;
  confirmed: string;
  assignedSlot: string;
  crop: string;
  allocatedQuantity: string;
  gateNumber: string;
  slotGuaranteedNote: string;
  bookVisitBtn: string;

  // Alerts
  notifications: string;
  bookingStillValidNotice: string;
  centreHoursNotice: string;

  // Help Section
  helpTitle: string;
  helpSubtitle: string;
  q1_when: string;
  q1_when_ans: string;
  q2_crowd: string;
  q2_crowd_ans: string;
  q3_status: string;
  q3_status_ans: string;
  q4_documents: string;
  q4_documents_ans: string;
  q4_doc_list: string[];
  q5_contact: string;
  callHelpdesk: string;
  tollFreeNumber: string;
  askPlaceholder: string;
  askBtn: string;
  unavailableInfo: string;

  // Assisted Access / CSC / IVR
  assistedMode: string;
  assistedModeDesc: string;
  lookupToken: string;
  enterTokenNumber: string;
  search: string;
  printPass: string;
  farmerNameLabel: string;
  ivrButton: string;
  missedCallPrompt: string;
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  ta: {
    appTitle: 'AgriFlow',
    tagline: 'Know the crowd before it arrives.',
    greeting: 'வணக்கம் 👋',
    centreName: 'சிங்காநல்லூர் கொள்முதல் நிலையம் (Singanallur Centre)',
    centreStatus: 'நிலையத்தின் நிலை',
    
    // 3 Simplified Crowd States
    goodTimeToVisit: 'LOW CROWD (குறைந்த கூட்டம்)',
    goodTimeExplanation: 'கூட்டம் குறைவாக உள்ளது. நீங்கள் இப்போது கொள்முதல் நிலையத்திற்கு வரலாம்.',
    moderateCrowd: 'MODERATE CROWD (மிதமான கூட்டம்)',
    moderateCrowdExplanation: 'காத்திருப்பு நேரம் சற்று அதிகமாகலாம். சிறந்த நேரம்: மதியம் 2:00 மணிக்கு மேல்.',
    highCrowd: 'HIGH CROWD (அதிக கூட்டம்)',
    highCrowdExplanation: 'இப்போது அதிக விவசாயிகள் வருவார்கள் என எதிர்பார்க்கப்படுகிறது. முடிந்தால் மதியம் 2:00 மணிக்கு மேல் வரவும். உங்கள் பதிவு ரத்தாகாது.',

    // 3 Core Questions
    whatIsHappening: 'இப்போது என்ன நடக்கிறது?',
    whatShouldIDo: 'நான் என்ன செய்ய வேண்டும்?',
    whenShouldICome: 'நான் எப்போது வர வேண்டும்?',

    // Metrics
    currentCrowdLabel: 'தற்போதைய டிராக்டர்கள்',
    farmersWaiting: 'விவசாயிகள் வரிசையில்',
    expectedSoonLabel: 'அடுத்து வரவுள்ளோர்',
    recommendedTimeTitle: '🕒 BEST TIME TO VISIT (சிறந்த நேரம்)',
    recommendedTimeValue: 'After 2:00 PM (மதியம் 2:00 மணிக்கு மேல்)',
    recommendedTimeAdvice: 'குறைந்த கூட்டம் எதிர்பார்க்கப்படுகிறது. மதியம் 2:00 மணிக்கு மேல் வந்தால் காத்திருக்கும் நேரம் மிகக் குறைவாக இருக்கும்.',

    // Voice
    listen: '🔊 Listen (கேளுங்கள்)',
    listening: '🔊 ஒலிக்கிறது...',
    stopVoice: '⏹ நிறுத்து',
    speakQuery: '🎤 பேசி கேளுங்கள்',

    // Connectivity
    lastUpdated: 'Last updated: 10:30 AM',
    refresh: 'புதுப்பி',
    retry: 'மீண்டும் முயற்சி',
    workingOffline: 'சேமிக்கப்பட்ட தகவல் காட்டப்படுகிறது (இணையம் தேவையில்லை)',

    // SMS
    viewAsSms: 'View as SMS (குறுஞ்செய்தியாக காண்க)',
    smsFormat: 'சாதாரண போன் SMS வடிவம் (160 Chars)',
    copySms: 'SMS நகலெடு',
    copied: 'நகலெடுக்கப்பட்டது!',
    smsHeader: 'AGRIFLOW UPDATE',

    // Navigation
    navHome: 'முகப்பு',
    navBooking: 'எனது டோக்கன்',
    navAlerts: 'அறிவிப்புகள்',
    navHelp: 'உதவி',

    // Booking
    myBooking: 'MY BOOKING (எனது டோக்கன்)',
    tokenNumber: 'Token #1024',
    bookingStatus: 'Booking Status',
    confirmed: '✓ Confirmed',
    assignedSlot: 'Assigned Window: 11:30 AM – 12:30 PM',
    crop: 'Crop: Paddy (PR-126)',
    allocatedQuantity: 'Quantity: 45 Quintals',
    gateNumber: 'Gate 2 (Weighbridge West)',
    slotGuaranteedNote: 'நீங்கள் மதியம் 2:00 மணிக்கு மேல் வந்தாலும் உங்கள் டோக்கன் முறை ரத்தாகாது.',
    bookVisitBtn: 'புதிய நேரம் முன்பதிவு செய்',

    // Alerts
    notifications: 'நிலைய அறிவிப்புகள்',
    bookingStillValidNotice: 'உங்கள் பதிவு இன்று மாலை 7:00 மணி வரை முழுமையாக செல்லுபடியாகும்.',
    centreHoursNotice: 'கொள்முதல் நிலையம் இன்று மாலை 7:00 மணி வரை செயல்படும்.',

    // Help
    helpTitle: 'Help & Verified Guidance',
    helpSubtitle: 'விவசாயிகளுக்கான நேரடி வழிகாட்டுதல்',
    q1_when: 'When should I visit? (நான் எப்போது வர வேண்டும்?)',
    q1_when_ans: 'இப்போது அதிக கூட்டம் உள்ளதால், மதியம் 2:00 மணிக்கு மேல் வருவது நல்லது. உங்கள் டிராக்டர் காத்திருக்கும் நேரம் குறையும்.',
    q2_crowd: 'What is the crowd now? (தற்போதைய கூட்டம் எவ்வளவு?)',
    q2_crowd_ans: 'நிலையத்தில் தற்போது 23 வாகனங்கள் வரிசையில் உள்ளன. எடை மேடைகள் தொடர்ந்து செயல்பட்டு வருகின்றன.',
    q3_status: 'What is my booking status? (எனது டோக்கன் பதிவு நிலை என்ன?)',
    q3_status_ans: 'டோக்கன் #1024 உறுதி செய்யப்பட்டுள்ளது. மதியம் 2:00 மணிக்கு மேல் வந்தாலும் உங்கள் முறை பாதுகாக்கப்படும்.',
    q4_documents: 'What documents do I need? (என்னென்ன ஆவணங்கள் தேவை?)',
    q4_documents_ans: '1) ஆதார் அட்டை, 2) பட்டா/சிட்டா நில ஆவணம், 3) ஆதாருடன் இணைந்த வங்கிக் கணக்குப் புத்தகம், 4) டோக்கன் பதிவு எண்.',
    q4_doc_list: [
      'அசல் ஆதார் அட்டை',
      'பட்டா / சிட்டா நில உரிமை நகல்',
      'வங்கிக் கணக்குப் புத்தக நகல் (ஆதார் இணைக்கப்பட்டது)',
      'டோக்கன் #1024 SMS அல்லது ரசீது'
    ],
    q5_contact: 'Contact centre (நிலைய உதவி எண்)',
    callHelpdesk: 'உதவி எண்: 1800-180-1551',
    tollFreeNumber: '1800-180-1551',
    askPlaceholder: 'உங்கள் கேள்வியைத் தட்டச்சு செய்யவும்...',
    askBtn: 'கேள்',
    unavailableInfo: 'தகவல் தற்போது கிடைக்கப்பெறவில்லை. தயவுசெய்து நிலைய உதவி எண்ணை (1800-180-1551) தொடர்பு கொள்ளவும்.',

    // Assisted & IVR
    assistedMode: 'பொது சேவை மையம் (CSC) / குடும்ப உதவி',
    assistedModeDesc: 'ஸ்மார்ட்போன் இல்லாத பிற விவசாயிகளுக்கு உதவ டோக்கன் தேடலாம்',
    lookupToken: 'விவசாயி டோக்கன் சரிபார்ப்பு',
    enterTokenNumber: 'டோக்கன் எண் (எ.கா. 1008, 1024)',
    search: 'தேடு',
    printPass: 'அனுமதி சீட்டு அச்சிடு',
    farmerNameLabel: 'விவசாயி பெயர்',
    ivrButton: '📞 போன் அழைப்பு / IVR முறை',
    missedCallPrompt: 'மிஸ்டு கால் சேவை'
  },
  hi: {
    appTitle: 'AgriFlow',
    tagline: 'Know the crowd before it arrives.',
    greeting: 'नमस्ते 👋',
    centreName: 'सिंघानाल्लूर खरीद केंद्र (Singanallur Centre)',
    centreStatus: 'केंद्र की स्थिति',

    // 3 Simplified Crowd States
    goodTimeToVisit: 'LOW CROWD (कम भीड़)',
    goodTimeExplanation: 'भीड़ बहुत कम है। आप अभी खरीद केंद्र पर आ सकते हैं।',
    moderateCrowd: 'MODERATE CROWD (मध्यम भीड़)',
    moderateCrowdExplanation: 'प्रतीक्षा समय थोड़ा अधिक हो सकता है। बेहतर समय: दोपहर 2:00 बजे के बाद।',
    highCrowd: 'HIGH CROWD (भारी भीड़)',
    highCrowdExplanation: 'अभी अधिक किसानों के आने की संभावना है। यदि संभव हो, तो दोपहर 2:00 बजे के बाद आएं। आपकी बुकिंग मान्य रहेगी।',

    // 3 Core Questions
    whatIsHappening: 'अभी क्या स्थिति है?',
    whatShouldIDo: 'मुझे क्या करना चाहिए?',
    whenShouldICome: 'मुझे कब आना चाहिए?',

    // Metrics
    currentCrowdLabel: 'वर्तमान में ट्रॉलियां',
    farmersWaiting: 'किसान कतार में',
    expectedSoonLabel: 'अगले घंटे संभावित',
    recommendedTimeTitle: '🕒 BEST TIME TO VISIT (सर्वोत्तम समय)',
    recommendedTimeValue: 'After 2:00 PM (दोपहर 2:00 बजे के बाद)',
    recommendedTimeAdvice: 'कम भीड़ अपेक्षित है। दोपहर 2:00 बजे के बाद आने से ट्रॉली का इंतज़ार बहुत कम होगा।',

    // Voice
    listen: '🔊 Listen (सुनें)',
    listening: '🔊 आवाज़ चल रही है...',
    stopVoice: '⏹ रोकें',
    speakQuery: '🎤 बोलकर पूछें',

    // Connectivity
    lastUpdated: 'Last updated: 10:30 AM',
    refresh: 'रिफ्रेश करें',
    retry: 'पुनः प्रयास करें',
    workingOffline: 'सुरक्षित डेटा दिखाया जा रहा है (इंटरनेट आवश्यक नहीं)',

    // SMS
    viewAsSms: 'View as SMS (SMS के रूप में देखें)',
    smsFormat: 'साधारण मोबाइल SMS प्रारूप (160 Chars)',
    copySms: 'SMS कॉपी करें',
    copied: 'कॉपी हो गया!',
    smsHeader: 'AGRIFLOW UPDATE',

    // Navigation
    navHome: 'होम',
    navBooking: 'मेरी बुकिंग',
    navAlerts: 'सूचनाएं',
    navHelp: 'मदद',

    // Booking
    myBooking: 'MY BOOKING (मेरी बुकिंग)',
    tokenNumber: 'Token #1024',
    bookingStatus: 'Booking Status',
    confirmed: '✓ Confirmed',
    assignedSlot: 'Assigned Window: 11:30 AM – 12:30 PM',
    crop: 'Crop: Paddy (PR-126)',
    allocatedQuantity: 'Quantity: 45 Quintals',
    gateNumber: 'Gate 2 (Weighbridge West)',
    slotGuaranteedNote: 'दोपहर 2:00 के बाद आने पर भी आपका टोकन रद्द नहीं होगा।',
    bookVisitBtn: 'नया स्लॉट बुक करें',

    // Alerts
    notifications: 'केंद्र की जरूरी सूचनाएं',
    bookingStillValidNotice: 'आपकी बुकिंग आज सायं 7:00 बजे तक पूरी तरह मान्य व सुरक्षित है।',
    centreHoursNotice: 'खरीद केंद्र आज सायं 7:00 बजे तक खुला रहेगा।',

    // Help
    helpTitle: 'Help & Verified Guidance',
    helpSubtitle: 'किसानों के लिए सीधी सरकारी सहायता',
    q1_when: 'When should I visit? (मुझे कब आना चाहिए?)',
    q1_when_ans: 'दोपहर में भारी भीड़ संभावित है, अतः दोपहर 2:00 बजे के बाद आना सबसे अच्छा रहेगा।',
    q2_crowd: 'What is the crowd now? (वर्तमान में कितनी भीड़ है?)',
    q2_crowd_ans: 'केंद्र पर इस समय लगभग 23 ट्रॉलियां कतार में हैं और तौल कांटा तेजी से काम कर रहा है।',
    q3_status: 'What is my booking status? (मेरी बुकिंग की क्या स्थिति है?)',
    q3_status_ans: 'टोकन #1024 पुष्ट है। दोपहर 2:00 बजे के बाद आने पर भी आपका नंबर सुरक्षित रहेगा।',
    q4_documents: 'What documents do I need? (मुझे कौन से दस्तावेज चाहिए?)',
    q4_documents_ans: '1) आधार कार्ड, 2) जमीन की गिरदावरी/फर्द, 3) बैंक पासबुक, 4) टोकन पर्ची।',
    q4_doc_list: [
      'पंजीकृत किसान का मूल आधार कार्ड',
      'जमीन की फर्द / गिरदावरी प्रति',
      'आधार से लिंक बैंक पासबुक',
      'टोकन #1024 एसएमएस या पर्ची'
    ],
    q5_contact: 'Contact centre (हेल्पलाइन पर बात करें)',
    callHelpdesk: 'हेल्पलाइन: 1800-180-1551',
    tollFreeNumber: '1800-180-1551',
    askPlaceholder: 'अपना सवाल यहां लिखें...',
    askBtn: 'पूछें',
    unavailableInfo: 'यह जानकारी वर्तमान में उपलब्ध नहीं है। कृपया हेल्पलाइन 1800-180-1551 पर संपर्क करें।',

    // Assisted & IVR
    assistedMode: 'CSC केंद्र / परिवार सहायता मोड',
    assistedModeDesc: 'गांव के अन्य बुजुर्ग किसानों का टोकन चेक करने व पर्ची निकालने हेतु',
    lookupToken: 'किसान टोकन खोजें',
    enterTokenNumber: 'टोकन संख्या (उदा. 1008, 1024)',
    search: 'खोजें',
    printPass: 'गेट पास प्रिंट करें',
    farmerNameLabel: 'किसान का नाम',
    ivrButton: '📞 फोन कॉल / IVR मोड',
    missedCallPrompt: 'मिस्ड कॉल सेवा'
  },
  en: {
    appTitle: 'AgriFlow',
    tagline: 'Know the crowd before it arrives.',
    greeting: 'Welcome 👋',
    centreName: 'Singanallur Procurement Centre',
    centreStatus: 'Centre Status',

    // 3 Simplified Crowd States
    goodTimeToVisit: 'LOW CROWD',
    goodTimeExplanation: 'Crowd is currently low. You may visit now.',
    moderateCrowd: 'MODERATE CROWD',
    moderateCrowdExplanation: 'Waiting may be longer. Better time: After 2:00 PM.',
    highCrowd: 'HIGH CROWD',
    highCrowdExplanation: 'More farmers are currently at the centre. If possible, visit after 2:00 PM. Your booking remains active.',

    // 3 Core Questions
    whatIsHappening: 'What is happening?',
    whatShouldIDo: 'What should I do?',
    whenShouldICome: 'When should I come?',

    // Metrics
    currentCrowdLabel: 'Vehicles in Line',
    farmersWaiting: 'Farmers waiting',
    expectedSoonLabel: 'Expected in 1 Hour',
    recommendedTimeTitle: '🕒 BEST TIME TO VISIT',
    recommendedTimeValue: 'After 2:00 PM',
    recommendedTimeAdvice: 'Less crowd is expected. Arriving after 2:00 PM will significantly reduce waiting time.',

    // Voice
    listen: '🔊 Listen',
    listening: '🔊 Speaking...',
    stopVoice: '⏹ Stop',
    speakQuery: '🎤 Speak Question',

    // Connectivity
    lastUpdated: 'Last updated: 10:30 AM',
    refresh: 'Refresh',
    retry: 'Retry',
    workingOffline: 'Showing saved data (No internet required)',

    // SMS
    viewAsSms: 'View as SMS',
    smsFormat: 'Standard Cellular SMS (160 Chars)',
    copySms: 'Copy SMS',
    copied: 'Copied!',
    smsHeader: 'AGRIFLOW UPDATE',

    // Navigation
    navHome: 'Home',
    navBooking: 'My Booking',
    navAlerts: 'Alerts',
    navHelp: 'Help',

    // Booking
    myBooking: 'MY BOOKING',
    tokenNumber: 'Token #1024',
    bookingStatus: 'Booking Status',
    confirmed: '✓ Confirmed',
    assignedSlot: 'Assigned Window: 11:30 AM – 12:30 PM',
    crop: 'Crop: Paddy (PR-126)',
    allocatedQuantity: 'Quantity: 45 Quintals',
    gateNumber: 'Gate 2 (Weighbridge West)',
    slotGuaranteedNote: 'You will not lose your slot if you arrive in the recommended afternoon window.',
    bookVisitBtn: 'Book a Visit',

    // Alerts
    notifications: 'Centre Notifications',
    bookingStillValidNotice: 'Your booking remains active throughout the day until 7:00 PM.',
    centreHoursNotice: 'Procurement centre will remain open until 7:00 PM today.',

    // Help
    helpTitle: 'Help & Verified Guidance',
    helpSubtitle: 'Verified public service assistance for farmers',
    q1_when: 'When should I visit?',
    q1_when_ans: 'Due to peak mid-day arrival pressure, we recommend arriving after 2:00 PM to avoid waiting.',
    q2_crowd: 'What is the crowd now?',
    q2_crowd_ans: 'There are currently 23 trolleys in line. Weighbridge 1 is operating steadily.',
    q3_status: 'What is my booking status?',
    q3_status_ans: 'Token #1024 is Confirmed. Even if you arrive after 2:00 PM, your priority is fully protected.',
    q4_documents: 'What documents do I need?',
    q4_documents_ans: '1) Aadhaar Card, 2) Land Record / Girdawari copy, 3) Bank passbook, 4) Token SMS.',
    q4_doc_list: [
      'Original Aadhaar Card of registered farmer',
      'Pattadar Passbook / Land Record (Girdawari) copy',
      'Aadhaar-seeded Bank Account Passbook copy',
      'Slot Booking Token printout or active SMS confirmation'
    ],
    q5_contact: 'Contact centre',
    callHelpdesk: 'Toll-Free Helpline: 1800-180-1551',
    tollFreeNumber: '1800-180-1551',
    askPlaceholder: 'Type your question...',
    askBtn: 'Ask',
    unavailableInfo: 'Information is not currently available. Please contact the procurement centre helpline at 1800-180-1551.',

    // Assisted & IVR
    assistedMode: 'Assisted Access (CSC / Family Mode)',
    assistedModeDesc: 'Assisting other village farmers without smartphones',
    lookupToken: 'Check Farmer Token',
    enterTokenNumber: 'Token Number (e.g. 1008, 1024)',
    search: 'Find Token',
    printPass: 'Print Gate Pass',
    farmerNameLabel: 'Farmer Name',
    ivrButton: '📞 Phone Call / IVR Mode',
    missedCallPrompt: 'Missed Call Service'
  }
};
