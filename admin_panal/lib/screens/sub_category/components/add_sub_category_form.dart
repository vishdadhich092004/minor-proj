import '../../../models/sub_category.dart';
import '../provider/sub_category_provider.dart';
import '../../../utility/extensions.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:provider/provider.dart';
import '../../../models/category.dart';
import '../../../utility/constants.dart';
import '../../../providers/language_provider.dart';
import '../../../utility/translations.dart' as AppTranslations;
import '../../../widgets/custom_dropdown.dart';
import '../../../widgets/custom_text_field.dart';

class SubCategorySubmitForm extends StatelessWidget {
  final SubCategory? subCategory;

  const SubCategorySubmitForm({super.key, this.subCategory});

  @override
  Widget build(BuildContext context) {
    context.subCategoryProvider.setDataForUpdateSubCategory(subCategory);
    var size = MediaQuery.of(context).size;
    return SingleChildScrollView(
      child: Form(
        key: context.subCategoryProvider.addSubCategoryFormKey,
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
              Gap(defaultPadding),
              Row(
                children: [
                  Expanded(
                    child: Consumer2<SubCategoryProvider, LanguageProvider>(
                      builder: (context, subCatProvider, languageProvider, child) {
                        return CustomDropdown(
                          initialValue: subCatProvider.selectedCategory,
                          hintText: subCatProvider.selectedCategory?.name ??
                              AppTranslations.Translations.get(
                                'select_category',
                                languageProvider.currentLanguageCode,
                              ),
                          items: context.dataProvider.categories,
                          displayItem: (Category? category) => category?.name ?? '',
                          onChanged: (newValue) {
                            if (newValue != null) {
                              subCatProvider.selectedCategory = newValue;
                              subCatProvider.updateUi();
                            }
                          },
                          validator: (value) {
                            if (value == null) {
                              return AppTranslations.Translations.get(
                                'please_select_category',
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
                          controller: context.subCategoryProvider.subCategoryNameCtrl,
                          labelText: AppTranslations.Translations.get(
                            'sub_category_name',
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
                      Gap(defaultPadding),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          foregroundColor: Colors.white,
                          backgroundColor: primaryColor,
                        ),
                        onPressed: () {
                          if (context.subCategoryProvider.addSubCategoryFormKey.currentState!.validate()) {
                            context.subCategoryProvider.addSubCategoryFormKey.currentState!.save();
                            context.subCategoryProvider.submitSubCategory();
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
void showAddSubCategoryForm(BuildContext context, SubCategory? subCategory) {
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
                  'add_sub_category',
                  languageProvider.currentLanguageCode,
                ).toUpperCase(),
                style: TextStyle(color: primaryColor),
              ),
            ),
            content: SubCategorySubmitForm(subCategory: subCategory),
          );
        },
      );
    },
  );
}
