import '../../../models/variant.dart';
import '../../../models/variant_type.dart';
import '../provider/variant_provider.dart';
import '../../../utility/extensions.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../utility/constants.dart';
import '../../../providers/language_provider.dart';
import '../../../utility/translations.dart' as AppTranslations;
import '../../../widgets/custom_dropdown.dart';
import '../../../widgets/custom_text_field.dart';

class VariantSubmitForm extends StatefulWidget {
  final Variant? variant;

  const VariantSubmitForm({super.key, this.variant});

  @override
  State<VariantSubmitForm> createState() => _VariantSubmitFormState();
}

class _VariantSubmitFormState extends State<VariantSubmitForm> {
  @override
  void initState() {
    super.initState();
    // Call setDataForUpdateVariant only once when the widget is first created
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.variantProvider.setDataForUpdateVariant(widget.variant);
    });
  }

  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    var isMobile = size.width < 950;
    return SingleChildScrollView(
      child: Form(
        key: context.variantProvider.addVariantsFormKey,
        child: Padding(
          padding:
              EdgeInsets.all(isMobile ? defaultPadding / 2 : defaultPadding),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(height: defaultPadding),
              isMobile
                  ? Column(
                      children: [
                        Consumer2<VariantsProvider, LanguageProvider>(
                          builder: (context, variantProvider, languageProvider,
                              child) {
                            return CustomDropdown(
                              initialValue: variantProvider.selectedVariantType,
                              items: context.dataProvider.variantTypes,
                              hintText:
                                  variantProvider.selectedVariantType?.name ??
                                      AppTranslations.Translations.get(
                                        'select_variant_type',
                                        languageProvider.currentLanguageCode,
                                      ),
                              displayItem: (VariantType? variantType) =>
                                  variantType?.name ?? '',
                              onChanged: (newValue) {
                                variantProvider.selectedVariantType = newValue;
                                variantProvider.updateUI();
                              },
                              validator: (value) {
                                if (value == null) {
                                  return AppTranslations.Translations.get(
                                    'please_select_variant_type',
                                    languageProvider.currentLanguageCode,
                                  );
                                }
                                return null;
                              },
                            );
                          },
                        ),
                        SizedBox(height: defaultPadding),
                        Consumer<LanguageProvider>(
                          builder: (context, languageProvider, child) {
                            return CustomTextField(
                              controller: context.variantProvider.variantCtrl,
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
                            );
                          },
                        ),
                      ],
                    )
                  : Row(
                      children: [
                        Expanded(
                          child: Consumer2<VariantsProvider, LanguageProvider>(
                            builder: (context, variantProvider,
                                languageProvider, child) {
                              return CustomDropdown(
                                initialValue:
                                    variantProvider.selectedVariantType,
                                items: context.dataProvider.variantTypes,
                                hintText:
                                    variantProvider.selectedVariantType?.name ??
                                        AppTranslations.Translations.get(
                                          'select_variant_type',
                                          languageProvider.currentLanguageCode,
                                        ),
                                displayItem: (VariantType? variantType) =>
                                    variantType?.name ?? '',
                                onChanged: (newValue) {
                                  variantProvider.selectedVariantType =
                                      newValue;
                                  variantProvider.updateUI();
                                },
                                validator: (value) {
                                  if (value == null) {
                                    return AppTranslations.Translations.get(
                                      'please_select_variant_type',
                                      languageProvider.currentLanguageCode,
                                    );
                                  }
                                  return null;
                                },
                              );
                            },
                          ),
                        ),
                        Expanded(
                          child: Consumer<LanguageProvider>(
                            builder: (context, languageProvider, child) {
                              return CustomTextField(
                                controller: context.variantProvider.variantCtrl,
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
                              );
                            },
                          ),
                        ),
                      ],
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
                          if (context
                              .variantProvider.addVariantsFormKey.currentState!
                              .validate()) {
                            context.variantProvider.addVariantsFormKey
                                .currentState!
                                .save();
                            context.variantProvider.submitVariant();
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
void showAddVariantForm(BuildContext context, Variant? variant) {
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
                        'add_variant',
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
                    child: VariantSubmitForm(variant: variant),
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
