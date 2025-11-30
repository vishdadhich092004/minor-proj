import 'package:admin/utility/extensions.dart';
import 'components/dash_board_header.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:provider/provider.dart';
import '../../utility/constants.dart';
import '../../providers/language_provider.dart';
import '../../utility/translations.dart' as AppTranslations;
import 'components/add_product_form.dart';
import 'components/order_details_section.dart';
import 'components/product_list_section.dart';
import 'components/product_summery_section.dart';

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        primary: false,
        padding: EdgeInsets.all(defaultPadding),
        child: Column(
          children: [
            DashBoardHeader(),
            Gap(defaultPadding),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  flex: 5,
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Consumer<LanguageProvider>(
                              builder: (context, languageProvider, child) {
                                return Text(
                                  AppTranslations.Translations.get(
                                    'my_products',
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
                                  showAddProductForm(context, null);
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
                              context.dataProvider.getAllProduct();
                            },
                            icon: Icon(Icons.refresh),
                          ),
                        ],
                      ),
                      Gap(defaultPadding),
                      ProductSummerySection(),
                      Gap(defaultPadding),
                      ProductListSection(),
                    ],
                  ),
                ),
                SizedBox(width: defaultPadding),
                Expanded(flex: 2, child: OrderDetailsSection()),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
