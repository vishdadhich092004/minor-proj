import 'package:admin/utility/extensions.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../core/data/data_provider.dart';
import '../../../models/product_summery_info.dart';
import '../../../utility/constants.dart';
import '../../../utility/responsive.dart';
import 'product_summery_card.dart';

class ProductSummerySection extends StatelessWidget {
  const ProductSummerySection({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final Size _size = MediaQuery.of(context).size;
    final bool isMobile = Responsive.isMobile(context);
    final bool isTablet = Responsive.isTablet(context);

    return Consumer<DataProvider>(
      builder: (context, dataProvider, _) {
        int totalProduct = 1;
        totalProduct =
            context.dataProvider.calculateProductWithQuantity(quantity: null);
        int outOfStockProduct =
            context.dataProvider.calculateProductWithQuantity(quantity: 0);
        int limitedStockProduct =
            context.dataProvider.calculateProductWithQuantity(quantity: 1);
        int otherStockProduct =
            totalProduct - outOfStockProduct - limitedStockProduct;

        List<ProductSummeryInfo> productSummeryItems = [
          ProductSummeryInfo(
            title: "All Product",
            productsCount: totalProduct,
            svgSrc: "assets/icons/Product.svg",
            color: primaryColor,
            percentage: 100,
          ),
          ProductSummeryInfo(
            title: "Out of Stock",
            productsCount: outOfStockProduct,
            svgSrc: "assets/icons/Product2.svg",
            color: Color(0xFFEA3829),
            percentage: totalProduct != 0
                ? (outOfStockProduct / totalProduct) * 100
                : 0,
          ),
          ProductSummeryInfo(
            title: "Limited Stock",
            productsCount: limitedStockProduct,
            svgSrc: "assets/icons/Product3.svg",
            color: Color(0xFFECBE23),
            percentage: totalProduct != 0
                ? (limitedStockProduct / totalProduct) * 100
                : 0,
          ),
          ProductSummeryInfo(
            title: "Other Stock",
            productsCount: otherStockProduct,
            svgSrc: "assets/icons/Product4.svg",
            color: Color(0xFF47e228),
            percentage: totalProduct != 0
                ? (otherStockProduct / totalProduct) * 100
                : 0,
          ),
        ];

        // Determine number of columns based on screen size
        int crossAxisCount;
        double childAspectRatio;

        if (isMobile) {
          crossAxisCount = 2; // 2 cards per row on mobile
          childAspectRatio = 1.2;
        } else if (isTablet) {
          crossAxisCount = 3; // 3 cards per row on tablet
          childAspectRatio = 1.3;
        } else {
          crossAxisCount = 4; // 4 cards per row on desktop
          childAspectRatio = _size.width < 1400 ? 1.1 : 1.4;
        }

        return Column(
          children: [
            GridView.builder(
              physics: NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: productSummeryItems.length,
              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: crossAxisCount,
                crossAxisSpacing: defaultPadding,
                mainAxisSpacing: defaultPadding,
                childAspectRatio: childAspectRatio,
              ),
              itemBuilder: (context, index) => ProductSummeryCard(
                info: productSummeryItems[index],
                onTap: (productType) {
                  context.dataProvider
                      .filterProductsByQuantity(productType ?? '');
                },
              ),
            ),
          ],
        );
      },
    );
  }
}
