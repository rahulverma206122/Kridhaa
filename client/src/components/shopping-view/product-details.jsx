// // import { StarIcon } from "lucide-react";
// // import { Avatar, AvatarFallback } from "../ui/avatar";  // avatar ka use krke hum user ke profile picture ko dikhayenge, jise reviews section me use kiya jayega. Jab user koi review likhega to uska naam aur profile picture dono dikhaye jayenge, jisse review aur authentic lagega. Agar user ne profile picture nahi lagayi hai to AvatarFallback component me hum uske naam ka first letter dikhayenge, jisse bhi ek tarah ka visual representation mil jayega. Is tarah se Avatar component se hum apne reviews section ko aur engaging aur personalized bana sakte hain.
// // import { Button } from "../ui/button";
// // import { Dialog, DialogContent } from "../ui/dialog";  // dialogue ka use krke hum product details ko ek modal ke roop me dikhayenge. Jab user kisi product tile par click karega to ek dialogue open hoga jisme us product ki sari details dikhayi jayengi, jaise ki product image, description, price, reviews wagairah. Dialog component se hum apne UI ko aur interactive aur user-friendly bana sakte hain, kyunki user bina page reload kiye hi product details dekh sakta hai aur wahan se directly add to cart bhi kar sakta hai.
// // import { Separator } from "../ui/separator";  // separator component ka use krke hum product details dialogue me different sections ko visually separate karenge. Jaise ki product description ke baad ek separator hoga, uske baad reviews section start hoga, aur reviews ke baad ek aur separator hoga jiske baad review submission form hoga. Is tarah se Separator component se hum apne product details dialogue ko organized aur easy to navigate bana sakte hain, jisse user ko information easily samajh me aaye aur wo apne desired action tak asani se pahunch sake. 
// // import { Input } from "../ui/input";  // input ka use krke hum review submission form me user se review message lene ke liye ek text input field create karenge. Jab user apna review likhega to wo is input field me type karega, aur uske baad submit button par click karke apna review submit karega. Input component se hum apne review submission form ko functional aur user-friendly bana sakte hain, jisse user apne feedback ko easily share kar sake.
// // import { useDispatch, useSelector } from "react-redux";

// // // 👉 React ke apne hooks hote hain
// // // 👉 Redux (react-redux) ke apne hooks hote hain
// // //“Yes, React provides its own hooks like useState and useEffect, while react-redux provides hooks like useSelector and useDispatch to interact with the Redux store.”
// // // “We decide which hook to use based on the scope of state. If the state is local to a component, we use React hooks like useState. If the state needs to be shared across multiple components, we use Redux hooks like useSelector and useDispatch.”

// // // Ye 2 question pucho khud se:

// // // Kya ye data share hoga?
// // // YES → Redux
// // // NO → useState
// // // Kya ye sirf UI control hai?
// // // YES → useState

// // import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// // import { useToast } from "../ui/use-toast";
// // import { setProductDetails } from "@/store/shop/products-slice";
// // import { Label } from "../ui/label";  // label ka use krke hum review submission form me input field ke sath ek descriptive label provide karenge. Jaise ki "Write a review" label ko hum input field ke upar rakhenge, jisse user ko pata chalega ki wo is input field me apna review message likh sakta hai. Label component se hum apne review submission form ko aur accessible aur user-friendly bana sakte hain, jisse user ko samajh me aaye ki wo kis purpose ke liye input field ka use kar raha hai.
// // import StarRatingComponent from "../common/star-rating";
// // import { useEffect, useState } from "react";
// // import { addReview, getReviews } from "@/store/shop/review-slice";

// // // card me click krne se jo card's details aari h wo h 
// // function ProductDetailsDialog({ open, setOpen, productDetails }) { // use this in listing.jsx
  
// // //   It receives props:

// // // open → dialog open hai ya nahi (boolean)
// // // setOpen → dialog ko open/close karne ka function
// // // productDetails → current product ka data
  
// //   const [reviewMsg, setReviewMsg] = useState("");  // default me reviewMsg khali hai, jab user review likhega to wo reviewMsg me store hoga, aur setReviewMsg function se update hoga. Jab user input field me kuch type karega to onChange event trigger hoga, jisme hum setReviewMsg ko call karke reviewMsg ko update karenge. Is tarah se reviewMsg state variable me user ka current review message hoga, jise hum review submission ke time use karenge.

// // // User jo review likhega uske liye state

// // // reviewMsg → current text
// // // setReviewMsg → update function

// //   const [rating, setRating] = useState(0);

// // // 👉 User ka rating (like ⭐ 1–5)

// // // Default = 0
// // // Update when user selects rating

// //   const dispatch = useDispatch();
// //   const { user } = useSelector((state) => state.auth); // here auth is the key used in store.js

// // // useSelector(...)

// // // 👉 Ye Redux hook hai
// // // 👉 Kaam: store se data read karna

// // // (state) => state.auth

// // // 👉 Ye ek arrow function hai

// // // state = poora Redux store
// // // state.auth = store ka ek specific part (slice)

