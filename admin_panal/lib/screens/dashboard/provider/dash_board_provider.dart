import 'dart:developer';
import 'dart:io';
import 'dart:typed_data';
import '../../../models/api_response.dart';
import '../../../models/brand.dart';
import '../../../models/sub_category.dart';
import '../../../models/variant_type.dart';
import 'package:flutter/foundation.dart' hide Category;
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import '../../../core/data/data_provider.dart';
import '../../../models/category.dart';
import '../../../services/http_services.dart';
import '../../../models/product.dart';
import '../../../utility/snack_bar_helper.dart';

class DashBoardProvider extends ChangeNotifier {
  HttpService service = HttpService();
  final DataProvider _dataProvider;
  final addProductFormKey = GlobalKey<FormState>();

  //?text editing controllers in dashBoard screen
  TextEditingController productNameCtrl = TextEditingController();
  TextEditingController productDescCtrl = TextEditingController();
  TextEditingController productQntCtrl = TextEditingController();
  TextEditingController productPriceCtrl = TextEditingController();
  TextEditingController productOffPriceCtrl = TextEditingController();

  //? dropdown value
  Category? selectedCategory;
  SubCategory? selectedSubCategory;
  Brand? selectedBrand;
  VariantType? selectedVariantType;
  List<String> selectedVariants = [];

  Product? productForUpdate;
  File? selectedMainImage,
      selectedSecondImage,
      selectedThirdImage,
      selectedFourthImage,
      selectedFifthImage;
  XFile? mainImgXFile,
      secondImgXFile,
      thirdImgXFile,
      fourthImgXFile,
      fifthImgXFile;

  //? to filter the data depend on parent dropdown value
  List<SubCategory> subCategoriesByCategory = [];
  List<Brand> brandsBySubCategory = [];
  List<String> variantsByVariantType = [];

  DashBoardProvider(this._dataProvider);

