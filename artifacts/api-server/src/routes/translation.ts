import express from 'express';
import { Translation } from '../models/Translation.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for translations
const translationRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 translations per minute
  message: { error: 'Rate limit exceeded. Please wait before making more translation requests.' }
});

// Simple mock translation service (replace with real AI service)
const mockTranslationService = {
  translate: async (text: string, sourceLang: string, targetLang: string) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
    
    // Mock translations for demo
    const translations: Record<string, Record<string, string>> = {
      'hi': {
        'en': 'Hello! How are you?',
        'te': 'హలో! మీరు ఎలా ఉన్నారు?',
        'ta': 'வணக்கம்! நீங்கள் எப்படி இருக்கிறீர்கள்?'
      },
      'en': {
        'hi': 'नमस्ते! आप कैसे हैं?',
        'te': 'హలో! మీరు ఎలా ఉన్నారు?',
        'ta': 'வணக்கம்! நீங்கள் எப்படி இருக்கிறீர்கள்?'
      }
    };

    const result = translations[sourceLang]?.[targetLang] || 
                  `[Translated from ${sourceLang} to ${targetLang}]: ${text}`;
    
    return {
      translatedText: result,
      confidence: 0.95 + Math.random() * 0.04, // 95-99% confidence
      processingTime: Math.floor(200 + Math.random() * 300)
    };
  }
};

// POST /api/translate
router.post('/', translationRateLimit, async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage, sessionId } = req.body;

    // Validation
    if (!text || !sourceLanguage || !targetLanguage) {
      return res.status(400).json({
        error: 'Text, sourceLanguage, and targetLanguage are required'
      });
    }

    if (sourceLanguage === targetLanguage) {
      return res.status(400).json({
        error: 'Source and target languages cannot be the same'
      });
    }

    const supportedLanguages = ['hi', 'en', 'te', 'ta', 'kn', 'bn', 'mr', 'gu', 'pa', 'ml'];
    if (!supportedLanguages.includes(sourceLanguage) || !supportedLanguages.includes(targetLanguage)) {
      return res.status(400).json({
        error: 'Unsupported language pair'
      });
    }

    // Get translation from service
    const startTime = Date.now();
    const result = await mockTranslationService.translate(text, sourceLanguage, targetLanguage);
    const actualProcessingTime = Date.now() - startTime;

    // Save to database
    const translation = new Translation({
      sourceText: text.trim(),
      translatedText: result.translatedText,
      sourceLanguage,
      targetLanguage,
      sessionId: sessionId || undefined,
      confidence: result.confidence,
      processingTime: actualProcessingTime
    });

    await translation.save();

    res.json({
      success: true,
      translation: {
        id: translation._id,
        sourceText: translation.sourceText,
        translatedText: translation.translatedText,
        sourceLanguage: translation.sourceLanguage,
        targetLanguage: translation.targetLanguage,
        confidence: translation.confidence,
        processingTime: translation.processingTime
      }
    });

  } catch (error) {
    console.error('Translation error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        error: 'Validation error',
        details: errors
      });
    }

    res.status(500).json({
      error: 'Translation service temporarily unavailable. Please try again.'
    });
  }
});

// GET /api/translate/history
router.get('/history', async (req, res) => {
  try {
    const { sessionId, limit = 20 } = req.query;
    
    const query = sessionId ? { sessionId } : {};
    const translations = await Translation.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));

    res.json({
      success: true,
      translations: translations.map(t => ({
        id: t._id,
        sourceText: t.sourceText,
        translatedText: t.translatedText,
        sourceLanguage: t.sourceLanguage,
        targetLanguage: t.targetLanguage,
        confidence: t.confidence,
        processingTime: t.processingTime,
        createdAt: t.createdAt
      }))
    });
  } catch (error) {
    console.error('Translation history error:', error);
    res.status(500).json({
      error: 'Failed to retrieve translation history'
    });
  }
});

// GET /api/translate/stats
router.get('/stats', async (req, res) => {
  try {
    const [totalTranslations, languagePairs, avgProcessingTime] = await Promise.all([
      Translation.countDocuments(),
      Translation.aggregate([
        {
          $group: {
            _id: { source: '$sourceLanguage', target: '$targetLanguage' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Translation.aggregate([
        {
          $group: {
            _id: null,
            avgTime: { $avg: '$processingTime' },
            avgConfidence: { $avg: '$confidence' }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalTranslations,
        popularLanguagePairs: languagePairs,
        averageProcessingTime: Math.round(avgProcessingTime[0]?.avgTime || 0),
        averageConfidence: Math.round((avgProcessingTime[0]?.avgConfidence || 0) * 100)
      }
    });
  } catch (error) {
    console.error('Translation stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve translation statistics'
    });
  }
});

export default router;