// // // 🧠 Matlab:

// // // “Mujhe poore store me se sirf auth wala data chahiye”

// // // { user } (Destructuring)

// // // 👉 state.auth se ek object milta hai

// // // Example:

// // // state.auth = {
// // //   user: {...},
// // //   isAuthenticated: true,
// // //   loading: false
// // // }

// // // 👉 { user } ka matlab:
// // // ➡️ Sirf user nikaal lo

// //   const { cartItems } = useSelector((state) => state.shopCart);
// //   const { reviews } = useSelector((state) => state.shopReview);

// //   const { toast } = useToast();

// //   function handleRatingChange(getRating) {  
// //     setRating(getRating);
// //   }

// // // getRating kaha se aaya?
// // // 👉 Ye function ka parameter hai

// // // Matlab:

// // // Jab tum function call karoge
// // // Tab value pass hogi → wo getRating ban jaati hai

// //   function handleAddToCart(getCurrentProductId, getTotalStock) {
// //     let getCartItems = cartItems.items || [];  // cartItems.items me wo array hoga jisme currently cart me jo items hain wo stored honge. Agar cartItems.items undefined hai to hum default value ke roop me empty array [] use karenge, jisse code me error na aaye. Is tarah se getCartItems variable me hume current cart items ka array mil jayega, jise hum aage check karenge ki kya user already is product ko cart me add kar chuka hai ya nahi, aur accordingly quantity update karenge ya naye item ke roop me add karenge.

// // // cartItems = {
// // //   items: [
// // //     {
// // //       productId: "p1",
// // //       name: "Gold Ring",
// // //       price: 5000,
// // //       quantity: 2,
// // //       image: "url"
// // //     },
// // //     {
// // //       productId: "p2",
// // //       name: "Necklace",
// // //       price: 10000,
// // //       quantity: 1
// // //     }
// // //   ]
// // // }

// //     if (getCartItems.length) {
// //       const indexOfCurrentItem = getCartItems.findIndex((item) => 
// //         item.productId === getCurrentProductId
// //       );
// //       if (indexOfCurrentItem > -1) {
// //         const getQuantity = getCartItems[indexOfCurrentItem].quantity;
// //         if (getQuantity + 1 > getTotalStock) {
// //           toast({
// //             title: `Only ${getQuantity} quantity can be added for this item`,
// //             variant: "destructive",
// //           });

// //           return;
// //         }
// //       }
// //     }
// //     dispatch(addToCart({ // ye cartslice me define h or ye teen parameter le rha h
// //         userId: user?.id,
// //         productId: getCurrentProductId,
// //         quantity: 1,
// //       })
// //     ).then((data) => {   // data = poora action object jo dispatch ke baad return hota hai

// //       //   yha data and payload me farak hai

// //       // data = poora action object
// //       // payload = actual useful data (jo backend se aaya)

// // // 👉 Ye data actually hota hai:

// // // {
// // //   type: "cart/addToCart/fulfilled",
// // //   payload: {...},   // 🔥 important
// // //   meta: {...}
// // // }


// // // payload kya hai?

// // // 👉 payload = actual useful data (jo backend se aaya)

// // // Tumhare thunk me:

// // // return response.data;

// // // 👉 Ye hi aake payload me store hota hai

// // // data?.payload?.success
// // // “data is the Redux action object, payload contains the API response, and success indicates whether the operation was successful.”
// //       // payload ke andar success field hoti h 
// //       if (data?.payload?.success) {
// //         dispatch(fetchCartItems(user?.id));
// //         toast({
// //           title: "Product is added to cart",
// //         });
// //       }
// //     });
// //   }

// //   function handleDialogClose() { // isse product card bnd ho jaege jb khi bhi click krege
// //     setOpen(false);  // Dialog (popup) band kar raha hai

// // // setProductDetails() → action hai
// // // Likely product details ko clear / null kar raha hai

// // // 💡 Kyun?
// // // ➡️ Next time naya product open ho toh purana data na dikhe


// // // 👉 Agar reset nahi karte:

// // // Old rating dikh jaata 😬
// // // Old review text reh jaata 😬
// // // Wrong product data show ho sakta

// // // NEW / BUG FIX (v2):
// // // Pehle hum yaha turant dispatch(setProductDetails()) call karte the — data turant null.
// // // Fir humne 300ms ka setTimeout try kiya taaki Dialog ki close animation khatam hone ke
// // // baad hi data clear ho. Lekin agar animation 300ms se zyada chale (custom Tailwind
// // // duration ya slow device), tab bhi wahi bug wapas aa jaata hai — image/content khaali
// // // dikhna, aur close karne ke liye dobara click karna padta hai.
// // //
// // // Isliye ab hum productDetails ko CLOSE par bilkul clear hi nahi karte. Iski zaroorat
// // // nahi hai, kyunki jab bhi dialog dobara khulta hai, handleGetProductDetails
// // // dispatch(fetchProductDetails(id)) call karta hai, jo products-slice.js me
// // // fetchProductDetails.fulfilled case me productDetails ko naye product ke data se
// // // already overwrite kar deta hai (dekho: state.productDetails = action.payload.data).
// // // Matlab purana data apne aap replace ho jaata hai jab naya product khulta hai —
// // // isliye close ke time clear karne ki zaroorat hi nahi, aur is race condition ka
// // // permanent fix ho jaata hai (koi bhi animation duration guess karne ki zaroorat nahi).
// //     setRating(0);  // save krne ke bad mtlb rating dene ke bad star 0 ho jae 
// //     setReviewMsg(""); //  msg wala input khali ho jae
// //   }

