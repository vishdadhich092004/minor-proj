import '../../utility/extensions.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../utility/app_color.dart';
import '../../widget/custom_text_field.dart';
import '../../providers/language_provider.dart';
import '../../utility/translations.dart' as AppTranslations;

class MyAddressPage extends StatelessWidget {
  const MyAddressPage({super.key});

  @override
  Widget build(BuildContext context) {
    context.profileProvider.retrieveSavedAddress();
    return Scaffold(
      appBar: AppBar(
        title: Consumer<LanguageProvider>(
          builder: (context, languageProvider, child) {
            return Text(
              AppTranslations.Translations.get(
                  'my_address', languageProvider.currentLanguageCode),
              style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppColor.darkOrange),
            );
          },
        ),
      ),
      body: SingleChildScrollView(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Form(
              key: context.profileProvider.addressFormKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.max,
                children: [
                  Card(
                    elevation: 4,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    surfaceTintColor: Colors.white,
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Consumer<LanguageProvider>(
                        builder: (context, languageProvider, child) {
                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              CustomTextField(
                                labelText: AppTranslations.Translations.get(
                                    'phone',
                                    languageProvider.currentLanguageCode),
                                onSave: (value) {},
                                inputType: TextInputType.number,
                                controller:
                                    context.profileProvider.phoneController,
                                validator: (value) => value!.isEmpty
                                    ? AppTranslations.Translations.get(
                                            'please_enter_email',
                                            languageProvider
                                                .currentLanguageCode)
                                        .replaceAll('email', 'phone')
                                    : null,
                              ),
                              CustomTextField(
                                labelText: AppTranslations.Translations.get(
                                    'street',
                                    languageProvider.currentLanguageCode),
                                onSave: (val) {},
                                controller:
                                    context.profileProvider.streetController,
                                validator: (value) => value!.isEmpty
                                    ? AppTranslations.Translations.get(
                                            'please_enter_email',
                                            languageProvider
                                                .currentLanguageCode)
                                        .replaceAll('email', 'street')
                                    : null,
                              ),
                              CustomTextField(
                                labelText: AppTranslations.Translations.get(
                                    'city',
                                    languageProvider.currentLanguageCode),
                                onSave: (value) {},
                                controller:
                                    context.profileProvider.cityController,
                                validator: (value) => value!.isEmpty
                                    ? AppTranslations.Translations.get(
                                            'please_enter_email',
                                            languageProvider
                                                .currentLanguageCode)
                                        .replaceAll('email', 'city')
                                    : null,
                              ),
                              CustomTextField(
                                labelText: AppTranslations.Translations.get(
                                    'state',
                                    languageProvider.currentLanguageCode),
                                onSave: (value) {},
                                controller:
                                    context.profileProvider.stateController,
                                validator: (value) => value!.isEmpty
                                    ? AppTranslations.Translations.get(
                                            'please_enter_email',
                                            languageProvider
                                                .currentLanguageCode)
                                        .replaceAll('email', 'state')
                                    : null,
                              ),
                              Row(
                                children: [
                                  Expanded(
                                    child: CustomTextField(
                                      labelText:
                                          AppTranslations.Translations.get(
                                              'postal_code',
                                              languageProvider
                                                  .currentLanguageCode),
                                      onSave: (value) {},
                                      inputType: TextInputType.number,
                                      controller: context
                                          .profileProvider.postalCodeController,
                                      validator: (value) => value!.isEmpty
                                          ? AppTranslations.Translations.get(
                                                  'please_enter_email',
                                                  languageProvider
                                                      .currentLanguageCode)
                                              .replaceAll(
                                                  'email', 'postal code')
                                          : null,
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: CustomTextField(
                                      labelText:
                                          AppTranslations.Translations.get(
                                              'country',
                                              languageProvider
                                                  .currentLanguageCode),
                                      onSave: (value) {},
                                      controller: context
                                          .profileProvider.countryController,
                                      validator: (value) => value!.isEmpty
                                          ? AppTranslations.Translations.get(
                                                  'please_enter_email',
                                                  languageProvider
                                                      .currentLanguageCode)
                                              .replaceAll('email', 'country')
                                          : null,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          );
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  Center(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColor.darkOrange,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 40, vertical: 16),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30)),
                      ),
                      onPressed: () {
                        if (context.profileProvider.addressFormKey.currentState!
                            .validate()) {
                          context.profileProvider.storeAddress();
                        }
                      },
                      child: Consumer<LanguageProvider>(
                        builder: (context, languageProvider, child) {
                          return Text(
                            AppTranslations.Translations.get(
                                'save', languageProvider.currentLanguageCode),
                            style: const TextStyle(fontSize: 18),
                          );
                        },
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
