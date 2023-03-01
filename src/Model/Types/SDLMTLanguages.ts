export default interface SDLMTLanguages {
  languagePairs: SDLMTLanguagePair[];
}

interface SDLMTLanguagePair {
  languagePairId: string;
  sourceLanguage: string;
  sourceLanguageId: string;
  targetLanguage: string;
  targetLanguageId: string;
  domain: string;
  platform: string;
  technology: string;
  version: string;
  adaptable: boolean;
}
