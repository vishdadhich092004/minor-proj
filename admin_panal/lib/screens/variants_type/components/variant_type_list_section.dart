import 'package:admin/utility/extensions.dart';

import '../../../core/data/data_provider.dart';
import 'add_variant_type_form.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../utility/color_list.dart';
import '../../../utility/constants.dart';
import '../../../models/variant_type.dart';

class VariantsTypeListSection extends StatelessWidget {
  const VariantsTypeListSection({
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
            "All Variants Type",
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
                        label: Text("Variant Name"),
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
                      dataProvider.variantTypes.length,
                      (index) => variantTypeDataRow(
                        dataProvider.variantTypes[index],
                        index + 1,
                        edit: () {
                          showAddVariantsTypeForm(
                              context, dataProvider.variantTypes[index]);
                        },
                        delete: () {
                          context.variantTypeProvider.deleteVariantType(
                              dataProvider.variantTypes[index]);
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

DataRow variantTypeDataRow(VariantType VariantTypeInfo, int index,
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
                  VariantTypeInfo.name ?? '',
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
            VariantTypeInfo.type ?? '',
            overflow: TextOverflow.ellipsis,
            maxLines: 1,
          ),
        ),
      ),
      DataCell(
        SizedBox(
          width: 100,
          child: Text(
            VariantTypeInfo.createdAt ?? '',
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
