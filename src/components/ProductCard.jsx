import { Link } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { toast } from "react-toastify";

const ProductCard = ({ product, viewMode }) => { // Accept viewMode prop

  const { dispatch, cartItems } = useCart();

  const isInCart = cartItems.some(item => item.id === product.id);

  const handleAddToCart = () => {
    if (isInCart) return;
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success(`${product.name} added to cart!`);
  }

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 
        ${viewMode === 'grid' 
          ? 'flex flex-col' // Grid: column layout for individual card
          : 'flex flex-row items-center space-x-4 w-full' // List: row layout, align items, add space-x
        }
      `}
    >
      <Link 
        to={`/product/${product.id}`} 
        className={`${
          viewMode === 'grid' 
            ? 'w-full h-48 mb-4' // Grid: set specific image height and margin-bottom
            : 'w-32 h-32 flex-shrink-0' // List: smaller fixed size, prevent shrinking
        }`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded" // Apply to both, object-cover is key
        />
      </Link>
      <div 
        className={`flex-grow ${
          viewMode === 'list' ? 'flex flex-col justify-center' : '' // List: allow content to grow, center vertically
        }`}
      >
        <Link to={`/product/${product.id}`}> 
          <h3 className="text-lg font-semibold">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-between py-1">
          <p className="text-sm text-gray-500">{product.category}</p>
          <p className="text-orange-600 font-bold text-lg">₹{product.price}</p>
        </div>
      </div>
      {
        isInCart ? (
          <Link
            to="/cart"
            className={`
              block bg-green-600 text-white text-center py-2 rounded hover:bg-green-700 transition
              ${viewMode === 'grid' ? 'mt-auto' : 'ml-auto px-4'} // Grid: push to bottom; List: margin-left auto, add horizontal padding
            `}
          >
            Go to Cart
          </Link>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`
              bg-orange-500 text-white py-2 rounded cursor-pointer hover:bg-orange-600 transition duration-200
              ${viewMode === 'grid' ? 'mt-auto px-4' : 'ml-auto px-4'} // Grid: push to bottom, add padding; List: margin-left auto, add padding
            `}
          >
            Add to Cart
          </button>
        )
      }
    </div>
  );
};

export default ProductCard;