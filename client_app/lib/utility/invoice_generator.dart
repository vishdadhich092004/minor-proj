import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:intl/intl.dart';
import '../models/order.dart';

class InvoiceGenerator {
  static Future<void> generateAndDownloadInvoice(Order order) async {
    final pdf = pw.Document();

    // Calculate totals
    double subtotal = order.orderTotal?.subtotal ?? 0;
    double discount = order.orderTotal?.discount ?? 0;
    double total = order.orderTotal?.total ?? 0;
    double savings = discount;

    // Format date
    String formattedDate = order.orderDate ?? '';
    try {
      DateTime dateTime = DateTime.parse(order.orderDate ?? '');
      formattedDate = DateFormat('dd MMM yyyy, hh:mm a').format(dateTime);
    } catch (e) {
      formattedDate = order.orderDate ?? '';
    }

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(24),
        build: (pw.Context context) {
          return [
            // Header
            _buildHeader(),
            pw.SizedBox(height: 12),
            
            // Invoice Info
            _buildInvoiceInfo(order.sId ?? '', formattedDate),
            pw.SizedBox(height: 12),
            
            // Customer & Shipping Info
            _buildCustomerInfo(order),
            pw.SizedBox(height: 15),
            
            // Items Table
            _buildItemsTable(order.items ?? []),
            pw.SizedBox(height: 15),
            
            // Pricing Summary
            _buildPricingSummary(subtotal, discount, total, savings),
            pw.SizedBox(height: 12),
            
            // Payment Method
            _buildPaymentInfo(order.paymentMethod ?? ''),
            
            // Savings Highlight
            if (savings > 0) ...[
              pw.SizedBox(height: 12),
              _buildSavingsHighlight(savings),
            ],
            
            pw.SizedBox(height: 15),
            
            // Footer
            _buildFooter(),
          ];
        },
      ),
    );

    // Save and open the PDF
    await _savePdf(pdf, 'Invoice_${order.sId ?? 'order'}.pdf');
  }

  static pw.Widget _buildHeader() {
    return pw.Container(
      decoration: pw.BoxDecoration(
        color: PdfColors.orange,
        borderRadius: const pw.BorderRadius.all(pw.Radius.circular(8)),
      ),
      padding: const pw.EdgeInsets.all(16),
      child: pw.Row(
        mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
        children: [
            pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Text(
                'INVOICE',
                style: pw.TextStyle(
                  fontSize: 28,
                  fontWeight: pw.FontWeight.bold,
                  color: PdfColors.white,
                ),
              ),
              pw.SizedBox(height: 3),
              pw.Text(
                'E-Commerce Store',
                style: const pw.TextStyle(
                  fontSize: 14,
                  color: PdfColors.white,
                ),
              ),
            ],
          ),
          pw.Container(
            width: 60,
            height: 60,
            decoration: pw.BoxDecoration(
              color: PdfColors.white,
              borderRadius: const pw.BorderRadius.all(pw.Radius.circular(8)),
            ),
            child: pw.Center(
              child: pw.Text(
                'LOGO',
                style: pw.TextStyle(
                  fontSize: 14,
                  fontWeight: pw.FontWeight.bold,
                  color: PdfColors.orange,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  static pw.Widget _buildInvoiceInfo(String orderId, String date) {
    return pw.Container(
      padding: const pw.EdgeInsets.all(12),
      decoration: pw.BoxDecoration(
        border: pw.Border.all(color: PdfColors.grey300),
        borderRadius: const pw.BorderRadius.all(pw.Radius.circular(8)),
      ),
      child: pw.Row(
        mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
        children: [
          pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Text(
                'Order ID',
                style: pw.TextStyle(
                  fontSize: 10,
                  color: PdfColors.grey600,
                ),
              ),
              pw.SizedBox(height: 4),
              pw.Text(
                orderId,
                style: pw.TextStyle(
                  fontSize: 12,
                  fontWeight: pw.FontWeight.bold,
                ),
              ),
            ],
          ),
          pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.end,
            children: [
              pw.Text(
                'Order Date',
                style: pw.TextStyle(
                  fontSize: 10,
                  color: PdfColors.grey600,
                ),
              ),
              pw.SizedBox(height: 4),
              pw.Text(
                date,
                style: pw.TextStyle(
                  fontSize: 12,
                  fontWeight: pw.FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  static pw.Widget _buildCustomerInfo(Order order) {
    return pw.Row(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        // Billing To
        pw.Expanded(
          child: pw.Container(
            padding: const pw.EdgeInsets.all(12),
            decoration: pw.BoxDecoration(
              color: PdfColors.grey100,
              borderRadius: const pw.BorderRadius.all(pw.Radius.circular(8)),
            ),
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
              pw.Text(
                'BILL TO',
                style: pw.TextStyle(
                  fontSize: 12,
                  fontWeight: pw.FontWeight.bold,
                  color: PdfColors.orange,
                ),
              ),
              pw.SizedBox(height: 6),
                pw.Text(
                  order.userID?.name ?? 'Customer',
                  style: pw.TextStyle(
                    fontSize: 14,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ),
        pw.SizedBox(width: 16),
        
        // Shipping Address
        pw.Expanded(
          child: pw.Container(
            padding: const pw.EdgeInsets.all(12),
            decoration: pw.BoxDecoration(
              color: PdfColors.grey100,
              borderRadius: const pw.BorderRadius.all(pw.Radius.circular(8)),
            ),
            child: pw.Column(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              children: [
              pw.Text(
                'SHIP TO',
                style: pw.TextStyle(
                  fontSize: 12,
                  fontWeight: pw.FontWeight.bold,
                  color: PdfColors.orange,
                ),
              ),
              pw.SizedBox(height: 6),
                if (order.shippingAddress != null) ...[
                  pw.Text(
                    order.shippingAddress!.street ?? '',
                    style: const pw.TextStyle(fontSize: 11),
                  ),
                  pw.Text(
                    '${order.shippingAddress!.city ?? ''}, ${order.shippingAddress!.state ?? ''}',
                    style: const pw.TextStyle(fontSize: 11),
                  ),
                  pw.Text(
                    '${order.shippingAddress!.postalCode ?? ''}, ${order.shippingAddress!.country ?? ''}',
                    style: const pw.TextStyle(fontSize: 11),
                  ),
                  if (order.shippingAddress!.phone != null)
                    pw.Text(
                      'Phone: ${order.shippingAddress!.phone}',
                      style: const pw.TextStyle(fontSize: 11),
                    ),
                ],
              ],
            ),
          ),
        ),
      ],
    );
  }

  static pw.Widget _buildItemsTable(List<Items> items) {
    return pw.Table(
      border: pw.TableBorder.all(color: PdfColors.grey300),
      children: [
        // Header
        pw.TableRow(
          decoration: const pw.BoxDecoration(color: PdfColors.grey200),
          children: [
            _buildTableCell('Item Name', isHeader: true),
            _buildTableCell('Variant', isHeader: true),
            _buildTableCell('Quantity', isHeader: true, align: pw.TextAlign.center),
            _buildTableCell('Price (Rs.)', isHeader: true, align: pw.TextAlign.right),
            _buildTableCell('Total (Rs.)', isHeader: true, align: pw.TextAlign.right),
          ],
        ),
        // Items
        ...items.map((item) {
          double itemTotal = (item.price ?? 0) * (item.quantity ?? 0);
          return pw.TableRow(
            children: [
              _buildTableCell(item.productName ?? '', align: pw.TextAlign.left),
              _buildTableCell(item.variant ?? 'Default', align: pw.TextAlign.left),
              _buildTableCell('${item.quantity ?? 0}', align: pw.TextAlign.center),
              _buildTableCell('Rs. ${(item.price ?? 0).toStringAsFixed(2)}', align: pw.TextAlign.right),
              _buildTableCell('Rs. ${itemTotal.toStringAsFixed(2)}', align: pw.TextAlign.right),
            ],
          );
        }).toList(),
      ],
    );
  }

  static pw.Widget _buildTableCell(
    String text, {
    bool isHeader = false,
    pw.TextAlign align = pw.TextAlign.left,
  }) {
    return pw.Container(
      padding: const pw.EdgeInsets.all(6),
      child: pw.Text(
        text,
        style: pw.TextStyle(
          fontSize: isHeader ? 12 : 11,
          fontWeight: isHeader ? pw.FontWeight.bold : pw.FontWeight.normal,
        ),
        textAlign: align,
      ),
    );
  }

  static pw.Widget _buildPricingSummary(
    double subtotal,
    double discount,
    double total,
    double savings,
  ) {
      return pw.Row(
        crossAxisAlignment: pw.CrossAxisAlignment.start,
        children: [
          pw.Expanded(child: pw.SizedBox()),
          pw.Container(
            width: 250,
            padding: const pw.EdgeInsets.all(12),
          decoration: pw.BoxDecoration(
            border: pw.Border.all(color: PdfColors.grey300),
            borderRadius: const pw.BorderRadius.all(pw.Radius.circular(8)),
          ),
          child: pw.Column(
            children: [
              _buildSummaryRow('Subtotal', 'Rs. ${subtotal.toStringAsFixed(2)}'),
              pw.SizedBox(height: 6),
              _buildSummaryRow(
                'Discount',
                '-Rs. ${discount.toStringAsFixed(2)}',
                valueColor: PdfColors.green,
              ),
              pw.Divider(thickness: 1),
              pw.SizedBox(height: 6),
              _buildSummaryRow(
                'Total',
                'Rs. ${total.toStringAsFixed(2)}',
                isTotal: true,
              ),
            ],
          ),
        ),
      ],
    );
  }

  static pw.Widget _buildSummaryRow(
    String label,
    String value, {
    bool isTotal = false,
    PdfColor? valueColor,
  }) {
    return pw.Row(
      mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
      children: [
        pw.Text(
          label,
          style: pw.TextStyle(
            fontSize: isTotal ? 14 : 12,
            fontWeight: isTotal ? pw.FontWeight.bold : pw.FontWeight.normal,
          ),
        ),
        pw.Text(
          value,
          style: pw.TextStyle(
            fontSize: isTotal ? 14 : 12,
            fontWeight: isTotal ? pw.FontWeight.bold : pw.FontWeight.normal,
            color: valueColor,
          ),
        ),
      ],
    );
  }

  static pw.Widget _buildPaymentInfo(String paymentMethod) {
    return pw.Container(
      padding: const pw.EdgeInsets.all(12),
      decoration: pw.BoxDecoration(
        color: PdfColors.blue50,
        borderRadius: const pw.BorderRadius.all(pw.Radius.circular(8)),
      ),
      child: pw.Row(
        children: [
          pw.Text(
            'Payment Method: ',
            style: pw.TextStyle(
              fontSize: 12,
              fontWeight: pw.FontWeight.bold,
            ),
          ),
          pw.Text(
            paymentMethod.toUpperCase(),
            style: const pw.TextStyle(
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }

  static pw.Widget _buildSavingsHighlight(double savings) {
    return pw.Container(
      padding: const pw.EdgeInsets.all(12),
      decoration: pw.BoxDecoration(
        color: PdfColors.green50,
        border: pw.Border.all(color: PdfColors.green, width: 2),
        borderRadius: const pw.BorderRadius.all(pw.Radius.circular(8)),
      ),
      child: pw.Row(
        mainAxisAlignment: pw.MainAxisAlignment.center,
        children: [
          pw.Icon(
            const pw.IconData(0xe876), // checkmark icon
            color: PdfColors.green,
            size: 20,
          ),
          pw.SizedBox(width: 8),
          pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Text(
                'Congratulations! You Saved',
                style: pw.TextStyle(
                  fontSize: 12,
                  fontWeight: pw.FontWeight.bold,
                  color: PdfColors.green900,
                ),
              ),
              pw.Text(
                'Rs. ${savings.toStringAsFixed(2)}',
                style: pw.TextStyle(
                  fontSize: 18,
                  fontWeight: pw.FontWeight.bold,
                  color: PdfColors.green,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  static pw.Widget _buildFooter() {
    return pw.Container(
      padding: const pw.EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: const pw.BoxDecoration(
        border: pw.Border(
          top: pw.BorderSide(color: PdfColors.grey300, width: 2),
        ),
      ),
      child: pw.Column(
        children: [
          pw.Text(
            'Thank you for shopping with us!',
            style: pw.TextStyle(
              fontSize: 12,
              fontWeight: pw.FontWeight.bold,
              color: PdfColors.orange,
            ),
            textAlign: pw.TextAlign.center,
          ),
          pw.SizedBox(height: 4),
          pw.Text(
            'For any queries, please contact our support team',
            style: const pw.TextStyle(
              fontSize: 9,
              color: PdfColors.grey600,
            ),
            textAlign: pw.TextAlign.center,
          ),
          pw.SizedBox(height: 2),
          pw.Text(
            'Email: support@ecommerce.com | Phone: +1234567890',
            style: const pw.TextStyle(
              fontSize: 9,
              color: PdfColors.grey600,
            ),
            textAlign: pw.TextAlign.center,
          ),
        ],
      ),
    );
  }

  static Future<void> _savePdf(pw.Document pdf, String fileName) async {
    try {
      final bytes = await pdf.save();
      
      if (kIsWeb) {
        // For web platform, use layoutPdf which opens print dialog
        await Printing.layoutPdf(
          onLayout: (PdfPageFormat format) async => bytes,
        );
      } else {
        // For mobile and desktop, use sharePdf
        await Printing.sharePdf(
          bytes: bytes,
          filename: fileName,
        );
      }
    } catch (e) {
      print('Error saving PDF: $e');
      rethrow;
    }
  }
}

