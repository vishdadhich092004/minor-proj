import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/language_provider.dart';

class LanguageSelector extends StatelessWidget {
  final bool showAsDialog;
  
  const LanguageSelector({super.key, this.showAsDialog = false});

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        if (showAsDialog) {
          return _buildDialog(context, languageProvider);
        }
        return _buildDropdown(context, languageProvider);
      },
    );
  }

  Widget _buildDropdown(BuildContext context, LanguageProvider languageProvider) {
    return DropdownButton<AppLanguage>(
      value: languageProvider.currentLanguage,
      icon: const Icon(Icons.language, color: Colors.white54),
      underline: const SizedBox(),
      dropdownColor: const Color(0xFF2A2D3E),
      style: const TextStyle(color: Colors.white54),
      items: AppLanguage.values.map((AppLanguage language) {
        return DropdownMenuItem<AppLanguage>(
          value: language,
          child: Row(
            children: [
              Text(language.flag, style: const TextStyle(fontSize: 20)),
              const SizedBox(width: 8),
              Text(language.name, style: const TextStyle(color: Colors.white54)),
            ],
          ),
        );
      }).toList(),
      onChanged: (AppLanguage? newLanguage) {
        if (newLanguage != null) {
          languageProvider.setLanguage(newLanguage);
        }
      },
    );
  }

  Widget _buildDialog(BuildContext context, LanguageProvider languageProvider) {
    return AlertDialog(
      backgroundColor: const Color(0xFF2A2D3E),
      title: Text(
        'Select Language',
        style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
      ),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: AppLanguage.values.map((AppLanguage language) {
          final isSelected = languageProvider.currentLanguage == language;
          return ListTile(
            leading: Text(language.flag, style: const TextStyle(fontSize: 24)),
            title: Text(language.name, style: const TextStyle(color: Colors.white54)),
            trailing: isSelected
                ? const Icon(Icons.check, color: Colors.green)
                : null,
            onTap: () {
              languageProvider.setLanguage(language);
              Navigator.of(context).pop();
            },
          );
        }).toList(),
      ),
    );
  }
}

void showLanguageSelectorDialog(BuildContext context) {
  showDialog(
    context: context,
    builder: (context) => const LanguageSelector(showAsDialog: true),
  );
}

