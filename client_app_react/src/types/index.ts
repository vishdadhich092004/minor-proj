export interface User {
    _id: string;
    name: string;
    useremail?: string;
    password?: string;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export interface Category {
    _id: string;
    name: string;
    image: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Poster {
    _id: string;
    posterName: string;
    imageUrl: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Image {
    _id: string;
    image: number;
    url: string;
}

export interface Variant {
    _id: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Product {
    _id: string;
    name: string;
    description: string;
    quantity: number;
    price: number;
    offerPrice: number;
    proCategoryId: { _id: string; name: string } | null;
    proSubCategoryId: { _id: string; name: string } | null;
    proBrandId: { _id: string; name: string } | null;
    images: Image[];
    proVariantId?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Coupon {
    _id: string;
    couponCode: string;
    discountType: 'fixed' | 'percentage';
    discountAmount: number;
    minimumPurchaseAmount: number;
    endDate: string;
    status: string;
    applicableCategory?: string;
    applicableSubCategory?: string;
    applicableProduct?: string;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    variant?: string;
}

export interface OrderData {
    userID: string;
    orderStatus: string;
    items: {
        productID: string;
        productName: string;
        quantity: number;
        price: number;
        variant?: string;
    }[];
    totalPrice: number;
    shippingAddress: {
        phone: string;
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    couponCode?: string;
    orderTotal: {
        subtotal: number;
        discount: number;
        total: number;
    };
}

export interface Order {
    _id: string;
    userID: User | string;
    orderStatus: string;
    items: {
        productID: string;
        productName: string;
        quantity: number;
        price: number;
        variant?: string;
        _id: string;
    }[];
    totalPrice: number;
    shippingAddress: {
        phone: string;
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    couponCode?: string;
    orderTotal: {
        subtotal: number;
        discount: number;
        total: number;
    };
    orderDate: string;
    createdAt: string;
    updatedAt: string;
    trackingUrl?: string;
}
