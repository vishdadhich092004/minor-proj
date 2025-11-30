import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../providers/language_provider.dart';
import '../../../utility/translations.dart' as AppTranslations;

class EmptyCart extends StatelessWidget {
  const EmptyCart({super.key});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Expanded(
            child: Center(
              child: Image.asset('assets/images/empty_cart.png'),
            ),
          ),
          Consumer<LanguageProvider>(
            builder: (context, languageProvider, child) {
              return Text(
                AppTranslations.Translations.get(
                    'empty_cart', languageProvider.currentLanguageCode),
                style:
                    const TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
              );
            },
          ),
        ],
      ),
    );
  }
}
