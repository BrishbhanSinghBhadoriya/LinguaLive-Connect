import mongoose, { Document, Schema } from "mongoose";

export interface ITranslation extends Document {
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  sessionId?: string;
  confidence: number;
  processingTime: number;
  createdAt: Date;
}

const supportedLangs = ["hi", "en", "te", "ta", "kn", "bn", "mr", "gu", "pa", "ml", "or", "as", "ur", "sa", "ne", "si"];

const TranslationSchema: Schema = new Schema(
  {
    sourceText: { type: String, required: true, trim: true, maxlength: 2000 },
    translatedText: { type: String, required: true, trim: true, maxlength: 2000 },
    sourceLanguage: { type: String, required: true, enum: supportedLangs },
    targetLanguage: { type: String, required: true, enum: supportedLangs },
    sessionId: { type: String, index: true },
    confidence: { type: Number, required: true, min: 0, max: 1 },
    processingTime: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

TranslationSchema.index({ sourceLanguage: 1, targetLanguage: 1 });
TranslationSchema.index({ createdAt: -1 });

export const Translation =
  mongoose.models.Translation ||
  mongoose.model<ITranslation>("Translation", TranslationSchema);
