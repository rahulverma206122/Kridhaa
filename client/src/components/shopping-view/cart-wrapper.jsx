import { useNavigate } from "react-router-dom";  // see pdf
import { Button } from "../ui/button";  // shadcn/ui provides unstyled, accessible components that you can customize. We have created a Button component using shadcn/ui's Button and added our own styling to it. You can check the code in client/src/components/ui/button.jsx to see how we have created our own Button component using shadcn/ui and how you can use it in your components.
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

// ye cart ko kholne pr(right side se jo ata h) jo content aata h use dikhega
function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0   // If cartItems exists and has at least one item, run the reduce
      ? cartItems.reduce(  // reduce funtion me do verible liye sum and cuurentitem  reduce kya karta hai? 👉 Array ko ek single value me convert karta hai
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0  // 0 called the initial value of the accumulator (sum). witthout 0 reduce will take the first item in the array as the initial sum.Then it starts the loop from the second element.Problem: if the array is empty, it will throw an error     If we also tried to set something for currentItemThat’s not possible, because currentItem must come from the array.
        )
      : 0;

  return (
    <SheetContent
      className="sm:max-w-md h-screen flex flex-col pb-6"
    >
      <SheetHeader className="flex-shrink-0">
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>

      {/* 🔥 Cart items area is now scrollable */}
      <div
        className="mt-8 space-y-4 flex-1 min-h-0 overflow-y-auto pr-2 pb-2"
      >
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => (
              <UserCartItemsContent
                key={item?.productId}
                cartItem={item}
              />
            ))  // “Agar cart me items hain → unhe UI me dikhao”  👉 Loop chala rahe ho, Har item ke liye ek component render karta hai
          : null}  {/*React me {} ke andar JavaScript likhte hain*/}
      </div>

      {/* 🔥 Total and Checkout stay fixed at the bottom */}
      <div className="flex-shrink-0 bg-background pt-3 pb-6 border-t space-y-3">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>

          <span className="font-bold">
            ₹{totalCartAmount}
          </span>  {/*totalCartAmount variable h function nhi*/}
        </div>

        <Button
          onClick={() => {
            navigate("/shop/checkout"); // Yaha hum navigate("/shop/checkout") use kar rahe hain, iska matlab hai ki jab user Checkout button par click karega to usse "/shop/checkout" route par le jaya jayega.
            setOpenCartSheet(false);
          }}
          className="w-full"
        >
          Checkout
        </Button>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;