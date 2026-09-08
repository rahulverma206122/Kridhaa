import { Card, CardContent, CardFooter } from "../ui/card";  // ui ke andar card se humne card component ko import kiya hai, jisme Card, CardContent, CardFooter hote hain. Ye components humare product tile ke layout ko structure karne me madad karenge. Card component ek container hai jo poore product tile ko wrap karega, CardContent me hum product ki details jaise title, category, carat, price wagairah dikhayenge, aur CardFooter me hum add to cart button rakhenge. Is tarah se hum apne product tile ko visually appealing aur organized bana sakte hain. 
import { Button } from "../ui/button"; 
import { caratOptionsMap, categoryOptionsMap } from "@/config"; 
import { Badge } from "../ui/badge";  // badge component ko humne import kiya hai, jise hum product image ke upar overlay ke roop me use karenge. Ye badge hume product ki stock status ya sale status dikhane me madad karega. Jaise ki agar product out of stock hai to hum "Out Of Stock" badge dikhayenge, agar stock kam hai to "Only X items left" badge dikhayenge, aur agar product sale par hai to "Sale" badge dikhayenge. Is tarah se badge component se hum apne product tile ko aur informative aur attractive bana sakte hain. 
 
// ye wala shop view me card ko dikhaege  
function ShoppingProductTile({ 
  product,//  These are called function parameters (props destructuring). 
  handleGetProductDetails,// You’re saying: "From all the props passed, I only want these three: product, handleGetProductDetails, handleAddtoCart." 
  handleAddtoCart, 
  compact = false,
  mobileCompact = false,
}) { 
  return ( 
    <Card className="w-full max-w-sm mx-auto"> 
      <div onClick={() => handleGetProductDetails(product?._id)}> {/* mtlb card me khi pr bhi click kroge to productdetails aajaegi and ye function listing.jsx me h  */} 
        <div className="relative">  {/* relative → does NOT move the element “Any absolute child will position itself inside me, not the whole page”  The image will go to top-right of the entire screen ❌*/} 
           
          {/* 🔥 Simple Example 
<div className="relative"> 
  <div className="absolute top-0 right-0">❤️</div> 
</div> 
 
👉 Yahan: 
Parent = relative 
Child = absolute 
 
💡 Result: 
👉 ❤️ icon parent ke top-right corner me aayega 
 
🤯 Agar relative na ho: 
<div> 
  <div className="absolute top-0 right-0">❤️</div> 
</div> 
 
👉 Yahan: 
Parent = relative 
Child = absolute 
 
💡 Result: 
👉 ❤️ chala jayega: 
➡️ poore page ke top-right 😵 */} 
           
          <img 
            //src={product?.image}
            src={product?.image?.replace(/^http:\/\//i, "https://")} 
            alt={product?.title} 
            className={`w-full object-cover ${
              compact 
                ? "h-[115px] sm:h-[140px] md:h-[190px]" 
                : mobileCompact
                  ? "h-[170px] sm:h-[200px] md:h-[300px]"
                  : "h-[300px]" 
            }`} 
          /> 

          {product?.totalStock === 0 ? ( 
            <Badge
  className="hidden md:block absolute top-2 left-2 bg-red-400 hover:bg-red-600 text-xs md:text-sm"
>
  Out Of Stock
</Badge>
          ) : product?.totalStock < 10 ? ( 
            <Badge className="hidden md:block absolute top-2 left-2 bg-red-400 hover:bg-red-600 text-xs md:text-sm"> 
              {`Only ${product?.totalStock} items left`} 
            </Badge> 
          ) : product?.salePrice > 0 ? ( 
            <Badge className="absolute top-2 left-2 bg-red-400 hover:bg-red-600 text-xs md:text-sm"> 
              Sale 
            </Badge> 
          ) : null}

        </div> 
 
{/* Start 
  ↓ 
Stock === 0 ? 
  → YES → "Out Of Stock" ❌ END 
 
  ↓ NO 
Stock < 10 ? 
  → YES → "Only X left" ❌ END 
 
  ↓ NO 
SalePrice > 0 ? 
  → YES → "Sale" ❌ END 
 
  ↓ NO 
Show Nothing */} 
 
 
        <CardContent
          className={`${
            compact
              ? "p-2 md:p-4"
              : mobileCompact
                ? "p-2 md:p-4"
                : "p-4"
          }`}
        > 
          <h2 
            className={`font-bold mb-2 ${
              compact 
                ? "text-sm sm:text-base md:text-base line-clamp-2" 
                : mobileCompact
                  ? "text-sm sm:text-base md:text-xl line-clamp-2"
                  : "text-xl" 
            }`} 
          > 
            {product?.title} 
          </h2> 
 
          <div className="flex justify-between items-center mb-2 gap-1"> 
            <span 
              className={`text-muted-foreground truncate ${
                compact 
                  ? "text-xs sm:text-sm md:text-sm" 
                  : mobileCompact
                    ? "text-xs sm:text-sm md:text-[16px]"
                    : "text-[16px]" 
              }`} 
            > 
              {categoryOptionsMap[product?.category]} 
            </span> 
 
            <span 
              className={`text-muted-foreground whitespace-nowrap ${
                compact 
                  ? "text-xs sm:text-sm md:text-sm" 
                  : mobileCompact
                    ? "text-xs sm:text-sm md:text-[16px]"
                    : "text-[16px]" 
              }`} 
            > 
              {caratOptionsMap[product?.carat]} 
            </span> 
          </div> 
 
          <div className="flex justify-between items-center mb-1 md:mb-2 gap-1"> 
            <span 
              className={`${
                product?.salePrice > 0 ? "line-through" : "" 
              } font-semibold text-primary ${
                compact 
                  ? "text-sm sm:text-base md:text-base" 
                  : mobileCompact
                    ? "text-sm sm:text-base md:text-lg"
                    : "text-lg" 
              }`} 
            > 
              ₹{product?.price} 
            </span> 
 
            {product?.salePrice > 0 ? ( 
              <span 
                className={`font-semibold text-primary ${
                  compact 
                    ? "text-sm sm:text-base md:text-base" 
                    : mobileCompact
                      ? "text-sm sm:text-base md:text-lg"
                      : "text-lg" 
                }`} 
              > 
                ₹{product?.salePrice} 
              </span> 
            ) : null} 
          </div> 
        </CardContent> 
      </div> 
 
      <CardFooter
        className={`${
          compact || mobileCompact
            ? "p-2 pt-0 md:p-4"
            : ""
        }`}
      > 
        {product?.totalStock === 0 ? ( 
          <Button className="w-full opacity-60 cursor-not-allowed"> 
            Out Of Stock 
          </Button> 
        ) : ( 
          <Button 
            onClick={() => 
              handleAddtoCart( 
                product?._id, 
                product?.totalStock,
                product // 🔥 Complete product data guest cart ke liye pass kar rahe hain
              ) 
            } //handleAddtoCart kahin na kahin defined hoga hi, warna code run hi nahi karega. 
            className={`bg-cyan-800 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-md transition-colors w-full ${
              compact
                ? "text-xs sm:text-sm md:text-base px-2 py-1.5 md:px-6 md:py-2"
                : mobileCompact
                  ? "text-xs sm:text-sm md:text-base px-2 py-1.5 md:px-6 md:py-2"
                  : "text-base px-6 py-2"
            }`} 
          > 
            Add to cart 
          </Button> 
        )} 
      </CardFooter> 
    </Card> 
  ); 
} 
 
export default ShoppingProductTile;