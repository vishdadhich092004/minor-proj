import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/useOrderStore';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { ArrowLeft, Package, Calendar, Loader2, Printer, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MyOrders = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { orders, fetchMyOrders, isLoading } = useOrderStore();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchMyOrders(user._id);
    }, [user, navigate, fetchMyOrders]);

    const downloadInvoice = (e: React.MouseEvent, order: any) => {
        e.stopPropagation();
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(20);
        doc.text('INVOICE', 14, 22);
        
        doc.setFontSize(10);
        doc.text(`Order ID: ${order._id.toUpperCase()}`, 14, 30);
        doc.text(`Date: ${new Date(order.orderDate || order.createdAt).toLocaleDateString()}`, 14, 35);
        doc.text(`Status: ${order.orderStatus}`, 14, 40);

        // Customer Info
        doc.text('Bill To:', 14, 50);
        doc.text(user?.name || 'Customer', 14, 55);
        doc.text(order.shippingAddress.street, 14, 60);
        doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}`, 14, 65);
        doc.text(`Phone: ${order.shippingAddress.phone}`, 14, 70);

        // Items Table
        const tableBody = order.items.map((item: any) => [
            item.productName,
            item.quantity,
            `Rs. ${item.price}`,
            `Rs. ${item.price * item.quantity}`
        ]);

        autoTable(doc, {
            startY: 80,
            head: [['Item', 'Qty', 'Price', 'Total']],
            body: tableBody,
        });

        // Total
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.text(`Subtotal: Rs. ${order.orderTotal.subtotal}`, 140, finalY);
        doc.text(`Discount: -Rs. ${order.orderTotal.discount}`, 140, finalY + 5);
        doc.setFontSize(14);
        doc.text(`Total: Rs. ${order.orderTotal.total}`, 140, finalY + 12);

        doc.save(`Invoice_${order._id}.pdf`);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                 <button 
                    onClick={() => navigate('/profile')} 
                    className="flex items-center text-gray-600 hover:text-primary mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-1" /> Back to Profile
                </button>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No orders yet</h3>
                        <p className="text-gray-500 mb-6">Start shopping to make your first order!</p>
                        <button onClick={() => navigate('/')} className="px-6 py-2 bg-primary text-white rounded-lg">Browse Products</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div 
                                key={order._id} 
                                onClick={() => navigate(`/order/${order._id}`)}
                                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:border-primary/50 transition-colors cursor-pointer group"
                            >
                                <div className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-900">#{order._id.slice(-6).toUpperCase()}</span></p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">{new Date(order.orderDate || order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                ${order.orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                                                ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                                                ${order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                            `}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-b border-gray-100 py-4 my-4">
                                        {order.items.slice(0, 3).map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center py-2">
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.productName}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity} {item.variant ? `• ${item.variant}` : ''}</p>
                                                </div>
                                                <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <p className="text-sm text-gray-500 mt-2 text-center">+ {order.items.length - 3} more items</p>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <p className="text-gray-500">Total Amount</p>
                                        <p className="text-xl font-bold text-primary">₹{order.orderTotal.total}</p>
                                    </div>
                                    
                                     {/* Action Bar */}
                                    <div className="mt-4 pt-4 border-t flex flex-wrap justify-end gap-3">
                                        <button
                                            onClick={(e) => downloadInvoice(e, order)}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                        >
                                            <Printer className="h-4 w-4" />
                                            Invoice
                                        </button>
                                        
                                        {order.trackingUrl && (
                                            <a 
                                                href={order.trackingUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="px-4 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                                            >
                                                Track Shipment
                                            </a>
                                        )}

                                        <div className="flex items-center gap-1 text-primary font-medium text-sm pl-2">
                                            Details <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyOrders;
