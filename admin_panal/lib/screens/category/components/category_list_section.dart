import 'package:admin/utility/extensions.dart';

import '../../../core/data/data_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../utility/constants.dart';
import '../../../models/category.dart';
import 'add_category_form.dart';

class CategoryListSection extends StatelessWidget {
  const CategoryListSection({
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
          Text(
            "All Categories",
            style: Theme.of(context).textTheme.titleMedium,
          ),
          SizedBox(
            width: double.infinity,
            child: Consumer<DataProvider>(
              builder: (context, dataProvider, child) {
                return SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: DataTable(
                    columnSpacing: defaultPadding,
                    columns: [
                      DataColumn(
                        label: Text("Category Name"),
                      ),
                      DataColumn(
                        label: Text("Added Date"),
                      ),
                      DataColumn(
                        label: Text("Edit"),
                      ),
                      DataColumn(
                        label: Text("Delete"),
                      ),
                    ],
                    rows: List.generate(
                      dataProvider.categories.length,
                      (index) => categoryDataRow(dataProvider.categories[index],
                          delete: () {
                        context.categoryProvider
                            .deleteCategory(dataProvider.categories[index]);
                      }, edit: () {
                        showAddCategoryForm(
                            context, dataProvider.categories[index]);
                      }),
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

DataRow categoryDataRow(Category CatInfo, {Function? edit, Function? delete}) {
  return DataRow(
    cells: [
      DataCell(
        SizedBox(
          width: 200,
          child: Row(
            children: [
              Image.network(
                CatInfo.image ?? '',
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
                  CatInfo.name ?? '',
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
          width: 120,
          child: Text(
            CatInfo.createdAt ?? '',
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
          ),
        ),
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
