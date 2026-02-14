export interface Category {
    _id: string;
    name: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
    sId?: string; // Mapped from Flutter logic, though likely _id is enough
}

export interface SubCategory {
    _id: string;
    name: string;
    categoryId: string | Category;
    createdAt?: string;
    updatedAt?: string;
    sId?: string;
}

export interface Brand {
    _id: string;
    name: string;
    subcategoryId: string | SubCategory;
    createdAt?: string;
    updatedAt?: string;
    sId?: string;
}

export interface VariantType {
    _id: string;
    name: string;
    type: string;
    createdAt?: string;
    updatedAt?: string;
    sId?: string;
}

export interface Variant {
    _id: string;
    name: string;
    variantTypeId: string | VariantType;
    createdAt?: string;
    updatedAt?: string;
    sId?: string;
}

export interface ProductImage {
    _id: string;
    image: string;
    url: string;
}

export interface Product {
    _id: string;
    name: string;
    description?: string;
    price: number;
    offerPrice?: number;
    quantity: number;
    proCategoryId: Category;
    proSubCategoryId: SubCategory;
    proBrandId?: Brand;
    proVariantTypeId?: VariantType;
    proVariantId?: string[]; // Array of strings (names or IDs)
    images: ProductImage[];
    createdAt?: string;
    updatedAt?: string;
    sId?: string;
}

export interface Poster {
    _id: string;
    posterName: string;
    imageUrl: string;
    createdAt?: string;
    updatedAt?: string;
    sId?: string;
}

export interface Coupon {
    _id: string;
    couponCode: string;
    discountType: 'fixed' | 'percentage' | string;
    discountAmount: number;
    minimumPurchaseAmount: number;
    endDate: string;
    status: 'active' | 'inactive' | string;
    applicableCategory?: string | Category; // ID or Object
    applicableSubCategory?: string | SubCategory; // ID or Object
    applicableProduct?: string | Product; // ID or Object
    createdAt?: string;
    updatedAt?: string;
    sId?: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
    sId?: string;
}
