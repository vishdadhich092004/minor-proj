import 'dart:developer';
import 'package:e_commerce_app/utility/utility_extention.dart';

import '../../../models/coupon.dart';
import '../../login_screen/provider/user_provider.dart';
import '../../../services/http_services.dart';
import 'package:flutter/material.dart';
import 'package:flutter_cart/flutter_cart.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../../../models/api_response.dart';
import '../../../utility/constants.dart';
import '../../../utility/snack_bar_helper.dart';

class CartProvider extends ChangeNotifier {
  HttpService service = HttpService();
  final box = GetStorage();
  Razorpay razorpay = Razorpay();
  final UserProvider _userProvider;
  var flutterCart = FlutterCart();
  List<CartModel> myCartItems = [];

  final GlobalKey<FormState> buyNowFormKey = GlobalKey<FormState>();
  TextEditingController phoneController = TextEditingController();
  TextEditingController streetController = TextEditingController();
  TextEditingController cityController = TextEditingController();
  TextEditingController stateController = TextEditingController();
  TextEditingController postalCodeController = TextEditingController();
  TextEditingController countryController = TextEditingController();
  TextEditingController couponController = TextEditingController();
  bool isExpanded = false;

  Coupon? couponApplied;
  double couponCodeDiscount = 0;
  String selectedPaymentOption = 'prepaid';

  CartProvider(this._userProvider) {
    // Initialize Razorpay event handlers
    _setupRazorpayHandlers();
  }

  void _setupRazorpayHandlers() {
    razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  }

  void _handlePaymentSuccess(PaymentSuccessResponse response) async {
    log('Payment Success: ${response.paymentId}');
    
    if (_pendingPaymentOperation != null && _pendingOrderId != null) {
      // Verify payment and complete order
      await _verifyAndCompletePayment(
        _pendingOrderId!,
        response.paymentId!,
        response.signature!,
        _pendingPaymentOperation!,
      );
    } else {
      SnackBarHelper.showErrorSnackBar('Payment received but order context missing');
    }
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    log('Payment Error: ${response.message}');
    SnackBarHelper.showErrorSnackBar('Payment Failed: ${response.message}');
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    log('External Wallet: ${response.walletName}');
  }

  @override
  void dispose() {
    razorpay.clear();
    super.dispose();
  }

  getCartItems() {
    myCartItems = flutterCart.cartItemsList;
    notifyListeners();
  }

  void updateCart(CartModel cartItem, int quantity) {
    quantity = cartItem.quantity + quantity;
    flutterCart.updateQuantity(cartItem.productId, cartItem.variants, quantity);
    notifyListeners();
  }

  double getCartSubTotal() {
    return flutterCart.subtotal;
  }

  clearCartItems() {
    flutterCart.clearCart();
    notifyListeners();
  }

  double getGrandTotal() {
    return getCartSubTotal() - couponCodeDiscount;
  }

  checkCoupon() async {
    try {
      if (couponController.text.isEmpty) {
        SnackBarHelper.showErrorSnackBar('Enter a coupon code');
        return;
      }
      List<String> productIds =
          myCartItems.map((cartItem) => cartItem.productId).toList();
      Map<String, dynamic> couponData = {
        "couponCode": couponController.text,
        "purchaseAmount": getCartSubTotal(),
        "productIds": productIds
      };
      final response = await service.addItem(
          endpointUrl: 'couponCodes/check-coupon', itemData: couponData);
      if (response.isOk) {
        final ApiResponse<Coupon> apiResponse = ApiResponse<Coupon>.fromJson(
            response.body,
            (json) => Coupon.fromJson(json as Map<String, dynamic>));
        if (apiResponse.success == true) {
          Coupon? coupon = apiResponse.data;
          if (coupon != null) {
            couponApplied = coupon;
            couponCodeDiscount = getCouponDiscountAmount(coupon);
          }
          SnackBarHelper.showSuccessSnackBar(apiResponse.message);
          log('Coupon is valid');
        } else {
          SnackBarHelper.showErrorSnackBar(
              "Failed to validate Coupon: ${apiResponse.message}");
        }
      } else {
        SnackBarHelper.showErrorSnackBar(
            'Error ${response.body?['message'] ?? response.statusText}');
      }
      notifyListeners();
    } catch (e) {
      print(e);
      SnackBarHelper.showErrorSnackBar('An error occurred: $e');
      rethrow;
    }
  }

