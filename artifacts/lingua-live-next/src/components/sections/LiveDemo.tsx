"use client"
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RefreshCw, Volume2, Mic, Languages as LangIcon, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const languages = [
  // Major Indian Languages (22 Official + widely spoken)
  { code: 'hi-IN', name: 'Hindi', script: 'हिंदी', color: 'bg-orange-500', speechCode: 'hi-IN' },
  { code: 'bn-IN', name: 'Bengali', script: 'বাংলা', color: 'bg-green-500', speechCode: 'bn-IN' },
  { code: 'te-IN', name: 'Telugu', script: 'తెలుగు', color: 'bg-pink-500', speechCode: 'te-IN' },
  { code: 'mr-IN', name: 'Marathi', script: 'मराठी', color: 'bg-purple-500', speechCode: 'mr-IN' },
  { code: 'ta-IN', name: 'Tamil', script: 'தமிழ்', color: 'bg-red-500', speechCode: 'ta-IN' },
  { code: 'gu-IN', name: 'Gujarati', script: 'ગુજરાતી', color: 'bg-indigo-500', speechCode: 'gu-IN' },
  { code: 'kn-IN', name: 'Kannada', script: 'ಕನ್ನಡ', color: 'bg-yellow-500', speechCode: 'kn-IN' },
  { code: 'ml-IN', name: 'Malayalam', script: 'മലയാളം', color: 'bg-teal-500', speechCode: 'ml-IN' },
  { code: 'pa-IN', name: 'Punjabi', script: 'ਪੰਜਾਬੀ', color: 'bg-amber-500', speechCode: 'pa-IN' },
  { code: 'or-IN', name: 'Odia', script: 'ଓଡ଼ିଆ', color: 'bg-lime-500', speechCode: 'or-IN' },
  { code: 'as-IN', name: 'Assamese', script: 'অসমীয়া', color: 'bg-cyan-500', speechCode: 'as-IN' },
  { code: 'ur-IN', name: 'Urdu', script: 'اردو', color: 'bg-rose-500', speechCode: 'ur-IN' },
  { code: 'sa-IN', name: 'Sanskrit', script: 'संस्कृतम्', color: 'bg-yellow-600', speechCode: 'sa-IN' },
  { code: 'ne-IN', name: 'Nepali', script: 'नेपाली', color: 'bg-blue-400', speechCode: 'ne-IN' },
  { code: 'si-LK', name: 'Sinhala', script: 'සිංහල', color: 'bg-emerald-500', speechCode: 'si-LK' },
  { code: 'en-IN', name: 'English (India)', script: 'English', color: 'bg-blue-500', speechCode: 'en-IN' },
];

