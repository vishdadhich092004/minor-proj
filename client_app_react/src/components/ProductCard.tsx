import type { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({
        id: product._id,
        name: product.name,
        price: product.offerPrice > 0 ? product.offerPrice : product.price,
        image: product.images && product.images.length > 0 ? product.images[0].url : '',
        quantity: 1
    });
  };

  const displayPrice = product.offerPrice > 0 ? product.offerPrice : product.price;
  const originalPrice = product.price;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="aspect-[3/4] relative bg-gray-100">
         <Link to={`/product/${product._id}`}>
             {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0].url} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
             ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
             )}
         </Link>
         
         <button 
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 bg-primary text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0"
         >
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
         </button>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-gray-800 line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
            <span className="font-bold text-primary">₹{displayPrice}</span>
            {product.offerPrice > 0 && (
                <span className="text-xs text-gray-400 line-through">₹{originalPrice}</span>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
