/**
 * AgriFlow Voice Communication Service
 * Converts critical notifications to speech in English, Tamil, and Hindi.
 * Formats tokens, dates, and times clearly with human-friendly fallback.
 */

import { LanguageCode } from '../../types/procurement';
import { voiceService } from '../voiceService';

export class VoiceCommunicationService {
  /**
   * Generates localized speech for Turn Approaching alert
   */
  public speakTurnApproaching(token = '1024', lang: LanguageCode = 'ta'): void {
    let text = '';
    if (lang === 'ta') {
      text = 'வணக்கம் சுகவிந்தர் சர்மா. உங்கள் டோக்கன் எண் ' + token + '. வரிசையில் உங்கள் முறை நெருங்கிவிட்டது. கேட் இரண்டுக்கு வரவும்.';
    } else if (lang === 'hi') {
      text = 'नमस्ते सुखविंदर शर्मा। आपका टोकन नंबर ' + token + ' है। कतार में आपका नंबर आ रहा है। कृपया गेट नंबर दो पर पहुंचे।';
    } else {
      text = 'Hello Sukhwinder Sharma. Your token number is ' + token + '. Your turn is approaching. Please proceed to Gate number 2.';
    }

    voiceService.speak(text, lang);
  }

  /**
   * Localized speech for Delay Advisory
   */
  public speakDelayAdvisory(delayMinutes = 25, lang: LanguageCode = 'ta'): void {
    let text = '';
    if (lang === 'ta') {
      text = 'முக்கிய தகவல். கொள்முதல் நிலையத்தில் ' + delayMinutes + ' நிமிடங்கள் தாமதம் ஏற்பட்டுள்ளது. உங்கள் பதிவு பாதுகாப்பாக உள்ளது.';
    } else if (lang === 'hi') {
      text = 'आवश्यक सूचना। खरीद केंद्र पर ' + delayMinutes + ' मिनट की देरी है। आपका टोकन सुरक्षित है।';
    } else {
      text = 'Operational advisory. The procurement centre has a ' + delayMinutes + ' minute delay. Your booking remains active and guaranteed.';
    }

    voiceService.speak(text, lang);
  }

  public stop(): void {
    voiceService.stop();
  }

  public isSpeaking(): boolean {
    return voiceService.isSpeaking();
  }
}

export const voiceCommunicationService = new VoiceCommunicationService();