// //   function handleAddReview() {
// //     dispatch(addReview({
// //         productId: productDetails?._id,
// //         userId: user?.id,
// //         userName: user?.userName,
// //         reviewMessage: reviewMsg,
// //         reviewValue: rating,
// //       })
// //     ).then((data) => {
// //       if (data.payload.success) {
// //         setRating(0);
// //         setReviewMsg("");
// //         dispatch(getReviews(productDetails?._id));
// //         toast({
// //           title: "Review added successfully!",
// //         });
// //       }
// //     });
// //   }

// //   // “This useEffect listens for changes in productDetails. When a new product is selected, it dispatches an action to fetch reviews for that product using its id.”
// //   useEffect(() => {
// //     if (productDetails !== null) dispatch(getReviews(productDetails?._id));  // us product ke reviews fetch honge
// //   }, [productDetails]);  // Jab bhi productDetails change hoga ye code run hoga 

// //   const averageReview =
// //     reviews && reviews.length > 0
// //       ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
// //         reviews.length
// //       : 0;

// //   return (
// //     <Dialog open={open} onOpenChange={handleDialogClose}>  {/* productdetail wala card khul kr aaega */}
// //       <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
// //         <div className="relative overflow-hidden rounded-lg">
// //           <img
// //             src={productDetails?.image}
// //             alt={productDetails?.title}
// //             width={600}
// //             height={600}
// //             className="aspect-square w-full object-cover"
// //           />
// //         </div>
// //         <div className="">
// //           <div>
// //             <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
// //             <p className="text-muted-foreground text-2xl mb-5 mt-4">
// //               {productDetails?.description}
// //             </p>
// //           </div>
// //           <div className="flex items-center justify-between">
// //             <p
// //               className={`text-3xl font-bold text-primary ${
// //                 productDetails?.salePrice > 0 ? "line-through" : ""
// //               }`}
// //             >
// //               ₹{productDetails?.price}
// //             </p>
// //             {productDetails?.salePrice > 0 ? (
// //               <p className="text-2xl font-bold text-muted-foreground">
// //                 ₹{productDetails?.salePrice}
// //               </p>
// //             ) : null}
// //           </div>
// //           <div className="flex items-center gap-2 mt-2">
// //             <div className="flex items-center gap-0.5">
// //               <StarRatingComponent rating={averageReview} />
// //             </div>
// //             <span className="text-muted-foreground">
// //               ({averageReview.toFixed(2)})
// //             </span>
// //           </div>
// //           <div className="mt-5 mb-5">
// //             {productDetails?.totalStock === 0 ? (
// //               <Button className="w-full opacity-60 cursor-not-allowed">
// //                 Out of Stock
// //               </Button>
// //             ) : (
// //               <Button
// //                 className="w-full bg-blue-900"
// //                 onClick={() =>
// //                   handleAddToCart(
// //                     productDetails?._id,
// //                     productDetails?.totalStock
// //                   )
// //                 }
// //               >
// //                 Add to Cart
// //               </Button>
// //             )}
// //           </div>
// //           <Separator />
// //           <div className="max-h-[300px] overflow-auto">
// //             <h2 className="text-xl font-bold mb-4">Reviews</h2>
// //             <div className="grid gap-6">
// //               {reviews && reviews.length > 0 ? (
// //                 reviews.map((reviewItem) => (
// //                   <div className="flex gap-4">
// //                     <Avatar className="w-10 h-10 border"> {/*user ka icon */}
// //                       <AvatarFallback>
// //                         {reviewItem?.userName[0].toUpperCase()}
// //                       </AvatarFallback>
// //                     </Avatar>
// //                     <div className="grid gap-1">
// //                       <div className="flex items-center gap-2">
// //                         <h3 className="font-bold">{reviewItem?.userName}</h3>
// //                       </div>
// //                       <div className="flex items-center gap-0.5">
// //                         <StarRatingComponent rating={reviewItem?.reviewValue} />
// //                       </div>
// //                       <p className="text-muted-foreground">
// //                         {reviewItem.reviewMessage}
// //                       </p>
// //                     </div>
// //                   </div>
// //                 ))
// //               ) : (
// //                 <h1>No Reviews</h1>
// //               )}
// //             </div>
// //             <div className="mt-10 flex-col flex gap-2">
// //               <Label>Write a review</Label>
// //               <div className="flex gap-1">
// //                 <StarRatingComponent
// //                   rating={rating}
// //                   handleRatingChange={handleRatingChange}
// //                 />
// //               </div>
// //               <Input

