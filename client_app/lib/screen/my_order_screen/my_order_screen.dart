import '../../core/data/data_provider.dart';
import '../tracking_screen/tracking_screen.dart';
import '../../utility/app_color.dart';
import '../../utility/extensions.dart';
import '../../utility/utility_extention.dart';
import '../../utility/invoice_generator.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import '../../widget/order_tile.dart';
import '../../providers/language_provider.dart';
import '../../utility/translations.dart' as AppTranslations;

class MyOrderScreen extends StatelessWidget {
  const MyOrderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Consumer<LanguageProvider>(
          builder: (context, languageProvider, child) {
            return Text(
              AppTranslations.Translations.get('my_orders', languageProvider.currentLanguageCode),
              style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: AppColor.darkOrange),
            );
          },
        ),
      ),
      body: Consumer<DataProvider>(
        builder: (context, provider, child) {
          return ListView.builder(
            itemCount: context.dataProvider.orders.length,
            itemBuilder: (context, index) {
              final order = context.dataProvider.orders[index];
              return OrderTile(
                paymentMethod: order.paymentMethod ?? '',
                items:
                    '${(order.items.safeElementAt(0)?.productName ?? '')} & ${order.items!.length - 1} Items',
                date: order.orderDate ?? '',
                status: order.orderStatus ?? 'pending',
                order: order,
                onTap: () {
                  if (order.orderStatus == 'shipped') {
                    Get.to(TrackingScreen(url: order.trackingUrl ?? ''));
                  }
                },
                onDownloadInvoice: () async {
                  try {
                    // Show loading indicator
                    showDialog(
                      context: context,
                      barrierDismissible: false,
                      builder: (BuildContext context) {
                        return const Center(
                          child: CircularProgressIndicator(
                            color: AppColor.darkOrange,
                          ),
                        );
                      },
                    );

                    // Generate invoice
                    await InvoiceGenerator.generateAndDownloadInvoice(order);

                    // Close loading indicator
                    Navigator.of(context).pop();

                    // Show success message
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Invoice generated successfully!'),
                        backgroundColor: Colors.green,
                        duration: Duration(seconds: 2),
                      ),
                    );
                  } catch (e) {
                    // Close loading indicator if still open
                    Navigator.of(context).pop();

                    // Show error message
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Error generating invoice: $e'),
                        backgroundColor: Colors.red,
                        duration: const Duration(seconds: 3),
                      ),
                    );
                  }
                },
              );
            },
          );
        },
      ),
    );
  }
}