  double getCouponDiscountAmount(Coupon coupon) {
    double discountAmount = 0;
    String discountType = coupon.discountType ?? 'fixed';
    if (discountType == 'fixed') {
      discountAmount = coupon.discountAmount ?? 0;
      return discountAmount;
    } else {
      double discountPercentage = coupon.discountAmount ?? 0;
      double amountAfterDiscountPercentage =
          getCartSubTotal() * (discountPercentage / 100);
      return amountAfterDiscountPercentage;
    }
  }

  addOrder(BuildContext context) async {
    try {
      Map<String, dynamic> order = {
        "userID": _userProvider.getLoginUsr()?.sId ?? '',
        "orderStatus": "pending",
        "items": cartItemToOrderItem(myCartItems),
        "totalPrice": getCartSubTotal(),
        "shippingAddress": {
          "phone": phoneController.text,
          "street": streetController.text,
          "city": cityController.text,
          "state": streetController.text,
          "postalCode": postalCodeController.text,
          "country": countryController.text
        },
        "paymentMethod": selectedPaymentOption,
        "couponCode": couponApplied?.sId,
        "orderTotal": {
          "subtotal": getCartSubTotal(),
          "discount": couponCodeDiscount,
          "total": getGrandTotal()
        },
      };

      final response =
          await service.addItem(endpointUrl: 'orders', itemData: order);
      if (response.isOk) {
        ApiResponse apiResponse = ApiResponse.fromJson(response.body, null);
        if (apiResponse.success == true) {
          SnackBarHelper.showSuccessSnackBar(apiResponse.message);
          log('Order added');
          clearCouponDiscount();
          clearCartItems();
          Navigator.pop(context);
        } else {
          SnackBarHelper.showErrorSnackBar(
              'Failed to add Order: ${apiResponse.message}');
        }
      } else {
        SnackBarHelper.showErrorSnackBar(
            'Error ${response.body?['message'] ?? response.statusText}');
      }
    } catch (e) {
      print(e);
      SnackBarHelper.showErrorSnackBar('An error occurred: $e');
      rethrow;
    }
  }

  List<Map<String, dynamic>> cartItemToOrderItem(List<CartModel> cartItems) {
    return cartItems.map((cartItem) {
      return {
        "productID": cartItem.productId,
        "productName": cartItem.productName,
        "quantity": cartItem.quantity,
        "price": cartItem.variants.safeElementAt(0)?.price ?? 0,
        "variant": cartItem.variants.safeElementAt(0)?.color ?? "",
      };
    }).toList();
  }

  submitOrder(BuildContext context) async {
    if (selectedPaymentOption == 'cod') {
      addOrder(context);
    } else {
      // Use Razorpay for prepaid payments
      await razorpayPayment(operation: () {
        addOrder(context);
      });
    }
  }

  clearCouponDiscount() {
    couponApplied = null;
    couponCodeDiscount = 0;
    couponController.text = '';
    notifyListeners();
  }

  void retrieveSavedAddress() {
    phoneController.text = box.read(PHONE_KEY) ?? '';
    streetController.text = box.read(STREET_KEY) ?? '';
    cityController.text = box.read(CITY_KEY) ?? '';
    stateController.text = box.read(STATE_KEY) ?? '';
    postalCodeController.text = box.read(POSTAL_CODE_KEY) ?? '';
    countryController.text = box.read(COUNTRY_KEY) ?? '';
  }

