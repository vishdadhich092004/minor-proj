export interface Order {
    _id: string;
    sId?: string; // Flutter often uses sId
    userID: {
        name: string;
        email: string;
        phone?: string;
    };
    orderStatus: string; // pending, processing, shipped, delivered, cancelled
    orderTotal: {
        subtotal: number;
        discount: number;
        total: number;
    };
    shippingcharge?: number;
    couponCode?: string;
    couponDiscount?: number;
    paymentMethod: string;
    trackingUrl?: string;
    addressID?: string; // Or Address object if populated
    createdAt: string;
    updatedAt: string;
}
