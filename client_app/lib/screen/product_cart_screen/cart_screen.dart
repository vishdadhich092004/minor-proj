import 'provider/cart_provider.dart';
import '../../utility/extensions.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../utility/animation/animated_switcher_wrapper.dart';
import '../../utility/app_color.dart';
import 'components/buy_now_bottom_sheet.dart';
import 'components/cart_list_section.dart';
import 'components/empty_cart.dart';
import '../../providers/language_provider.dart';
import '../../utility/translations.dart' as AppTranslations;

class CartScreen extends StatelessWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context) {
    Future.delayed(Duration.zero, () {
      context.cartProvider.getCartItems();
    });
    return Scaffold(
      appBar: AppBar(
        title: Consumer<LanguageProvider>(
          builder: (context, languageProvider, child) {
            return Text(
              AppTranslations.Translations.get('my_cart', languageProvider.currentLanguageCode),
              style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppColor.darkOrange),
            );
          },
        ),
      ),
      body: Consumer<CartProvider>(
        builder: (context, cartProvider, child) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              cartProvider.myCartItems.isEmpty
                  ? const EmptyCart()
                  : Consumer<CartProvider>(
                      builder: (context, cartProvider, child) {
                        return CartListSection(
                            cartProducts: cartProvider.myCartItems);
                      },
                    ),

              //? total price section
              Consumer<LanguageProvider>(
                builder: (context, languageProvider, child) {
                  return Container(
                    margin: const EdgeInsets.only(bottom: 15),
                    padding: const EdgeInsets.symmetric(horizontal: 30),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          AppTranslations.Translations.get('total', languageProvider.currentLanguageCode),
                          style:
                              const TextStyle(fontSize: 22, fontWeight: FontWeight.w400),
                        ),
                        AnimatedSwitcherWrapper(
                          child: Text(
                            "Rs ${context.cartProvider.getCartSubTotal()}",
                            style: const TextStyle(
                              fontSize: 25,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFFEC6813),
                            ),
                          ),
                        )
                      ],
                    ),
                  );
                },
              ),
              //? buy now button
              Consumer<LanguageProvider>(
                builder: (context, languageProvider, child) {
                  return SizedBox(
                    width: double.infinity,
                    child: Padding(
                      padding:
                          const EdgeInsets.only(left: 30, right: 30, bottom: 20),
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                            padding: const EdgeInsets.all(20)),
                        onPressed: context.cartProvider.myCartItems.isEmpty
                            ? null
                            : () {
                                showCustomBottomSheet(context);
                              },
                        child: Text(
                            AppTranslations.Translations.get('buy_now', languageProvider.currentLanguageCode),
                            style: const TextStyle(color: Colors.white)),
                      ),
                    ),
                  );
                },
              )
            ],
          );
        },
      ),
    );
  }
}
