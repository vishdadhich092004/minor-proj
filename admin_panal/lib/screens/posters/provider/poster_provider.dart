import 'dart:developer';
import 'dart:io';
import 'dart:typed_data';
import 'package:admin/utility/snack_bar_helper.dart';

import '../../../models/api_response.dart';
import '../../../services/http_services.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart' hide Category;
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import '../../../core/data/data_provider.dart';
import '../../../models/poster.dart';

class PosterProvider extends ChangeNotifier {
  HttpService service = HttpService();
  final DataProvider _dataProvider;
  final addPosterFormKey = GlobalKey<FormState>();
  TextEditingController posterNameCtrl = TextEditingController();
  Poster? posterForUpdate;

  File? selectedImage;
  XFile? imgXFile;

  PosterProvider(this._dataProvider);

  addPoster() async {
    try {
      if (selectedImage == null) {
        SnackBarHelper.showErrorSnackBar('Pleas Choose A Image !');
        return; //? stop the program eviction
      }

      Map<String, dynamic> formDataMap = {
        'posterName': posterNameCtrl.text,
        'image': 'no_data', //? image path will add from server side
      };

      final FormData form =
          await createFormData(imgXFile: imgXFile, formData: formDataMap);

      final response =
          await service.addItem(endpointUrl: 'posters', itemData: form);
      if (response.isOk) {
        ApiResponse apiResponse = ApiResponse.fromJson(response.body, null);
        if (apiResponse.success == true) {
          clearFields();
          SnackBarHelper.showSuccessSnackBar('${apiResponse.message}');
          log('poster added');
          _dataProvider.getAllPosters();
        } else {
          SnackBarHelper.showErrorSnackBar(
              'Failed to add posters: ${apiResponse.message}');
        }
      } else {
        SnackBarHelper.showErrorSnackBar(
            'Error ${response.body['message'] ?? response.statusText}');
      }
    } catch (e) {
      print(e);
      SnackBarHelper.showErrorSnackBar('An error occurred: $e');
      rethrow;
    }
  }

  updatePoster() async {
    try {
      Map<String, dynamic> formDataMap = {
        'posterName': posterNameCtrl.text,
        'image': posterForUpdate?.imageUrl ?? '',
      };

      final FormData form =
          await createFormData(imgXFile: imgXFile, formData: formDataMap);

      final response = await service.updateItem(
          endpointUrl: 'posters',
          itemData: form,
          itemId: posterForUpdate?.sId ?? '');
      if (response.isOk) {
        ApiResponse apiResponse = ApiResponse.fromJson(response.body, null);
        if (apiResponse.success == true) {
          clearFields();
          SnackBarHelper.showSuccessSnackBar('${apiResponse.message}');
          log('poster added');
          _dataProvider.getAllPosters();
        } else {
          SnackBarHelper.showErrorSnackBar(
              'Failed to add poster: ${apiResponse.message}');
        }
      } else {
        SnackBarHelper.showErrorSnackBar(
            'Error ${response.body['message'] ?? response.statusText}');
      }
    } catch (e) {
      print(e);
      SnackBarHelper.showErrorSnackBar('An error occurred: $e');
      rethrow;
    }
  }

  submitPoster() {
    if (posterForUpdate != null) {
      updatePoster();
    } else {
      addPoster();
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

  deletePoster(Poster poster) async {
    try {
      Response response = await service.deleteItem(
          endpointUrl: 'posters', itemId: poster.sId ?? '');
      if (response.isOk) {
        ApiResponse apiResponse = ApiResponse.fromJson(response.body, null);
        if (apiResponse.success == true) {
          SnackBarHelper.showSuccessSnackBar('Poster Deleted Successfully');
          _dataProvider.getAllPosters();
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

  setDataForUpdatePoster(Poster? poster) {
    if (poster != null) {
      clearFields();
      posterForUpdate = poster;
      posterNameCtrl.text = poster.posterName ?? '';
    } else {
      clearFields();
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

  clearFields() {
    posterNameCtrl.clear();
    selectedImage = null;
    imgXFile = null;
    posterForUpdate = null;
  }
}
