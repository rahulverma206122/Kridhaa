// import { Minus, Plus, Trash } from "lucide-react";
// import { Button } from "../ui/button";
// import { useDispatch, useSelector } from "react-redux";
// import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
// import { useToast } from "../ui/use-toast";

// // ye cart ke andar ek ek element ko with image tittle price ke sath dikha rha h sath hi use delete and item quntity update krna kitna stock h sab kr rha h
// function UserCartItemsContent({ cartItem }) {  //yha cartitem ki jgh hum kuch bhi likh skte the 
// //  yha cartItem ek prop hai jisme cart ke andar ka item aayega jise hum is component me use karenge. jab bhi hum UserCartItemsContent component ko call karenge to hume cartItem prop dena hoga jisme wo item hoga jise hum display karna chahte hain.  
//   const { user } = useSelector((state) => state.auth); //  “Redux store ke auth slice se user object le rahe ho”    useslector -> hook h store se data lata h 


// //   (state) => state.auth

// // 👉 Ye pura Redux state hota hai:
// // state = {
// //   auth: {
// //     user: { name: "Rahul", email: "..." },
// //     isAuthenticated: true
// //   }
// // }
  
//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { productList } = useSelector((state) => state.shopProducts);
//   const dispatch = useDispatch();
//   const { toast } = useToast();  // useToast ek custom hook hai jo humne create kiya hai apne ui library me. Ye hume toast function provide karta hai jisse hum user ko notifications dikha sakte hain. Jaise ki jab cart item update ho jaye ya delete ho jaye to hum user ko ek toast notification dikha sakte hain taki user ko pata chale ki action successful tha ya nahi.

//   function handleUpdateQuantity(getCartItem, typeOfAction) {  // cartitem isliye le rhe h jisse pata chle ki cart me item ki quantity kya h
//     if (typeOfAction == "plus") {  //  getCartItem ye hmne apne man se liya h kuch bhi likh skte the, lekin isse hume pata chalega ki hm kis item ki quantity update kr rhe h aur typeOfAction se hume pata chalega ki hm quantity increase kr rhe h ya decrease kr rhe h name kuch bhi ho skta tha lekin meaningful hona chahiye taki code padhne me asani ho
//       let getCartItems = cartItems.items || []; // mtlb cartitems ke andar items array hoga jisme sare cart items honge, lekin agar wo array empty h ya undefined h to hum usse empty array set kr denge taki code me error na aaye

//       if (getCartItems.length) {  // mtlb card empty nhi h to hi hm stock check krenge, agar cart empty h to stock check krne ki need nhi h
//         const indexOfCurrentCartItem = getCartItems.findIndex(  // Cart me search kar raha hai: “Kya ye same product already cart me hai?”
//           (item) => item.productId === getCartItem?.productId
//         );
//         //Product list me product dhundna jiska id cart item ke productId ke barabar ho taki hume pata chale ki is product ki total stock kitni hai
//         const getCurrentProductIndex = productList.findIndex(   
//           (product) => product._id === getCartItem?.productId
//         );
//         const getTotalStock = productList[getCurrentProductIndex].totalStock;

//         if (indexOfCurrentCartItem > -1) {
//           const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
//           if (getQuantity + 1 > getTotalStock) {
//             toast({
//               title: `Only ${getQuantity} quantity can be added for this item`,
//               variant: "destructive",
//             });

//             return;
//           }
//         }
//       }
//     }

//     dispatch(
//       updateCartQuantity({
//         userId: user?.id,
//         productId: getCartItem?.productId,
//         quantity:
//           typeOfAction === "plus"
//             ? getCartItem?.quantity + 1
//             : getCartItem?.quantity - 1,
//       })
//     ).then((data) => {    //   this called optional chaining    we use .then here because updateCartQuantity is an async thunk action, and when we dispatch it, it returns a promise. By using .then, we can wait for the promise to resolve and get the response data from the backend after the cart quantity has been updated. This allows us to show a toast notification to the user based on whether the update was successful or not.
//       if (data?.payload?.success) {
//         toast({
//           title: "Cart item is updated successfully",
//         });
//       }
//     });
//   }

//   function handleCartItemDelete(getCartItem) { // getcartitemm is a veriable 
//     dispatch(deleteCartItem({  // deleteCartItem cartslice me h
//        userId: user?.id, productId: getCartItem?.productId })  // is slice me hmme userid and productid deni h bcz use hui h slice me 
//     ).then((data) => {
//       if (data?.payload?.success) {
//         toast({
//           title: "Cart item is deleted successfully",
//         });
//       }
//     });
//   }

