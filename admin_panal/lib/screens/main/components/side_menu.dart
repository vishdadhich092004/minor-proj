import '../../../utility/extensions.dart';
import '../../../utility/responsive.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';
import '../../../providers/language_provider.dart';
import '../../../widgets/language_selector.dart';
import '../../../utility/translations.dart' as AppTranslations;

class SideMenu extends StatelessWidget {
  const SideMenu({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsive.isMobile(context);
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return Drawer(
          child: ListView(
            children: [
              DrawerHeader(
                child: Image.asset("assets/images/logo.png"),
              ),
              DrawerListTile(
                title: AppTranslations.Translations.get(
                    'dashboard', languageProvider.currentLanguageCode),
                svgSrc: "assets/icons/menu_dashboard.svg",
                press: () {
                  context.mainScreenProvider.navigateToScreen('Dashboard');
                  if (isMobile) Navigator.pop(context);
                },
              ),
              DrawerListTile(
                title: AppTranslations.Translations.get(
                    'category', languageProvider.currentLanguageCode),
                svgSrc: "assets/icons/menu_tran.svg",
                press: () {
                  context.mainScreenProvider.navigateToScreen('Category');
                  if (isMobile) Navigator.pop(context);
                },
              ),
              DrawerListTile(
                title: AppTranslations.Translations.get(
                    'sub_category', languageProvider.currentLanguageCode),
                svgSrc: "assets/icons/menu_task.svg",
                press: () {
                  context.mainScreenProvider.navigateToScreen('SubCategory');
                  if (isMobile) Navigator.pop(context);
                },
              ),
              DrawerListTile(
                title: AppTranslations.Translations.get(
                    'brands', languageProvider.currentLanguageCode),
                svgSrc: "assets/icons/menu_doc.svg",
                press: () {
                  context.mainScreenProvider.navigateToScreen('Brands');
                  if (isMobile) Navigator.pop(context);
                },
              ),
              DrawerListTile(
                title: AppTranslations.Translations.get(
                    'variant_type', languageProvider.currentLanguageCode),
                svgSrc: "assets/icons/menu_store.svg",
                press: () {
                  context.mainScreenProvider.navigateToScreen('VariantType');
                  if (isMobile) Navigator.pop(context);
                },
              ),
              DrawerListTile(
                title: AppTranslations.Translations.get(
                    'variants', languageProvider.currentLanguageCode),
                svgSrc: "assets/icons/menu_notification.svg",
                press: () {
                  context.mainScreenProvider.navigateToScreen('Variants');
                  if (isMobile) Navigator.pop(context);
                },
              ),
              DrawerListTile(
                title: AppTranslations.Translations.get(
                    'orders', languageProvider.currentLanguageCode),
                svgSrc: "assets/icons/menu_profile.svg",
                press: () {
                  context.mainScreenProvider.navigateToScreen('Order');
                  if (isMobile) Navigator.pop(context);
                },
              ),
              DrawerListTile(
                title: AppTranslations.Translations.get(
                    'coupons', languageProvider.currentLanguageCode),
                svgSrc: "assets/icons/menu_setting.svg",
                press: () {
                  context.mainScreenProvider.navigateToScreen('Coupon');
                  if (isMobile) Navigator.pop(context);
                },
              ),
              DrawerListTile(
                title: AppTranslations.Translations.get(
                    'posters', languageProvider.currentLanguageCode),
                svgSrc: "assets/icons/menu_doc.svg",
                press: () {
                  context.mainScreenProvider.navigateToScreen('Poster');
                  if (isMobile) Navigator.pop(context);
                },
              ),
              DrawerListTile(
                title: AppTranslations.Translations.get(
                    'notifications', languageProvider.currentLanguageCode),
                svgSrc: "assets/icons/menu_notification.svg",
                press: () {
                  context.mainScreenProvider.navigateToScreen('Notifications');
                  if (isMobile) Navigator.pop(context);
                },
              ),
              const Divider(color: Colors.white24),
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                child: Row(
                  children: [
                    SvgPicture.asset(
                      "assets/icons/menu_setting.svg",
                      colorFilter: const ColorFilter.mode(
                          Colors.white54, BlendMode.srcIn),
                      height: 16,
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: LanguageSelector(),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class DrawerListTile extends StatelessWidget {
  const DrawerListTile({
    Key? key,
    // For selecting those three line once press "Command+D"
    required this.title,
    required this.svgSrc,
    required this.press,
  }) : super(key: key);

  final String title, svgSrc;
  final VoidCallback press;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      onTap: press,
      horizontalTitleGap: 0.0,
      leading: SvgPicture.asset(
        svgSrc,
        colorFilter: ColorFilter.mode(Colors.white54, BlendMode.srcIn),
        height: 16,
      ),
      title: Text(
        title,
        style: TextStyle(color: Colors.white54),
      ),
    );
  }
}
