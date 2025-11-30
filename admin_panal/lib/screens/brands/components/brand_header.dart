import 'package:admin/utility/extensions.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';
import '../../../utility/constants.dart';
import '../../../providers/language_provider.dart';
import '../../../utility/translations.dart' as AppTranslations;

class BrandHeader extends StatelessWidget {
  const BrandHeader({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return Row(
          children: [
            Text(
              AppTranslations.Translations.get(
                'brands',
                languageProvider.currentLanguageCode,
              ),
              style: Theme.of(context).textTheme.titleLarge,
            ),
            Spacer(flex: 2),
            Expanded(
              child: SearchField(
                onChange: (val) {
                  context.dataProvider.filterBrands(val);
                },
              ),
            ),
            ProfileCard(),
          ],
        );
      },
    );
  }
}

class ProfileCard extends StatelessWidget {
  const ProfileCard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return Container(
          margin: EdgeInsets.only(left: defaultPadding),
          padding: EdgeInsets.symmetric(
            horizontal: defaultPadding,
            vertical: defaultPadding / 2,
          ),
          decoration: BoxDecoration(
            color: secondaryColor,
            borderRadius: const BorderRadius.all(Radius.circular(10)),
            border: Border.all(color: Colors.white10),
          ),
          child: Row(
            children: [
              CircleAvatar(
                radius: 12,
                backgroundImage: AssetImage('assets/images/profile.png'),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: defaultPadding / 2,
                ),
                child: Text(
                  AppTranslations.Translations.get(
                    'team_iiit',
                    languageProvider.currentLanguageCode,
                  ),
                ),
              ),
              Icon(Icons.keyboard_arrow_down),
            ],
          ),
        );
      },
    );
  }
}

class SearchField extends StatelessWidget {
  final Function(String) onChange;

  const SearchField({Key? key, required this.onChange}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return TextField(
          decoration: InputDecoration(
            hintText: AppTranslations.Translations.get(
              'search',
              languageProvider.currentLanguageCode,
            ),
            fillColor: secondaryColor,
            filled: true,
            border: OutlineInputBorder(
              borderSide: BorderSide.none,
              borderRadius: const BorderRadius.all(Radius.circular(10)),
            ),
            suffixIcon: InkWell(
              onTap: () {},
              child: Container(
                padding: EdgeInsets.all(defaultPadding * 0.75),
                margin: EdgeInsets.symmetric(horizontal: defaultPadding / 2),
                decoration: BoxDecoration(
                  color: primaryColor,
                  borderRadius: const BorderRadius.all(Radius.circular(10)),
                ),
                child: SvgPicture.asset("assets/icons/Search.svg"),
              ),
            ),
          ),
          onChanged: (value) {
            onChange(value);
          },
        );
      },
    );
  }
}
