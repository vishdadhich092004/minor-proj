import 'product_cart_screen/cart_screen.dart';
import 'product_favorite_screen/favorite_screen.dart';
import 'product_list_screen/product_list_screen.dart';
import 'profile_screen/profile_screen.dart';
import 'package:flutter/material.dart';
import 'package:animations/animations.dart';
import 'package:provider/provider.dart';
import '../../../widget/page_wrapper.dart';
import '../providers/language_provider.dart';
import '../utility/translations.dart' as AppTranslations;

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  static const List<Widget> screens = [
    ProductListScreen(),
    FavoriteScreen(),
    CartScreen(),
    ProfileScreen()
  ];

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int newIndex = 0;

  @override
  Widget build(BuildContext context) {
    return PageWrapper(
      child: Scaffold(
        bottomNavigationBar: Consumer<LanguageProvider>(
          builder: (context, languageProvider, child) {
            return BottomNavigationBar(
              items: [
                BottomNavigationBarItem(
                  icon: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.home),
                      const SizedBox(height: 4),
                      Text(
                        AppTranslations.Translations.get(
                            'home', languageProvider.currentLanguageCode),
                        style: const TextStyle(fontSize: 12),
                      ),
                    ],
                  ),
                  label: '',
                ),
                BottomNavigationBarItem(
                  icon: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.favorite),
                      const SizedBox(height: 4),
                      Text(
                        AppTranslations.Translations.get(
                            'favorite', languageProvider.currentLanguageCode),
                        style: const TextStyle(fontSize: 12),
                      ),
                    ],
                  ),
                  label: '',
                ),
                BottomNavigationBarItem(
                  icon: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.shopping_bag),
                      const SizedBox(height: 4),
                      Text(
                        AppTranslations.Translations.get(
                            'cart', languageProvider.currentLanguageCode),
                        style: const TextStyle(fontSize: 12),
                      ),
                    ],
                  ),
                  label: '',
                ),
                BottomNavigationBarItem(
                  icon: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.account_circle),
                      const SizedBox(height: 4),
                      Text(
                        AppTranslations.Translations.get(
                            'profile', languageProvider.currentLanguageCode),
                        style: const TextStyle(fontSize: 12),
                      ),
                    ],
                  ),
                  label: '',
                ),
              ],
              currentIndex: newIndex,
              selectedItemColor: const Color(0xFFEC6813),
              unselectedItemColor: Colors.grey,
              showSelectedLabels: false,
              showUnselectedLabels: false,
              type: BottomNavigationBarType.fixed,
              onTap: (currentIndex) {
                setState(() {
                  newIndex = currentIndex;
                });
              },
            );
          },
        ),
        body: PageTransitionSwitcher(
          duration: const Duration(seconds: 1),
          transitionBuilder: (
            Widget child,
            Animation<double> animation,
            Animation<double> secondaryAnimation,
          ) {
            return FadeThroughTransition(
              animation: animation,
              secondaryAnimation: secondaryAnimation,
              child: child,
            );
          },
          child: HomeScreen.screens[newIndex],
        ),
      ),
    );
  }
}
