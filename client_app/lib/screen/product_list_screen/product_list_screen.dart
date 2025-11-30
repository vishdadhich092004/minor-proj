import '../../core/data/data_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../login_screen/provider/user_provider.dart';
import 'components/custom_app_bar.dart';
import '../../../../widget/product_grid_view.dart';
import 'components/category_selector.dart';
import 'components/poster_section.dart';
import '../../providers/language_provider.dart';
import '../../utility/translations.dart' as AppTranslations;



class ProductListScreen extends StatelessWidget {
  const ProductListScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final userProvider = Provider.of<UserProvider>(context);
    final loggedInUser = userProvider.getLoginUsr();

    String? firstName;
    if (loggedInUser?.name != null) {
      final nameParts = loggedInUser!.name!.split(' ');
      if (nameParts.isNotEmpty) {
        firstName = nameParts[0]; // The first element is the first name
      }
    }
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: const CustomAppBar(),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Consumer<LanguageProvider>(
                  builder: (context, languageProvider, child) {
                    final helloText = AppTranslations.Translations.get('hello', languageProvider.currentLanguageCode);
                    return Text(
                      firstName != null
                          ? '$helloText, $firstName!'
                          : '$helloText!',
                      style: Theme.of(context).textTheme.displayLarge,
                    );
                  },
                ),
                Consumer<LanguageProvider>(
                  builder: (context, languageProvider, child) {
                    return Text(
                      AppTranslations.Translations.get('lets_get_something', languageProvider.currentLanguageCode),
                      style: Theme.of(context).textTheme.headlineSmall,
                    );
                  },
                ),
                const PosterSection(),
                Consumer<LanguageProvider>(
                  builder: (context, languageProvider, child) {
                    return Text(
                      AppTranslations.Translations.get('top_categories', languageProvider.currentLanguageCode),
                      style: Theme.of(context).textTheme.headlineMedium,
                    );
                  },
                ),
                const SizedBox(height: 5),
                Consumer<DataProvider>(
                  builder: (context, dataProvider, child) {
                    return CategorySelector(
                      categories: dataProvider.categories,
                    );
                  },
                ),
                Consumer<DataProvider>(
                  builder: (context, dataProvider, child) {
                    return ProductGridView(
                      items: dataProvider.products,
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
