import { Button } from "@/components/ui/button";
import imgg from "../../assets/KR.png";
import img from "../../assets/aa.mp4";
import kidsImg from "../../assets/kids.webp";
import anklet from "../../assets/anklets.webp";
import coin from "../../assets/coins.webp";
import women from "../../assets/women.webp";
import men from "../../assets/mens.webp";
import ring from "../../assets/rings.webp";
import toe from "../../assets/toe.png";
import h from "../../assets/h1.png";
import of from "../../assets/gms.webp";
import v1 from "../../assets/v1.mp4";
import v2 from "../../assets/v2.mp4";
import v3 from "../../assets/v3.mp4";
import v4 from "../../assets/v4.mp4";
import v5 from "../../assets/v5.mp4";
import v6 from "../../assets/v6.mp4";
import v7 from "../../assets/v7.mp4";
import p1 from "../../assets/p1.webp";
import p2 from "../../assets/p2.png";
import p3 from "../../assets/p3.webp";
import p4 from "../../assets/p4.webp";
import p5 from "../../assets/p5.webp";
import p6 from "../../assets/p6.webp";
import p7 from "../../assets/p7.webp";
import blue from "../../assets/blue.mp4";

import { motion } from "framer-motion";
import Footer from "../../components/shopping-view/footer";
import Rate from "../../components/shopping-view/rate";


import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  PersonStanding,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  BookHeart,
  UmbrellaIcon,
  WashingMachine,
  RectangleVertical,
  BadgeCheck,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

import AIJewelryAssistant from "@/components/shopping-view/ai-jewelry-assistant";

import RecommendedProducts from "@/components/shopping-view/recommended-products";

const categoriesWithIcon = [  
  { id: "men", label: "Men", image: men },  // id = internal unique identifier (backend/frontend logic ke liye)
  { id: "women", label: "Women", image: women },  // label = jo user ko dikhana hai (UI par dikhne wala text)
  { id: "kids", label: "Kids", image: kidsImg},  
  { id: "coins", label: "Coins & Bars", image: coin},
  {id: "anklets", label: "Anklets", image:anklet},
  {id: "rings", label: "Silver Rings", image:ring},
  {id: "toerings", label: "Toe Rings", image:toe},
];

const caratsWithIcon = [
  { id: "k18", label: "18 K", image: h },
  { id: "k20", label: "20 K", image: h },
  { id: "k22", label: "22 K", image: h },
  { id: "k24", label: "24 K", image: h },
  { id: "silver", label: "92.5", image: h },
];

const videoWithIcon = [
  { id: "v1", label: "", video: v6 },
  { id: "v2", label: "", video: v2 },
  { id: "v3", label: "", video: v3 },
  { id: "v4", label: "", video: v7 },
  { id: "v5", label: "", video: v5 },
  { id: "v6", label: "", video: v1 },
  { id: "v7", label: "", video: v4 },
];


function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);

// currentSlide index track karta hai (kaunsa slide show ho raha hai)
// Slider me indexing 0 se start hoti hai
// Isliye initial value = 0 (first image)

// 🔥 null kab use karte hain?
// 👉 When value abhi exist nahi karti, but baad me aayegi

  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate() hook React Router v6 ka part hai, jo ki functional components me navigation handle karne ke liye use hota hai. Ye hook ek function return karta hai jise navigate() ke naam se use karte hain, jiska use karke aap programmatically kisi bhi route par navigation handle kar sakte hain. Ye hook ek function return karta hai jise navigate() ke naam se use karte hain, jiska use karke aap programmatically kisi bhi route par le ja sakte hain, bina kisi link ke click ke. Ye dynamic navigation ke liye bahut useful hota hai, especially jab aapko user actions ke basis par different pages par le jana ho.
  // Jaise ki jab user kisi category ya product par click kare, to wo navigate() function specific route par le jaata hai, bina kisi full page reload ke. 

  const { toast } = useToast(); // useToast() custom hook hai jo ki toast notifications ko handle karta hai. Ye hook ek object return karta hai jisme toast function hota hai, jiska use karke aap apne application me toast messages show kar sakte ho. Jaise ki jab user product cart me add kare, to toast() function se success message show kar sakte ho, jisse user ko feedback milega.

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");  // first we clear the session storage mtlb jo bhi filter lga ho phle use clear krdo
    const currentFilter = {
      [section]: [getCurrentItem.id], //  Create a new filter object  {"carat":[101]}
    };  // why we use []:It means the key name will be taken from the variable section.jab [] lag jate h to wo cheez variable ho jati hai agar ye na lage to section hamesha section hi rhega kabhi carat ya category nhi banega
   // [getCurrentItem.id] → can remove [] it rep the array , but only if you don’t need multiple values in that filter.
    sessionStorage.setItem("filters", JSON.stringify(currentFilter)); // Save the new filter object in sessionStorage
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  // function handleAddtoCart(getCurrentProductId) {
  //   dispatch(
  //     addToCart({
  //       userId: user?.id,
  //       productId: getCurrentProductId,
  //       quantity: 1,
  //     })
  //   ).then((data) => {
  //     if (data?.payload?.success) {
  //       dispatch(fetchCartItems(user?.id));
  //       toast({
  //         title: "Product is added to cart",
  //       });
  //     }
  //   });
  // }


