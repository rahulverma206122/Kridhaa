import { Button } from "@/components/ui/button";
import img from "../../assets/KR.png";
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
  { id: "men", label: "Men", icon: PersonStanding },
  { id: "women", label: "Women", icon: BookHeart  },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Fine Gold and Silver", icon: RectangleVertical },
];

const brandsWithIcon = [
  { id: "nike", label: "18 Kt", icon: BadgeCheck },
  { id: "adidas", label: "20 Kt", icon: BadgeCheck },
  { id: "puma", label: "22 Kt", icon: BadgeCheck },
  { id: "levi", label: "24 Kt", icon: BadgeCheck },
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
      [section]: [getCurrentItem.id], //  Create a new filter object  {"brand":[101]}
    };  // why we use []:It means the key name will be taken from the variable section.jab [] lag jate h to we chez veriable ho jati h agar ye na lage to section hmesa section hi rhega kbhi brand ya catogory nhi bnega
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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">

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
                //muted
                loop
                playsInline
                controls
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
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-2 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Hall Mark</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="relative h-[460px] w-full overflow-hidden">
          <img 
          src={img} 
          className="h-full w-full mt-8 object-center"
          />
      </div>

      <section className="py-12">
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
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
