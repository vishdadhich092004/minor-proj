import 'package:admin/utility/extensions.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:provider/provider.dart';
import '../../utility/constants.dart';
import '../../utility/responsive.dart';
import '../../providers/language_provider.dart';
import '../../utility/translations.dart' as AppTranslations;
import 'components/add_category_form.dart';
import 'components/category_header.dart';
import 'components/category_list_section.dart';

class CategoryScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);
    return SafeArea(
      child: SingleChildScrollView(
        primary: false,
        padding: EdgeInsets.all(defaultPadding),
        child: Column(
          children: [
            CategoryHeader(),
            SizedBox(height: defaultPadding),
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
                              'my_categories',
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
                          Flexible(
                            child: Consumer<LanguageProvider>(
                              builder: (context, languageProvider, child) {
                                return ElevatedButton.icon(
                                  style: TextButton.styleFrom(
                                    padding: EdgeInsets.symmetric(
                                      horizontal: defaultPadding,
                                      vertical: defaultPadding * 0.75,
                                    ),
                                  ),
                                  onPressed: () {
                                    showAddCategoryForm(context, null);
                                  },
                                  icon: Icon(Icons.add, size: 18),
                                  label: Flexible(
                                    child: Text(
                                      AppTranslations.Translations.get(
                                        'add_new',
                                        languageProvider.currentLanguageCode,
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                          SizedBox(width: 8),
                          IconButton(
                            onPressed: () {
                              context.dataProvider.getAllCategory(
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
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Expanded(
                        child: Consumer<LanguageProvider>(
                          builder: (context, languageProvider, child) {
                            return Text(
                              AppTranslations.Translations.get(
                                'my_categories',
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
                              showAddCategoryForm(context, null);
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
                          context.dataProvider.getAllCategory(
                            showSnack: true,
                          );
                        },
                        icon: Icon(Icons.refresh),
                      ),
                    ],
                  ),
                Gap(defaultPadding),
                CategoryListSection(),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
