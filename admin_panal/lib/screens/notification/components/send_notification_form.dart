import '../../../utility/extensions.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:provider/provider.dart';
import '../../../utility/constants.dart';
import '../../../providers/language_provider.dart';
import '../../../utility/translations.dart' as AppTranslations;
import '../../../widgets/custom_text_field.dart';

class SendNotificationForm extends StatelessWidget {

  const SendNotificationForm({super.key});

  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    return SingleChildScrollView(
      child: Form(
        key: context.notificationProvider.sendNotificationFormKey,
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
              Consumer<LanguageProvider>(
                builder: (context, languageProvider, child) {
                  return Column(
                    children: [
                      CustomTextField(
                        controller: context.notificationProvider.titleCtrl,
                        labelText: AppTranslations.Translations.get(
                          'enter_notification_title',
                          languageProvider.currentLanguageCode,
                        ),
                        onSave: (val) {},
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return AppTranslations.Translations.get(
                              'please_enter_title_name',
                              languageProvider.currentLanguageCode,
                            );
                          }
                          return null;
                        },
                      ),
                      CustomTextField(
                        controller: context.notificationProvider.descriptionCtrl,
                        labelText: AppTranslations.Translations.get(
                          'enter_notification_description',
                          languageProvider.currentLanguageCode,
                        ),
                        lineNumber: 3,
                        onSave: (val) {},
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return AppTranslations.Translations.get(
                              'please_enter_description',
                              languageProvider.currentLanguageCode,
                            );
                          }
                          return null;
                        },
                      ),
                      CustomTextField(
                        controller: context.notificationProvider.imageUrlCtrl,
                        labelText: AppTranslations.Translations.get(
                          'enter_notification_image_url',
                          languageProvider.currentLanguageCode,
                        ),
                        onSave: (val) {},
                      ),
                    ],
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
                      SizedBox(width: defaultPadding),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          foregroundColor: Colors.white,
                          backgroundColor: primaryColor,
                        ),
                        onPressed: () {
                          if (context.notificationProvider.sendNotificationFormKey.currentState!.validate()) {
                            context.notificationProvider.sendNotificationFormKey.currentState!.save();
                            context.notificationProvider.sendNotification();
                            Navigator.of(context).pop();
                          }
                        },
                        child: Text(
                          AppTranslations.Translations.get(
                            'send',
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
void sendNotificationFormForm(BuildContext context) {
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
                  'send_notification',
                  languageProvider.currentLanguageCode,
                ).toUpperCase(),
                style: TextStyle(color: primaryColor),
              ),
            ),
            content: SendNotificationForm(),
          );
        },
      );
    },
  );
}
