import 'package:admin/utility/extensions.dart';
import 'components/dash_board_header.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:provider/provider.dart';
import '../../utility/constants.dart';
import '../../utility/responsive.dart';
import '../../providers/language_provider.dart';
import '../../utility/translations.dart' as AppTranslations;
import 'components/add_product_form.dart';
import 'components/order_details_section.dart';
import 'components/product_list_section.dart';
import 'components/product_summery_section.dart';

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);
    return SafeArea(
      child: SingleChildScrollView(
        primary: false,
        clipBehavior: Clip.hardEdge,
        padding: EdgeInsets.all(defaultPadding),
        child: Column(
          children: [
            DashBoardHeader(),
            Gap(defaultPadding),
            if (isMobile) ...[
              // Mobile layout: Stack vertically
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ClipRect(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Flexible(
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
                                overflow: TextOverflow.ellipsis,
                              );
                            },
                          ),
                        ),
                        SizedBox(width: 8),
                        Flexible(
                          child: Consumer<LanguageProvider>(
                            builder: (context, languageProvider, child) {
                              return ElevatedButton.icon(
                                style: TextButton.styleFrom(
                                  padding: EdgeInsets.symmetric(
                                    horizontal: defaultPadding * 0.75,
                                    vertical: defaultPadding * 0.65,
                                  ),
                                ),
                                onPressed: () {
                                  showAddProductForm(context, null);
                                },
                                icon: Icon(Icons.add, size: 18),
                                label: Text(
                                  AppTranslations.Translations.get(
                                    'add_new',
                                    languageProvider.currentLanguageCode,
                                  ),
                                  overflow: TextOverflow.ellipsis,
                                ),
                              );
                            },
                          ),
                        ),
                        SizedBox(width: 4),
                        IconButton(
                          padding: EdgeInsets.all(8),
                          constraints: BoxConstraints(),
                          onPressed: () {
                            context.dataProvider.getAllProduct();
                          },
                          icon: Icon(Icons.refresh, size: 20),
                        ),
                      ],
                    ),
                  ),
                  Gap(defaultPadding),
                  ProductSummerySection(),
                  Gap(defaultPadding),
                  ProductListSection(),
                  Gap(defaultPadding),
                  OrderDetailsSection(),
                ],
              ),
            ] else ...[
              // Desktop layout: Side by side
              ClipRect(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      flex: 5,
                      child: Column(
                        children: [
                          ClipRect(
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Expanded(
                                  child: Consumer<LanguageProvider>(
                                    builder:
                                        (context, languageProvider, child) {
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
              ),
            ],
          ],
        ),
      ),
    );
  }
}
