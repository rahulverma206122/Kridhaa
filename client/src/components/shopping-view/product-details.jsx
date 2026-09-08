// // import { StarIcon } from "lucide-react";
// // import { Avatar, AvatarFallback } from "../ui/avatar";  // avatar ka use krke hum user ke profile picture ko dikhayenge, jise reviews section me use kiya jayega. Jab user koi review likhega to uska naam aur profile picture dono dikhaye jayenge. Agar user ne profile picture nahi lagayi hai to AvatarFallback component me hum uske naam ka first letter dikhayenge, jisse bhi ek tarah ka visual representation mil jayega. Is tarah se Avatar component se hum apne reviews section ko aur engaging aur personalized bana sakte hain.
// // import { Button } from "../ui/button";
// // import { Dialog, DialogContent } from "../ui/dialog";  // dialogue ka use krke hum product details ko ek modal ke roop me dikhayenge. Jab user kisi product tile par click karega to ek dialogue open hoga jisme us product ki sari details dikhayi jayengi, jaise ki product image, description, price, reviews wagairah. Dialog component se hum apne UI ko aur interactive aur user-friendly bana sakte hain, kyunki user bina page reload kiye hi product details dekh sakta hai aur wahan se directly add to cart bhi kar sakta hai.
// // import { Separator } from "../ui/separator";  // separator component ka use krke hum product details dialogue me different sections ko visually separate karenge. Jaise ki product description ke baad ek separator hoga, uske baad reviews section start hoga, aur reviews ke baad ek aur separator hoga jiske baad review submission form hoga. Is tarah se Separator component se hum apne product details dialogue ko organized aur easy to navigate bana sakte hain.
// // import { Input } from "../ui/input";  // input ka use krke hum review submission form me user se review message lene ke liye ek text input field create karenge.
// // import { useDispatch, useSelector } from "react-redux";

// // // 👉 React ke apne hooks hote hain
// // // 👉 Redux (react-redux) ke apne hooks hote hain
// // // “Yes, React provides its own hooks like useState and useEffect, while react-redux provides hooks to interact with the Redux store.”
// // // “We decide which hook to use based on the scope of state. If the state is local to a component, useState is used, Redux is used.”

// // // Ye 2 question pucho khud se:

// // // Kya ye data share hoga?
// // // YES → Redux
// // // NO → useState
// // // Kya ye sirf UI control hai?
// // // YES → useState

import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";  // avatar ka use krke hum user ke profile picture ko dikhayenge, jise reviews section me use kiya jayega. Jab user koi review likhega to uska naam aur profile picture dono dikhaye jayenge. Agar user ne profile picture nahi lagayi hai to AvatarFallback component me hum uske naam ka first letter dikhayenge, jisse bhi ek tarah ka visual representation mil jayega. Is tarah se Avatar component se hum apne reviews section ko aur engaging aur personalized bana sakte hain.
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";  // dialogue ka use krke hum product details ko ek modal ke roop me dikhayenge. Jab user kisi product tile par click karega to ek dialogue open hoga jisme us product ki sari details dikhayi jayengi, jaise ki product image, description, price, reviews wagairah. Dialog component se hum apne UI ko aur interactive aur user-friendly bana sakte hain, kyunki user bina page reload kiye hi product details dekh sakta hai aur wahan se directly add to cart bhi kar sakta hai.
import { Separator } from "../ui/separator";  // separator component ka use krke hum product details dialogue me different sections ko visually separate karenge. Jaise ki product description ke baad a separator hoga, uske baad reviews section start hoga, aur reviews ke baad ek aur separator hoga jiske baad review submission form hoga. Is tarah se Separator component se hum apne product details dialogue ko organized aur easy to navigate bana sakte hain.
import { Input } from "../ui/input";  // input ka use krke hum review submission form me user se review message lene ke liye ek text input field create karenge. Jab user apna review likhega to wo reviewMsg me store hoga aur submit button par click karke apna review submit karega.
import { useDispatch, useSelector } from "react-redux";

// 👉 React ke apne hooks hote hain
// 👉 Redux (react-redux) ke apne hooks hote hain
// //“Yes, React provides its own hooks like useState and useEffect, while react-redux provides hooks to interact with the Redux store.”
// // “We decide which hook to use based on the scope of state. If the state is local to a component, useState is used, Redux is used.”

// // Ye 2 question pucho khud se:

