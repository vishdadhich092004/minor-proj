class Variant {
  String? sId;
  String? name;
  VariantTypeRef? variantTypeId;

  Variant({this.sId, this.name, this.variantTypeId});

  Variant.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    name = json['name'];
    variantTypeId = json['variantTypeId'] != null
        ? VariantTypeRef.fromJson(json['variantTypeId'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['_id'] = sId;
    data['name'] = name;
    if (variantTypeId != null) {
      data['variantTypeId'] = variantTypeId!.toJson();
    }
    return data;
  }
}

class VariantTypeRef {
  String? sId;
  String? name;
  String? type;

  VariantTypeRef({this.sId, this.name, this.type});

  VariantTypeRef.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    name = json['name'];
    type = json['type'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = <String, dynamic>{};
    data['_id'] = sId;
    data['name'] = name;
    data['type'] = type;
    return data;
  }
}

