import mongoose, { Document, Schema } from 'mongoose';

export interface ITranslation extends Document {
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  userId?: string;
  sessionId?: string;
  confidence: number;
  processingTime: number;
  createdAt: Date;
}

const TranslationSchema: Schema = new Schema({
  sourceText: {
    type: String,
    required: [true, 'Source text is required'],
    trim: true,
    maxlength: [2000, 'Source text cannot be more than 2000 characters']
  },
  translatedText: {
    type: String,
    required: [true, 'Translated text is required'],
    trim: true,
    maxlength: [2000, 'Translated text cannot be more than 2000 characters']
  },
  sourceLanguage: {
    type: String,
    required: [true, 'Source language is required'],
    enum: ['hi', 'en', 'te', 'ta', 'kn', 'bn', 'mr', 'gu', 'pa', 'ml']
  },
  targetLanguage: {
    type: String,
    required: [true, 'Target language is required'],
    enum: ['hi', 'en', 'te', 'ta', 'kn', 'bn', 'mr', 'gu', 'pa', 'ml']
  },
  userId: {
    type: String,
    required: false
  },
  sessionId: {
    type: String,
    required: false,
    index: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  processingTime: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
TranslationSchema.index({ sourceLanguage: 1, targetLanguage: 1 });
TranslationSchema.index({ createdAt: -1 });
TranslationSchema.index({ userId: 1, createdAt: -1 });

export const Translation = mongoose.model<ITranslation>('Translation', TranslationSchema);