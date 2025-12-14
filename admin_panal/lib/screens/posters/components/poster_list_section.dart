import 'package:admin/utility/extensions.dart';

import '../../../core/data/data_provider.dart';
import 'add_poster_form.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../models/poster.dart';
import '../../../utility/constants.dart';

class PosterListSection extends StatelessWidget {
  const PosterListSection({
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
            "All Posters",
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
                        label: Text("Edit"),
                      ),
                      DataColumn(
                        label: Text("Delete"),
                      ),
                    ],
                    rows: List.generate(
                      dataProvider.posters.length,
                      (index) => posterDataRow(dataProvider.posters[index],
                          delete: () {
                        context.posterProvider
                            .deletePoster(dataProvider.posters[index]);
                      }, edit: () {
                        showAddPosterForm(context, dataProvider.posters[index]);
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

DataRow posterDataRow(Poster poster, {Function? edit, Function? delete}) {
  return DataRow(
    cells: [
      DataCell(
        SizedBox(
          width: 200,
          child: Row(
            children: [
              Image.network(
                poster.imageUrl ?? '',
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
                  poster.posterName ?? '',
                  overflow: TextOverflow.ellipsis,
                  maxLines: 1,
                ),
              ),
            ],
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