// // // name="reviewMsg"

// // // 👉 Ye input ka identifier hai

// // // Form submit karte time use hota hai
// // // Multiple inputs ho toh differentiate karne ke liye
// // // 👉 Backend ko bhejte waqt helpful

// //                 name="reviewMsg"

// //                 //👉 value = jo text input box me dikh raha hai (user jo type kar raha hai)

// //                 // 👉 Use:

// // // User jo type kare usko store karna
// // // Form submit karna
// // // Validation karna 

// //                 value={reviewMsg}   // mtlb “Input box me jo bhi dikhega, wo reviewMsg se aayega”

// // // Jab user type kare:

// // // event.target.value → jo user ne likha
// // // setReviewMsg(...) → state update

// //                 onChange={(event) => setReviewMsg(event.target.value)}
// //                 placeholder="Write a review..."
// //               />
// //               <Button
// //                 onClick={handleAddReview}
// //                 className="bg-blue-900"
// //                 disabled={reviewMsg.trim() === ""} // see notes  “Agar user ne kuch nahi likha (ya sirf spaces likhe), toh button disabled rahega”
// //               >
// //                 Submit
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }

// // export default ProductDetailsDialog;

// import { StarIcon } from "lucide-react";
// import { Avatar, AvatarFallback } from "../ui/avatar";  // avatar ka use krke hum user ke profile picture ko dikhayenge, jise reviews section me use kiya jayega. Jab user koi review likhega to uska naam aur profile picture dono dikhaye jayenge, jisse review aur authentic lagega. Agar user ne profile picture nahi lagayi hai to AvatarFallback component me hum uske naam ka first letter dikhayenge, jisse bhi ek tarah ka visual representation mil jayega. Is tarah se Avatar component se hum apne reviews section ko aur engaging aur personalized bana sakte hain.
// import { Button } from "../ui/button";
// import { Dialog, DialogContent } from "../ui/dialog";  // dialogue ka use krke hum product details ko ek modal ke roop me dikhayenge. Jab user kisi product tile par click karega to ek dialogue open hoga jisme us product ki sari details dikhayi jayengi, jaise ki product image, description, price, reviews wagairah. Dialog component se hum apne UI ko aur interactive aur user-friendly bana sakte hain, kyunki user bina page reload kiye hi product details dekh sakta hai aur wahan se directly add to cart bhi kar sakta hai.
// import { Separator } from "../ui/separator";  // separator component ka use krke hum product details dialogue me different sections ko visually separate karenge. Jaise ki product description ke baad ek separator hoga, uske baad reviews section start hoga, aur reviews ke baad ek aur separator hoga jiske baad review submission form hoga. Is tarah se Separator component se hum apne product details dialogue ko organized aur easy to navigate bana sakte hain, jisse user ko information easily samajh me aaye aur wo apne desired action tak asani se pahunch sake. 
// import { Input } from "../ui/input";  // input ka use krke hum review submission form me user se review message lene ke liye ek text input field create karenge. Jab user apna review likhega to wo is input field me type karega, aur uske baad submit button par click karke apna review submit karega. Input component se hum apne review submission form ko functional aur user-friendly bana sakte hain, jisse user apne feedback ko easily share kar sake.
// import { useDispatch, useSelector } from "react-redux";

// // 👉 React ke apne hooks hote hain
// // 👉 Redux (react-redux) ke apne hooks hote hain
// //“Yes, React provides its own hooks like useState and useEffect, while react-redux provides hooks like useSelector and useDispatch to interact with the Redux store.”
// // “We decide which hook to use based on the scope of state. If the state is local to a component, we use React hooks like useState. If the state needs to be shared across multiple components, we use Redux hooks like useSelector and useDispatch.”

// // Ye 2 question pucho khud se:

// // Kya ye data share hoga?
// // YES → Redux
// // NO → useState
// // Kya ye sirf UI control hai?
// // YES → useState

// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import { useToast } from "../ui/use-toast";
// import { setProductDetails } from "@/store/shop/products-slice";
// import { Label } from "../ui/label";  // label ka use krke hum review submission form me input field ke sath ek descriptive label provide karenge. Jaise ki "Write a review" label ko hum input field ke upar rakhenge, jisse user ko pata chalega ki wo is input field me apna review message likh sakta hai. Label component se hum apne review submission form ko aur accessible aur user-friendly bana sakte hain, jisse user ko samajh me aaye ki wo kis purpose ke liye input field ka use kar raha hai.
// import StarRatingComponent from "../common/star-rating";
// import { useEffect, useState } from "react";
// import { addReview, getReviews } from "@/store/shop/review-slice";
// import { addRecentlyViewedProduct } from "@/utils/recently-viewed"; // 👈 adjust path to wherever your util file actually lives

// // card me click krne se jo card's details aari h wo h 
// function ProductDetailsDialog({ open, setOpen, productDetails }) { // use this in listing.jsx
  
