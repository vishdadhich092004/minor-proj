import 'package:flutter/material.dart';
import 'package:get_storage/get_storage.dart';
import '../services/translation_service.dart';

enum AppLanguage {
  english('en', 'English', '🇬🇧'),
  hindi('hi', 'हिंदी', '🇮🇳'),
  bengali('bn', 'বাংলা', '🇧🇩');

  final String code;
  final String name;
  final String flag;

  const AppLanguage(this.code, this.name, this.flag);
}

class LanguageProvider extends ChangeNotifier {
  final GetStorage _storage = GetStorage();
  final TranslationService _translationService = TranslationService();
  
  static const String _languageKey = 'selected_language';
  
  AppLanguage _currentLanguage = AppLanguage.english;
  Map<String, String> _translationCache = {};

  LanguageProvider() {
    _loadSavedLanguage();
  }

  AppLanguage get currentLanguage => _currentLanguage;
  String get currentLanguageCode => _currentLanguage.code;

  void _loadSavedLanguage() {
    final savedCode = _storage.read(_languageKey);
    if (savedCode != null) {
      _currentLanguage = AppLanguage.values.firstWhere(
        (lang) => lang.code == savedCode,
        orElse: () => AppLanguage.english,
      );
    }
    notifyListeners();
  }

  Future<void> setLanguage(AppLanguage language) async {
    if (_currentLanguage == language) return;
    
    _currentLanguage = language;
    _storage.write(_languageKey, language.code);
    _translationCache.clear(); // Clear cache when language changes
    notifyListeners();
  }

  // Translate text with caching
  Future<String> translate(String text) async {
    if (_currentLanguage == AppLanguage.english || text.isEmpty) {
      return text;
    }

    // Check cache first
    final cacheKey = '${_currentLanguage.code}_$text';
    if (_translationCache.containsKey(cacheKey)) {
      return _translationCache[cacheKey]!;
    }

    // Translate and cache
    final translated = await _translationService.translateText(text, _currentLanguage.code);
    _translationCache[cacheKey] = translated;
    return translated;
  }

  // Translate multiple texts
  Future<List<String>> translateList(List<String> texts) async {
    if (_currentLanguage == AppLanguage.english || texts.isEmpty) {
      return texts;
    }

    return await _translationService.translateTexts(texts, _currentLanguage.code);
  }

  // Clear translation cache
  void clearCache() {
    _translationCache.clear();
  }
}

