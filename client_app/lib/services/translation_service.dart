import 'package:get/get_connect.dart';
import '../utility/constants.dart';
import '../models/api_response.dart';

class TranslationService {
  final String baseUrl = MAIN_URL;

  // Translate a single text
  Future<String> translateText(String text, String targetLanguage) async {
    try {
      if (targetLanguage == 'en' || text.isEmpty) {
        return text;
      }

      final response = await GetConnect().post(
        '$baseUrl/translate',
        {
          'text': text,
          'targetLanguage': targetLanguage,
        },
      );

      if (response.statusCode == 200) {
        final apiResponse = ApiResponse<Map<String, dynamic>>.fromJson(
          response.body,
          (json) => json as Map<String, dynamic>,
        );

        if (apiResponse.success && apiResponse.data != null) {
          return apiResponse.data!['translatedText'] ?? text;
        }
      }
    } catch (e) {
      print('Translation error: $e');
    }
    
    // Return original text if translation fails
    return text;
  }

  // Translate multiple texts at once
  Future<List<String>> translateTexts(List<String> texts, String targetLanguage) async {
    try {
      if (targetLanguage == 'en' || texts.isEmpty) {
        return texts;
      }

      final response = await GetConnect().post(
        '$baseUrl/translate/batch',
        {
          'texts': texts,
          'targetLanguage': targetLanguage,
        },
      );

      if (response.statusCode == 200) {
        final apiResponse = ApiResponse<Map<String, dynamic>>.fromJson(
          response.body,
          (json) => json as Map<String, dynamic>,
        );

        if (apiResponse.success && apiResponse.data != null) {
          final translatedTexts = (apiResponse.data!['translatedTexts'] as List?)
              ?.map((e) => e.toString())
              .toList() ?? texts;
          return translatedTexts;
        }
      }
    } catch (e) {
      print('Batch translation error: $e');
    }
    
    // Return original texts if translation fails
    return texts;
  }
}

