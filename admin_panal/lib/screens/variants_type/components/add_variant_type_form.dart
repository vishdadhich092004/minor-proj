import '../../../models/variant_type.dart';
import '../../../utility/extensions.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../utility/constants.dart';
import '../../../providers/language_provider.dart';
import '../../../utility/translations.dart' as AppTranslations;
import '../../../widgets/custom_text_field.dart';

class VariantTypeSubmitForm extends StatefulWidget {
  final VariantType? variantType;

  const VariantTypeSubmitForm({super.key, this.variantType});

  @override
  State<VariantTypeSubmitForm> createState() => _VariantTypeSubmitFormState();
}

class _VariantTypeSubmitFormState extends State<VariantTypeSubmitForm> {
  @override
  void initState() {
    super.initState();
    // Call setDataForUpdateVariantTYpe only once when the widget is first created
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.variantTypeProvider.setDataForUpdateVariantTYpe(widget.variantType);
    });
  }

  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    var isMobile = size.width < 950;
    return SingleChildScrollView(
      child: Form(
        key: context.variantTypeProvider.addVariantsTypeFormKey,
        child: Padding(
          padding:
              EdgeInsets.all(isMobile ? defaultPadding / 2 : defaultPadding),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(height: defaultPadding),
              Consumer<LanguageProvider>(
                builder: (context, languageProvider, child) {
                  return isMobile
                      ? Column(
                          children: [
                            CustomTextField(
                              controller:
                                  context.variantTypeProvider.variantNameCtrl,
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
                            SizedBox(height: defaultPadding),
                            CustomTextField(
                              controller:
                                  context.variantTypeProvider.variantTypeCtrl,
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
                          ],
                        )
                      : Row(
                          children: [
                            Expanded(
                              child: CustomTextField(
                                controller:
                                    context.variantTypeProvider.variantNameCtrl,
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
                                controller:
                                    context.variantTypeProvider.variantTypeCtrl,
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
                          if (context.variantTypeProvider.addVariantsTypeFormKey
                              .currentState!
                              .validate()) {
                            context.variantTypeProvider.addVariantsTypeFormKey
                                .currentState!
                                .save();
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
          return Dialog(
            backgroundColor: Colors.transparent,
            insetPadding: EdgeInsets.symmetric(
              horizontal: MediaQuery.of(context).size.width < 950 ? 10 : 20,
              vertical: 20,
            ),
            child: Container(
              constraints: BoxConstraints(
                maxHeight: MediaQuery.of(context).size.height * 0.9,
                maxWidth: 800,
              ),
              decoration: BoxDecoration(
                color: bgColor,
                borderRadius: BorderRadius.circular(12.0),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Padding(
                    padding: EdgeInsets.all(defaultPadding),
                    child: Text(
                      AppTranslations.Translations.get(
                        'add_variant_type',
                        languageProvider.currentLanguageCode,
                      ).toUpperCase(),
                      style: TextStyle(
                        color: primaryColor,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Flexible(
                    child: VariantTypeSubmitForm(variantType: variantType),
                  ),
                ],
              ),
            ),
          );
        },
      );
    },
  );
}
