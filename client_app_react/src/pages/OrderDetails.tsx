import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/useOrderStore';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { ArrowLeft, Printer, Loader2, Package } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const OrderDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { orders, fetchOrderById } = useOrderStore(); 
    const [order, setOrder] = useState(orders.find(o => o._id === id));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        const loadOrder = async () => {
             if (id) {
                 const found = orders.find(o => o._id === id);
                 if (found) {
                     setOrder(found);
                 } else {
                     setLoading(true);
                     const fetchedOrder = await fetchOrderById(id);
                     if (fetchedOrder) {
                         setOrder(fetchedOrder);
                     }
                     setLoading(false);
                 }
             }
        };
        loadOrder();
    }, [id, orders, fetchOrderById]);

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                     {loading ? (
                         <Loader2 className="h-8 w-8 animate-spin text-primary" />
                     ) : (
                        <>
                            <p>Order not found.</p>
                            <button onClick={() => navigate('/orders')} className="mt-4 text-primary">Go to My Orders</button>
                        </>
                     )}
                </div>
            </div>
        );
    }

    const downloadInvoice = () => {
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
        const tableBody = order.items.map(item => [
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
                    onClick={() => navigate('/orders')} 
                    className="flex items-center text-gray-600 hover:text-primary mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-1" /> Back to Orders
                </button>
                
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                    <button 
                        onClick={downloadInvoice}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <Printer className="h-4 w-4" /> Download Invoice
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row justify-between mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Order placed on</p>
                                <p className="font-medium text-gray-900">{new Date(order.orderDate || order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <p className="text-sm text-gray-500">Order ID</p>
                                <p className="font-medium text-gray-900">#{order._id.slice(-6).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Package className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.productName}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity} {item.variant} </p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-gray-900">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{order.orderTotal.subtotal}</span>
                            </div>
                             <div className="flex justify-between text-gray-600">
                                <span>Discount</span>
                                <span className="text-green-600">-₹{order.orderTotal.discount}</span>
                            </div>
                             <div className="flex justify-between text-gray-600">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-gray-900 font-bold text-base pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>₹{order.orderTotal.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OrderDetails;
