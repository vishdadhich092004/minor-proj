import '../../../models/variant_type.dart';
import '../../../utility/extensions.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../utility/constants.dart';
import '../../../providers/language_provider.dart';
import '../../../utility/translations.dart' as AppTranslations;
import '../../../widgets/custom_text_field.dart';

class VariantTypeSubmitForm extends StatelessWidget {
  final VariantType? variantType;

  const VariantTypeSubmitForm({super.key, this.variantType});

  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    context.variantTypeProvider.setDataForUpdateVariantTYpe(variantType);
    return SingleChildScrollView(
      child: Form(
        key: context.variantTypeProvider.addVariantsTypeFormKey,
        child: Container(
          padding: EdgeInsets.all(defaultPadding),
          width: size.width * 0.5,
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(12.0),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(height: defaultPadding),
              Consumer<LanguageProvider>(
                builder: (context, languageProvider, child) {
                  return Row(
                    children: [
                      Expanded(
                        child: CustomTextField(
                          controller: context.variantTypeProvider.variantNameCtrl,
                          labelText: AppTranslations.Translations.get(
                            'variant_name',
                            languageProvider.currentLanguageCode,
                          ),
                          onSave: (val) {},
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return AppTranslations.Translations.get(
                                'please_enter_name',
                                languageProvider.currentLanguageCode,
                              );
                            }
                            return null;
                          },
                        ),
                      ),
                      Expanded(
                        child: CustomTextField(
                          controller: context.variantTypeProvider.variantTypeCtrl,
                          labelText: AppTranslations.Translations.get(
                            'variant_type',
                            languageProvider.currentLanguageCode,
                          ),
                          onSave: (val) {},
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return AppTranslations.Translations.get(
                                'please_enter_name',
                                languageProvider.currentLanguageCode,
                              );
                            }
                            return null;
                          },
                        ),
                      ),
                    ],
                  );
                },
              ),
              SizedBox(height: defaultPadding * 2),
              Consumer<LanguageProvider>(
                builder: (context, languageProvider, child) {
                  return Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          foregroundColor: Colors.white,
                          backgroundColor: secondaryColor,
                        ),
                        onPressed: () {
                          Navigator.of(context).pop();
                        },
                        child: Text(
                          AppTranslations.Translations.get(
                            'cancel',
                            languageProvider.currentLanguageCode,
                          ),
                        ),
                      ),
                      SizedBox(width: defaultPadding),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          foregroundColor: Colors.white,
                          backgroundColor: primaryColor,
                        ),
                        onPressed: () {
                          if (context.variantTypeProvider.addVariantsTypeFormKey.currentState!.validate()) {
                            context.variantTypeProvider.addVariantsTypeFormKey.currentState!.save();
                            context.variantTypeProvider.submitVariantType();
                            Navigator.of(context).pop();
                          }
                        },
                        child: Text(
                          AppTranslations.Translations.get(
                            'submit',
                            languageProvider.currentLanguageCode,
                          ),
                        ),
                      ),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// How to show the category popup
void showAddVariantsTypeForm(BuildContext context, VariantType? variantType) {
  showDialog(
    context: context,
    builder: (BuildContext context) {
      return Consumer<LanguageProvider>(
        builder: (context, languageProvider, child) {
          return AlertDialog(
            backgroundColor: bgColor,
            title: Center(
              child: Text(
                AppTranslations.Translations.get(
                  'add_variant_type',
                  languageProvider.currentLanguageCode,
                ).toUpperCase(),
                style: TextStyle(color: primaryColor),
              ),
            ),
            content: VariantTypeSubmitForm(variantType: variantType),
          );
        },
      );
    },
  );
}
