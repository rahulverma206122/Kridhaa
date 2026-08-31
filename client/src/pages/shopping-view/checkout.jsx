import Address from "@/components/shopping-view/address";
import img from "../../assets/aaa.mp4";

import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);  // approvalURL shoporder slice me h 
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);  // how to know when do null false and 0 in usestate see in notes
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
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

  function handleInitiatePaypalPayment() {
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
 // ye sari cheze order model se aari h 
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
        state:currentSelectedAddress?.state,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),// can we do date.now()  see in notes    creates a Date object (full date + time). 2026-04-25T14:30:45.123Z   If you want to store just the date without time, you can set the time to 00:00:00 using setHours(0, 0, 0, 0) method on the Date object. This way, you will have a Date object that represents only the date part without any time information.
//       👉 Used when:

// You want to store date properly in DB (like MongoDB)
// You may need formatting, timezone handling, etc.
      
      // Date.now() returns a timestamp (number) in milliseconds. 1714042245123

//       👉 Used when:

// You only need time difference / calculations
// Not worried about date formatting

      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {  // createneworder shop ke orderslice se dispatch kiya h
      // console.log(data, "Rahul");  // yha se humm backend ko req bhej rhe h jo orderdata bnaya h uska pura data dekr ye req createneworeder bhej rha h
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
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

// 🔥 Flow (step-by-step)
// dispatch(createNewOrder(orderData))
//         ↓
// Redux thunk runs
//         ↓
// API call to backend
//         ↓
// Response comes back
//         ↓
// .then((data) => { ... }) executes


  if (approvalURL) { // if approvalurl present   // approvalURL shoporder slice me h
    window.location.href = approvalURL; // window.location.href represents the current page’s full URL.“If approvalURL exists, redirect the user’s browser to that URL.”
  }

  // window.location.href = browser ke andar current page ka URL hota hai, jab hum ise kisi naye URL se set karte hain, to browser us naye URL par navigate kar jata hai. Yaha pe hum check kar rahe hain ki agar approvalURL available hai,
  // to user ko us URL par redirect kar denge, jahan wo PayPal payment process complete kar sakta hai.
  // Ye redirection tabhi hoga jab backend se hume PayPal ka approvalURL mil jayega, jo ki payment initiation ke response me aata hai.

  return (
    <div className="flex flex-col">
      {/* Video Banner */}
        <div className="relative w-full overflow-hidden">
          <video
            src={img}
            className="w-[1535px] h-[550px] object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"  // preload attribute ka use karke hum browser ko bata sakte hain ki video ko kaise load karna chahiye. "auto" value ka matlab hai ki browser video ko load karna shuru kar dega jaise hi page load hota hai, lekin wo video ko play nahi karega jab tak user usse play na kare. Isse ensure hota hai ki video content jaldi se available ho jaye jab user play button dabaye, bina kisi delay ke. Ye especially useful hota hai jab aap chahte hain ki video content smoothly play ho without buffering issues, aur user experience ko enhance karta hai.
          />

          {/* Gradient overlay (fade bottom into white) */}
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-4">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0  //First check if cartItems is not null or undefined.Next, check if items property actually exists inside cartItems.Finally, check if the items array has at least one element.
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiatePaypalPayment} className="w-full">
              {isPaymentStart
                ? "Processing Paypal Payment..."
                : "Checkout with Paypal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
