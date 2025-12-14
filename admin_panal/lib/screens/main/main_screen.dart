import 'provider/main_screen_provider.dart';
import '../../utility/extensions.dart';
import '../../utility/responsive.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'components/side_menu.dart';

class MainScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    context.dataProvider;
    return Responsive(
      mobile: Scaffold(
        drawer: SideMenu(),
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
        ),
        body: SafeArea(
          child: ClipRect(
            child: Consumer<MainScreenProvider>(
              builder: (context, provider, child) {
                return provider.selectedScreen;
              },
            ),
          ),
        ),
      ),
      desktop: Scaffold(
        body: SafeArea(
          child: ClipRect(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: SideMenu(),
                ),
                Consumer<MainScreenProvider>(
                  builder: (context, provider, child) {
                    return Expanded(
                      flex: 5,
                      child: ClipRect(
                        child: provider.selectedScreen,
                      ),
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
