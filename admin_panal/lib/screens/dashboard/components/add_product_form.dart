import '../../../models/brand.dart';
import '../../../models/category.dart';
import '../../../models/product.dart';
import '../../../models/sub_category.dart';
import '../../../models/variant_type.dart';
import '../provider/dash_board_provider.dart';
import '../../../utility/extensions.dart';
import '../../../widgets/multi_select_drop_down.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../utility/constants.dart';
import '../../../providers/language_provider.dart';
import '../../../utility/translations.dart' as AppTranslations;
import '../../../widgets/custom_dropdown.dart';
import '../../../widgets/custom_text_field.dart';
import '../../../widgets/product_image_card.dart';

class ProductSubmitForm extends StatelessWidget {
  final Product? product;

  const ProductSubmitForm({super.key, this.product});

  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    var isMobile = size.width < 950;
    context.dashBoardProvider.setDataForUpdateProduct(product);
    return SingleChildScrollView(
      child: Form(
        key: context.dashBoardProvider.addProductFormKey,
        //for unique identifier
        child: Padding(
          padding:
              EdgeInsets.all(isMobile ? defaultPadding / 2 : defaultPadding),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SizedBox(height: defaultPadding),
              isMobile
                  ? Column(
                      children: [
                        Consumer2<DashBoardProvider, LanguageProvider>(
                          builder:
                              (context, dashProvider, languageProvider, child) {
                            return ProductImageCard(
                              labelText: AppTranslations.Translations.get(
                                'main_image',
                                languageProvider.currentLanguageCode,
                              ),
                              imageFile: dashProvider.selectedMainImage,
                              imageUrlForUpdateImage:
                                  product?.images.safeElementAt(0)?.url,
                              onTap: () {
                                dashProvider.pickImage(imageCardNumber: 1);
                              },
                              onRemoveImage: () {
                                dashProvider.selectedMainImage = null;
                                dashProvider.updateUI();
                              },
                            );
                          },
                        ),
                        SizedBox(height: defaultPadding / 2),
                        Consumer2<DashBoardProvider, LanguageProvider>(
                          builder:
                              (context, dashProvider, languageProvider, child) {
                            return ProductImageCard(
                              labelText: AppTranslations.Translations.get(
                                'second_image',
                                languageProvider.currentLanguageCode,
                              ),
                              imageFile: dashProvider.selectedSecondImage,
                              imageUrlForUpdateImage:
                                  product?.images.safeElementAt(1)?.url,
                              onTap: () {
                                dashProvider.pickImage(imageCardNumber: 2);
                              },
                              onRemoveImage: () {
                                dashProvider.selectedSecondImage = null;
                                dashProvider.updateUI();
                              },
                            );
                          },
                        ),
                        SizedBox(height: defaultPadding / 2),
                        Consumer2<DashBoardProvider, LanguageProvider>(
                          builder:
                              (context, dashProvider, languageProvider, child) {
                            return ProductImageCard(
                              labelText: AppTranslations.Translations.get(
                                'third_image',
                                languageProvider.currentLanguageCode,
                              ),
                              imageFile: dashProvider.selectedThirdImage,
                              imageUrlForUpdateImage:
                                  product?.images.safeElementAt(2)?.url,
                              onTap: () {
                                dashProvider.pickImage(imageCardNumber: 3);
                              },
                              onRemoveImage: () {
                                dashProvider.selectedThirdImage = null;
                                dashProvider.updateUI();
                              },
                            );
                          },
                        ),
                        SizedBox(height: defaultPadding / 2),
                        Consumer2<DashBoardProvider, LanguageProvider>(
                          builder:
                              (context, dashProvider, languageProvider, child) {
                            return ProductImageCard(
                              labelText: AppTranslations.Translations.get(
                                'fourth_image',
                                languageProvider.currentLanguageCode,
                              ),
                              imageFile: dashProvider.selectedFourthImage,
                              imageUrlForUpdateImage:
                                  product?.images.safeElementAt(3)?.url,
                              onTap: () {
                                dashProvider.pickImage(imageCardNumber: 4);
                              },
                              onRemoveImage: () {
                                dashProvider.selectedFourthImage = null;
                                dashProvider.updateUI();
                              },
                            );
                          },
                        ),
                        SizedBox(height: defaultPadding / 2),
                        Consumer2<DashBoardProvider, LanguageProvider>(
                          builder:
                              (context, dashProvider, languageProvider, child) {
                            return ProductImageCard(
                              labelText: AppTranslations.Translations.get(
                                'fifth_image',
                                languageProvider.currentLanguageCode,
                              ),
                              imageFile: dashProvider.selectedFifthImage,
                              imageUrlForUpdateImage:
                                  product?.images.safeElementAt(4)?.url,
                              onTap: () {
                                dashProvider.pickImage(imageCardNumber: 5);
                              },
                              onRemoveImage: () {
                                dashProvider.selectedFifthImage = null;
                                dashProvider.updateUI();
                              },
                            );
                          },
                        ),
                      ],
                    )
                  : Wrap(
                      spacing: defaultPadding / 2,
                      runSpacing: defaultPadding / 2,
                      alignment: WrapAlignment.spaceEvenly,
                      children: [
                        Consumer2<DashBoardProvider, LanguageProvider>(
                          builder:
                              (context, dashProvider, languageProvider, child) {
                            return ProductImageCard(
                              labelText: AppTranslations.Translations.get(
                                'main_image',
                                languageProvider.currentLanguageCode,
                              ),
                              imageFile: dashProvider.selectedMainImage,
                              imageUrlForUpdateImage:
                                  product?.images.safeElementAt(0)?.url,
                              onTap: () {
                                dashProvider.pickImage(imageCardNumber: 1);
                              },
                              onRemoveImage: () {
                                dashProvider.selectedMainImage = null;
                                dashProvider.updateUI();
                              },
                            );
                          },
                        ),
                        Consumer2<DashBoardProvider, LanguageProvider>(
                          builder:
                              (context, dashProvider, languageProvider, child) {
                            return ProductImageCard(
                              labelText: AppTranslations.Translations.get(
                                'second_image',
                                languageProvider.currentLanguageCode,
                              ),
                              imageFile: dashProvider.selectedSecondImage,
                              imageUrlForUpdateImage:
                                  product?.images.safeElementAt(1)?.url,
                              onTap: () {
                                dashProvider.pickImage(imageCardNumber: 2);
                              },
                              onRemoveImage: () {
                                dashProvider.selectedSecondImage = null;
                                dashProvider.updateUI();
                              },
                            );
                          },
                        ),
                        Consumer2<DashBoardProvider, LanguageProvider>(
                          builder:
                              (context, dashProvider, languageProvider, child) {
                            return ProductImageCard(
                              labelText: AppTranslations.Translations.get(
                                'third_image',
                                languageProvider.currentLanguageCode,
                              ),
                              imageFile: dashProvider.selectedThirdImage,
                              imageUrlForUpdateImage:
                                  product?.images.safeElementAt(2)?.url,
                              onTap: () {
                                dashProvider.pickImage(imageCardNumber: 3);
                              },
                              onRemoveImage: () {
                                dashProvider.selectedThirdImage = null;
                                dashProvider.updateUI();
                              },
                            );
                          },
                        ),
                        Consumer2<DashBoardProvider, LanguageProvider>(
                          builder:
                              (context, dashProvider, languageProvider, child) {
                            return ProductImageCard(
                              labelText: AppTranslations.Translations.get(
                                'fourth_image',
                                languageProvider.currentLanguageCode,
                              ),
                              imageFile: dashProvider.selectedFourthImage,
                              imageUrlForUpdateImage:
                                  product?.images.safeElementAt(3)?.url,
                              onTap: () {
                                dashProvider.pickImage(imageCardNumber: 4);
                              },
                              onRemoveImage: () {
                                dashProvider.selectedFourthImage = null;
                                dashProvider.updateUI();
                              },
                            );
                          },
                        ),
                        Consumer2<DashBoardProvider, LanguageProvider>(
                          builder:
                              (context, dashProvider, languageProvider, child) {
                            return ProductImageCard(
                              labelText: AppTranslations.Translations.get(
                                'fifth_image',
                                languageProvider.currentLanguageCode,
                              ),
                              imageFile: dashProvider.selectedFifthImage,
                              imageUrlForUpdateImage:
                                  product?.images.safeElementAt(4)?.url,
                              onTap: () {
                                dashProvider.pickImage(imageCardNumber: 5);
                              },
                              onRemoveImage: () {
                                dashProvider.selectedFifthImage = null;
                                dashProvider.updateUI();
                              },
                            );
                          },
                        ),
                      ],
                    ),
              SizedBox(height: defaultPadding),
              Consumer<LanguageProvider>(
                builder: (context, languageProvider, child) {
                  return CustomTextField(
                    controller: context.dashBoardProvider.productNameCtrl,
                    labelText: AppTranslations.Translations.get(
                      'product_name',
                      languageProvider.currentLanguageCode,
                    ),
                    onSave: (val) {},
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return AppTranslations.Translations.get(
                          'please_enter_name',
                          languageProvider.currentLanguageCode,
                        );
                      }
                      return null;
                    },
                  );
                },
              ),
              SizedBox(height: defaultPadding),
              Consumer<LanguageProvider>(
                builder: (context, languageProvider, child) {
                  return CustomTextField(
                    controller: context.dashBoardProvider.productDescCtrl,
                    labelText: AppTranslations.Translations.get(
                      'product_description',
                      languageProvider.currentLanguageCode,
                    ),
                    lineNumber: 3,
                    onSave: (val) {},
                  );
                },
              ),
              SizedBox(height: defaultPadding),
              isMobile
                  ? Column(
                      children: [
                        Consumer2<DashBoardProvider, LanguageProvider>(
                          builder:
                              (context, dashProvider, languageProvider, child) {
                            return CustomDropdown(
                              key: ValueKey(dashProvider.selectedCategory?.sId),
                              initialValue: dashProvider.selectedCategory,
                              hintText: dashProvider.selectedCategory?.name ??
                                  AppTranslations.Translations.get(
                                    'select_category',
                                    languageProvider.currentLanguageCode,
                                  ),
                              items: context.dataProvider.categories,
                              displayItem: (Category? category) =>
                                  category?.name ?? '',
                              onChanged: (newValue) {
                                if (newValue != null) {
                                  context.dashBoardProvider
                                      .filterSubcategory(newValue);
                                }
                              },
                              validator: (value) {
                                if (value == null) {
                                  return AppTranslations.Translations.get(
                                    'please_select_category',
                                    languageProvider.currentLanguageCode,
                                  );
                                }
                                return null;
                              },
                            );
                          },
                        ),
                        SizedBox(height: defaultPadding),
                        Consumer2<DashBoardProvider, LanguageProvider>(
                          builder:
                              (context, dashProvider, languageProvider, child) {
                            return CustomDropdown(
                              key: ValueKey(
                                  dashProvider.selectedSubCategory?.sId),
                              hintText:
                                  dashProvider.selectedSubCategory?.name ??
                                      AppTranslations.Translations.get(
                                        'sub_category',
                                        languageProvider.currentLanguageCode,
                                      ),
                              items: dashProvider.subCategoriesByCategory,
                              initialValue: dashProvider.selectedSubCategory,
                              displayItem: (SubCategory? subCategory) =>
                                  subCategory?.name ?? '',
                              onChanged: (newValue) {
                                if (newValue != null) {
                                  context.dashBoardProvider
                                      .filterBrand(newValue);
                                }
                              },
                              validator: (value) {
                                if (value == null) {
                                  return AppTranslations.Translations.get(
                                    'please_select_sub_category',
                                    languageProvider.currentLanguageCode,
                                  );
                                }
                                return null;
                              },
                            );
                          },
                        ),
                        SizedBox(height: defaultPadding),
                        Consumer2<DashBoardProvider, LanguageProvider>(
                          builder:
                              (context, dashProvider, languageProvider, child) {
                            return CustomDropdown(
                              key: ValueKey(dashProvider.selectedBrand?.sId),
                              initialValue: dashProvider.selectedBrand,
                              items: dashProvider.brandsBySubCategory,
                              hintText: dashProvider.selectedBrand?.name ??
                                  AppTranslations.Translations.get(
                                    'select_brand',
                                    languageProvider.currentLanguageCode,
                                  ),
                              displayItem: (Brand? brand) => brand?.name ?? '',
                              onChanged: (newValue) {
                                if (newValue != null) {
                                  dashProvider.selectedBrand = newValue;
                                  dashProvider.updateUI();
                                }
                              },
                              validator: (value) {
                                if (value == null) {
                                  return AppTranslations.Translations.get(
                                    'please_select_brand',
                                    languageProvider.currentLanguageCode,
                                  );
                                }
                                return null;
                              },
                            );
                          },
                        ),
                      ],
                    )
                  : Row(
                      children: [
                        Expanded(
                          child: Consumer2<DashBoardProvider, LanguageProvider>(
                            builder: (context, dashProvider, languageProvider,
                                child) {
                              return CustomDropdown(
                                key: ValueKey(
                                    dashProvider.selectedCategory?.sId),
                                initialValue: dashProvider.selectedCategory,
                                hintText: dashProvider.selectedCategory?.name ??
                                    AppTranslations.Translations.get(
                                      'select_category',
                                      languageProvider.currentLanguageCode,
                                    ),
                                items: context.dataProvider.categories,
                                displayItem: (Category? category) =>
                                    category?.name ?? '',
                                onChanged: (newValue) {
                                  if (newValue != null) {
                                    context.dashBoardProvider
                                        .filterSubcategory(newValue);
                                  }
                                },
                                validator: (value) {
                                  if (value == null) {
                                    return AppTranslations.Translations.get(
                                      'please_select_category',
                                      languageProvider.currentLanguageCode,
                                    );
                                  }
                                  return null;
                                },
                              );
                            },
                          ),
                        ),
                        Expanded(
                          child: Consumer2<DashBoardProvider, LanguageProvider>(
                            builder: (context, dashProvider, languageProvider,
                                child) {
                              return CustomDropdown(
                                key: ValueKey(
                                    dashProvider.selectedSubCategory?.sId),
                                hintText:
                                    dashProvider.selectedSubCategory?.name ??
                                        AppTranslations.Translations.get(
                                          'sub_category',
                                          languageProvider.currentLanguageCode,
                                        ),
                                items: dashProvider.subCategoriesByCategory,
                                initialValue: dashProvider.selectedSubCategory,
                                displayItem: (SubCategory? subCategory) =>
                                    subCategory?.name ?? '',
                                onChanged: (newValue) {
                                  if (newValue != null) {
                                    context.dashBoardProvider
                                        .filterBrand(newValue);
                                  }
                                },
                                validator: (value) {
                                  if (value == null) {
                                    return AppTranslations.Translations.get(
                                      'please_select_sub_category',
                                      languageProvider.currentLanguageCode,
                                    );
                                  }
                                  return null;
                                },
                              );
                            },
                          ),
                        ),
                        Expanded(
                          child: Consumer2<DashBoardProvider, LanguageProvider>(
                            builder: (context, dashProvider, languageProvider,
                                child) {
                              return CustomDropdown(
                                key: ValueKey(dashProvider.selectedBrand?.sId),
                                initialValue: dashProvider.selectedBrand,
                                items: dashProvider.brandsBySubCategory,
                                hintText: dashProvider.selectedBrand?.name ??
                                    AppTranslations.Translations.get(
                                      'select_brand',
                                      languageProvider.currentLanguageCode,
                                    ),
                                displayItem: (Brand? brand) =>
                                    brand?.name ?? '',
                                onChanged: (newValue) {
                                  if (newValue != null) {
                                    dashProvider.selectedBrand = newValue;
                                    dashProvider.updateUI();
                                  }
                                },
                                validator: (value) {
                                  if (value == null) {
                                    return AppTranslations.Translations.get(
                                      'please_select_brand',
                                      languageProvider.currentLanguageCode,
                                    );
                                  }
                                  return null;
                                },
                              );
                            },
                          ),
                        ),
                      ],
                    ),
              SizedBox(height: defaultPadding),
              Consumer<LanguageProvider>(
                builder: (context, languageProvider, child) {
                  return isMobile
                      ? Column(
                          children: [
                            CustomTextField(
                              controller:
                                  context.dashBoardProvider.productPriceCtrl,
                              labelText: AppTranslations.Translations.get(
                                'price',
                                languageProvider.currentLanguageCode,
                              ),
                              inputType: TextInputType.number,
                              onSave: (val) {},
                              validator: (value) {
                                if (value == null) {
                                  return AppTranslations.Translations.get(
                                    'please_enter_price',
                                    languageProvider.currentLanguageCode,
                                  );
                                }
                                return null;
                              },
                            ),
                            SizedBox(height: defaultPadding),
                            CustomTextField(
                              controller:
                                  context.dashBoardProvider.productOffPriceCtrl,
                              labelText: AppTranslations.Translations.get(
                                'offer_price',
                                languageProvider.currentLanguageCode,
                              ),
                              inputType: TextInputType.number,
                              onSave: (val) {},
                            ),
                            SizedBox(height: defaultPadding),
                            CustomTextField(
                              controller:
                                  context.dashBoardProvider.productQntCtrl,
                              labelText: AppTranslations.Translations.get(
                                'quantity',
                                languageProvider.currentLanguageCode,
                              ),
                              inputType: TextInputType.number,
                              onSave: (val) {},
                              validator: (value) {
                                if (value == null) {
                                  return AppTranslations.Translations.get(
                                    'please_enter_quantity',
                                    languageProvider.currentLanguageCode,
                                  );
                                }
                                return null;
                              },
                            ),
                          ],
                        )
                      : Row(
                          children: [
                            Expanded(
                              child: CustomTextField(
                                controller:
                                    context.dashBoardProvider.productPriceCtrl,
                                labelText: AppTranslations.Translations.get(
                                  'price',
                                  languageProvider.currentLanguageCode,
                                ),
                                inputType: TextInputType.number,
                                onSave: (val) {},
                                validator: (value) {
                                  if (value == null) {
                                    return AppTranslations.Translations.get(
                                      'please_enter_price',
                                      languageProvider.currentLanguageCode,
                                    );
                                  }
                                  return null;
                                },
                              ),
                            ),
                            Expanded(
                              child: CustomTextField(
                                controller: context
                                    .dashBoardProvider.productOffPriceCtrl,
                                labelText: AppTranslations.Translations.get(
                                  'offer_price',
                                  languageProvider.currentLanguageCode,
                                ),
                                inputType: TextInputType.number,
                                onSave: (val) {},
                              ),
                            ),
                            Expanded(
                              child: CustomTextField(
                                controller:
                                    context.dashBoardProvider.productQntCtrl,
                                labelText: AppTranslations.Translations.get(
                                  'quantity',
                                  languageProvider.currentLanguageCode,
                                ),
                                inputType: TextInputType.number,
                                onSave: (val) {},
                                validator: (value) {
                                  if (value == null) {
                                    return AppTranslations.Translations.get(
                                      'please_enter_quantity',
                                      languageProvider.currentLanguageCode,
                                    );
                                  }
                                  return null;
                                },
                              ),
                            ),
                          ],
                        );
                },
              ),
              SizedBox(width: defaultPadding),
              isMobile
                  ? Column(
                      children: [
                        Consumer2<DashBoardProvider, LanguageProvider>(
                          builder:
                              (context, dashProvider, languageProvider, child) {
                            return CustomDropdown(
                              key: ValueKey(
                                  dashProvider.selectedVariantType?.sId),
                              initialValue: dashProvider.selectedVariantType,
                              items: context.dataProvider.variantTypes,
                              displayItem: (VariantType? variantType) =>
                                  variantType?.name ?? '',
                              onChanged: (newValue) {
                                if (newValue != null) {
                                  context.dashBoardProvider
                                      .filterVariant(newValue);
                                }
                              },
                              hintText: AppTranslations.Translations.get(
                                'select_variant_type',
                                languageProvider.currentLanguageCode,
                              ),
                            );
                          },
                        ),
                        SizedBox(height: defaultPadding),
                        Consumer2<DashBoardProvider, LanguageProvider>(
                          builder:
                              (context, dashProvider, languageProvider, child) {
                            final filteredSelectedItems = dashProvider
                                .selectedVariants
                                .where((item) => dashProvider
                                    .variantsByVariantType
                                    .contains(item))
                                .toList();
                            return MultiSelectDropDown(
                              items: dashProvider.variantsByVariantType,
                              onSelectionChanged: (newValue) {
                                dashProvider.selectedVariants = newValue;
                                dashProvider.updateUI();
                              },
                              displayItem: (String item) => item,
                              selectedItems: filteredSelectedItems,
                              hintText: AppTranslations.Translations.get(
                                'select_variants',
                                languageProvider.currentLanguageCode,
                              ),
                            );
                          },
                        ),
                      ],
                    )
                  : Row(
                      children: [
                        Expanded(
                          child: Consumer2<DashBoardProvider, LanguageProvider>(
                            builder: (context, dashProvider, languageProvider,
                                child) {
                              return CustomDropdown(
                                key: ValueKey(
                                    dashProvider.selectedVariantType?.sId),
                                initialValue: dashProvider.selectedVariantType,
                                items: context.dataProvider.variantTypes,
                                displayItem: (VariantType? variantType) =>
                                    variantType?.name ?? '',
                                onChanged: (newValue) {
                                  if (newValue != null) {
                                    context.dashBoardProvider
                                        .filterVariant(newValue);
                                  }
                                },
                                hintText: AppTranslations.Translations.get(
                                  'select_variant_type',
                                  languageProvider.currentLanguageCode,
                                ),
                              );
                            },
                          ),
                        ),
                        Expanded(
                          child: Consumer2<DashBoardProvider, LanguageProvider>(
                            builder: (context, dashProvider, languageProvider,
                                child) {
                              final filteredSelectedItems = dashProvider
                                  .selectedVariants
                                  .where((item) => dashProvider
                                      .variantsByVariantType
                                      .contains(item))
                                  .toList();
                              return MultiSelectDropDown(
                                items: dashProvider.variantsByVariantType,
                                onSelectionChanged: (newValue) {
                                  dashProvider.selectedVariants = newValue;
                                  dashProvider.updateUI();
                                },
                                displayItem: (String item) => item,
                                selectedItems: filteredSelectedItems,
                                hintText: AppTranslations.Translations.get(
                                  'select_variants',
                                  languageProvider.currentLanguageCode,
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
              SizedBox(height: defaultPadding),
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
                          if (context
                              .dashBoardProvider.addProductFormKey.currentState!
                              .validate()) {
                            context.dashBoardProvider.addProductFormKey
                                .currentState!
                                .save();
                            context.dashBoardProvider.submitProduct();
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

//show the popup
void showAddProductForm(BuildContext context, Product? product) {
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
                maxWidth: 1200,
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
                      (product == null
                              ? AppTranslations.Translations.get(
                                  'add_new',
                                  languageProvider.currentLanguageCode,
                                )
                              : AppTranslations.Translations.get(
                                  'update',
                                  languageProvider.currentLanguageCode,
                                ))
                          .toUpperCase(),
                      style: TextStyle(
                        color: primaryColor,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Flexible(
                    child: ProductSubmitForm(product: product),
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

extension SafeList<T> on List<T>? {
  T? safeElementAt(int index) {
    if (this == null || index < 0 || index >= this!.length) {
      return null;
    }
    return this![index];
  }
}