function handleAddtoCart(getCurrentProductId, getTotalStock, product) {
  // 🔥 Product ki complete information guest cart ke liye pass kar rahe hain
  const productData = {
    title: product?.title,
    image: product?.image,
    price: product?.price,
    salePrice: product?.salePrice,
  };

  dispatch(
    addToCart({
      userId: user?.id,
      productId: getCurrentProductId,
      quantity: 1,
      product: productData,
    })
  ).then((data) => {
    if (data?.payload?.success) {
      // 🔥 Guest cart ke liye fetchCartItems ki zaroorat nahi hai
      // kyunki cart-slice already Redux state update kar raha hai.
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




  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

//   🔥 1. [productDetails] kya hai?

// 👉 Haan, isse second parameter bolte hain
// 👉 Technically iska naam hai: dependency array
// “Jab bhi productDetails change hoga → ye function run hoga”

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);  // every 15 sec me slide aage bhad jaegi  // 15000 ms = 15 seconds
  // If we leave it like that, even when we leave the page or the images change, that old interval will still keep running in the background.
  //This can create extra unwanted timers (multiple slides changing at once) and also waste memory.so we use clearinterval
    return () => clearInterval(timer); // It means: when the component closes or updates, stop the old interval before starting a new one.
  }, [featureImageList]);

//   Flow samajh (step-by-step)
// Page load →
// useEffect run →
// setInterval start →

// Every 15 sec →
// currentSlide update →

// If images change →
// cleanup (clearInterval) →
// new interval start

// Agar cleanup nahi hota:

// 👉 Problem:

// Multiple timers run honge 😵
// Slide fast fast change hogi
// Memory leak hoga

  useEffect(() => {  // jaise hi home page pr aaege sare product dikhne lgege
    dispatch(
      fetchAllFilteredProducts({ // initial filter nhi hoga and price low to high aaege
        filterParams: {}, 
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);  

//   ❌ Tum kya soch rahe ho:

// “jab bhi dispatch hoga ye chalega”

// 👉 ❌ Ye galat hai
// “Agar dispatch function change hota hai tab effect run hoga”

// 🔥 BUT reality kya hai?

// 👉 Redux ka dispatch kabhi change hi nahi hota (stable hota hai)

// 👉 Isliye practically:

// Ye effect sirf ek baar run hota hai (mount pe)

// 🔹 To fir [dispatch] likhte kyun hain?

// 👉 2 reasons:

// 1. ESLint rule (important)

// React bolta hai:

// “Jo bhi use ho raha hai effect me, dependency me daalo”

  useEffect(() => {  // // jaise hi home page pr aaege sare images dikhne lgege
    dispatch(getFeatureImages());
  }, [dispatch]);


  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // delay between children
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -50 }, // start off-screen left
    show: { opacity: 1, x: 0 },     // fade in + slide to place
  };


  return (

    <div className="flex flex-col min-h-screen overflow-x-hidden">

      <div className="relative w-full overflow-hidden">
        <video
          src={img}
          className="w-full h-auto object-cover md:w-full md:h-auto"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      
        {/* Gradient overlay (fade bottom into white) */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
      </div>
                
      <section className="py-6 md:py-10 bg-white">
        <div className="container mx-auto px-3 md:px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
            Shop by Category
          </h2>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 md:gap-0"
            variants={container}
            initial="hidden"
            whileInView="show" // animate only when in view
            viewport={{ once: true, amount: 0.2 }} // trigger when 20% of section is visible
          >
            {categoriesWithIcon.map((categoryItem) => (
              <motion.div key={categoryItem.id} variants={item}>
                <div className="flex flex-col items-center">
                  <Card
                    onClick={() =>
                      handleNavigateToListingPage(categoryItem, "category")
                    }
                    className="cursor-pointer hover:shadow-lg transition-shadow 
                              rounded-2xl bg-amber-50/40 flex items-center justify-center 
                              border border-pink-200 w-[145px] h-[145px] md:w-[175px] md:h-[175px]"
                  >
                    <CardContent className="flex items-center justify-center p-2 md:p-4">
                      {categoryItem.image ? (
                        <img
                          src={categoryItem.image}
                          alt={categoryItem.label}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <categoryItem.icon className="w-20 h-20 text-slate-600" />
                      )}
                    </CardContent>
                  </Card>

                  <span className="text-gray-500 font-medium mt-3 text-base md:text-lg text-center">
                    {categoryItem.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-2 md:py-0 bg-white">
        <div className="container mx-auto px-3 md:px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
            Shop by Hall Mark
          </h2>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"   // animate only when visible
            viewport={{ once: true, amount: 0.2 }} // trigger when 20% visible
          >
            {caratsWithIcon.map((caratItem) => (  // variants = {item}  mtlb har ek item pr ye animation apply hoga
              <motion.div key={caratItem.id} variants={item}>
                <div className="flex flex-col items-center">
                  <Card
                    onClick={() =>
                      handleNavigateToListingPage(caratItem, "carat")
                    }
                    className="cursor-pointer hover:shadow-lg transition-shadow 
                              rounded-2xl bg-amber-50/40 flex items-center justify-center border border-pink-200
                              w-[150px] h-[150px] md:w-[250px] md:h-[150px]"
                  >
                    <CardContent className="flex items-center justify-center p-2 md:p-4">
                      {caratItem.image ? (
                        <img
                          src={caratItem.image}
                          alt={caratItem.label}
                          className="w-24 h-24 object-contain"
                        />
                      ) : (
                        <caratItem.icon className="w-20 h-20 mt-3 text-slate-500" />
                      )}
                    </CardContent>
                  </Card>

                  {/* label outside card */}
                  <span className="text-gray-500 font-medium mt-3 text-lg md:text-xl">
                    {caratItem.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      <div>
        {/* Other sections */}
        <Rate />
        {/* Footer, etc. */}
      </div>


      <div className="relative mt-8 md:mt-12 w-full aspect-[16/7] md:aspect-auto md:h-[530px] overflow-hidden">

        {featureImageList && featureImageList.length > 0
        ? featureImageList.map((slide, index) => {
            const isVideo = slide?.image?.match(/\.(mp4|webm|ogg)$/i);

            return isVideo ? (
              <video
                key={index}
               // src={slide?.image}
               src={slide?.image?.replace(/^http:\/\//i, "https://")}
               className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 border-4 border-white rounded-3xl shadow-lg p-1 md:px-2 md:py-2`}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            ) : (
              <img
                key={index}
                src={slide?.image}
                alt={`slide-${index}`}
         className={`${
  index === currentSlide ? "opacity-100" : "opacity-0"
} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 border-4 border-white rounded-3xl shadow-lg p-1 md:px-2 md:py-2`}     
              />
            );
          })
        : null} 

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(  // from this logic go to back
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )// 👉 What happens here:

//(prevSlide - 1) → goes one step back.
//But if prevSlide is 0, then (0 - 1 = -1) → negative ❌
// So we add + featureImageList.length → makes it positive again.
// % featureImageList.length → makes sure it stays within the valid range (0 to length-1).
// ✅ Example:
// prevSlide = 0
// (0 - 1 + 5) % 5 = (4) % 5 = 4
// So it wraps around to the last image.
// That’s why it’s the Back button.
          }
          className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-white/80 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md cursor-pointer"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>

        <Button 
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(  // form this logic it will go forward
              (prevSlide) => (prevSlide + 1) % featureImageList.length
         ) //👉 What happens here:

// (prevSlide + 1) → goes one step forward.
// % featureImageList.length → if we go past the last image, wrap back to 0.
// ✅ Example:
// prevSlide = 4, featureImageList.length = 5
// (4 + 1) % 5 = 5 % 5 = 0
// So it loops back to the first image.
// That’s why it’s the Next button.
          }
          className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-white/80 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full shadow-md cursor-pointer"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div> 


    <section className="py-2 md:py-8 mt-4 md:mt-10 bg-white">
  <div className="w-full">
<div className="flex flex-nowrap gap-3 md:gap-1 overflow-x-auto scrollbar px-3 md:px-0 pb-0 md:pb-4">      {videoWithIcon.map((videoItem) => (
        <div
          key={videoItem.id}
          className="flex flex-col items-center flex-shrink-0"
        >
          <Card
            onClick={() =>
              handleNavigateToListingPage(videoItem, "carat")
            }
            className="cursor-pointer hover:shadow-lg transition-shadow 
                      rounded-lg bg-amber-50/40 flex items-center justify-center 
                      border border-pink-200 
                      w-[43vw] h-[280px] 
                      md:w-[250px] md:h-[400px] 
                      overflow-hidden"
          >
            {/* ✅ CardContent must stretch full */}
            <CardContent className="w-full h-full p-0">
              {videoItem.video ? (
                <video
                  src={videoItem.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : videoItem.image ? (
                <img
                  src={videoItem.image}
                  alt={videoItem.label}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-slate-500">No media</span>
              )}
            </CardContent>
          </Card>

          <span className="text-gray-500 font-medium mt-3 text-lg md:text-xl">
            {videoItem.label}
          </span>
        </div>
      ))}
    </div>
  </div>
</section>


   <div className="relative w-full h-auto mt-4 md:h-[170px] md:mt-4 overflow-hidden">
  <img
    src={of}
    className="w-full h-auto mt-0 md:h-full md:mt-8 object-center"
    alt="Gold Mine"
  />
</div>


      <section className="py-8 md:py-10 bg-white">
        <h2 className="text-2xl md:text-2xl font-bold text-center mb-6">
          Editorial
        </h2>

        <div
          className="w-full mx-auto grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-5 px-4 md:px-0">

          {/* Big Item 1 */}
          <div className="col-span-2 md:col-span-3 md:row-span-2 md:ml-5 rounded-xl overflow-hidden">
            <div className="relative w-full aspect-[4/3] md:aspect-auto md:pb-[84%] rounded-xl overflow-hidden"> 
              {/* 56.25% = 16:9 aspect ratio, adjust if your video has different ratio */}
              <video 
                src={blue} 
                autoPlay
                loop
                playsInline
                controls
                muted
                className="absolute top-0 left-0 w-full h-full object-cover md:object-fill rounded-xl"
              />
            </div>
          </div>
              
          <div
            className="col-span-2 md:col-span-3 grid grid-cols-3 gap-3 md:gap-5"  >
                        
            <div className="rounded-xl h-[220px] md:h-[300px] ">
              <img src={p1} 
              className="w-full h-full object-cover rounded-xl transition-transform duration-1000 hover:scale-110"  />
            </div>

            <div className="rounded-xl h-[220px] md:h-auto">
              <img src={p7} 
              className="w-full h-full object-cover rounded-xl transition-transform duration-1000 hover:scale-110"  />
            </div>

            <div className="rounded-xl mr-0 md:mr-3 h-[220px] md:h-auto">
              <img src={p3} 
              className="w-full h-full object-cover rounded-xl transition-transform duration-1000 hover:scale-110"  />
            </div>

            <div className="rounded-xl h-[220px] md:h-[300px]">
              <img src={p4} 
              className="w-full h-full object-cover rounded-xl transition-transform duration-1000 hover:scale-110"  />
            </div>

            <div className="rounded-xl h-[220px] md:h-auto">
              <img src={p5} 
              className="w-full h-full object-cover rounded-xl transition-transform duration-1000 hover:scale-110"  />
            </div>

            <div className="rounded-xl mr-0 md:mr-3 h-[220px] md:h-auto">
              <img src={p6} 
              className="w-full h-full object-cover rounded-xl transition-transform duration-1000 hover:scale-110"  />
            </div>

          </div>
        </div>
      </section>


      <RecommendedProducts
        handleGetProductDetails={handleGetProductDetails}
        handleAddtoCart={handleAddtoCart}
      />


      <section className="py-1 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mt-6 mb-6 md:mb-8">
            Feature Products
          </h2>

<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
  key={productItem._id || productItem.id}
  handleGetProductDetails={handleGetProductDetails}
  product={productItem}
  handleAddtoCart={handleAddtoCart}
  mobileCompact={true}
/>
                ))
              : null}
          </div>
        </div>
      </section>


      <div className="relative w-full h-auto mt-4 md:h-[460px] md:mt-0 overflow-hidden">
  <img
    src={imgg}
    className="w-full h-auto md:h-full md:w-full md:mt-8 object-contain md:object-center"
    alt="Kridha Store"
  />
</div>


      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
          

      <AIJewelryAssistant />

      <div>
        <Footer />
      </div>

    </div>
  );
}

export default ShoppingHome;