// //   It receives props:

// // open → dialog open hai ya nahi (boolean)
// // setOpen → dialog ko open/close karne ka function
// // productDetails → current product ka data
  
//   const [reviewMsg, setReviewMsg] = useState("");  // default me reviewMsg khali hai, jab user review likhega to wo reviewMsg me store hoga, aur setReviewMsg function se update hoga. Jab user input field me kuch type karega to onChange event trigger hoga, jisme hum setReviewMsg ko call karke reviewMsg ko update karenge. Is tarah se reviewMsg state variable me user ka current review message hoga, jise hum review submission ke time use karenge.

// // User jo review likhega uske liye state

// // reviewMsg → current text
// // setReviewMsg → update function

//   const [rating, setRating] = useState(0);

// // 👉 User ka rating (like ⭐ 1–5)

// // Default = 0
// // Update when user selects rating

//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth); // here auth is the key used in store.js

// // useSelector(...)

// // 👉 Ye Redux hook hai
// // 👉 Kaam: store se data read karna

// // (state) => state.auth

// // 👉 Ye ek arrow function hai

// // state = poora Redux store
// // state.auth = store ka ek specific part (slice)

// // 🧠 Matlab:

// // “Mujhe poore store me se sirf auth wala data chahiye”

// // { user } (Destructuring)

// // 👉 state.auth se ek object milta hai

// // Example:

// // state.auth = {
// //   user: {...},
// //   isAuthenticated: true,
// //   loading: false
// // }

// // 👉 { user } ka matlab:
// // ➡️ Sirf user nikaal lo

//   const { cartItems } = useSelector((state) => state.shopCart);
//   const { reviews } = useSelector((state) => state.shopReview);

//   const { toast } = useToast();

//   function handleRatingChange(getRating) {  
//     setRating(getRating);
//   }

// // getRating kaha se aaya?
// // 👉 Ye function ka parameter hai

// // Matlab:

// // Jab tum function call karoge
// // Tab value pass hogi → wo getRating ban jaati hai

//   function handleAddToCart(getCurrentProductId, getTotalStock) {
//     let getCartItems = cartItems.items || [];  // cartItems.items me wo array hoga jisme currently cart me jo items hain wo stored honge. Agar cartItems.items undefined hai to hum default value ke roop me empty array [] use karenge, jisse code me error na aaye. Is tarah se getCartItems variable me hume current cart items ka array mil jayega, jise hum aage check karenge ki kya user already is product ko cart me add kar chuka hai ya nahi, aur accordingly quantity update karenge ya naye item ke roop me add karenge.

// // cartItems = {
// //   items: [
// //     {
// //       productId: "p1",
// //       name: "Gold Ring",
// //       price: 5000,
// //       quantity: 2,
// //       image: "url"
// //     },
// //     {
// //       productId: "p2",
// //       name: "Necklace",
// //       price: 10000,
// //       quantity: 1
// //     }
// //   ]
// // }

//     if (getCartItems.length) {
//       const indexOfCurrentItem = getCartItems.findIndex((item) => 
//         item.productId === getCurrentProductId
//       );
//       if (indexOfCurrentItem > -1) {
//         const getQuantity = getCartItems[indexOfCurrentItem].quantity;
//         if (getQuantity + 1 > getTotalStock) {
//           toast({
//             title: `Only ${getQuantity} quantity can be added for this item`,
//             variant: "destructive",
//           });

//           return;
//         }
//       }
//     }
//     dispatch(addToCart({ // ye cartslice me define h or ye teen parameter le rha h
//         userId: user?.id,
//         productId: getCurrentProductId,
//         quantity: 1,
//       })
//     ).then((data) => {   // data = poora action object jo dispatch ke baad return hota hai

//       //   yha data and payload me farak hai

//       // data = poora action object
//       // payload = actual useful data (jo backend se aaya)

// // 👉 Ye data actually hota hai:

// // {
// //   type: "cart/addToCart/fulfilled",
// //   payload: {...},   // 🔥 important
// //   meta: {...}
// // }


// // payload kya hai?

// // 👉 payload = actual useful data (jo backend se aaya)

// // Tumhare thunk me:

// // return response.data;

// // 👉 Ye hi aake payload me store hota hai

// // data?.payload?.success
// // “data is the Redux action object, payload contains the API response, and success indicates whether the operation was successful.”
//       // payload ke andar success field hoti h 
//       if (data?.payload?.success) {
//         dispatch(fetchCartItems(user?.id));
//         toast({
//           title: "Product is added to cart",
//         });
//       }
//     });
//   }

//   function handleDialogClose() { // isse product card bnd ho jaege jb khi bhi click krege
//     setOpen(false);  // Dialog (popup) band kar raha hai

// // setProductDetails() → action hai
// // Likely product details ko clear / null kar raha hai

// // 💡 Kyun?
// // ➡️ Next time naya product open ho toh purana data na dikhe


// // 👉 Agar reset nahi karte:

