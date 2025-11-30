import '../login_screen/login_screen.dart';
import '../my_address_screen/my_address_screen.dart';
import '../../utility/animation/open_container_wrapper.dart';
import '../../utility/extensions.dart';
import '../../widget/navigation_tile.dart';
import '../../widget/language_selector.dart';
import '../../utility/translations.dart' as AppTranslations;
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import '../../utility/app_color.dart';
import '../../providers/language_provider.dart';
import '../my_order_screen/my_order_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Assuming your theme and colors are defined elsewhere in your app
    const TextStyle linkStyle =
        TextStyle(fontSize: 18, fontWeight: FontWeight.w600);
    const TextStyle titleStyle =
        TextStyle(fontWeight: FontWeight.bold, fontSize: 20);

    return Scaffold(
      appBar: AppBar(
        title: Consumer<LanguageProvider>(
          builder: (context, languageProvider, child) {
            return Text(
              AppTranslations.Translations.get('profile', languageProvider.currentLanguageCode),
              style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppColor.darkOrange),
            );
          },
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.only(top: 10, left: 20, right: 20),
        children: [
          const SizedBox(
            height: 200,
            child: CircleAvatar(
              radius: 40,
              backgroundColor: AppColor.darkOrange,
              backgroundImage: AssetImage(
                'assets/images/profile_pic.png',
              ),
            ),
          ),
          const SizedBox(height: 20),
          Center(
            child: Text(
              "${context.userProvider.getLoginUsr()?.name}",
              style: titleStyle,
            ),
          ),
          const SizedBox(height: 40),
          Consumer<LanguageProvider>(
            builder: (context, languageProvider, child) {
              return OpenContainerWrapper(
                nextScreen: MyOrderScreen(),
                child: SizedBox(
                  child: NavigationTile(
                    icon: Icons.list,
                    title: AppTranslations.Translations.get('my_orders', languageProvider.currentLanguageCode),
                  ),
                ),
              );
            },
          ),
          const SizedBox(height: 15),
          Consumer<LanguageProvider>(
            builder: (context, languageProvider, child) {
              return OpenContainerWrapper(
                nextScreen: MyAddressPage(),
                child: NavigationTile(
                  icon: Icons.location_on,
                  title: AppTranslations.Translations.get('my_address', languageProvider.currentLanguageCode),
                ),
              );
            },
          ),
          const SizedBox(height: 15),
          Consumer<LanguageProvider>(
            builder: (context, languageProvider, child) {
              return InkWell(
                onTap: () => showLanguageSelectorDialog(context),
                child: NavigationTile(
                  icon: Icons.language,
                  title: AppTranslations.Translations.get('language', languageProvider.currentLanguageCode),
                ),
              );
            },
          ),
          const SizedBox(height: 60),
          Center(
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColor.darkOrange,
                foregroundColor: Colors.white,
                padding:
                    const EdgeInsets.symmetric(horizontal: 40, vertical: 16),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30)),
              ),
              onPressed: () {
                context.userProvider.logOutUser();
                Get.offAll(const AuthScreen());
              },
              child: Consumer<LanguageProvider>(
                builder: (context, languageProvider, child) {
                  return Text(
                    AppTranslations.Translations.get('logout', languageProvider.currentLanguageCode),
                    style: const TextStyle(fontSize: 18),
                  );
                },
              ),
            ),
          ),
        ],
      ),
    );
  }
}
