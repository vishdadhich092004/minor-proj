// Stub file for mobile platforms (where dart:html is not available)
// This file is only imported on non-web platforms

class RazorpayWebHelper {
  static Future<void> loadRazorpayScript() async {
    throw UnsupportedError('RazorpayWebHelper is only available on web platform');
  }

  static Future<void> openCheckoutSimple({
    required String razorpayKey,
    required String orderId,
    required int amount,
    required String name,
    required String email,
    required String phone,
    required Function(String paymentId, String signature) onSuccess,
    required Function(String error) onError,
  }) async {
    throw UnsupportedError('RazorpayWebHelper is only available on web platform');
  }
}

