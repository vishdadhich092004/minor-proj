import '../../../models/category.dart';
import '../provider/category_provider.dart';
import '../../../utility/extensions.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:provider/provider.dart';
import '../../../utility/constants.dart';
import '../../../providers/language_provider.dart';
import '../../../utility/translations.dart' as AppTranslations;
import '../../../widgets/category_image_card.dart';
import '../../../widgets/custom_text_field.dart';

class CategorySubmitForm extends StatelessWidget {
  final Category? category;

  const CategorySubmitForm({super.key, this.category});

  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    context.categoryProvider.setDataForUpdateCategory(category);
    return SingleChildScrollView(
      child: Form(
        key: context.categoryProvider.addCategoryFormKey,
        child: Container(
          padding: EdgeInsets.all(defaultPadding),
          width: size.width * 0.3,
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: BorderRadius.circular(12.0),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Gap(defaultPadding),
              Consumer2<CategoryProvider, LanguageProvider>(
                builder: (context, catProvider, languageProvider, child) {
                  return CategoryImageCard(
                    labelText: AppTranslations.Translations.get(
                      'category',
                      languageProvider.currentLanguageCode,
                    ),
                    imageFile: catProvider.selectedImage,
                    imageUrlForUpdateImage: category?.image,
                    onTap: () {
                      catProvider.pickImage();
                    },
                  );
                },
              ),
              Gap(defaultPadding),
              Consumer<LanguageProvider>(
                builder: (context, languageProvider, child) {
                  return CustomTextField(
                    controller: context.categoryProvider.categoryNameCtrl,
                    labelText: AppTranslations.Translations.get(
                      'category_name',
                      languageProvider.currentLanguageCode,
                    ),
                    onSave: (val) {},
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return AppTranslations.Translations.get(
                          'enter_name',
                          languageProvider.currentLanguageCode,
                        );
                      }
                      return null;
                    },
                  );
                },
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
                          if (context
                              .categoryProvider.addCategoryFormKey.currentState!
                              .validate()) {
                            context
                                .categoryProvider.addCategoryFormKey.currentState!
                                .save();
                            context.categoryProvider.submitCategory();
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

// show the category popup
void showAddCategoryForm(BuildContext context, Category? category) {
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
                  'add_category',
                  languageProvider.currentLanguageCode,
                ).toUpperCase(),
                style: TextStyle(color: primaryColor),
              ),
            ),
            content: CategorySubmitForm(category: category),
          );
        },
      );
    },
  );
}