  addProduct() async {
    try {
      if (selectedMainImage == null) {
        SnackBarHelper.showErrorSnackBar('Please Choose A Image !!');
        return;
      }

      Map<String, dynamic> formDataMap = {
        'name': productNameCtrl.text,
        'description': productDescCtrl.text,
        'proCategoryId': selectedCategory?.sId ?? '',
        'proSubCategoryId': selectedSubCategory?.sId ?? '',
        'proBrandId': selectedBrand?.sId ?? '',
        'price': productPriceCtrl.text,
        'offerPrice': productOffPriceCtrl.text.isEmpty
            ? productPriceCtrl.text
            : productOffPriceCtrl.text,
        'quantity': productQntCtrl.text,
        'proVariantTypeId': selectedVariantType?.sId,
        'proVariantId': selectedVariants,
      };

      final FormData form = await createFormDataForMultipleImage(imgXFiles: [
        {'image1': mainImgXFile},
        {'image2': secondImgXFile},
        {'image3': thirdImgXFile},
        {'image4': fourthImgXFile},
        {'image5': fifthImgXFile}
      ], formData: formDataMap);

      final response =
          await service.addItem(endpointUrl: 'products', itemData: form);

      if (response.isOk) {
        ApiResponse apiResponse = ApiResponse.fromJson(response.body, null);

        if (apiResponse.success == true) {
          clearFields();
          SnackBarHelper.showSuccessSnackBar('${apiResponse.message}');
          _dataProvider.getAllProduct();
          log('products added');
        } else {
          SnackBarHelper.showErrorSnackBar(
              'Failed to add products: ${apiResponse.message}');
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

  updateProduct() async {
    try {
      Map<String, dynamic> formDataMap = {
        'name': productNameCtrl.text,
        'description': productDescCtrl.text,
        'proCategoryId': selectedCategory?.sId ?? '',
        'proSubCategoryId': selectedSubCategory?.sId ?? '',
        'proBrandId': selectedBrand?.sId ?? '',
        'price': productPriceCtrl.text,
        'offerPrice': productOffPriceCtrl.text.isEmpty
            ? productPriceCtrl.text
            : productOffPriceCtrl.text,
        'quantity': productQntCtrl.text,
        'proVariantTypeId': selectedVariantType?.sId ?? '',
        'proVariantId': selectedVariants,
      };

      final FormData form = await createFormDataForMultipleImage(imgXFiles: [
        {'image1': mainImgXFile},
        {'image2': secondImgXFile},
        {'image3': thirdImgXFile},
        {'image4': fourthImgXFile},
        {'image5': fifthImgXFile}
      ], formData: formDataMap);

      final response = await service.updateItem(
          endpointUrl: 'products',
          itemData: form,
          itemId: '${productForUpdate?.sId}');

      if (response.isOk) {
        ApiResponse apiResponse = ApiResponse.fromJson(response.body, null);

        if (apiResponse.success == true) {
          clearFields();
          SnackBarHelper.showSuccessSnackBar('${apiResponse.message}');
          _dataProvider.getAllProduct();
          log('products added');
          clearFields();
        } else {
          SnackBarHelper.showErrorSnackBar(
              'Failed to add products: ${apiResponse.message}');
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

  submitProduct() {
    if (productForUpdate != null) {
      updateProduct();
    } else {
      addProduct();
    }
  }

  deleteProduct(Product product) async {
    try {
      Response response = await service.deleteItem(
          endpointUrl: 'products', itemId: product.sId ?? '');
      if (response.isOk) {
        ApiResponse apiResponse = ApiResponse.fromJson(response.body, null);
        if (apiResponse.success == true) {
          SnackBarHelper.showSuccessSnackBar('Product Deleted Successfully');
          _dataProvider.getAllProduct();
        }
      } else {
        SnackBarHelper.showErrorSnackBar(
            'Error ${response.body['message'] ?? response.statusText}');
      }
    } catch (e) {
      print(e);
      rethrow;
    }
  }

  void pickImage({required int imageCardNumber}) async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      if (imageCardNumber == 1) {
        selectedMainImage = File(image.path);
        mainImgXFile = image;
      } else if (imageCardNumber == 2) {
        selectedSecondImage = File(image.path);
        secondImgXFile = image;
      } else if (imageCardNumber == 3) {
        selectedThirdImage = File(image.path);
        thirdImgXFile = image;
      } else if (imageCardNumber == 4) {
        selectedFourthImage = File(image.path);
        fourthImgXFile = image;
      } else if (imageCardNumber == 5) {
        selectedFifthImage = File(image.path);
        fifthImgXFile = image;
      }
      notifyListeners();
    }
  }

  //? Helper function to get MIME type from XFile or filename
  String _getMimeType(XFile file, String fileName) {
    // Try to get MIME type from XFile if available (for newer versions)
    // If not available, infer from filename
    try {
      final extension = fileName.toLowerCase().split('.').last;
      switch (extension) {
        case 'jpg':
        case 'jpeg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        case 'gif':
          return 'image/gif';
        case 'webp':
          return 'image/webp';
        default:
          return 'image/jpeg'; // Default to jpeg if unknown
      }
    } catch (e) {
      return 'image/jpeg';
    }
  }

  //? Helper function to ensure filename has proper extension
  String _ensureFileExtension(String fileName, String mimeType) {
    // Check if filename already has an extension
    final parts = fileName.split('.');
    if (parts.length > 1) {
      final ext = parts.last.toLowerCase();
      // Validate extension matches MIME type
      if ((mimeType == 'image/jpeg' && (ext == 'jpg' || ext == 'jpeg')) ||
          (mimeType == 'image/png' && ext == 'png') ||
          (mimeType == 'image/gif' && ext == 'gif') ||
          (mimeType == 'image/webp' && ext == 'webp')) {
        return fileName;
      }
    }

    // If no extension or wrong extension, add correct one based on MIME type
    final baseName = parts.length > 1
        ? parts.sublist(0, parts.length - 1).join('.')
        : fileName;
    switch (mimeType) {
      case 'image/jpeg':
        return '$baseName.jpg';
      case 'image/png':
        return '$baseName.png';
      case 'image/gif':
        return '$baseName.gif';
      case 'image/webp':
        return '$baseName.webp';
      default:
        return '$baseName.jpg';
    }
  }

  Future<FormData> createFormDataForMultipleImage({
    required List<Map<String, XFile?>>? imgXFiles,
    required Map<String, dynamic> formData,
  }) async {
    // Loop over the provided image files and add them to the form data
    if (imgXFiles != null) {
      for (int i = 0; i < imgXFiles.length; i++) {
        XFile? imgXFile = imgXFiles[i]['image' + (i + 1).toString()];
        if (imgXFile != null) {
          // Check if it's running on the web
          if (kIsWeb) {
            String fileName = imgXFile.name;
            Uint8List byteImg = await imgXFile.readAsBytes();

            // Get MIME type
            String mimeType = _getMimeType(imgXFile, fileName);

            // Ensure filename has proper extension
            fileName = _ensureFileExtension(fileName, mimeType);

            // Create MultipartFile with explicit contentType
            formData['image' + (i + 1).toString()] = MultipartFile(
              byteImg,
              filename: fileName,
              contentType: mimeType,
            );
          } else {
            String filePath = imgXFile.path;
            String fileName = filePath.split('/').last;
            String mimeType = _getMimeType(imgXFile, fileName);
            fileName = _ensureFileExtension(fileName, mimeType);
            formData['image' + (i + 1).toString()] = await MultipartFile(
              filePath,
              filename: fileName,
              contentType: mimeType,
            );
          }
        }
      }
    }

    // Create and return the FormData object
    final FormData form = FormData(formData);
    return form;
  }

  filterSubcategory(Category category) {
    selectedSubCategory = null;
    selectedBrand = null;
    selectedCategory = category;
    subCategoriesByCategory.clear();
    final newList = _dataProvider.subCategories
        .where((subcategory) => subcategory.categoryId?.sId == category.sId)
        .toList();
    subCategoriesByCategory = newList;
    notifyListeners();
  }

  filterBrand(SubCategory subCategory) {
    selectedBrand = null;
    selectedSubCategory = subCategory;
    brandsBySubCategory.clear();
    final newList = _dataProvider.brands
        .where((brand) => brand.subcategoryId?.sId == subCategory.sId)
        .toList();
    brandsBySubCategory = newList;
    notifyListeners();
  }

  filterVariant(VariantType variantType) {
    selectedVariants = [];
    selectedVariantType = variantType;
    final newList = _dataProvider.variants
        .where((variant) => variant.variantTypeId?.sId == variantType.sId)
        .toList();
    final List<String> variantNames =
        newList.map((variant) => variant.name ?? '').toList();
    variantsByVariantType = variantNames;
    notifyListeners();
  }

  setDataForUpdateProduct(Product? product) {
    if (product != null) {
      productForUpdate = product;

      productNameCtrl.text = product.name ?? '';
      productDescCtrl.text = product.description ?? '';
      productPriceCtrl.text = product.price.toString();
      productOffPriceCtrl.text = '${product.offerPrice}';
      productQntCtrl.text = '${product.quantity}';

      selectedCategory = _dataProvider.categories.firstWhereOrNull(
          (element) => element.sId == product.proCategoryId?.sId);

      final newListCategory = _dataProvider.subCategories
          .where((subcategory) =>
              subcategory.categoryId?.sId == product.proCategoryId?.sId)
          .toList();
      subCategoriesByCategory = newListCategory;
      selectedSubCategory = _dataProvider.subCategories.firstWhereOrNull(
          (element) => element.sId == product.proSubCategoryId?.sId);

      final newListBrand = _dataProvider.brands
          .where((brand) =>
              brand.subcategoryId?.sId == product.proSubCategoryId?.sId)
          .toList();
      brandsBySubCategory = newListBrand;
      selectedBrand = _dataProvider.brands.firstWhereOrNull(
          (element) => element.sId == product.proBrandId?.sId);

      selectedVariantType = _dataProvider.variantTypes.firstWhereOrNull(
          (element) => element.sId == product.proVariantTypeId?.sId);

      final newListVariant = _dataProvider.variants
          .where((variant) =>
              variant.variantTypeId?.sId == product.proVariantTypeId?.sId)
          .toList();
      final List<String> variantNames =
          newListVariant.map((variant) => variant.name ?? '').toList();
      variantsByVariantType = variantNames;
      selectedVariants = product.proVariantId ?? [];
    } else {
      clearFields();
    }
  }

  clearFields() {
    productNameCtrl.clear();
    productDescCtrl.clear();
    productPriceCtrl.clear();
    productOffPriceCtrl.clear();
    productQntCtrl.clear();

    selectedMainImage = null;
    selectedSecondImage = null;
    selectedThirdImage = null;
    selectedFourthImage = null;
    selectedFifthImage = null;

    mainImgXFile = null;
    secondImgXFile = null;
    thirdImgXFile = null;
    fourthImgXFile = null;
    fifthImgXFile = null;

    selectedCategory = null;
    selectedSubCategory = null;
    selectedBrand = null;
    selectedVariantType = null;
    selectedVariants = [];

    productForUpdate = null;

    subCategoriesByCategory = [];
    brandsBySubCategory = [];
    variantsByVariantType = [];
  }

  updateUI() {
    notifyListeners();
  }
}
