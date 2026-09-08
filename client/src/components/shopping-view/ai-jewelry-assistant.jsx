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
  // fetchProductDetails in products-slice.js uses, just called directly here so it
  // never touches the shared global productDetails.
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
        className="
          fixed
          bottom-4 right-4
          md:bottom-6 md:right-6
          z-50
          w-14 h-14
          md:w-16 md:h-16
          rounded-full
          bg-cyan-800 hover:bg-cyan-700
          text-white
          shadow-2xl
          flex items-center justify-center
          transition-all duration-300
          hover:scale-110
        "
      >
        {isOpen ? (
          <X
            size={24}
            className="md:w-7 md:h-7"
          />
        ) : (
          <Sparkles
            size={24}
            className="md:w-7 md:h-7"
          />
        )}
      </button>


      {/* CHAT WINDOW */}

      {isOpen && (
        <div
          className="
            fixed
            bottom-[84px]
            right-3
            z-50

            w-[calc(100vw-24px)]
            h-[70vh]
            max-h-[600px]
            min-h-[420px]

            md:bottom-24
            md:right-6
            md:w-[380px]
            md:h-[550px]
            md:max-h-none
            md:min-h-0

            bg-white
            rounded-2xl
            shadow-2xl
            border
            flex flex-col
            overflow-hidden
          "
        >

          {/* HEADER */}

          <div
            className="
              bg-cyan-800
              text-white
              p-3
              md:p-4
              flex items-center
              gap-2
              md:gap-3
              shrink-0
            "
          >
            <div
              className="
                w-9 h-9
                md:w-10 md:h-10
                rounded-full
                bg-white/20
                flex items-center
                justify-center
                shrink-0
              "
            >
              <Bot
                size={20}
                className="md:w-[22px] md:h-[22px]"
              />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold text-base md:text-lg">
                AI Jewelry Assistant
              </h2>

              <p className="text-[11px] md:text-xs text-white/70">
                Ask me anything about jewelry
              </p>
            </div>
          </div>


          {/* CHAT MESSAGES */}

          <div
            className="
              flex-1
              overflow-y-auto
              p-3
              md:p-4
              space-y-3
              md:space-y-4
            "
          >

            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-6 md:mt-10">

                <Bot
                  size={36}
                  className="
                    mx-auto
                    mb-3
                    text-cyan-700
                    md:w-10 md:h-10
                  "
                />

                <p className="font-medium text-sm md:text-base">
                  Hi! I'm your AI Jewelry Assistant ✨
                </p>

                <p className="text-xs md:text-sm mt-2">
                  Try asking:
                </p>

                <div className="mt-3 md:mt-4 space-y-2">

                  <p
                    className="
                      text-xs md:text-sm
                      bg-gray-100
                      p-2
                      md:p-2.5
                      rounded-lg
                    "
                  >
                    "Show me a 22K ring"
                  </p>

                  <p
                    className="
                      text-xs md:text-sm
                      bg-gray-100
                      p-2
                      md:p-2.5
                      rounded-lg
                    "
                  >
                    "Jewelry under ₹50,000"
                  </p>

                  <p
                    className="
                      text-xs md:text-sm
                      bg-gray-100
                      p-2
                      md:p-2.5
                      rounded-lg
                    "
                  >
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
                  className={`
                    max-w-[82%]
                    md:max-w-[75%]
                    p-2.5
                    md:p-3
                    rounded-2xl
                    text-xs
                    md:text-sm
                    ${
                      msg.role === "user"
                        ? "bg-cyan-800 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }
                  `}
                >
                  {msg.text}
                </div>

              </div>
            ))}


            {/* LOADING */}

            {isLoading && (
              <div className="flex justify-start">

                <div
                  className="
                    bg-gray-100
                    p-2.5
                    md:p-3
                    rounded-2xl
                    text-xs
                    md:text-sm
                  "
                >
                  <span className="animate-pulse">
                    AI is thinking...
                  </span>
                </div>

              </div>
            )}


            {/* RECOMMENDED PRODUCTS */}

            {recommendedProducts.length > 0 && (
              <div
                className="
                  grid
                  grid-cols-2
                  gap-2
                  md:gap-3
                "
              >

                {recommendedProducts.map((product) => (

                  <div
                    key={product._id}
                    onClick={() =>
                      handleGetProductDetails(product?._id)
                    } // NEW: opens ProductDetailsDialog, same as ShoppingProductTile
                    className="
                      border
                      rounded-lg
                      md:rounded-xl
                      overflow-hidden
                      hover:shadow-lg
                      transition
                      cursor-pointer
                      bg-white
                    " // NEW: cursor-pointer to hint it's clickable
                  >

                    <img
                      src={product.image}
                      alt={product.title}
                      className="
                        w-full
                        h-24
                        md:h-28
                        object-cover
                      "
                    />

                    <div className="p-1.5 md:p-2">

                      <p
                        className="
                          font-semibold
                          text-[11px]
                          md:text-xs
                          line-clamp-1
                        "
                      >
                        {product.title}
                      </p>

                      <p className="text-[10px] md:text-xs text-gray-500">
                        {product.carat}
                      </p>

                      <p
                        className="
                          font-bold
                          text-xs
                          md:text-sm
                          text-cyan-800
                        "
                      >
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

          <div
            className="
              border-t
              p-2.5
              md:p-3
              flex
              gap-2
              shrink-0
              bg-white
            "
          >

            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask about jewelry..."
              className="
                flex-1
                min-w-0
                border
                rounded-xl
                px-3
                py-2
                md:py-2.5
                text-sm
                md:text-base
                outline-none
                focus:ring-2
                focus:ring-cyan-700
              "
            />

            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="
                bg-cyan-800
                text-white
                p-2.5
                md:p-3
                rounded-xl
                hover:bg-cyan-700
                shrink-0
                disabled:opacity-50
              "
            >
              <Send
                size={17}
                className="md:w-[18px] md:h-[18px]"
              />
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