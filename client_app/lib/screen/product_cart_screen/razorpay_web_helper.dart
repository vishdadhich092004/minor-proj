// Web-specific Razorpay helper using dart:html
import 'dart:html' as html;
import 'dart:async';
import 'dart:js' as js;

class RazorpayWebHelper {
  static bool _scriptLoaded = false;
  static Completer<void>? _scriptLoadCompleter;

  /// Load Razorpay checkout script
  static Future<void> loadRazorpayScript() async {
    if (_scriptLoaded) return;

    if (_scriptLoadCompleter != null) {
      return _scriptLoadCompleter!.future;
    }

    _scriptLoadCompleter = Completer<void>();

    // Check if script already exists
    final existingScript = html.document
        .querySelector('script[src*="razorpay.com/v1/checkout.js"]');
    if (existingScript != null) {
      _scriptLoaded = true;
      _scriptLoadCompleter!.complete();
      return;
    }

    // Create and load script
    final script = html.ScriptElement()
      ..src = 'https://checkout.razorpay.com/v1/checkout.js'
      ..async = true;

    script.onLoad.listen((_) {
      _scriptLoaded = true;
      _scriptLoadCompleter!.complete();
    });

    script.onError.listen((_) {
      _scriptLoadCompleter!.completeError('Failed to load Razorpay script');
    });

    html.document.head!.append(script);
    await _scriptLoadCompleter!.future;
  }

  /// Open Razorpay checkout
  static Future<Map<String, String>?> openCheckout({
    required String razorpayKey,
    required String orderId,
    required int amount,
    required String name,
    required String email,
    required String phone,
    required Function(String paymentId, String signature) onSuccess,
    required Function(String error) onError,
  }) async {
    try {
      await loadRazorpayScript();

      // Wait a bit for script to be fully loaded
      await Future.delayed(Duration(milliseconds: 300));

      // Create options object
      final options = js.JsObject.jsify({
        'key': razorpayKey,
        'amount': amount,
        'currency': 'INR',
        'order_id': orderId,
        'name': 'MOBIZATE',
        'description': 'Order Payment',
        'prefill': {
          'name': name,
          'email': email,
          'contact': phone,
        },
        'theme': {
          'color': '#FFE64A',
        },
        'handler': js.allowInterop((response) {
          onSuccess(
            response['razorpay_payment_id'] as String,
            response['razorpay_signature'] as String,
          );
        }),
        'modal': js.JsObject.jsify({
          'ondismiss': js.allowInterop(() {
            onError('Payment cancelled by user');
          }),
        }),
      });

      // Create Razorpay instance
      final razorpay = js.context.callMethod('eval', [
        'new Razorpay(${js.context['JSON'].callMethod('stringify', [options])})'
      ]);

      // Set up error handler
      razorpay.callMethod('on', [
        'payment.failed',
        js.allowInterop((response) {
          final error = response['error']?['description'] ?? 'Payment failed';
          onError(error);
        }),
      ]);

      // Open checkout
      razorpay.callMethod('open');

      return null;
    } catch (e) {
      onError('Failed to initialize payment: $e');
      return null;
    }
  }

  /// Simpler approach using JavaScript string evaluation
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
    try {
      await loadRazorpayScript();
      await Future.delayed(Duration(milliseconds: 500));

      // Escape strings for JavaScript
      String escapeJs(String str) => str
          .replaceAll('\\', '\\\\')
          .replaceAll("'", "\\'")
          .replaceAll('\n', '\\n');

      // Create a unique callback name for storing callbacks
      final callbackId = 'rzp_${DateTime.now().millisecondsSinceEpoch}';

      // Create callback functions in global scope using dart:js
      js.context['window']['${callbackId}_success'] =
          js.allowInterop((paymentId, signature) {
        onSuccess(paymentId as String, signature as String);
      });

      js.context['window']['${callbackId}_error'] = js.allowInterop((error) {
        onError(error as String);
      });

      // Create and execute Razorpay checkout
      final jsCode = '''
        (function() {
          if (typeof Razorpay === 'undefined') {
            window.${callbackId}_error('Razorpay script not loaded');
            return;
          }
          
          var options = {
            key: '${escapeJs(razorpayKey)}',
            amount: $amount,
            currency: 'INR',
            order_id: '${escapeJs(orderId)}',
            name: 'MOBIZATE',
            description: 'Order Payment',
            prefill: {
              name: '${escapeJs(name)}',
              email: '${escapeJs(email)}',
              contact: '${escapeJs(phone)}'
            },
            theme: {
              color: '#FFE64A'
            },
            handler: function(response) {
              window.${callbackId}_success(response.razorpay_payment_id, response.razorpay_signature);
            },
            modal: {
              ondismiss: function() {
                window.${callbackId}_error('Payment cancelled by user');
              }
            }
          };
          
          var rzp = new Razorpay(options);
          
          rzp.on('payment.failed', function(response) {
            var errorMsg = response.error && response.error.description 
              ? response.error.description 
              : 'Payment failed';
            window.${callbackId}_error(errorMsg);
          });
          
          rzp.open();
        })();
      ''';

      js.context.callMethod('eval', [jsCode]);
    } catch (e) {
      onError('Failed to open payment: $e');
    }
  }
}