//   return (
//     <div className="flex items-center space-x-4">
//       <img
//         src={cartItem?.image}
//         alt={cartItem?.title}  // alt attribute is used to provide alternative text for an image if the image cannot be displayed. It is also important for accessibility, as screen readers will read the alt text to visually impaired users. In this case, we are using the cartItem's title as the alt text, which gives a description of the product in the cart.
//         className="w-20 h-20 rounded object-cover"
//       />
//       <div className="flex-1">
//         <h3 className="font-extrabold">{cartItem?.title}</h3>
//         <div className="flex items-center gap-2 mt-1">
//           <Button
//             variant="outline"   // variant="outline" se button ka style change ho jata hai, ye humne apne ui library me define kiya h. jab hum variant="outline" use karte hain to button ka background transparent ho jata hai aur border show hota hai. isse button ek outline ke jaisa dikhai deta hai. humne apne ui library me ye style define kiya h taki hum easily outline button use kar sakein apne components me.
//             className="h-8 w-8 rounded-full"
//             size="icon"  // size="icon" se button ka size change ho jata hai, ye bhi humne apne ui library me define kiya h. jab hum size="icon" use karte hain to button ka size chhota ho jata hai, jo icons ke liye perfect hota hai. isse button ek circular icon ke jaisa dikhai deta hai. humne apne ui library me ye style define kiya h taki hum easily icon buttons use kar sakein apne components me.
//             disabled={cartItem?.quantity === 1} // disable krdo jab keval 1 quantity bchi ho
//             onClick={() => handleUpdateQuantity(cartItem, "minus")}
//           >
//             <Minus className="w-4 h-4" />
//             <span className="sr-only">Decrease</span>  
               
//             {/* // sr-only class ka use accessibility ke liye hota hai. Ye class screen readers ke liye content ko accessible banata hai, lekin visually usse hide kar deta hai. Is case me, "Decrease" text screen readers ke liye available hoga, taki visually impaired users ko pata chale ki ye button quantity decrease karne ke liye hai, lekin ye text visually dikhai nahi dega. */}
         
//           </Button>
//           <span className="font-semibold">{cartItem?.quantity}</span>
//           <Button
//             variant="outline"
//             className="h-8 w-8 rounded-full"
//             size="icon"
//             onClick={() => handleUpdateQuantity(cartItem, "plus")}
//           >
//             <Plus className="w-4 h-4" />
//             <span className="sr-only">Decrease</span>
//           </Button>
//         </div>
//       </div>
//       <div className="flex flex-col items-end">
//         <p className="font-semibold">
//           ₹
//           {(
//             (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
//             cartItem?.quantity
//           ).toFixed(2)} {/* ye last me hmne do no se phle decimal de dega like 99.5 ko 99.50 kr dega */}
//         </p>
//         <Trash
//           onClick={() => handleCartItemDelete(cartItem)}
//           className="cursor-pointer mt-1"
//           size={20}  // mtlb 20px ka icon hoga, lucide-react se aap icons ke size ko easily adjust kar sakte hain by passing the size prop. isse icon ka width aur height dono 20px ho jayega. ye size prop lucide-react ke icons ke liye specific hai, aur ye aapko icons ke size ko customize karne ki flexibility deta hai apne design ke hisab se.
//         />
//       </div>
//     </div>
//   );
// }

// export default UserCartItemsContent;



import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

