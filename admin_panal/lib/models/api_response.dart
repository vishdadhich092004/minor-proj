class ApiResponse<T> {
  final bool success;
  final String message;
  final T? data;

  ApiResponse({required this.success, required this.message, this.data});

  factory ApiResponse.fromJson(
    // factory constructor
    Map<String, dynamic> json,
    T Function(Object? json)? fromJsonT,
  ) {
    // Handle message field - it can be a String or a Map/Object
    String messageString;
    final messageValue = json['message'];
    if (messageValue is String) {
      messageString = messageValue;
    } else if (messageValue is Map) {
      // Convert Map to a readable string
      // Try to extract meaningful error information
      final code = messageValue['code'] ?? '';
      final path = messageValue['path'] ?? '';
      if (code != '' || path != '') {
        messageString =
            'Error: ${code != '' ? code : 'Unknown error'}${path != '' ? ' - File: $path' : ''}';
      } else {
        messageString = messageValue.toString();
      }
    } else {
      messageString = messageValue?.toString() ?? 'Unknown error';
    }

    return ApiResponse(
      success: json['success'] as bool,
      message: messageString,
      data: json['data'] != null ? fromJsonT!(json['data']) : null,
    );
  }
}
