import 'package:get/get_connect.dart';
import '../utility/constants.dart';

class TranslationService {
  final String baseUrl = MAIN_URL;

  Future<String> translateText(String text, String targetLanguage) async {
    try {
      if (targetLanguage == 'en' || text.isEmpty) {
        return text;
      }

      final response = await GetConnect().post('$baseUrl/translate', {
        'text': text,
        'targetLanguage': targetLanguage,
      });

      if (response.isOk && response.body['success']) {
        return response.body['data']?['translatedText'] ?? text;
      } else {
        print(
          'Translation API error: ${response.body?['message'] ?? response.statusText}',
        );
        return text;
      }
    } catch (e) {
      print('Error translating text: $e');
      return text;
    }
  }

  Future<List<String>> translateTexts(
    List<String> texts,
    String targetLanguage,
  ) async {
    try {
      if (targetLanguage == 'en' || texts.isEmpty) {
        return texts;
      }

      final response = await GetConnect().post('$baseUrl/translate/batch', {
        'texts': texts,
        'targetLanguage': targetLanguage,
      });

      if (response.isOk && response.body['success']) {
        final translatedTexts = response.body['data']?['translatedTexts'];
        if (translatedTexts != null) {
          return List<String>.from(translatedTexts);
        }
        return texts;
      } else {
        print(
          'Batch Translation API error: ${response.body?['message'] ?? response.statusText}',
        );
        return texts;
      }
    } catch (e) {
      print('Error translating batch texts: $e');
      return texts;
    }
  }
}
