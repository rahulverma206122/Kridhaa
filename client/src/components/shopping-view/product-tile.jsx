import { Card, CardContent, CardFooter } from "../ui/card";  // ui ke andar card se humne card component ko import kiya hai, jisme Card, CardContent, CardFooter hote hain. Ye components humare product tile ke layout ko structure karne me madad karenge. Card component ek container hai jo poore product tile ko wrap karega, CardContent me hum product ki details jaise title, category, carat, price wagairah dikhayenge, aur CardFooter me hum add to cart button rakhenge. Is tarah se hum apne product tile ko visually appealing aur organized bana sakte hain.
import { Button } from "../ui/button";
import { caratOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";  // badge component ko humne import kiya hai, jise hum product image ke upar overlay ke roop me use karenge. Ye badge hume product ki stock status ya sale status dikhane me madad karega. Jaise ki agar product out of stock hai to hum "Out Of Stock" badge dikhayenge, agar stock kam hai to "Only X items left" badge dikhayenge, aur agar product sale par hai to "Sale" badge dikhayenge. Is tarah se badge component se hum apne product tile ko aur informative aur attractive bana sakte hain.

// ye wala shop view me card ko dikhaege 
function ShoppingProductTile({
  product,//  These are called function parameters (props destructuring).
  handleGetProductDetails,// You’re saying: "From all the props passed, I only want these three: product, handleGetProductDetails, handleAddtoCart."
  handleAddtoCart,
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

👉 ❤️ chala jayega:
➡️ poore page ke top-right 😵 */}
          
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-400 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-400 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-400 hover:bg-red-600">
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


        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {caratOptionsMap[product?.carat]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ₹{product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                ₹{product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)} //handleAddtoCart kahin na kahin defined hoga hi, warna code run hi nahi karega.
            className="bg-cyan-800 hover:bg-cyan-700 text-white font-semibold text-base px-6 py-2 rounded-lg shadow-md transition-colors w-full"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;