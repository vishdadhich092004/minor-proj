import 'package:e_commerce_app/utility/extensions.dart';
import '../../utility/app_color.dart';
import 'provider/product_detail_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../../widget/carousel_slider.dart';
import '../../../../widget/page_wrapper.dart';
import '../../models/product.dart';
import '../../widget/horizondal_list.dart';
import 'components/product_rating_section.dart';
import '../../core/data/data_provider.dart';
import '../../providers/language_provider.dart';
import '../../utility/translations.dart' as AppTranslations;
import '../../widget/translated_text.dart';

class ProductDetailScreen extends StatelessWidget {
  final Product product;

  const ProductDetailScreen(this.product, {super.key});

  @override
  Widget build(BuildContext context) {
    double height = MediaQuery.of(context).size.height;
    double width = MediaQuery.of(context).size.width;
    return SafeArea(
      child: Scaffold(
        extendBodyBehindAppBar: true,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: IconButton(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.arrow_back, color: Colors.black),
          ),
        ),
        body: SingleChildScrollView(
          child: PageWrapper(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                //? product image section
                Container(
                  height: height * 0.42,
                  width: width,
                  decoration: const BoxDecoration(
                    color: Color(0xFFE5E6E8),
                    borderRadius: BorderRadius.only(
                      bottomRight: Radius.circular(200),
                      bottomLeft: Radius.circular(200),
                    ),
                  ),
                  child: CarouselSlider(items: product.images ?? []),
                ),
                const SizedBox(height: 20),
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      //? product name (automatically translated)
                      TranslatedText(
                        product.name ?? '',
                        style: Theme.of(context).textTheme.displayMedium,
                      ),
                      const SizedBox(height: 10),
                      //? product rating section
                      const ProductRatingSection(),
                      const SizedBox(height: 10),
                      //? product rate , offer , stock section
                      Row(
                        children: [
                          Text(
                            product.offerPrice != null
                                ? "Rs${product.offerPrice}"
                                : "Rs${product.price}",
                            style: Theme.of(context).textTheme.displayLarge,
                          ),
                          const SizedBox(width: 3),
                          Visibility(
                            visible: product.offerPrice != product.price,
                            child: Text(
                              "Rs${product.price}",
                              style: const TextStyle(
                                decoration: TextDecoration.lineThrough,
                                color: Colors.grey,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          const Spacer(),
                          Consumer<LanguageProvider>(
                            builder: (context, languageProvider, child) {
                              return Text(
                                product.quantity != 0
                                    ? "${AppTranslations.Translations.get('available_stock', languageProvider.currentLanguageCode)} : ${product.quantity}"
                                    : AppTranslations.Translations.get(
                                        'not_available',
                                        languageProvider.currentLanguageCode),
                                style: const TextStyle(
                                    fontWeight: FontWeight.w500),
                              );
                            },
                          )
                        ],
                      ),
                      const SizedBox(height: 30),
                      product.proVariantId!.isNotEmpty
                          ? Consumer<LanguageProvider>(
                              builder: (context, languageProvider, child) {
                                return FutureBuilder<String>(
                                  future: languageProvider.translate(
                                      'Available ${product.proVariantTypeId?.type ?? ''}'),
                                  builder: (context, snapshot) {
                                    return Text(
                                      snapshot.data ??
                                          'Available ${product.proVariantTypeId?.type ?? ''}',
                                      style: const TextStyle(
                                          color: Colors.red, fontSize: 16),
                                    );
                                  },
                                );
                              },
                            )
                          : const SizedBox(),
                      Consumer2<ProductDetailProvider, DataProvider>(
                        builder:
                            (context, proDetailProvider, dataProvider, child) {
                          // Get variant names from the map
                          final variantNames = (product.proVariantId ?? [])
                              .map((variantId) =>
                                  dataProvider.variantIdToNameMap[variantId] ??
                                  variantId)
                              .where((name) => name.isNotEmpty)
                              .toList();

                          String? selectedVariantName;
                          if (proDetailProvider.selectedVariant != null) {
                            selectedVariantName =
                                dataProvider.variantIdToNameMap[
                                        proDetailProvider.selectedVariant] ??
                                    proDetailProvider.selectedVariant;
                          }

                          return HorizontalList(
                            items: variantNames,
                            itemToString: (val) => val,
                            selected: selectedVariantName,
                            onSelect: (val) {
                              // Find the variant ID that corresponds to the selected name
                              final variantId =
                                  dataProvider.variantIdToNameMap.entries
                                      .firstWhere(
                                        (entry) => entry.value == val,
                                        orElse: () => MapEntry('', val),
                                      )
                                      .key;
                              proDetailProvider.selectedVariant =
                                  variantId.isNotEmpty ? variantId : val;
                              proDetailProvider.updateUI();
                            },
                          );
                        },
                      ),
                      //? product description (automatically translated)
                      Consumer<LanguageProvider>(
                        builder: (context, languageProvider, child) {
                          return Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                AppTranslations.Translations.get('about',
                                    languageProvider.currentLanguageCode),
                                style:
                                    Theme.of(context).textTheme.headlineMedium,
                              ),
                              const SizedBox(height: 10),
                              TranslatedText(
                                product.description ?? '',
                              ),
                            ],
                          );
                        },
                      ),
                      const SizedBox(height: 40),
                      //? add to cart button
                      Consumer<LanguageProvider>(
                        builder: (context, languageProvider, child) {
                          return SizedBox(
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                onPressed: product.quantity != 0
                                    ? () {
                                        context.proDetailProvider.addToCart(
                                            product,
                                            languageProvider: languageProvider);
                                      }
                                    : null,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: product.quantity != 0
                                      ? AppColor.primaryOrange
                                      : Colors.grey[400],
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 20, vertical: 12),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  elevation: 2,
                                ),
                                icon: const Icon(Icons.shopping_cart_outlined,
                                    color: Colors.white, size: 20),
                                label: Text(
                                  product.quantity != 0
                                      ? AppTranslations.Translations.get(
                                          'add_to_cart',
                                          languageProvider.currentLanguageCode)
                                      : AppTranslations.Translations.get(
                                          'out_of_stock',
                                          languageProvider.currentLanguageCode),
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w600,
                                    fontSize: 16,
                                  ),
                                ),
                              ));
                        },
                      )
                    ],
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
