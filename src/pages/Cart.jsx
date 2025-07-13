import { Link } from "react-router-dom";
import { useCart } from "../context/cartContext";
import { toast } from "react-toastify";

const Cart = () => {
  const { cartItems, dispatch } = useCart();

  const handleRemove = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
    toast.error("Item removed from cart!");
  };

  const handleDecrement = (item) => {
    if (item.quantity === 1) {
      toast.error("Item removed from cart!");
    }
    dispatch({ type: "DECREMENT_QUANTITY", payload: item.id });
  };

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiateRazorpay = async () => {
    if (cartItems.length === 0) {
      toast.info("Your cart is empty. Add items to proceed.");
      return;
    }

    // Load Razorpay script
    const isRazorpayLoaded = await loadRazorpayScript();
    if (!isRazorpayLoaded) {
      toast.error("Failed to load Razorpay. Please try again.");
      return;
    }

    const totalAmount = getTotal();

    try {
      // Step 1: Call your backend to create a Razorpay order
      // Fixed: Changed port from 5173 to 5000
      const response = await fetch('http://localhost:5000/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmount, currency: 'INR' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const orderData = await response.json();
      const { orderId, amount, currency } = orderData;

      const options = {
        // Fixed: Remove process.env from frontend - use your actual Razorpay key_id here
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your actual Razorpay key_id
        amount: amount, // Amount from the backend order
        currency: currency, // Currency from the backend order
        name: "Your E-commerce Store",
        description: "Purchase from Your Store",
        image: "https://your-company-logo.png", // Replace with your actual logo URL
        order_id: orderId, // The order ID obtained from your backend
        handler: async function (response) {
          // This function is called when the payment is successful on Razorpay's end
          // Step 2: Send payment details to your backend for verification
          try {
            // Fixed: Changed port from 5173 to 5000
            const verifyResponse = await fetch('http://localhost:5000/api/verify-razorpay-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.status === "success") {
              console.log("Payment successful and verified:", verifyData);
              toast.success("Payment Successful!");
              dispatch({ type: "CLEAR_CART" }); // Clear cart only after backend verification
            } else {
              console.error("Payment successful but verification failed:", verifyData);
              toast.error("Payment Verification Failed! Please contact support.");
            }
          } catch (error) {
            console.error("Error during payment verification:", error);
            toast.error("An error occurred during payment verification.");
          }
        },
        prefill: {
          name: "John Doe", // Optional: prefill customer name
          email: "john.doe@example.com", // Optional: prefill customer email
          contact: "9999999999", // Optional: prefill customer contact
        },
        notes: {
          address: "Your Store Address, City, State",
        },
        theme: {
          color: "#F37254", // Optional: Change the theme color of Razorpay checkout
        },
      };

      const rzp1 = new window.Razorpay(options);

      rzp1.on("payment.failed", function (response) {
        console.error("Payment failed:", response);
        toast.error("Payment Failed! Please try again.");
      });

      rzp1.open();

    } catch (error) {
      console.error("Error initiating payment:", error.message);
      toast.error(`Failed to initiate payment: ${error.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto min-h-[50vh] max-h-full h-full px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty. <Link to={"/products"} className="text-blue-600">Shop Now</Link></p>
      ) : (
        <>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border border-gray-300 p-4 rounded-md shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p>₹{item.price} x {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecrement(item)}
                      className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => dispatch({ type: "INCREMENT_QUANTITY", payload: item.id })}
                      className="px-2 py-1 bg-gray-200 rounded cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8">
            <p className="text-xl font-semibold">Total: ₹{getTotal()}</p>
            <button
              onClick={initiateRazorpay}
              className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 cursor-pointer"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;