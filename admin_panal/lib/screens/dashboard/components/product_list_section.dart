import 'package:admin/utility/extensions.dart';
import '../../../core/data/data_provider.dart';
import '../../../models/product.dart';
import 'add_product_form.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../utility/constants.dart';
import '../../../providers/language_provider.dart';
import '../../../utility/translations.dart' as AppTranslations;

class ProductListSection extends StatelessWidget {
  const ProductListSection({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(defaultPadding),
      decoration: BoxDecoration(
        color: secondaryColor,
        borderRadius: const BorderRadius.all(Radius.circular(10)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Consumer<LanguageProvider>(
            builder: (context, languageProvider, child) {
              return Text(
                AppTranslations.Translations.get(
                  'all_products',
                  languageProvider.currentLanguageCode,
                ),
                style: Theme.of(context).textTheme.titleMedium,
              );
            },
          ),
          SizedBox(
            width: double.infinity,
            child: Consumer2<DataProvider, LanguageProvider>(
              builder: (context, dataProvider, languageProvider, child) {
                return SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: DataTable(
                    columnSpacing: defaultPadding,
                    columns: [
                      DataColumn(
                        label: Text(
                          AppTranslations.Translations.get(
                            'product_name',
                            languageProvider.currentLanguageCode,
                          ),
                        ),
                      ),
                      DataColumn(
                        label: Text(
                          AppTranslations.Translations.get(
                            'category',
                            languageProvider.currentLanguageCode,
                          ),
                        ),
                      ),
                      DataColumn(
                        label: Text(
                          AppTranslations.Translations.get(
                            'sub_category',
                            languageProvider.currentLanguageCode,
                          ),
                        ),
                      ),
                      DataColumn(
                        label: Text(
                          AppTranslations.Translations.get(
                            'price',
                            languageProvider.currentLanguageCode,
                          ),
                        ),
                      ),
                      DataColumn(
                        label: Text(
                          AppTranslations.Translations.get(
                            'edit',
                            languageProvider.currentLanguageCode,
                          ),
                        ),
                      ),
                      DataColumn(
                        label: Text(
                          AppTranslations.Translations.get(
                            'delete',
                            languageProvider.currentLanguageCode,
                          ),
                        ),
                      ),
                    ],
                    rows: List.generate(
                      dataProvider.products.length,
                      (index) => productDataRow(
                        dataProvider.products[index],
                        edit: () {
                          showAddProductForm(
                              context, dataProvider.products[index]);
                        },
                        delete: () {
                          context.dashBoardProvider
                              .deleteProduct(dataProvider.products[index]);
                        },
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

DataRow productDataRow(Product productInfo,
    {Function? edit, Function? delete}) {
  return DataRow(
    cells: [
      DataCell(
        SizedBox(
          width: 150,
          child: Row(
            children: [
              Image.network(
                productInfo.images?.first.url ?? '',
                height: 30,
                width: 30,
                errorBuilder: (BuildContext context, Object exception,
                    StackTrace? stackTrace) {
                  return Icon(Icons.error);
                },
              ),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  productInfo.name ?? '',
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                ),
              ),
            ],
          ),
        ),
      ),
      DataCell(
        SizedBox(
          width: 100,
          child: Text(
            productInfo.proCategoryId?.name ?? '',
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
          ),
        ),
      ),
      DataCell(
        SizedBox(
          width: 100,
          child: Text(
            productInfo.proSubCategoryId?.name ?? '',
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
          ),
        ),
      ),
      DataCell(
        Text('${productInfo.price}'),
      ),
      DataCell(IconButton(
          onPressed: () {
            if (edit != null) edit();
          },
          icon: Icon(
            Icons.edit,
            color: Colors.white,
          ))),
      DataCell(IconButton(
          onPressed: () {
            if (delete != null) delete();
          },
          icon: Icon(
            Icons.delete,
            color: Colors.red,
          ))),
    ],
  );
}
