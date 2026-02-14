import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { type Order } from '../../types/order';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import { ArrowLeft, Package, User, MapPin } from 'lucide-react';

const OrderDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { orders, updateOrderStatus, loading: hooksLoading } = useOrders();
    const [order, setOrder] = useState<Order | null>(null);
    const [status, setStatus] = useState('');
    const [trackingUrl, setTrackingUrl] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (orders.length > 0) {
            const foundOrder = orders.find(o => o._id === id || o.sId === id);
            if (foundOrder) {
                setOrder(foundOrder);
                setStatus(foundOrder.orderStatus);
                // setTrackingUrl(foundOrder.trackingUrl || ''); // Uncomment if trackingUrl exists in type
            }
        }
    }, [orders, id]);

    const handleUpdate = async () => {
        if (!order) return;
        setUpdating(true);
        const result = await updateOrderStatus(order._id || order.sId!, status, trackingUrl);
        setUpdating(false);
        if (result.success) {
            alert('Order updated successfully');
        } else {
            alert(result.message);
        }
    };

    if (hooksLoading && !order) return <div className="p-10">Loading order details...</div>;
    if (!order) return <div className="p-10 text-center">Order not found</div>;

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <button onClick={() => navigate('/orders')} className="mb-4 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Orders
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content - Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                            <Package className="mr-2 h-5 w-5" /> Order Items
                        </h2>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                             {/* Note: Order Items structure might vary based on type definition. 
                                 Assuming array of items inside order, but need to check 'items' field in type.
                                 Flutter code shows 'items' list.
                             */}
                             {/* Mocking items display if strict type structure isn't fully clear or consistent yet */}
                             {/* In real implementaton, map over order.items */}
                            <div className="py-4">
                                <p className="text-sm text-gray-500">Items data structure pending verification. Displaying total items count if available.</p>
                                {/* <p>Total Items: {order.items?.length || 0}</p> */}
                            </div>
                        </div>
                         <div className="pt-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 mt-4">
                            <span className="font-medium text-gray-900 dark:text-white">Total Amount</span>
                            <span className="text-xl font-bold text-primary">₹{order.orderTotal?.total?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Status & Info */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Order Status</h2>
                        <div className="space-y-4">
                            <Select 
                                label="Update Status"
                                options={[
                                    { label: 'Pending', value: 'pending' },
                                    { label: 'Processing', value: 'processing' },
                                    { label: 'Shipped', value: 'shipped' },
                                    { label: 'Delivered', value: 'delivered' },
                                    { label: 'Cancelled', value: 'cancelled' },
                                ]}
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                            />
                            {status === 'shipped' && (
                                <Input 
                                    label="Tracking URL" 
                                    value={trackingUrl} 
                                    onChange={e => setTrackingUrl(e.target.value)} 
                                    placeholder="http://tracking.url..."
                                />
                            )}
                            <Button onClick={handleUpdate} isLoading={updating} className="w-full">
                                Update Order
                            </Button>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                             <User className="mr-2 h-5 w-5" /> Customer
                        </h2>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{order.userID?.name}</p>
                        <p className="text-sm text-gray-500 break-words">{order.userID?.email}</p>
                         {/* <p className="text-sm text-gray-500">{order.userID?.phone}</p> */}
                    </div>

                     {/* Shipping Info */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                             <MapPin className="mr-2 h-5 w-5" /> Shipping Address
                        </h2>
                        {/* Adapt fields based on actual Order type */}
                         <p className="text-sm text-gray-500">{order.addressID ?? 'No address provided'}</p> 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
