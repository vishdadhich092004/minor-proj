import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import '../../utility/constants.dart';

class CustomNetworkImage extends StatelessWidget {
  final String imageUrl;
  final BoxFit fit;
  final double scale;

  const CustomNetworkImage({
    super.key,
    required this.imageUrl,
    this.fit = BoxFit.cover,
    this.scale = 1.0,
  });

  // Check if URL is external (not from our backend)
  bool _isExternalUrl(String url) {
    if (url.isEmpty) return false;
    try {
      final uri = Uri.parse(url);
      final mainUri = Uri.parse(MAIN_URL);
      return uri.host.isNotEmpty && uri.host != mainUri.host;
    } catch (e) {
      return false;
    }
  }

  // Get proxied URL for web platform
  String _getProxiedUrl(String url) {
    if (!kIsWeb || !_isExternalUrl(url)) {
      return url;
    }
    // Use backend proxy for external images
    final encodedUrl = Uri.encodeComponent(url);
    return '$MAIN_URL/api/image-proxy/proxy?url=$encodedUrl';
  }

  @override
  Widget build(BuildContext context) {
    // Use proxied URL for external images on web to bypass CORS
    final urlToUse = _getProxiedUrl(imageUrl);
    
    return Image.network(
      urlToUse,
      fit: fit,
      scale: scale,
      loadingBuilder: (BuildContext context, Widget child, ImageChunkEvent? loadingProgress) {
        if (loadingProgress == null) return child;
        return Center(
          child: CircularProgressIndicator(
            value: loadingProgress.expectedTotalBytes != null
                ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
                : null,
          ),
        );
      },
      errorBuilder: (BuildContext context, Object exception, StackTrace? stackTrace) {
        return _buildErrorWidget();
      },
    );
  }

  Widget _buildErrorWidget() {
    return Container(
      color: Colors.grey[200],
      child: const Center(
        child: Icon(Icons.error, color: Colors.red, size: 40),
      ),
    );
  }
}