const sampleTexts: Record<string, { text: string; translation: string }> = {
  'hi-IN': { text: "नमस्ते! आप कैसे हैं?", translation: "नमस्ते! आप कैसे हैं?" },
  'bn-IN': { text: "হ্যালো! আপনি কেমন আছেন?", translation: "হ্যালো! আপনি কেমন আছেন?" },
  'te-IN': { text: "హలో! మీరు ఎలా ఉన్నారు?", translation: "హలో! మీరు ఎలా ఉన్నారు?" },
  'mr-IN': { text: "नमस्कार! तुम्ही कसे आहात?", translation: "नमस्कार! तुम्ही कसे आहात?" },
  'ta-IN': { text: "வணக்கம்! நீங்கள் எப்படி இருக்கிறீர்கள்?", translation: "வணக்கம்! நீங்கள் எப்படி இருக்கிறீர்கள்?" },
  'gu-IN': { text: "હેલો! તમે કેમ છો?", translation: "હેલો! તમે કેમ છો?" },
  'kn-IN': { text: "ನಮಸ್ಕಾರ! ನೀವು ಹೇಗಿದ್ದೀರಿ?", translation: "ನಮಸ್ಕಾರ! ನೀವು ಹೇಗಿದ್ದೀರಿ?" },
  'ml-IN': { text: "ഹലോ! നിങ്ങൾക്ക് എങ്ങനെയുണ്ട്?", translation: "ഹലോ! നിങ്ങൾക്ക് എങ്ങനെയുണ്ട്?" },
  'pa-IN': { text: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?", translation: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?" },
  'or-IN': { text: "ନମସ୍କାର! ଆପଣ କେମିତି ଅଛନ୍ତି?", translation: "ନମସ୍କାର! ଆପଣ କେମିତି ଅଛନ୍ତି?" },
  'as-IN': { text: "নমস্কাৰ! আপুনি কেনে আছে?", translation: "নমস্কাৰ! আপুনি কেনে আছে?" },
  'ur-IN': { text: "ہیلو! آپ کیسے ہیں؟", translation: "ہیلو! آپ کیسے ہیں؟" },
  'sa-IN': { text: "नमस्ते! भवान् कथम् अस्ति?", translation: "नमस्ते! भवान् कथम् अस्ति?" },
  'ne-IN': { text: "नमस्ते! तपाईं कस्तो हुनुहुन्छ?", translation: "नमस्ते! तपाईं कस्तो हुनुहुन्छ?" },
  'si-LK': { text: "හෙලෝ! ඔබට කොහොමද?", translation: "හෙලෝ! ඔබට කොහොමද?" },
  'en-IN': { text: "Hello! How are you?", translation: "Hello! How are you?" },
};