// ye cart ke andar ek ek element ko with image tittle price ke sath dikha rha h sath hi use delete and item quntity update krna kitna stock h sab kr rha h
function UserCartItemsContent({ cartItem }) {  //yha cartitem ki jgh hum kuch bhi likh skte the 
//  yha cartItem ek prop hai jisme cart ke andar ka item aayega jise hum is component me use karenge. jab bhi hum UserCartItemsContent component ko call karenge to hume cartItem prop dena hoga jisme wo item hoga jise hum display karna chahte hain.  
  const { user } = useSelector((state) => state.auth); //  “Redux store ke auth slice se user object le rahe ho”    useslector -> hook h store se data lata h 


//   (state) => state.auth

// 👉 Ye pura Redux state hota hai:
// state = {
//   auth: {
//     user: { name: "Rahul", email: "..." },
//     isAuthenticated: true
//   }
// }
  
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();  // useToast ek custom hook hai jo humne create kiya hai apne ui library me. Ye hume toast function provide karta hai jisse hum user ko notifications dikha sakte hain. Jaise ki jab cart item update ho jaye ya delete ho jaye to hum ek toast notification dikha sakte hain taki user ko pata chale ki action successful tha ya nahi.

  function handleUpdateQuantity(getCartItem, typeOfAction) {  // cartitem isliye le rhe h jisse pata chle ki cart me item ki quantity kya h
    if (typeOfAction == "plus") {  //  getCartItem ye hmne apne man se liya h kuch bhi likh skte the, lekin isse hume pata chalega ki hm kis item ki quantity update kr rhe h aur typeOfAction se hume pata chalega ki hm quantity increase kr rhe h ya decrease kr rhe h name kuch bhi ho skta tha lekin meaningful hona chahiye taki code padhne me asani ho
      let getCartItems = cartItems.items || []; // mtlb cartitems ke andar items array hoga jisme sare cart items honge, lekin agar wo array empty h ya undefined h to hum usse empty array set kar denge taki code me error na aaye

      if (getCartItems.length) {  // mtlb card empty nhi h to hi hm stock check krenge, agar cart empty h to stock check krne ki need nhi h
        const indexOfCurrentCartItem = getCartItems.findIndex(  // Cart me search kar raha hai: “Kya ye same product already cart me hai?”
          (item) => item.productId === getCartItem?.productId
        );
        //Product list me product dhundna jiska id cart item ke productId ke barabar ho taki hume pata chale ki is product ki total stock kitni hai
        const getCurrentProductIndex = productList.findIndex(   
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: "destructive",
            });

            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {    //   this called optional chaining    we use .then here because updateCartQuantity is an async thunk action, and when we dispatch it, it returns a promise. By using .then, we can wait for the promise to resolve and get the response data from the backend after the cart quantity has been updated. This allows us to show a toast notification to the user based on whether the update was successful or not.
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
      }
    });
  }

  function handleCartItemDelete(getCartItem) { // getcartitemm is a veriable 
    dispatch(deleteCartItem({  // deleteCartItem cartslice me h
       userId: user?.id, productId: getCartItem?.productId })  // is slice me hmme userid and productid deni h bcz use hui h slice me 
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  return (
    <div className="flex items-center gap-2 md:space-x-4 md:gap-0 w-full min-w-0">

      <img
        src={cartItem?.image}
        alt={cartItem?.title}  // alt attribute is used to provide alternative text for an image if the image cannot be displayed. It is also important for accessibility, as screen readers will read the alt text to visually impaired users. In this case, we are using the cartItem's title as the alt text, which gives a description of the product in the cart. 
        className="w-16 h-16 md:w-20 md:h-20 rounded object-cover flex-shrink-0"
      />

      <div className="flex-1 min-w-0">

        <h3 className="font-extrabold text-sm md:text-base line-clamp-2 leading-5">
          {cartItem?.title}
        </h3>

        <div className="flex items-center gap-1.5 md:gap-2 mt-1">

          <Button
            variant="outline"   // variant="outline" se button ka style change ho jata hai, ye humne apne ui library me define kiya h. jab hum variant="outline" use karte hain to button ka background transparent ho jata hai aur border show hota hai. isse button ek outline ke jaisa dikhai deta hai. humne apne ui library me ye style define kiya h taki hum easily outline button use kar sakein apne components me.
            className="h-7 w-7 md:h-8 md:w-8 rounded-full"
            size="icon"  // size="icon" se button ka size change ho jata h, jo icons ke liye perfect hota hai. isse button ek circular icon ke jaisa dikhai deta hai. humne apne ui library me ye style define kiya h taki hum easily outline button use kar sakein apne components me.
            disabled={cartItem?.quantity === 1} // disable krdo jab keval 1 quantity bchi ho
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-3.5 h-3.5 md:w-4 md:h-4" />

            <span className="sr-only">Decrease</span>  
               
            {/* // sr-only class ka use accessibility ke liye hota hai. Ye class screen readers ke liye content ko accessible banata hai, lekin visually usse hide kar deta hai. Is case me, "Decrease" text screen readers ke liye available hoga, taki visually impaired users ko pata chale ki button quantity ko decrease karne ke liye hai, lekin visually usse hide kar deta hai. */}
         
          </Button>

          <span className="font-semibold text-sm md:text-base min-w-[16px] text-center">
            {cartItem?.quantity}
          </span>

          <Button
            variant="outline"
            className="h-7 w-7 md:h-8 md:w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />

            <span className="sr-only">Decrease</span>
          </Button>

        </div>
      </div>

      <div className="flex flex-col items-end flex-shrink-0 min-w-[52px]">

        <p className="font-semibold text-sm md:text-base whitespace-nowrap">
          ₹
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)} {/* ye last me hmne do no se phle decimal de dega like 99.5 ko 99.50 kr dega */}

        </p>

        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={18}  // mtlb 20px ka icon hoga, lucide-react se aap icons ke size ko easily adjust kar sakte hain by passing the size prop. isse icon ka width aur height dono 20px ho jayega. ye size prop lucide-react ke icons ke liye specific hai, aur ye aapko icons ka size customize karne ki flexibility deta hai apne design ke hisab se.
        />

      </div>

    </div>
  );
}

export default UserCartItemsContent;