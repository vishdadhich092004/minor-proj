import 'package:admin/utility/extensions.dart';

import '../../../core/data/data_provider.dart';
import '../../../models/variant.dart';
import 'add_variant_form.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../utility/color_list.dart';
import '../../../utility/constants.dart';

class VariantsListSection extends StatelessWidget {
  const VariantsListSection({
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
            "All Variants",
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
                        label: Text("Variant"),
                      ),
                      DataColumn(
                        label: Text("Variant Type"),
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
                      dataProvider.variants.length,
                      (index) => variantDataRow(
                          dataProvider.variants[index], index + 1, edit: () {
                        showAddVariantForm(
                            context, dataProvider.variants[index]);
                      }, delete: () {
                        context.variantProvider
                            .deleteVariant(dataProvider.variants[index]);
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

DataRow variantDataRow(Variant VariantInfo, int index,
    {Function? edit, Function? delete}) {
  return DataRow(
    cells: [
      DataCell(
        SizedBox(
          width: 150,
          child: Row(
            children: [
              Container(
                height: 24,
                width: 24,
                decoration: BoxDecoration(
                  color: colors[index % colors.length],
                  shape: BoxShape.circle,
                ),
                child: Text(index.toString(), textAlign: TextAlign.center),
              ),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  VariantInfo.name ?? '',
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
            VariantInfo.variantTypeId?.name ?? '',
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
          ),
        ),
      ),
      DataCell(
        SizedBox(
          width: 100,
          child: Text(
            VariantInfo.createdAt ?? '',
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