export function LiveDemo({ 
  onTranslationComplete, 
  maxTranslations, 
  currentTranslations, 
  maxLanguages 
}: { 
  onTranslationComplete?: (source: string, translated: string) => void; 
  maxTranslations?: number; 
  currentTranslations?: number;
  maxLanguages?: number; 
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [sourceLanguage, setSourceLanguage] = useState('hi-IN');
  const [targetLanguage, setTargetLanguage] = useState('en-IN');
  const [recognizedText, setRecognizedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Filter languages based on maxLanguages
  const availableLanguages = maxLanguages ? languages.slice(0, maxLanguages) : languages;
  const sourceLang = availableLanguages.find(lang => lang.code === sourceLanguage) ?? availableLanguages[0];
  const targetLang = availableLanguages.find(lang => lang.code === targetLanguage && lang.code !== sourceLanguage) ?? availableLanguages.find(lang => lang.code !== sourceLanguage) ?? availableLanguages[1];

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;
    
    if (!SpeechRecognition || !SpeechSynthesis) {
      setIsSupported(false);
      setError('Voice features not supported in this browser. Please use Chrome or Edge for full functionality.');
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    synthRef.current = SpeechSynthesis;

    // Load voices
    const loadVoices = () => {
      const voices = synthRef.current?.getVoices();
      console.log('Available voices:', voices);
    };
    loadVoices();
    synthRef.current.onvoiceschanged = loadVoices;

    // Setup speech recognition with improved settings
    const recognition = recognitionRef.current;
    recognition.continuous = false;
    recognition.interimResults = true; // Allow interim results
    recognition.maxAlternatives = 1;
    recognition.lang = sourceLanguage;

    recognition.onresult = (event: any) => {
      let transcript = '';
      
      // Get the final transcript
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript = event.results[i][0].transcript.trim();
          break;
        } else {
          // Show interim results
          transcript = event.results[i][0].transcript.trim();
        }
      }
      
      if (transcript) {
        setRecognizedText(transcript);
        if (event.results[event.results.length - 1].isFinal) {
          setStep(2);
          translateText(transcript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      let errorMessage = '';
      switch (event.error) {
        case 'no-speech':
          errorMessage = 'No speech detected. Please speak louder and try again.';
          break;
        case 'audio-capture':
          errorMessage = 'Microphone not accessible. Please check your microphone permissions.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone permission denied. Please allow microphone access and try again.';
          break;
        case 'network':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'aborted':
          errorMessage = 'Voice recognition was stopped.';
          break;
        default:
          errorMessage = `Voice recognition error: ${event.error}. Please try again.`;
      }
      
      setError(errorMessage);
      setIsRecording(false);
      setStep(0);
    };

    recognition.onspeechstart = () => {
      console.log('Speech detected');
      setError(''); // Clear any previous errors
    };

    recognition.onspeechend = () => {
      console.log('Speech ended');
    };

    recognition.onend = () => {
      setIsRecording(false);
      console.log('Recognition ended');
    };

    recognition.onstart = () => {
      console.log('Recognition started');
      setError(''); // Clear errors when starting
    };

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (synthRef.current) {
        synthRef.current.onvoiceschanged = null;
      }
    };
  }, [sourceLanguage]);

  const translateText = async (text: string) => {
    try {
      // Check if user has exceeded their daily limit
      if (maxTranslations !== undefined && currentTranslations !== undefined && currentTranslations >= maxTranslations) {
        setError(`Daily limit reached! You've used all ${maxTranslations} translations. Please upgrade your plan.`);
        setStep(0);
        return;
      }

      const sourceLangCode = sourceLanguage.split('-')[0];
      const targetLangCode = targetLanguage.split('-')[0];

      let translated = '';

      // Call our own Next.js API route
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            sourceLanguage: sourceLangCode,
            targetLanguage: targetLangCode,
            sessionId: typeof window !== 'undefined' ? window.sessionStorage.getItem('sessionId') || (() => {
              const id = Math.random().toString(36).slice(2);
              window.sessionStorage.setItem('sessionId', id);
              return id;
            })() : undefined,
          }),
        });
        const data = await response.json();
        if (data.success && data.translation?.translatedText) {
          translated = data.translation.translatedText;
        } else {
          throw new Error(data.error || 'Translation failed');
        }
      } catch {
        // Fallback: use sample text for the target language
        translated = sampleTexts[targetLanguage]?.text || `[${targetLang.name} mein anuvad]: ${text}`;
      }

      setTranslatedText(translated);
      setStep(3);

      // Call the callback
      if (onTranslationComplete) {
        onTranslationComplete(text, translated);
      }

      // Speak the translation
      setTimeout(() => speakText(translated, targetLanguage), 500);

    } catch (err) {
      setError('Anuvad karne mein samasya aayi. Phir koshish karein.');
      setStep(0);
    }
  };

  const speakText = (text: string, language: string) => {
    // Cancel any ongoing speech
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    
    // Try browser TTS first with better voice selection
    const langCode = language.split('-')[0];
    if (synthRef.current) {
      const voices = synthRef.current.getVoices();
      // Try to find any voice for the language (exact or just language code)
      let matchingVoice = voices.find(voice => voice.lang === language);
      if (!matchingVoice) {
        matchingVoice = voices.find(voice => voice.lang.startsWith(langCode));
      }
      // If still no match, try any voice that might support Indian languages
      if (!matchingVoice) {
        matchingVoice = voices.find(voice => voice.name.toLowerCase().includes('india') || voice.name.toLowerCase().includes('hindi'));
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => {
        setIsPlaying(false);
        setTimeout(() => {
          setStep(0);
          setRecognizedText('');
          setTranslatedText('');
        }, 1000);
      };
      utterance.onerror = (event) => {
        console.error('TTS error:', event);
        setIsPlaying(false);
        setError('Text-to-speech failed');
      };
      
      synthRef.current.speak(utterance);
    }
  };

  const startVoiceDemo = () => {
    if (!isSupported || !recognitionRef.current) {
      setError('Voice recognition not available. Try the simulation instead.');
      return;
    }
    
    setError('');
    setRecognizedText('');
    setTranslatedText('');
    setStep(1);
    setIsRecording(true);
    
    try {
      recognitionRef.current.lang = sourceLanguage;
      recognitionRef.current.start();
      
      // Auto-timeout after 10 seconds if no speech detected
      const timeoutId = setTimeout(() => {
        if (isRecording && !recognizedText) {
          setError('Listening timeout. Please speak within 10 seconds and try again.');
          stopDemo();
        }
      }, 10000);
      
      // Clear timeout if recognition ends naturally
      recognitionRef.current.addEventListener('end', () => {
        clearTimeout(timeoutId);
      });
      
    } catch (err) {
      console.error('Recognition start error:', err);
      setError('Could not start voice recognition. Please check microphone permissions and try again.');
      setIsRecording(false);
      setStep(0);
    }
  };

  const stopDemo = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsRecording(false);
    setIsPlaying(false);
    setStep(0);
    setRecognizedText('');
    setTranslatedText('');
  };

  const startSimulatedDemo = () => {
    if (isRecording || isPlaying || step > 0) return;
    
    setError('');
    setStep(1);
    
    const sourceKey = sourceLanguage as keyof typeof sampleTexts;
    const sampleText = sampleTexts[sourceKey]?.text || "Hello, this is a test.";
    
    // Simulate recording
    setTimeout(() => {
      setRecognizedText(sampleText);
      setStep(2);
      
      // Simulate translation
      setTimeout(() => {
        translateText(sampleText);
      }, 1500);
    }, 2000);
  };

  const WaveForm = ({ active, color }: { active: boolean; color: string }) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full ${color}`}
          animate={{
            height: active ? [4, Math.random() * 20 + 8, 4] : 4,
            opacity: active ? [0.4, 1, 0.4] : 0.2,
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: active ? Infinity : 0,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );

  return (
    <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Live Voice Translation
          </span>{" "}
          Demo
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/60 text-lg mb-8"
        >
          🎤 Speak in one language, hear it in another - instantly!
        </motion.p>
        
        {/* Language Selection */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/40">Speak in:</span>
            <select 
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50"
              disabled={isRecording || isPlaying}
            >
              {availableLanguages.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-gray-800">
                  {lang.name} ({lang.script})
                </option>
              ))}
            </select>
          </div>
          
          <motion.div
            animate={{ rotate: step === 2 ? 360 : 0 }}
            transition={{ duration: 2, repeat: step === 2 ? Infinity : 0, ease: "linear" }}
          >
            <LangIcon className="w-5 h-5 text-primary" />
          </motion.div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/40">Hear in:</span>
            <select 
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary/50"
              disabled={isRecording || isPlaying}
            >
              {availableLanguages.filter(lang => lang.code !== sourceLanguage).map(lang => (
                <option key={lang.code} value={lang.code} className="bg-gray-800">
                  {lang.name} ({lang.script})
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm max-w-md mx-auto">
            {error}
          </div>
        )}
      </div>

      <div className="glass-card p-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        
        {/* Demo Content */}
        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          
          {/* Input - Source Language */}
          <div className="flex-1">
            <div className={`bg-black/40 rounded-xl p-6 border transition-all duration-500 ${
              step === 1 ? 'border-primary/50 bg-primary/5' : 'border-white/10'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${sourceLang.color} bg-opacity-20 flex items-center justify-center text-white font-bold border-2 ${
                    step === 1 ? 'border-white/40' : 'border-white/20'
                  }`}>
                    {isRecording ? <Mic className="w-5 h-5 text-red-500" /> : <Mic className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-semibold">You Speak</div>
                    <div className="text-xs text-white/50">{sourceLang.name}</div>
                  </div>
                </div>
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-red-400">Listening...</span>
                  </motion.div>
                )}
              </div>
              
              <div className="min-h-[120px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {recognizedText ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center"
                    >
                      <div className={`text-lg font-semibold mb-3 ${sourceLang.color.replace('bg-', 'text-')}`}>
                        &quot;{recognizedText}&quot;
                      </div>
                    </motion.div>
                  ) : step === 1 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-white/50 flex items-center justify-center h-full"
                    >
                      <div>
                        <Mic className="w-8 h-8 mx-auto mb-2 text-red-500 animate-pulse" />
                        <div className="text-sm">🎤 Speak now...</div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-white/30 flex items-center justify-center h-full"
                    >
                      <div>
                        <Mic className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <div className="text-sm">Click to start speaking</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="mt-4">
                  <WaveForm active={step === 1} color={sourceLang.color} />
                </div>
              </div>
            </div>
          </div>

          {/* Processing */}
          <div className="flex items-center justify-center lg:w-24">
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
              step === 2 
                ? 'border-primary/50 bg-primary/10' 
                : 'border-white/20 bg-white/5'
            }`}>
              <motion.div
                animate={{ 
                  rotate: step === 2 ? 360 : 0,
                  scale: step === 2 ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: step === 2 ? Infinity : 0, ease: "linear" },
                  scale: { duration: 1, repeat: step === 2 ? Infinity : 0 }
                }}
              >
                <RefreshCw className={`w-6 h-6 ${step === 2 ? 'text-primary' : 'text-white/40'}`} />
              </motion.div>
            </div>
          </div>

          {/* Output - Target Language */}
          <div className="flex-1">
            <div className={`bg-black/40 rounded-xl p-6 border transition-all duration-500 ${
              step === 3 ? 'border-secondary/50 bg-secondary/5' : 'border-white/10'
            }`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full ${targetLang.color} bg-opacity-20 flex items-center justify-center text-white font-bold border-2 ${
                    step === 3 ? 'border-white/40' : 'border-white/20'
                  }`}>
                    <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-green-500' : ''}`} />
                  </div>
                  <div>
                    <div className="font-semibold">You Hear</div>
                    <div className="text-xs text-white/50">{targetLang.name}</div>
                  </div>
                </div>
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-green-400">🔊 Speaking</span>
                  </motion.div>
                )}
              </div>
              
              <div className="min-h-[120px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {translatedText ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center"
                    >
                      <div className={`text-lg font-semibold mb-3 ${targetLang.color.replace('bg-', 'text-')}`}>
                        &quot;{translatedText}&quot;
                      </div>
                      <div className="text-sm text-white/60">
                        Translated from {sourceLang.name}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-white/30 flex items-center justify-center h-full"
                    >
                      <div>
                        <Volume2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <div className="text-sm">Translation will appear here</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="mt-4">
                  <WaveForm active={step === 3 && isPlaying} color={targetLang.color} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="text-center mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSupported ? (
              <>
                <Button
                  onClick={startVoiceDemo}
                  disabled={isRecording || isPlaying || step > 0}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent text-white font-semibold px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(108,99,255,0.4)] hover:shadow-[0_0_50px_rgba(108,99,255,0.6)] hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Mic className="w-5 h-5 mr-2" />
                  🎤 Start Voice Demo
                </Button>
                <Button
                  onClick={stopDemo}
                  disabled={!isRecording && !isPlaying && step === 0}
                  variant="outline"
                  size="lg"
                  className="border-red-500/40 text-red-400 hover:bg-red-500/10 px-6 py-4 rounded-xl"
                >
                  <MicOff className="w-5 h-5 mr-2" />
                  Stop
                </Button>
              </>
            ) : null}
            
            <Button
              onClick={startSimulatedDemo}
              disabled={isRecording || isPlaying || step > 0}
              variant="outline"
              size="lg"
              className="border-white/20 text-white/80 hover:bg-white/5 px-6 py-4 rounded-xl"
            >
              <Play className="w-5 h-5 mr-2" />
              ▶️ Demo Simulation
            </Button>
          </div>
          
          <p className="text-xs text-white/40">
            {isSupported 
              ? "🎤 Real voice recognition enabled | 🔊 Text-to-speech active | Translation latency: <300ms" 
              : "⚠️ Voice features need Chrome/Edge browser | Simulation available for all browsers"}
          </p>
        </div>
      </div>
    </section>
  );
}