// // Old rating dikh jaata 😬
// // Old review text reh jaata 😬
// // Wrong product data show ho sakta

// // NEW / BUG FIX (v2):
// // Pehle hum yaha turant dispatch(setProductDetails()) call karte the — data turant null.
// // Fir humne 300ms ka setTimeout try kiya taaki Dialog ki close animation khatam hone ke
// // baad hi data clear ho. Lekin agar animation 300ms se zyada chale (custom Tailwind
// // duration ya slow device), tab bhi wahi bug wapas aa jaata hai — image/content khaali
// // dikhna, aur close karne ke liye dobara click karna padta hai.
// //
// // Isliye ab hum productDetails ko CLOSE par bilkul clear hi nahi karte. Iski zaroorat
// // nahi hai, kyunki jab bhi dialog dobara khulta hai, handleGetProductDetails
// // dispatch(fetchProductDetails(id)) call karta hai, jo products-slice.js me
// // fetchProductDetails.fulfilled case me productDetails ko naye product ke data se
// // already overwrite kar deta hai (dekho: state.productDetails = action.payload.data).
// // Matlab purana data apne aap replace ho jaata hai jab naya product khulta hai —
// // isliye close ke time clear karne ki zaroorat hi nahi, aur is race condition ka
// // permanent fix ho jaata hai (koi bhi animation duration guess karne ki zaroorat nahi).
//     setRating(0);  // save krne ke bad mtlb rating dene ke bad star 0 ho jae 
//     setReviewMsg(""); //  msg wala input khali ho jae
//   }

//   function handleAddReview() {
//     dispatch(addReview({
//         productId: productDetails?._id,
//         userId: user?.id,
//         userName: user?.userName,
//         reviewMessage: reviewMsg,
//         reviewValue: rating,
//       })
//     ).then((data) => {
//       if (data.payload.success) {
//         setRating(0);
//         setReviewMsg("");
//         dispatch(getReviews(productDetails?._id));
//         toast({
//           title: "Review added successfully!",
//         });
//       }
//     });
//   }

//   // “This useEffect listens for changes in productDetails. When a new product is selected, it dispatches an action to fetch reviews for that product using its id.”
//   useEffect(() => {
//     if (productDetails !== null) dispatch(getReviews(productDetails?._id));  // us product ke reviews fetch honge
//   }, [productDetails]);  // Jab bhi productDetails change hoga ye code run hoga 

//   // NEW: har baar jab bhi productDetails load hota hai (Home, Listing, ya AI assistant —
//   // kahin se bhi dialog khule), us product ko "recently viewed" list me localStorage
//   // me save kar dete hain. Pehle ye kahin call hi nahi ho raha tha, isliye recommendation
//   // backend ko hamesha khali array milta tha aur wo sirf latest 8 products dikhata tha —
//   // asal me kisi ke browsing history se koi lena dena nahi tha.
//   useEffect(() => {
//     if (productDetails?._id) {
//       addRecentlyViewedProduct(productDetails._id);
//     }
//   }, [productDetails]);

//   const averageReview =
//     reviews && reviews.length > 0
//       ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
//         reviews.length
//       : 0;

//   return (
//     <Dialog open={open} onOpenChange={handleDialogClose}>  {/* productdetail wala card khul kr aaega */}
//       <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
//         <div className="relative overflow-hidden rounded-lg">
//           <img
//             src={productDetails?.image}
//             alt={productDetails?.title}
//             width={600}
//             height={600}
//             className="aspect-square w-full object-cover"
//           />
//         </div>
//         <div className="">
//           <div>
//             <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
//             <p className="text-muted-foreground text-2xl mb-5 mt-4">
//               {productDetails?.description}
//             </p>
//           </div>
//           <div className="flex items-center justify-between">
//             <p
//               className={`text-3xl font-bold text-primary ${
//                 productDetails?.salePrice > 0 ? "line-through" : ""
//               }`}
//             >
//               ₹{productDetails?.price}
//             </p>
//             {productDetails?.salePrice > 0 ? (
//               <p className="text-2xl font-bold text-muted-foreground">
//                 ₹{productDetails?.salePrice}
//               </p>
//             ) : null}
//           </div>
//           <div className="flex items-center gap-2 mt-2">
//             <div className="flex items-center gap-0.5">
//               <StarRatingComponent rating={averageReview} />
//             </div>
//             <span className="text-muted-foreground">
//               ({averageReview.toFixed(2)})
//             </span>
//           </div>
//           <div className="mt-5 mb-5">
//             {productDetails?.totalStock === 0 ? (
//               <Button className="w-full opacity-60 cursor-not-allowed">
//                 Out of Stock
//               </Button>
//             ) : (
//               <Button
//                 className="w-full bg-blue-900"
//                 onClick={() =>
//                   handleAddToCart(
//                     productDetails?._id,
//                     productDetails?.totalStock
//                   )
//                 }
//               >
//                 Add to Cart
//               </Button>
//             )}
//           </div>
//           <Separator />
//           <div className="max-h-[300px] overflow-auto">
//             <h2 className="text-xl font-bold mb-4">Reviews</h2>
//             <div className="grid gap-6">
//               {reviews && reviews.length > 0 ? (
//                 reviews.map((reviewItem) => (
//                   <div className="flex gap-4">
//                     <Avatar className="w-10 h-10 border"> {/*user ka icon */}
//                       <AvatarFallback>
//                         {reviewItem?.userName[0].toUpperCase()}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="grid gap-1">
//                       <div className="flex items-center gap-2">
//                         <h3 className="font-bold">{reviewItem?.userName}</h3>
//                       </div>
//                       <div className="flex items-center gap-0.5">
//                         <StarRatingComponent rating={reviewItem?.reviewValue} />
//                       </div>
//                       <p className="text-muted-foreground">
//                         {reviewItem.reviewMessage}
//                       </p>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <h1>No Reviews</h1>
//               )}
//             </div>
//             <div className="mt-10 flex-col flex gap-2">
//               <Label>Write a review</Label>
//               <div className="flex gap-1">
//                 <StarRatingComponent
//                   rating={rating}
//                   handleRatingChange={handleRatingChange}
//                 />
//               </div>
//               <Input

