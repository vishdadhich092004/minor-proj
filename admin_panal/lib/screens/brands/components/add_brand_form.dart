import '../../../models/sub_category.dart';
import '../provider/brand_provider.dart';
import '../../../utility/extensions.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:provider/provider.dart';
import '../../../models/brand.dart';
import '../../../utility/constants.dart';
import '../../../providers/language_provider.dart';
import '../../../utility/translations.dart' as AppTranslations;
import '../../../widgets/custom_dropdown.dart';
import '../../../widgets/custom_text_field.dart';

class BrandSubmitForm extends StatelessWidget {
  final Brand? brand;

  const BrandSubmitForm({super.key, this.brand});

  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    var isMobile = size.width < 950;
    context.brandProvider.setDataForUpdateBrand(brand);
    return SingleChildScrollView(
      child: Form(
        key: context.brandProvider.addBrandFormKey,
        child: Padding(
          padding:
              EdgeInsets.all(isMobile ? defaultPadding / 2 : defaultPadding),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Gap(defaultPadding),
              isMobile
                  ? Column(
                      children: [
                        Consumer2<BrandProvider, LanguageProvider>(
                          builder: (context, brandProvider, languageProvider,
                              child) {
                            return CustomDropdown(
                              initialValue: brandProvider.selectedSubCategory,
                              items: context.dataProvider.subCategories,
                              hintText:
                                  brandProvider.selectedSubCategory?.name ??
                                      AppTranslations.Translations.get(
                                        'please_select_sub_category',
                                        languageProvider.currentLanguageCode,
                                      ),
                              displayItem: (SubCategory? subCategory) =>
                                  subCategory?.name ?? '',
                              onChanged: (newValue) {
                                brandProvider.selectedSubCategory = newValue;
                                brandProvider.updateUI();
                              },
                              validator: (value) {
                                if (value == null) {
                                  return AppTranslations.Translations.get(
                                    'please_select_sub_category',
                                    languageProvider.currentLanguageCode,
                                  );
                                }
                                return null;
                              },
                            );
                          },
                        ),
                        Gap(defaultPadding),
                        Consumer<LanguageProvider>(
                          builder: (context, languageProvider, child) {
                            return CustomTextField(
                              controller: context.brandProvider.brandNameCtrl,
                              labelText: AppTranslations.Translations.get(
                                'brand_name',
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
                          child: Consumer2<BrandProvider, LanguageProvider>(
                            builder: (context, brandProvider, languageProvider,
                                child) {
                              return CustomDropdown(
                                initialValue: brandProvider.selectedSubCategory,
                                items: context.dataProvider.subCategories,
                                hintText:
                                    brandProvider.selectedSubCategory?.name ??
                                        AppTranslations.Translations.get(
                                          'please_select_sub_category',
                                          languageProvider.currentLanguageCode,
                                        ),
                                displayItem: (SubCategory? subCategory) =>
                                    subCategory?.name ?? '',
                                onChanged: (newValue) {
                                  brandProvider.selectedSubCategory = newValue;
                                  brandProvider.updateUI();
                                },
                                validator: (value) {
                                  if (value == null) {
                                    return AppTranslations.Translations.get(
                                      'please_select_sub_category',
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
                                controller: context.brandProvider.brandNameCtrl,
                                labelText: AppTranslations.Translations.get(
                                  'brand_name',
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
              Gap(defaultPadding * 2),
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
                              .brandProvider.addBrandFormKey.currentState!
                              .validate()) {
                            context.brandProvider.addBrandFormKey.currentState!
                                .save();
                            context.brandProvider.submitBrand();
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

// brand popup
void showBrandForm(BuildContext context, Brand? brand) {
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
                        'add_brand',
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
                    child: BrandSubmitForm(brand: brand),
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
