import '../../../models/product.dart';
import '../../../models/sub_category.dart';
import '../provider/coupon_code_provider.dart';
import '../../../utility/extensions.dart';
import 'package:flutter/material.dart';
import 'package:gap/gap.dart';
import 'package:provider/provider.dart';
import '../../../models/category.dart';
import '../../../models/coupon.dart';
import '../../../utility/constants.dart';
import '../../../providers/language_provider.dart';
import '../../../utility/translations.dart' as AppTranslations;
import '../../../widgets/custom_date_picker.dart';
import '../../../widgets/custom_dropdown.dart';
import '../../../widgets/custom_text_field.dart';

class CouponSubmitForm extends StatelessWidget {
  final Coupon? coupon;

  const CouponSubmitForm({Key? key, this.coupon}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var size = MediaQuery.of(context).size;
    context.couponCodeProvider.setDataForUpdateCoupon(coupon);
    return SingleChildScrollView(
      child: Form(
        key: context.couponCodeProvider.addCouponFormKey,
        child: Container(
          width: size.width * 0.7,
          padding: EdgeInsets.all(defaultPadding),
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
                  return Row(
                    children: [
                      Expanded(
                        child: CustomTextField(
                          controller: context.couponCodeProvider.couponCodeCtrl,
                          labelText: AppTranslations.Translations.get(
                            'coupon_code',
                            languageProvider.currentLanguageCode,
                          ),
                          onSave: (val) {},
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return AppTranslations.Translations.get(
                                'please_enter_coupon_code',
                                languageProvider.currentLanguageCode,
                              );
                            }
                            return null;
                          },
                        ),
                      ),
                      Expanded(
                        child: CustomDropdown(
                          key: GlobalKey(),
                          hintText: AppTranslations.Translations.get(
                            'discount_type',
                            languageProvider.currentLanguageCode,
                          ),
                          items: [
                            AppTranslations.Translations.get('fixed', languageProvider.currentLanguageCode),
                            AppTranslations.Translations.get('percentage', languageProvider.currentLanguageCode),
                          ],
                          initialValue: context.couponCodeProvider.selectedDiscountType == 'fixed'
                              ? AppTranslations.Translations.get('fixed', languageProvider.currentLanguageCode)
                              : AppTranslations.Translations.get('percentage', languageProvider.currentLanguageCode),
                          onChanged: (newValue) {
                            if (newValue == AppTranslations.Translations.get('fixed', languageProvider.currentLanguageCode)) {
                              context.couponCodeProvider.selectedDiscountType = 'fixed';
                            } else {
                              context.couponCodeProvider.selectedDiscountType = 'percentage';
                            }
                          },
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return AppTranslations.Translations.get(
                                'please_select_discount_type',
                                languageProvider.currentLanguageCode,
                              );
                            }
                            return null;
                          },
                          displayItem: (val) => val,
                        ),
                      ),
                    ],
                  );
                },
              ),
              Gap(defaultPadding),
              Consumer<LanguageProvider>(
                builder: (context, languageProvider, child) {
                  return Row(
                    children: [
                      Expanded(
                        child: CustomTextField(
                          controller: context.couponCodeProvider.discountAmountCtrl,
                          labelText: AppTranslations.Translations.get(
                            'discount_amount',
                            languageProvider.currentLanguageCode,
                          ),
                          inputType: TextInputType.number,
                          onSave: (val) {},
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return AppTranslations.Translations.get(
                                'please_enter_discount_amount',
                                languageProvider.currentLanguageCode,
                              );
                            }
                            return null;
                          },
                        ),
                      ),
                      Expanded(
                        child: CustomTextField(
                          controller: context.couponCodeProvider.minimumPurchaseAmountCtrl,
                          labelText: AppTranslations.Translations.get(
                            'minimum_purchase_amount',
                            languageProvider.currentLanguageCode,
                          ),
                          inputType: TextInputType.number,
                          onSave: (val) {},
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return AppTranslations.Translations.get(
                                'please_enter_minimum_purchase_amount',
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
              Gap(defaultPadding),
              Consumer<LanguageProvider>(
                builder: (context, languageProvider, child) {
                  return Row(
                    children: [
                      Expanded(
                        child: CustomDatePicker(
                          labelText: AppTranslations.Translations.get(
                            'select_date',
                            languageProvider.currentLanguageCode,
                          ),
                          controller: context.couponCodeProvider.endDateCtrl,
                          initialDate: DateTime.now(),
                          firstDate: DateTime(2000),
                          lastDate: DateTime(2100),
                          onDateSelected: (DateTime date) {
                            print('Selected Date: $date');
                          },
                        ),
                      ),
                      Expanded(
                        child: CustomDropdown(
                          key: GlobalKey(),
                          hintText: AppTranslations.Translations.get(
                            'status',
                            languageProvider.currentLanguageCode,
                          ),
                          initialValue: context.couponCodeProvider.selectedCouponStatus == 'active'
                              ? AppTranslations.Translations.get('active', languageProvider.currentLanguageCode)
                              : AppTranslations.Translations.get('inactive', languageProvider.currentLanguageCode),
                          items: [
                            AppTranslations.Translations.get('active', languageProvider.currentLanguageCode),
                            AppTranslations.Translations.get('inactive', languageProvider.currentLanguageCode),
                          ],
                          displayItem: (val) => val,
                          onChanged: (newValue) {
                            if (newValue == AppTranslations.Translations.get('active', languageProvider.currentLanguageCode)) {
                              context.couponCodeProvider.selectedCouponStatus = 'active';
                            } else {
                              context.couponCodeProvider.selectedCouponStatus = 'inactive';
                            }
                          },
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return AppTranslations.Translations.get(
                                'please_select_status',
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
              Consumer2<CouponCodeProvider, LanguageProvider>(
                builder: (context, couponProvider, languageProvider, child) {
                  return Row(
                    children: [
                      Expanded(
                        child: CustomDropdown(
                          initialValue: couponProvider.selectedCategory,
                          hintText: couponProvider.selectedCategory?.name ??
                              AppTranslations.Translations.get(
                                'select_category',
                                languageProvider.currentLanguageCode,
                              ),
                          items: context.dataProvider.categories,
                          displayItem: (Category? category) =>
                              category?.name ?? '',
                          onChanged: (newValue) {
                            if (newValue != null) {
                              couponProvider.selectedSubCategory = null;
                              couponProvider.selectedProduct = null;
                              couponProvider.selectedCategory = newValue;
                              couponProvider.updateUi();
                            }
                          },
                        ),
                      ),
                      Expanded(
                        child: CustomDropdown(
                          initialValue: couponProvider.selectedSubCategory,
                          hintText: couponProvider.selectedSubCategory?.name ??
                              AppTranslations.Translations.get(
                                'select_sub_category',
                                languageProvider.currentLanguageCode,
                              ),
                          items: context.dataProvider.subCategories,
                          displayItem: (SubCategory? subCategory) =>
                              subCategory?.name ?? '',
                          onChanged: (newValue) {
                            if (newValue != null) {
                              couponProvider.selectedCategory = null;
                              couponProvider.selectedProduct = null;
                              couponProvider.selectedSubCategory = newValue;
                              couponProvider.updateUi();
                            }
                          },
                        ),
                      ),
                      Expanded(
                        child: CustomDropdown(
                          initialValue: couponProvider.selectedProduct,
                          hintText: couponProvider.selectedProduct?.name ??
                              AppTranslations.Translations.get(
                                'select_product',
                                languageProvider.currentLanguageCode,
                              ),
                          items: context.dataProvider.products,
                          displayItem: (Product? product) =>
                              product?.name ?? '',
                          onChanged: (newValue) {
                            if (newValue != null) {
                              couponProvider.selectedCategory = null;
                              couponProvider.selectedSubCategory = null;
                              couponProvider.selectedProduct = newValue;
                              couponProvider.updateUi();
                            }
                          },
                        ),
                      ),
                    ],
                  );
                },
              ),
              Gap(defaultPadding),
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
                              .couponCodeProvider.addCouponFormKey.currentState!
                              .validate()) {
                            context
                                .couponCodeProvider.addCouponFormKey.currentState!
                                .save();
                            context.couponCodeProvider.submitCoupon();
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

// How to show the popup
void showAddCouponForm(BuildContext context, Coupon? coupon) {
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
                  'add_coupon',
                  languageProvider.currentLanguageCode,
                ).toUpperCase(),
                style: TextStyle(color: primaryColor),
              ),
            ),
            content: CouponSubmitForm(coupon: coupon),
          );
        },
      );
    },
  );
}