// // Kya ye data share hoga?
// // YES → Redux
// // NO → useState
// // Kya ye sirf UI control hai?
// // YES → useState

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

    // 🔥 IMPORTANT FIX:
    // Product details ko Redux se bhi clear kar rahe hain.
    // Pehle sirf popup close hota tha, lekin productDetails Redux me
    // purana product store rehta tha.
    //
    // Example:
    // Product A open → productDetails = Product A
    // Product A close → productDetails ab bhi Product A ❌
    // Men/Women/Search page open → purana Product A dobara open ❌
    //
    // Ab:
    // Product A close → productDetails = null ✅
    // Isliye next page par purana product automatically open nahi hoga.
    dispatch(setProductDetails(null));

    setRating(0);  // save krne bad mtlb rating dene ke bad star 0 ho jae
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
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id));  // us product ke reviews fetch honge
    }
  }, [productDetails, dispatch]);

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
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        // 🔥 Dialog ke andar se jab user close button,
        // outside click, ya Escape press karega,
        // nextOpen false hoga.
        //
        // Sirf close hone par cleanup karo.
        // Open hone par handleDialogClose() nahi chalana hai.
        if (!nextOpen) {
          handleDialogClose();
        }
      }}
    >
      {/* productdetail wala card khul kr aaega */}

      <DialogContent
        className="
          /* ================= MOBILE ================= */

          w-[80vw]
          max-w-[320px]

          /* 🔥 Mobile popup will fit inside the screen */
          max-h-[calc(100vh-24px)]
          overflow-hidden

          p-2.5

          /* ================= DESKTOP ================= */

          sm:p-8
          md:p-10
          md:max-w-[94vw]
          lg:max-w-[70vw]

          grid
          grid-cols-1
          md:grid-cols-2

          gap-2.5
          md:gap-8
        "
      >

        {/* Product Image */}
        <div className="relative overflow-hidden rounded-lg w-full">

          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="
              w-full
              h-[135px]
              object-cover
              rounded-lg

              sm:aspect-square
              sm:h-auto

              md:max-h-none
            "
          />

        </div>

        {/* Product Details */}
        <div className="min-w-0 w-full overflow-hidden">

          <div>

            <h1
              className="
                text-base
                sm:text-2xl
                md:text-3xl
                font-extrabold
                break-words
                leading-tight
              "
            >
              {productDetails?.title}
            </h1>

            <p
              className="
                text-muted-foreground

                /* Mobile */
                text-xs
                leading-snug
                mb-1
                mt-1

                /* 🔥 Mobile description limited so it doesn't push Submit down */
                line-clamp-2

                /* Desktop */
                sm:text-lg
                md:text-2xl
                md:mb-5
                md:mt-4
                md:leading-relaxed
                md:line-clamp-none

                break-words
              "
            >
              {productDetails?.description}
            </p>

          </div>

          {/* Price */}
          <div className="flex items-center justify-between gap-2">

            <p
              className={`
                text-lg
                sm:text-3xl
                font-bold
                text-primary
                ${
                  productDetails?.salePrice > 0
                    ? "line-through"
                    : ""
                }
              `}
            >
              ₹{productDetails?.price}
            </p>

            {productDetails?.salePrice > 0 ? (
              <p className="text-base sm:text-2xl font-bold text-muted-foreground">
                ₹{productDetails?.salePrice}
              </p>
            ) : null}

          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 md:mt-2">

            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>

            <span className="text-xs sm:text-base text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>

          </div>

          {/* Add To Cart */}
          <div className="mt-1.5 md:mt-5 mb-1.5 md:mb-5">

            {productDetails?.totalStock === 0 ? (

              <Button
                className="
                  w-full
                  opacity-60
                  cursor-not-allowed
                  h-8
                  md:h-10
                "
              >
                Out of Stock
              </Button>

            ) : (

              <Button
                className="
                  w-full
                  bg-blue-900
                  hover:bg-blue-800
                  h-8
                  md:h-10
                "
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

          {/* Reviews */}
          <div className="mt-1.5 md:mt-5">

            <h2 className="text-sm md:text-xl font-bold mb-1 md:mb-4">
              Reviews
            </h2>

            {/* Review List */}
            <div
              className="
                /* 🔥 Very small area on mobile */
                max-h-[45px]

                /* Desktop remains normal */
                md:max-h-[300px]

                overflow-hidden
                pr-1
              "
            >

              <div className="grid gap-1 md:gap-6">

                {reviews && reviews.length > 0 ? (

                  reviews.map((reviewItem) => (

                    <div
                      key={reviewItem?._id}
                      className="flex gap-2 md:gap-4 min-w-0"
                    >

                      <Avatar
                        className="
                          w-5 h-5
                          md:w-10 md:h-10
                          border
                          flex-shrink-0
                        "
                      >

                        {/*user ka icon */}

                        <AvatarFallback>
                          {reviewItem?.userName?.[0]?.toUpperCase()}
                        </AvatarFallback>

                      </Avatar>

                      <div className="grid gap-0.5 min-w-0">

                        <div className="flex items-center gap-2">

                          <h3 className="font-bold text-xs md:text-base break-words">
                            {reviewItem?.userName}
                          </h3>

                        </div>

                        <div className="flex items-center gap-0.5">

                          <StarRatingComponent
                            rating={reviewItem?.reviewValue}
                          />

                        </div>

                        <p className="text-xs md:text-base text-muted-foreground break-words">
                          {reviewItem?.reviewMessage}
                        </p>

                      </div>

                    </div>

                  ))

                ) : (

                  <h1 className="text-xs md:text-lg">
                    No Reviews
                  </h1>

                )}

              </div>

            </div>

            {/* Write Review */}
            <div className="mt-1.5 md:mt-10 flex-col flex gap-1">

              <Label className="text-xs md:text-base">
                Write a review
              </Label>

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
                className="h-8 md:h-10"
              />

              <Button
                onClick={handleAddReview}
                className="bg-blue-900 hover:bg-blue-800 h-8 md:h-10"
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