  Future<void> stripePayment({required void Function() operation}) async {
    try {
      Map<String, dynamic> paymentData = {
        "email": _userProvider.getLoginUsr()?.name,
        "name": _userProvider.getLoginUsr()?.name,
        "address": {
          "line1": streetController.text,
          "city": cityController.text,
          "state": stateController.text,
          "postal_code": postalCodeController.text,
          "country": "US"
        },
        "amount": getGrandTotal() * 100,
        "currency": "usd",
        "description": "Your transaction description here"
      };
      Response response = await service.addItem(
          endpointUrl: 'payment/stripe', itemData: paymentData);
      final data = await response.body;
      final paymentIntent = data['paymentIntent'];
      final ephemeralKey = data['ephemeralKey'];
      final customer = data['customer'];
      final publishableKey = data['publishableKey'];

      Stripe.publishableKey = publishableKey;
      BillingDetails billingDetails = BillingDetails(
        email: _userProvider.getLoginUsr()?.name,
        phone: '91234123908',
        name: _userProvider.getLoginUsr()?.name,
        address: Address(
            country: 'US',
            city: cityController.text,
            line1: streetController.text,
            line2: stateController.text,
            postalCode: postalCodeController.text,
            state: stateController.text
            // Other address details
            ),
        // Other billing details
      );
      await Stripe.instance.initPaymentSheet(
        paymentSheetParameters: SetupPaymentSheetParameters(
          customFlow: false,
          merchantDisplayName: 'MOBIZATE',
          paymentIntentClientSecret: paymentIntent,
          customerEphemeralKeySecret: ephemeralKey,
          customerId: customer,
          style: ThemeMode.light,
          billingDetails: billingDetails,
          // googlePay: const PaymentSheetGooglePay(
          //   merchantCountryCode: 'US',
          //   currencyCode: 'usd',
          //   testEnv: true,
          // ),
          // applePay: const PaymentSheetApplePay(merchantCountryCode: 'US')
        ),
      );

      await Stripe.instance.presentPaymentSheet().then((value) {
        log('payment success');
        //? do the success operation
        ScaffoldMessenger.of(Get.context!).showSnackBar(
          const SnackBar(content: Text('Payment Success')),
        );
        operation();
      }).onError((error, stackTrace) {
        if (error is StripeException) {
          ScaffoldMessenger.of(Get.context!).showSnackBar(
            SnackBar(content: Text('${error.error.localizedMessage}')),
          );
        } else {
          ScaffoldMessenger.of(Get.context!).showSnackBar(
            SnackBar(content: Text('Stripe Error: $error')),
          );
        }
      });
    } catch (e) {
      ScaffoldMessenger.of(Get.context!).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    }
  }

  Future<void> razorpayPayment({required void Function() operation}) async {
    try {
      // Step 1: Create order on backend
      final amount = getGrandTotal();
      Response orderResponse = await service.addItem(
        endpointUrl: 'payment/razorpay/create-order',
        itemData: {
          'amount': amount,
          'currency': 'INR',
          'receipt': 'receipt_${DateTime.now().millisecondsSinceEpoch}',
        },
      );

      if (!orderResponse.isOk) {
        SnackBarHelper.showErrorSnackBar('Failed to create payment order');
        return;
      }

      final orderData = await orderResponse.body;
      if (orderData['error'] == true) {
        SnackBarHelper.showErrorSnackBar(orderData['message'] ?? 'Failed to create order');
        return;
      }

      final orderId = orderData['data']['orderId'];
      final razorpayKey = orderData['data']['key'];

      // Step 2: Open Razorpay checkout with order ID
      // Note: When using order_id, amount is not needed as it's already in the order
      var options = {
        'key': razorpayKey,
        'name': 'MOBIZATE',
        'order_id': orderId,
        'description': 'Order Payment',
        'timeout': 300, // 5 minutes
        'prefill': {
          'contact': phoneController.text.isNotEmpty 
              ? phoneController.text 
              : '9999999999',
          'email': _userProvider.getLoginUsr()?.name ?? '',
          'name': _userProvider.getLoginUsr()?.name ?? 'User',
        },
        'theme': {
          'color': '#FFE64A',
        },
      };

      // Store the operation callback for later use
      _pendingPaymentOperation = operation;
      _pendingOrderId = orderId;

      razorpay.open(options);
    } catch (e) {
      log('Razorpay Payment Error: $e');
      SnackBarHelper.showErrorSnackBar('Payment Error: $e');
    }
  }

  // Store pending operation and order ID for payment verification
  void Function()? _pendingPaymentOperation;
  String? _pendingOrderId;

  Future<void> _verifyAndCompletePayment(
    String orderId,
    String paymentId,
    String signature,
    void Function() operation,
  ) async {
    try {
      // Verify payment on backend
      Response verifyResponse = await service.addItem(
        endpointUrl: 'payment/razorpay/verify',
        itemData: {
          'razorpay_order_id': orderId,
          'razorpay_payment_id': paymentId,
          'razorpay_signature': signature,
        },
      );

      if (!verifyResponse.isOk) {
        SnackBarHelper.showErrorSnackBar('Payment verification failed');
        return;
      }

      final verifyData = await verifyResponse.body;
      if (verifyData['error'] == true) {
        SnackBarHelper.showErrorSnackBar(
          verifyData['message'] ?? 'Payment verification failed',
        );
        return;
      }

      // Payment verified successfully, proceed with order
      log('Payment verified successfully');
      operation();
    } catch (e) {
      log('Payment Verification Error: $e');
      SnackBarHelper.showErrorSnackBar('Payment verification error: $e');
    } finally {
      _pendingPaymentOperation = null;
      _pendingOrderId = null;
    }
  }

  void updateUI() {
    notifyListeners();
  }
}
