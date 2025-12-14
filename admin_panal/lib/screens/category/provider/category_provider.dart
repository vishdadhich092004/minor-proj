import 'dart:developer';
import 'dart:io';
import 'dart:typed_data';
import '../../../models/api_response.dart';
import '../../../services/http_services.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart' hide Category;
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import '../../../core/data/data_provider.dart';
import '../../../models/category.dart';
import '../../../utility/snack_bar_helper.dart';

class CategoryProvider extends ChangeNotifier {
  HttpService service = HttpService();
  final DataProvider _dataProvider;
  final addCategoryFormKey = GlobalKey<FormState>();
  TextEditingController categoryNameCtrl = TextEditingController();
  Category? categoryForUpdate;

  File? selectedImage;
  XFile? imgXFile;

  CategoryProvider(this._dataProvider);

  addCategory() async {
    try {
      if (selectedImage == null) {
        SnackBarHelper.showErrorSnackBar('Pleas Choose A Image !');
        return; //? stop the program eviction
      }

      Map<String, dynamic> formDataMap = {
        'name': categoryNameCtrl.text,
        'image': 'no_data', //? image path will add from server side
      };

      final FormData form =
          await createFormData(imgXFile: imgXFile, formData: formDataMap);

      final response =
          await service.addItem(endpointUrl: 'categories', itemData: form);
      if (response.isOk) {
        ApiResponse apiResponse = ApiResponse.fromJson(response.body, null);
        if (apiResponse.success == true) {
          clearFields();
          SnackBarHelper.showSuccessSnackBar('${apiResponse.message}');
          _dataProvider.getAllCategory();
          log('category added');
        } else {
          SnackBarHelper.showErrorSnackBar(
              'Failed to add category: ${apiResponse.message}');
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

  updateCategory() async {
    try {
      Map<String, dynamic> formDataMap = {
        'name': categoryNameCtrl.text,
        'image': categoryForUpdate?.image ?? '',
      };

      final FormData form =
          await createFormData(imgXFile: imgXFile, formData: formDataMap);

      final response = await service.updateItem(
        endpointUrl: 'categories',
        itemData: form,
        itemId: categoryForUpdate?.sId ?? '',
      );

      if (response.isOk) {
        ApiResponse apiResponse = ApiResponse.fromJson(response.body, null);
        if (apiResponse.success == true) {
          clearFields();
          SnackBarHelper.showSuccessSnackBar('${apiResponse.message}');
          log('category added');
          _dataProvider.getAllCategory();
        } else {
          SnackBarHelper.showErrorSnackBar(
              'Failed to add category: ${apiResponse.message}');
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

  submitCategory() {
    if (categoryForUpdate != null) {
      updateCategory();
    } else {
      addCategory();
    }
  }

  void pickImage() async {
    final ImagePicker picker = ImagePicker();
    final XFile? image = await picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      selectedImage = File(image.path);
      imgXFile = image;
      notifyListeners();
    }
  }

  deleteCategory(Category category) async {
    try {
      Response response = await service.deleteItem(
          endpointUrl: 'categories', itemId: category.sId ?? '');

      if (response.isOk) {
        ApiResponse apiResponse = ApiResponse.fromJson(response.body, null);
        if (apiResponse.success == true) {
          SnackBarHelper.showSuccessSnackBar('Category Deleted Successfully');
          _dataProvider.getAllCategory();
        }
      } else {
        SnackBarHelper.showErrorSnackBar(
            'Error ${response.body?['message'] ?? response.statusText}');
      }
    } catch (e) {
      print(e);
      rethrow;
    }
  }

  //? Helper function to get MIME type from XFile or filename
  String _getMimeType(XFile file, String fileName) {
    // Try to get MIME type from XFile if available (for newer versions)
    try {
      // XFile might have mimeType property in some versions
      // If not available, infer from filename
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

  //? to create form data for sending image with body
  Future<FormData> createFormData(
      {required XFile? imgXFile,
      required Map<String, dynamic> formData}) async {
    if (imgXFile != null) {
      MultipartFile multipartFile;
      if (kIsWeb) {
        String fileName = imgXFile.name;
        Uint8List byteImg = await imgXFile.readAsBytes();

        // Get MIME type
        String mimeType = _getMimeType(imgXFile, fileName);

        // Ensure filename has proper extension
        fileName = _ensureFileExtension(fileName, mimeType);

        // Create MultipartFile with explicit contentType
        multipartFile = MultipartFile(
          byteImg,
          filename: fileName,
          contentType: mimeType,
        );
      } else {
        String fileName = imgXFile.path.split('/').last;
        String mimeType = _getMimeType(imgXFile, fileName);
        fileName = _ensureFileExtension(fileName, mimeType);
        multipartFile = MultipartFile(
          imgXFile.path,
          filename: fileName,
          contentType: mimeType,
        );
      }
      formData['img'] = multipartFile;
    }
    final FormData form = FormData(formData);
    return form;
  }

  //? set data for update on editing
  setDataForUpdateCategory(Category? category) {
    if (category != null) {
      clearFields();
      categoryForUpdate = category;
      categoryNameCtrl.text = category.name ?? '';
    } else {
      clearFields();
    }
  }

  //? to clear text field and images after adding or update category
  clearFields() {
    categoryNameCtrl.clear();
    selectedImage = null;
    imgXFile = null;
    categoryForUpdate = null;
  }
}
