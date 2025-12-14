import '../provider/poster_provider.dart';
import '../../../utility/extensions.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:provider/provider.dart';
import '../../../models/poster.dart';
import '../../../utility/constants.dart';
import '../../../providers/language_provider.dart';
import '../../../utility/translations.dart' as AppTranslations;
import '../../../widgets/category_image_card.dart';
import '../../../widgets/custom_text_field.dart';

class PosterSubmitForm extends StatelessWidget {
  final Poster? poster;

  const PosterSubmitForm({super.key, this.poster});

  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    var isMobile = size.width < 950;
    context.posterProvider.setDataForUpdatePoster(poster);
    return SingleChildScrollView(
      child: Form(
        key: context.posterProvider.addPosterFormKey,
        child: Padding(
          padding:
              EdgeInsets.all(isMobile ? defaultPadding / 2 : defaultPadding),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Gap(defaultPadding),
              Consumer2<PosterProvider, LanguageProvider>(
                builder: (context, posterProvider, languageProvider, child) {
                  return CategoryImageCard(
                    labelText: AppTranslations.Translations.get(
                      'posters',
                      languageProvider.currentLanguageCode,
                    ),
                    imageFile: posterProvider.selectedImage,
                    imageUrlForUpdateImage: poster?.imageUrl,
                    onTap: () {
                      posterProvider.pickImage();
                    },
                  );
                },
              ),
              Gap(defaultPadding),
              Consumer<LanguageProvider>(
                builder: (context, languageProvider, child) {
                  return CustomTextField(
                    controller: context.posterProvider.posterNameCtrl,
                    labelText: AppTranslations.Translations.get(
                      'poster_name',
                      languageProvider.currentLanguageCode,
                    ),
                    onSave: (val) {},
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return AppTranslations.Translations.get(
                          'please_enter_poster_name',
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
                              .posterProvider.addPosterFormKey.currentState!
                              .validate()) {
                            context
                                .posterProvider.addPosterFormKey.currentState!
                                .save();
                            context.posterProvider.submitPoster();
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
void showAddPosterForm(BuildContext context, Poster? poster) {
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
                maxWidth: 600,
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
                        'add_poster',
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
                    child: PosterSubmitForm(poster: poster),
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
