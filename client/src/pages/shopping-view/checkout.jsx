import Address from "@/components/shopping-view/address";
import img from "../../assets/aaa.mp4";

import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder, capturePayment } from "@/store/shop/order-slice"; // NEW: capturePayment ab yahi se call hoga (handler callback ke andar), pehle ye PaypalReturnPage.jsx se call hota tha
import { fetchCartItems } from "@/store/shop/cart-slice"; // NEW BUG FIX: payment success ke baad cart Redux state ko refresh karne ke liye
import { useNavigate } from "react-router-dom"; // NEW: Navigate ki jagah useNavigate — payment success hone par hum programmatically navigate karenge (koi redirect page ki zaroorat nahi)
import { useToast } from "@/components/ui/use-toast";

// NEW (Razorpay migration): Razorpay ka checkout widget ek <script> tag se
// aata hai (https://checkout.razorpay.com/v1/checkout.js). Ye function us
// script ko dynamically page me load karta hai (agar pehle se load nahi hai),
// taaki humein index.html me manually <script> tag add na karna pade.
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-checkout-script")) {
      resolve(true); // already loaded hai, dobara load karne ki zaroorat nahi
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);

  // NEW (Razorpay migration): approvalURL ki jagah ab ye cheezein chahiye
  // checkout modal kholne ke liye — sab shopOrder slice se hi aa rahe hain
  const { razorpayOrderId, amount, currency, keyId } = useSelector(
    (state) => state.shopOrder
  );

  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);  // how to know when do null false and 0 in usestate see in notes
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // NEW
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  // NEW (Razorpay migration): renamed from handleInitiatePaypalPayment.
  // Ab async hai kyunki humein Razorpay ka script load hone ka wait karna
  // padta hai modal kholne se pehle.
  async function handleInitiateRazorpayPayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });

      return;
    }

    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });

      return;
    }

    // ye sari chezein order model se aari h
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        state: currentSelectedAddress?.state,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "razorpay", // NEW: paypal → razorpay
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(), // can we do date.now()  see in notes    creates a Date object (full date + time). 2026-04-25T14:30:45.123Z   If you want to store just the date without time, you can set the time to 00:00:00 using setHours(0, 0, 0, 0) method on the Date object. This way, the order will store only the date without any time information.
      //       👉 Used when:

      // You want to store date properly in DB (like MongoDB)
      // You may need formatting, timezone handling, etc.

      // Date.now() returns a timestamp (number) in milliseconds. 1714042245123

      //       👉 Used when:

      // You only need time difference / calculations
      // Not worried about date formatting

      orderUpdateDate: new Date(),
      // NEW: paymentId/payerId hata diye — Razorpay flow me ye baad me
      // (payment complete hone ke baad) milte hain, create step par nahi
    };

    dispatch(createNewOrder(orderData)).then(async (data) => {
      // console.log(data, "Rahul");  // yha se humm backend ko req bhej rhe h jo orderdata bnaya h uska pura data dekr ye req createneworeder bhej rha h

      if (data?.payload?.success) {
        setIsPaymemntStart(true);

        // NEW (Razorpay migration): ab yaha se hum seedha checkout MODAL
        // kholte hain (PayPal ki tarah kisi doosre page par redirect nahi
        // karte).
        const scriptLoaded = await loadRazorpayScript();

        if (!scriptLoaded) {
          toast({
            title:
              "Razorpay SDK failed to load. Check your internet connection.",
            variant: "destructive",
          });
          setIsPaymemntStart(false);
          return;
        }

        const {
          razorpayOrderId: newRazorpayOrderId,
          amount: newAmount,
          currency: newCurrency,
          keyId: newKeyId,
          orderId, // hamara apna Mongo order id
        } = data.payload;

        const options = {
          key: newKeyId,
          amount: newAmount,
          currency: newCurrency,
          name: "Kridha Jewellers", // apna brand name — checkout modal me dikhega
          description: "Order Payment",
          order_id: newRazorpayOrderId,

          // NEW: ye woh "handler" callback hai jiski baat controller ke
          // comments me ki thi — payment success hone par Razorpay ISI
          // function ko call karta hai (koi redirect/return_url nahi
          // chahiye, jaise PayPal me tha).
          handler: function (response) {
            dispatch(
              capturePayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId,
              })
            ).then((captureData) => {
              if (captureData?.payload?.success) {
                sessionStorage.removeItem("currentOrderId");

                // NEW BUG FIX: backend ne cart delete kar diya hai
                // (Cart.findByIdAndDelete in capturePayment controller),
                // lekin Redux ka cartItems state abhi bhi purana (stale)
                // data dikha raha tha kyunki humne use kabhi refresh hi
                // nahi kiya. Isliye payment success hote hi cart ko
                // dobara fetch karna zaroori hai — isse cart icon count
                // aur cart page dono turant khali dikhenge.
                dispatch(fetchCartItems(user?.id));

                navigate("/shop/payment-success"); // same success page jo pehle tha
              } else {
                toast({
                  title:
                    "Payment verification failed. Please contact support.",
                  variant: "destructive",
                });
                setIsPaymemntStart(false);
              }
            });
          },

          prefill: {
            name: user?.userName,
            contact: currentSelectedAddress?.phone,
          },

          notes: {
            addressId: currentSelectedAddress?._id,
          },

          theme: {
            color: "#155e75", // site ke cyan-800 accent color se match karta hai
          },

          modal: {
            // NEW: agar user bina payment kiye modal band kar de, to button
            // ko "Processing..." state me atka na chhodo — wapas normal karo
            ondismiss: function () {
              setIsPaymemntStart(false);
            },
          },
        };

        const razorpayObject = new window.Razorpay(options);
        razorpayObject.open();
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

// 🔹 Why .then((data) => {...}) is used?

// 👉 Because
// dispatch(createNewOrder(orderData)) returns a Promise

// So you’re doing:

// dispatch(...)  → async call → backend request → response

// .then() is used to handle the response after API call finishes

// 🔥 Flow (step-by-step, Razorpay version)
// dispatch(createNewOrder(orderData))
//         ↓
// Redux thunk runs
//         ↓
// API call to backend → Razorpay order banta hai
//         ↓
// Response comes back (razorpayOrderId, amount, currency, keyId)
//         ↓
// Razorpay checkout MODAL khulta hai (yahi page par, koi redirect nahi)
//         ↓
// User modal ke andar payment karta hai
//         ↓
// Razorpay "handler" callback fire karta hai → capturePayment dispatch hota hai
//         ↓
// Verify + confirm ho jane par → payment-success page par navigate

  // NEW: PayPal wala ye block hata diya —
  //   if (approvalURL) { window.location.href = approvalURL; }
  // Razorpay me koi approvalURL nahi hota, redirect ki zaroorat hi nahi —
  // sab kuch handleInitiateRazorpayPayment ke andar hi ho jata hai.

  return (
    <div className="flex flex-col bg-white min-h-screen">

      {/* Video Banner */}
      <div className="relative w-full overflow-hidden">
        <video
          src={img}
          className="w-full h-[220px] sm:h-[300px] md:w-[1535px] md:h-[550px] object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"  // preload attribute ka use karke hum browser ko bata sakte hain ki video ko kaise load karna chahiye. "auto" value ka matlab hai ki browser video ko load karna shuru kar dega jaise hi page load hota hai, lekin wo video ko play nahi karega jab tak user usse play na kare. Isse ensure hota hai ki video content jaldi se available ho jaye jab user play button dabaye, bina kisi delay ke. Ye especially useful hota hai jab aap chahte hain ki video content smoothly play ho without buffering issues, aur user experience ko enhance karta hai.
        />

        {/* Gradient overlay (fade bottom into white) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
      </div>

      {/* Checkout Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-3 sm:p-4 md:p-4">

        {/* Address Section */}
        <div className="w-full min-w-0">
          <Address
            selectedId={currentSelectedAddress}
            setCurrentSelectedAddress={setCurrentSelectedAddress}
          />
        </div>

        {/* Cart + Payment Section */}
        <div className="flex flex-col gap-4 w-full min-w-0">

          {/* Cart Items */}
          <div className="rounded-xl border bg-white p-3 sm:p-4 space-y-4 shadow-sm">

            {cartItems &&
            cartItems.items &&
            cartItems.items.length > 0  //First check if cartItems is not null or undefined.Next, check if items property actually exists inside cartItems.Finally, check if the items array has at least one element.
              ? cartItems.items.map((item) => (
                  <UserCartItemsContent
                    key={item?.productId}
                    cartItem={item}
                  />
                ))
              : null}
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border bg-white p-4 shadow-sm">

            <div className="flex justify-between items-center gap-4">
              <span className="font-bold text-base sm:text-lg">
                Total
              </span>

              <span className="font-bold text-base sm:text-lg whitespace-nowrap">
                ₹{totalCartAmount}
              </span>
            </div>

          </div>

          {/* Razorpay Checkout Button */}
          <div className="w-full">
            <Button
              onClick={handleInitiateRazorpayPayment}
              disabled={isPaymentStart}
              className="w-full h-11 sm:h-10 text-sm sm:text-base"
            >
              {isPaymentStart
                ? "Processing Payment..."
                : "Checkout with Razorpay"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;