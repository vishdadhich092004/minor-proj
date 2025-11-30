import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/language_provider.dart';

/// Widget that automatically translates dynamic content using Google Translate
/// Use this for product names, descriptions, category names, etc.
class TranslatedText extends StatelessWidget {
  final String text;
  final TextStyle? style;
  final int? maxLines;
  final TextOverflow? overflow;
  final TextAlign? textAlign;
  final String? semanticsLabel;

  const TranslatedText(
    this.text, {
    super.key,
    this.style,
    this.maxLines,
    this.overflow,
    this.textAlign,
    this.semanticsLabel,
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return FutureBuilder<String>(
          future: languageProvider.translate(text),
          builder: (context, snapshot) {
            return Text(
              snapshot.data ?? text,
              style: style,
              maxLines: maxLines,
              overflow: overflow,
              textAlign: textAlign,
              semanticsLabel: semanticsLabel,
            );
          },
        );
      },
    );
  }
}

/// Extension for easy access to translation
extension StringTranslationExtension on String {
  Widget toTranslatedText({
    TextStyle? style,
    int? maxLines,
    TextOverflow? overflow,
    TextAlign? textAlign,
  }) {
    return TranslatedText(
      this,
      style: style,
      maxLines: maxLines,
      overflow: overflow,
      textAlign: textAlign,
    );
  }
}

