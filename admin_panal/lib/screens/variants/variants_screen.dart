import 'package:admin/utility/extensions.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:provider/provider.dart';
import '../../utility/constants.dart';
import '../../utility/responsive.dart';
import '../../providers/language_provider.dart';
import '../../utility/translations.dart' as AppTranslations;
import 'components/add_variant_form.dart';
import 'components/variant_header.dart';
import 'components/variants_list_section.dart';

class VariantsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);
    return SafeArea(
      child: SingleChildScrollView(
        primary: false,
        padding: EdgeInsets.all(defaultPadding),
        child: Column(
          children: [
            VariantsHeader(),
            Gap(defaultPadding),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (isMobile)
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Consumer<LanguageProvider>(
                        builder: (context, languageProvider, child) {
                          return Text(
                            AppTranslations.Translations.get(
                              'my_variants',
                              languageProvider.currentLanguageCode,
                            ),
                            style: Theme.of(
                              context,
                            ).textTheme.titleMedium,
                          );
                        },
                      ),
                      Gap(defaultPadding / 2),
                      Row(
                        children: [
                          Expanded(
                            child: Consumer<LanguageProvider>(
                              builder: (context, languageProvider, child) {
                                return ElevatedButton.icon(
                                  style: TextButton.styleFrom(
                                    padding: EdgeInsets.symmetric(
                                      horizontal: defaultPadding * 1.5,
                                      vertical: defaultPadding,
                                    ),
                                  ),
                                  onPressed: () {
                                    showAddVariantForm(context, null);
                                  },
                                  icon: Icon(Icons.add),
                                  label: Text(
                                    AppTranslations.Translations.get(
                                      'add_new',
                                      languageProvider.currentLanguageCode,
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                          Gap(10),
                          IconButton(
                            onPressed: () {
                              context.dataProvider.getAllVariant(
                                showSnack: true,
                              );
                            },
                            icon: Icon(Icons.refresh),
                          ),
                        ],
                      ),
                    ],
                  )
                else
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Consumer<LanguageProvider>(
                          builder: (context, languageProvider, child) {
                            return Text(
                              AppTranslations.Translations.get(
                                'my_variants',
                                languageProvider.currentLanguageCode,
                              ),
                              style: Theme.of(
                                context,
                              ).textTheme.titleMedium,
                            );
                          },
                        ),
                      ),
                      Consumer<LanguageProvider>(
                        builder: (context, languageProvider, child) {
                          return ElevatedButton.icon(
                            style: TextButton.styleFrom(
                              padding: EdgeInsets.symmetric(
                                horizontal: defaultPadding * 1.5,
                                vertical: defaultPadding,
                              ),
                            ),
                            onPressed: () {
                              showAddVariantForm(context, null);
                            },
                            icon: Icon(Icons.add),
                            label: Text(
                              AppTranslations.Translations.get(
                                'add_new',
                                languageProvider.currentLanguageCode,
                              ),
                            ),
                          );
                        },
                      ),
                      Gap(20),
                      IconButton(
                        onPressed: () {
                          context.dataProvider.getAllVariant(
                            showSnack: true,
                          );
                        },
                        icon: Icon(Icons.refresh),
                      ),
                    ],
                  ),
                Gap(defaultPadding),
                VariantsListSection(),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
