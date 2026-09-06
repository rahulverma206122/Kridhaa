import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  addUserMessage,
  askAIJewelryAssistant,
} from "@/store/shop/ai-slice";

import ProductDetailsDialog from "../shopping-view/product-details"; // 👈 adjust this path to wherever your ProductDetailsDialog.jsx actually lives

import { Bot, Send, X, Sparkles } from "lucide-react";

function AIJewelryAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  // NEW: controls the product details dialog, same pattern as listing.jsx
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  // NEW / BUG FIX (root cause fix):
  // Pehle hum yaha global Redux `productDetails` (state.shopProducts.productDetails) use
  // kar rahe the — usi field ko ShoppingHome.jsx aur ShoppingListing.jsx bhi apne
  // useEffect me watch karte hain:
  //     useEffect(() => {
  //       if (productDetails !== null) setOpenDetailsDialog(true);
  //     }, [productDetails]);
  // Matlab jaise hi AI widget ne dispatch(fetchProductDetails(id)) call karke global
  // productDetails set kiya, ShoppingHome ka apna useEffect BHI trigger ho gaya aur
  // uska APNA alag ProductDetailsDialog bhi khul gaya — iss wajah se ek hi click me
  // DO alag-alag dialogs open ho jaate the (ek AI widget ka, ek ShoppingHome ka), aur
  // X dabane par sirf ek band hota tha, dusra dabane ke liye dobara click karna padta tha.
  //
  // Fix: AI widget ab global Redux productDetails ko chhuta hi nahi hai. Iski jagah
  // apna khud ka LOCAL state (`aiProductDetails`) use karta hai, jo sirf isi component
  // ke andar rehta hai — isse ShoppingHome/ShoppingListing ke useEffect kabhi trigger
  // nahi honge, aur sirf EK hi dialog (AI widget ka) khulega/band hoga.
  const [aiProductDetails, setAiProductDetails] = useState(null);
  const [isProductLoading, setIsProductLoading] = useState(false);

  const dispatch = useDispatch();

  const {
    messages,
    isLoading,
    recommendedProducts,
  } = useSelector((state) => state.ai);

  function handleSendMessage() {
    if (!message.trim()) return;

    dispatch(addUserMessage(message));

    dispatch(
      askAIJewelryAssistant(message)
    );

    setMessage("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  }

  // NEW: fetch product by id independently (NOT via Redux fetchProductDetails),
  // store it in local state, then open our own dialog. Same API endpoint that
  // fetchProductDetails in products-slice.js uses, just called directly here so
  // it never touches the shared global productDetails.
  async function handleGetProductDetails(getCurrentProductId) {
    try {
      setIsProductLoading(true);

      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/products/get/${getCurrentProductId}`
      );

      setAiProductDetails(result?.data?.data);
      setOpenDetailsDialog(true);
    } catch (error) {
      console.error("Error fetching product details for AI assistant:", error);
    } finally {
      setIsProductLoading(false);
    }
  }

  return (
    <>
      {/* FLOATING BUTTON */}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full
        bg-cyan-800 hover:bg-cyan-700
        text-white shadow-2xl
        flex items-center justify-center
        transition-all duration-300 hover:scale-110"
      >
        {isOpen ? (
          <X size={28} />
        ) : (
          <Sparkles size={28} />
        )}
      </button>

      {/* CHAT WINDOW */}

      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50
          w-[380px] h-[550px]
          bg-white rounded-2xl shadow-2xl
          border flex flex-col overflow-hidden"
        >

          {/* HEADER */}

          <div
            className="bg-cyan-800 text-white
            p-4 flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-full
              bg-white/20 flex items-center justify-center"
            >
              <Bot size={22} />
            </div>

            <div>
              <h2 className="font-semibold">
                AI Jewelry Assistant
              </h2>

              <p className="text-xs text-white/70">
                Ask me anything about jewelry
              </p>
            </div>
          </div>

          {/* CHAT MESSAGES */}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-10">

                <Bot
                  size={40}
                  className="mx-auto mb-3 text-cyan-700"
                />

                <p className="font-medium">
                  Hi! I'm your AI Jewelry Assistant ✨
                </p>

                <p className="text-sm mt-2">
                  Try asking:
                </p>

                <div className="mt-4 space-y-2">

                  <p className="text-sm bg-gray-100 p-2 rounded-lg">
                    "Show me a 22K ring"
                  </p>

                  <p className="text-sm bg-gray-100 p-2 rounded-lg">
                    "Jewelry under ₹50,000"
                  </p>

                  <p className="text-sm bg-gray-100 p-2 rounded-lg">
                    "Suggest something for my mother"
                  </p>

                </div>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-cyan-800 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>

              </div>
            ))}

            {/* LOADING */}

            {isLoading && (
              <div className="flex justify-start">

                <div className="bg-gray-100 p-3 rounded-2xl">
                  <span className="animate-pulse">
                    AI is thinking...
                  </span>
                </div>

              </div>
            )}

            {/* RECOMMENDED PRODUCTS */}

            {recommendedProducts.length > 0 && (
              <div className="grid grid-cols-2 gap-3">

                {recommendedProducts.map((product) => (

                  <div
                    key={product._id}
                    onClick={() => handleGetProductDetails(product?._id)} // NEW: opens ProductDetailsDialog, same as ShoppingProductTile
                    className="border rounded-xl overflow-hidden
                    hover:shadow-lg transition cursor-pointer" // NEW: cursor-pointer to hint it's clickable
                  >

                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-28 object-cover"
                    />

                    <div className="p-2">

                      <p className="font-semibold text-xs line-clamp-1">
                        {product.title}
                      </p>

                      <p className="text-xs text-gray-500">
                        {product.carat}
                      </p>

                      <p className="font-bold text-sm text-cyan-800">
                        ₹{product.salePrice > 0
                          ? product.salePrice
                          : product.price}
                      </p>

                    </div>

                  </div>

                ))}

              </div>
            )}

          </div>

          {/* INPUT */}

          <div className="border-t p-3 flex gap-2">

            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask about jewelry..."
              className="flex-1 border rounded-xl px-3 py-2
              outline-none focus:ring-2 focus:ring-cyan-700"
            />

            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="bg-cyan-800 text-white
              p-3 rounded-xl hover:bg-cyan-700"
            >
              <Send size={18} />
            </button>

          </div>

        </div>
      )}

      {/* NEW: same dialog component used in listing.jsx/ShoppingHome, reused here so
          product data/reviews/add-to-cart all work identically. Rendered UNCONDITIONALLY
          so the Dialog's own `open` prop controls visibility (Radix handles show/hide).
          IMPORTANT: productDetails here comes from our OWN local `aiProductDetails` state,
          NOT from global Redux — this is what prevents ShoppingHome/ShoppingListing's
          `useEffect(() => { if (productDetails !== null) setOpenDetailsDialog(true) })`
          from also firing and opening a second, separate dialog underneath this one. */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={aiProductDetails}
      />
    </>
  );
}

export default AIJewelryAssistant;