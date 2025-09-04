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

const categoriesWithIcon = [
  { id: "men", label: "Men", image: men },
  { id: "women", label: "Women", image: women },
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
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");  // first we clear the session storage mtlb jo bhi filter lga ho phle use clear krdo
    const currentFilter = {
      [section]: [getCurrentItem.id], //  Create a new filter object  {"carat":[101]}
    };  // why we use []:It means the key name will be taken from the variable section.jab [] lag jate h to we chez veriable ho jati h agar ye na lage to section hmesa section hi rhega kbhi carat ya catogory nhi bnega
   // [getCurrentItem.id] → can remove [] it rep the array , but only if you don’t need multiple values in that filter.
    sessionStorage.setItem("filters", JSON.stringify(currentFilter)); // Save the new filter object in sessionStorage
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);  // every 5 sec me slide aage bhad jaegi
  // If we leave it like that, even when we leave the page or the images change, that old interval will still keep running in the background.
//This can create extra unwanted timers (multiple slides changing at once) and also waste memory.so we use clearinterval
    return () => clearInterval(timer); // It means: when the component closes or updates, stop the old timer before starting a new one.
  }, [featureImageList]);

  useEffect(() => {  // jaise hi home page pr aaege sare product dikhne lgege
    dispatch(
      fetchAllFilteredProducts({ // initial filter nhi hoga and price low to high aaege
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => { // // jaise hi home page pr aaege sare images dikhne lgege
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

    <div className="flex flex-col min-h-screen">

      <div className="relative w-full overflow-hidden">
                <video
                  src={img}
                  className="w-full h-auto object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
      
                {/* Gradient overlay (fade bottom into white) */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
              </div>
                
          <section className="py-10 bg-white">
                <div className="container mx-auto px-4">
                  <h2 className="text-3xl font-bold text-center mb-8">
                    Shop by Category </h2>

                  <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-0"
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
                                      border border-pink-200 w-[175px] h-[175px]"
                          >
                            <CardContent className="flex items-center justify-center">
                              {categoryItem.image ? (
                                <img
                                  src={categoryItem.image}
                                  alt={categoryItem.label}
                                  className="wfull h-full object-cover"
                                />
                              ) : (
                                <categoryItem.icon className="w-20 h-20 text-slate-600" />
                              )}
                            </CardContent>
                          </Card>
                          <span className="text-gray-500 font-medium mt-3 text-lg">
                            {categoryItem.label}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </section>

          <section className="py-0 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">Shop by Hall Mark</h2>

              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
                variants={container}
                initial="hidden"
                whileInView="show"   // animate only when visible
                viewport={{ once: true, amount: 0.2 }} // trigger when 20% visible
              >
                {caratsWithIcon.map((caratItem) => (
                  <motion.div key={caratItem.id} variants={item}>
                    <div className="flex flex-col items-center">
                      <Card
                        onClick={() => handleNavigateToListingPage(caratItem, "carat")}
                        className="cursor-pointer hover:shadow-lg transition-shadow 
                                  rounded-2xl bg-amber-50/40 flex items-center justify-center border border-pink-200
                                  w-[250px] h-[150px]"
                      >
                        <CardContent className="flex items-center justify-center">
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
                      <span className="text-gray-500 font-medium mt-3 text-xl">
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


      <div className="relative mt-12 w-full h-[530px] overflow-hidden">

        {featureImageList && featureImageList.length > 0
        ? featureImageList.map((slide, index) => {
            const isVideo = slide?.image?.match(/\.(mp4|webm|ogg)$/i);

            return isVideo ? (
              <video
                key={index}
                src={slide?.image}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full xs:object-contain object-cover transition-opacity duration-1000 border-4 border-white rounded-3xl shadow-lg px-2 py-2`}
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
                } absolute top-0 left-0 w-full h-full xs:object-contain transition-opacity duration-1000 border-4 border-white rounded-3xl shadow-lg px-2 py-2`}
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
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 w-10 h-10 flex items-center justify-center rounded-full shadow-md cursor-pointer"
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
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 w-10 h-10 flex items-center justify-center rounded-full shadow-md cursor-pointer"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div> 


            <section className="py-8 mt-10 bg-white">
            <div className="w-full">
              <div className="flex flex-nowrap gap-1 overflow-x-auto scrollbar">
                {videoWithIcon.map((videoItem) => (
                  <div key={videoItem.id} className="flex flex-col items-center flex-shrink-0">
                    <Card
                      onClick={() => handleNavigateToListingPage(videoItem, "carat")}
                      className="cursor-pointer hover:shadow-lg transition-shadow 
                                rounded-lg bg-amber-50/40 flex items-center justify-center 
                                border border-pink-200 w-[250px] h-[400px] overflow-hidden"
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
                    <span className="text-gray-500 font-medium mt-3 text-xl">
                      {videoItem.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>


       <div className="relative h-[170px] mt-4 w-full overflow-hidden">
          <img 
          src={of} 
          className="h-full w-full mt-8 object-center"
          />
      </div>


              <section className="py-10 bg-white">
          <h2 className="text-2xl font-bold  text-center mb-6">Editorial</h2>

          <div
            className="w-[100%] mx-auto grid grid-cols-6 gap-5">

            {/* Big Item 1 */}
            <div className="col-span-3 row-span-2 h-[620px] ml-5 rounded-xl overflow-hidden">
              <img src={p2} 
                className="w-full h-full object-bottom rounded-xl transition-transform duration-1000 hover:scale-110"      
              />
            </div>
              
              <div
              className=" col-span-3 grid grid-cols-3 gap-5"  >
                        
            <div className="rounded-xl h-[300px] ">
              <img src={p1} 
              className="w-full h-full object-cover rounded-xl transition-transform duration-1000 hover:scale-110"  />
            </div>
            <div className="rounded-xl">
              <img src={p7} 
              className="w-full h-full object-cover rounded-xl transition-transform duration-1000 hover:scale-110"  />
            </div>
            <div className=" rounded-xl mr-3">
              <img src={p3} 
              className="w-full h-full object-cover rounded-xl transition-transform duration-1000 hover:scale-110"  />
            </div>
          <div className=" rounded-xl h-[300px]">
              <img src={p4} 
              className="w-full h-full object-cover rounded-xl transition-transform duration-1000 hover:scale-110"  />
            </div>
          <div className=" rounded-xl">
              <img src={p5} 
              className="w-full h-full object-cover rounded-xl transition-transform duration-1000 hover:scale-110"  />
            </div>
            <div className=" rounded-xl mr-3">
              <img src={p6} 
              className="w-full h-full object-cover rounded-xl transition-transform duration-1000 hover:scale-110"  />
            </div>
              </div>
          </div>
        </section>


       <section className="py-1 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mt-6 mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

        <div className="relative h-[460px] w-full overflow-hidden">
          <img 
          src={imgg} 
          className="h-full w-full mt-8 object-center"
          />
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />

          <div>
          <Footer />
          </div>
    </div>
  );
}

export default ShoppingHome;
