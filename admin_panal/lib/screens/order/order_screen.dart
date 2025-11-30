import 'package:admin/utility/extensions.dart';
import 'components/order_header.dart';
import 'components/order_list_section.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:provider/provider.dart';
import '../../utility/constants.dart';
import '../../providers/language_provider.dart';
import '../../utility/translations.dart' as AppTranslations;
import '../../widgets/custom_dropdown.dart';

class OrderScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: SingleChildScrollView(
        primary: false,
        padding: EdgeInsets.all(defaultPadding),
        child: Column(
          children: [
            OrderHeader(),
            SizedBox(height: defaultPadding),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  flex: 5,
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Expanded(
                            child: Consumer<LanguageProvider>(
                              builder: (context, languageProvider, child) {
                                return Text(
                                  AppTranslations.Translations.get(
                                    'my_orders',
                                    languageProvider.currentLanguageCode,
                                  ),
                                  style: Theme.of(
                                    context,
                                  ).textTheme.titleMedium,
                                );
                              },
                            ),
                          ),
                          Gap(20),
                          Consumer<LanguageProvider>(
                            builder: (context, languageProvider, child) {
                              // Map English status values to their translated display values
                              final statusMap = {
                                'all': AppTranslations.Translations.get(
                                  'all_order',
                                  languageProvider.currentLanguageCode,
                                ),
                                'pending': AppTranslations.Translations.get(
                                  'pending',
                                  languageProvider.currentLanguageCode,
                                ),
                                'processing': AppTranslations.Translations.get(
                                  'processing',
                                  languageProvider.currentLanguageCode,
                                ),
                                'shipped': AppTranslations.Translations.get(
                                  'shipped',
                                  languageProvider.currentLanguageCode,
                                ),
                                'delivered': AppTranslations.Translations.get(
                                  'delivered',
                                  languageProvider.currentLanguageCode,
                                ),
                                'cancelled': AppTranslations.Translations.get(
                                  'cancelled',
                                  languageProvider.currentLanguageCode,
                                ),
                              };

                              return SizedBox(
                                width: 280,
                                child: CustomDropdown<String>(
                                  hintText: AppTranslations.Translations.get(
                                    'filter_order_by_status',
                                    languageProvider.currentLanguageCode,
                                  ),
                                  initialValue: 'all',
                                  items: ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'],
                                  displayItem: (val) => statusMap[val] ?? val,
                                  onChanged: (newValue) {
                                    if (newValue == 'all' || newValue == null) {
                                      context.dataProvider.filterOrders('');
                                    } else {
                                      // Pass English status value for filtering
                                      context.dataProvider.filterOrders(newValue);
                                    }
                                  },
                                  validator: (value) {
                                    if (value == null) {
                                      return AppTranslations.Translations.get(
                                        'please_select_status',
                                        languageProvider.currentLanguageCode,
                                      );
                                    }
                                    return null;
                                  },
                                ),
                              );
                            },
                          ),
                          Gap(40),
                          IconButton(
                            onPressed: () {
                              context.dataProvider.getAllOrders(
                                showSnack: true,
                              );
                            },
                            icon: Icon(Icons.refresh),
                          ),
                        ],
                      ),
                      Gap(defaultPadding),
                      OrderListSection(),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
