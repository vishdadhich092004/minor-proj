import 'package:flutter/material.dart';
import 'translated_text.dart';

class HorizontalList<T> extends StatelessWidget {
  final List<T>? items;
  final T? selected;
  final String Function(T) itemToString;
  final void Function(T) onSelect;
  final bool autoTranslate;

  const HorizontalList({
    super.key,
    this.items,
    required this.itemToString,
    this.selected,
    required this.onSelect,
    this.autoTranslate = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10.0),
      child: SizedBox(
        height: 50,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          itemCount: items?.length ?? 0,
          itemBuilder: (context, index) {
            T item = items![index];
            final itemText = itemToString(item);

            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: ChoiceChip(
                label: autoTranslate
                    ? TranslatedText(
                        itemText,
                        style: const TextStyle(fontSize: 14),
                      )
                    : Text(itemText),
                selected: selected == item,
                onSelected: (bool selected) {
                  onSelect(item);
                },
                backgroundColor: Colors.grey[200],
                selectedColor: Colors.orangeAccent,
                showCheckmark: false,
              ),
            );
          },
        ),
      ),
    );
  }
}