// // name="reviewMsg"

// // 👉 Ye input ka identifier hai

// // Form submit karte time use hota hai
// // Multiple inputs ho toh differentiate karne ke liye
// // 👉 Backend ko bhejte waqt helpful

//                 name="reviewMsg"

//                 //👉 value = jo text input box me dikh raha hai (user jo type kar raha hai)

//                 // 👉 Use:

// // User jo type kare usko store karna
// // Form submit karna
// // Validation karna 

//                 value={reviewMsg}   // mtlb “Input box me jo bhi dikhega, wo reviewMsg se aayega”

// // Jab user type kare:

// // event.target.value → jo user ne likha
// // setReviewMsg(...) → state update

//                 onChange={(event) => setReviewMsg(event.target.value)}
//                 placeholder="Write a review..."
//               />
//               <Button
//                 onClick={handleAddReview}
//                 className="bg-blue-900"
//                 disabled={reviewMsg.trim() === ""} // see notes  “Agar user ne kuch nahi likha (ya sirf spaces likhe), toh button disabled rahega”
//               >
//                 Submit
//               </Button>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default ProductDetailsDialog;


import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";  // avatar ka use krke hum user ke profile picture ko dikhayenge, jise reviews section me use kiya jayega. Jab user koi review likhega to uska naam aur profile picture dono dikhaye jayenge, jisse review aur authentic lagega. Agar user ne profile picture nahi lagayi hai to AvatarFallback component me hum uske naam ka first letter dikhayenge, jisse bhi ek tarah ka visual representation mil jayega. Is tarah se Avatar component se hum apne reviews section ko aur engaging aur personalized bana sakte hain.
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";  // dialogue ka use krke hum product details ko ek modal ke roop me dikhayenge. Jab user kisi product tile par click karega to ek dialogue open hoga jisme us product ki sari details dikhayi jayengi, jaise ki product image, description, price, reviews wagairah. Dialog component se hum apne product tile ko aur interactive aur user-friendly bana sakte hain, kyunki user bina page reload kiye hi product details dekh sakta hai aur wahan se directly add to cart bhi kar sakta hai.
import { Separator } from "../ui/separator";  // separator component ka use krke hum product details dialogue me different sections ko visually separate karenge. Jaise ki product description ke baad ek separator hoga, uske baad reviews section start hoga, aur reviews ke baad ek aur separator hoga jiske baad review submission form hoga. Is tarah se Separator component se hum apne reviews section ko organized aur easy to navigate bana sakte hain.
import { Input } from "../ui/input";  // input ka use krke hum review submission form me user se review message lene ke liye ek text input field create karenge. Jab user apna review likhega to wo is input field me type karega aur submit button par click karke apna review submit karega.
import { useDispatch, useSelector } from "react-redux";

// 👉 React ke apne hooks hote hain
// 👉 Redux (react-redux) ke apne hooks hote hain
//“Yes, React provides its own hooks like useState and useEffect, while react-redux provides hooks like useSelector and useDispatch to interact with the Redux store.”
// “We decide which hook to use based on the scope of state. If the state is local to a component, useState is used. If the state needs to be shared across multiple components, Redux is used.”

// Ye 2 question pucho khud se:

// Kya ye data share hoga?
// YES → Redux
// NO → useState
// Kya ye sirf UI control hai?
// YES → useState

import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";  // label ka use krke hum review submission form me input field ke sath ek descriptive label provide karenge.
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { addRecentlyViewedProduct } from "@/utils/recently-viewed"; // 👈 adjust path to wherever your util file actually lives

// card me click krne se jo card's details aari h wo h 
function ProductDetailsDialog({ open, setOpen, productDetails }) { // use this in listing.jsx
  
//   It receives props:

// open → dialog open hai ya nahi (boolean)
// setOpen → dialog ko open/close karne ka function
// productDetails → current product ka data
  
  const [reviewMsg, setReviewMsg] = useState("");  // default me reviewMsg khali hai, jab user review likhega to wo reviewMsg me store hoga, aur setReviewMsg function se update hoga.

// User jo review likhega uske liye state

// reviewMsg → current text
// setReviewMsg → update function

  const [rating, setRating] = useState(0);

// 👉 User ka rating (like ⭐ 1–5)

// Default = 0
// Update when user selects rating

  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector(
    (state) => state.auth
  ); // here auth is the key used in store.js

// useSelector(...)

// 👉 Ye Redux hook hai
// 👉 Kaam: store se data read karna

// (state) => state.auth

// 👉 Ye ek arrow function hai

// state = poora Redux store
// state.auth = store ka ek specific part

// 🧠 Matlab:

// “Mujhe poore store me se sirf auth wala data chahiye”

// { user, isAuthenticated } (Destructuring)

// 👉 user = logged in user
// 👉 isAuthenticated = user login hai ya nahi

  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  function handleRatingChange(getRating) {  
    setRating(getRating);
  }

// getRating kaha se aaya?
// Matlab jab function call hoga tab value getRating ban jaati hai

  function handleAddToCart(getCurrentProductId, getTotalStock) {

    let getCartItems = cartItems?.items || [];

    // 🔥 Guest ke liye cartItems Redux me available hoga
    // 🔥 Logged-in user ke liye bhi same structure use ho raha hai

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex((item) => 
        item.productId === getCurrentProductId
      );

      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;

        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    // 🔥 Product ki complete information guest cart ke liye pass kar rahe hain
    const productData = {
      title: productDetails?.title,
      image: productDetails?.image,
      price: productDetails?.price,
      salePrice: productDetails?.salePrice,
    };

    dispatch(
      addToCart({
        userId: isAuthenticated ? user?.id : null,
        productId: getCurrentProductId,
        quantity: 1,
        product: productData,
      })
    ).then((data) => {

      // data = poora action object jo dispatch ke baad return hota hai
      // payload = actual useful data jo thunk se return hua

      if (data?.payload?.success) {

        // 🔥 Guest aur logged-in dono ka Redux cart update hoga
        if (data?.payload?.isGuestCart) {
          // Guest cart already Redux me update ho chuka hai
        } else {
          // Logged-in user ke liye backend se latest cart fetch karo
          dispatch(fetchCartItems(user?.id));
        }

        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleDialogClose() { // isse product card bnd ho jaege jb khi bhi click krege
    setOpen(false);  // Dialog (popup) band kar raha hai

// setProductDetails() → action hai
// Likely product details ko clear / null kar raha hai

// 💡 Kyun?
// ➡️ Next time naya product open ho toh purana data na dikhe

// NEW / BUG FIX (v2):
// Pehle yaha turant dispatch(setProductDetails()) call karte the.
// Fir humne 300ms ka setTimeout try kiya tha.
// Lekin animation duration fixed maan lena reliable nahi tha.
//
// Isliye ab productDetails ko CLOSE par clear nahi karte.
// Jab dobara dialog khulta hai, fetchProductDetails naye product ka data overwrite kar deta hai.

    setRating(0);  // save krne ke bad mtlb rating dene ke bad star 0 ho jae 
    setReviewMsg(""); // msg wala input khali ho jae
  }

  function handleAddReview() {
    dispatch(addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  // “This useEffect listens for changes in productDetails. When a new product is selected, it dispatches an action to fetch reviews for that product using its id.”
  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));  // us product ke reviews fetch honge
  }, [productDetails]);  // Jab bhi productDetails change hoga ye code run hoga 

  // NEW: har baar jab bhi productDetails load hota hai (Home, Listing, ya AI assistant —
  // kahin se bhi dialog khule), us product ko "recently viewed" list me localStorage
  // me save kar dete hain.
  useEffect(() => {
    if (productDetails?._id) {
      addRecentlyViewedProduct(productDetails._id);
    }
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>  {/* productdetail wala card khul kr aaega */}
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">
              {productDetails?.title}
            </h1>

            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ₹{productDetails?.price}
            </p>

            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ₹{productDetails?.salePrice}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>

            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>

          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full bg-blue-900"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>

          <Separator />

          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>

            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border"> {/*user ka icon */}
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">
                          {reviewItem?.userName}
                        </h3>
                      </div>

                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent
                          rating={reviewItem?.reviewValue}
                        />
                      </div>

                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>

            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>

              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>

              <Input
                name="reviewMsg"

                //👉 value = jo text input box me dikh raha hai (user jo type kar raha hai)

                value={reviewMsg}

                // Jab user type kare:
                // event.target.value → jo user ne likha
                // setReviewMsg(...) → state update

                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              />

              <Button
                onClick={handleAddReview}
                className="bg-blue-900"
                disabled={reviewMsg.trim() === ""} // “Agar user ne kuch nahi likha (ya sirf spaces likhe), toh button disabled rahega”
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;