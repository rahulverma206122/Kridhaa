import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) { //Object.entries(filterParams) — turns the filterParams object into [key, value] pairs.
    if (Array.isArray(value) && value.length > 0) {  // Keys with empty arrays, null, undefined, or non-array values are skipped.
      const paramValue = value.join(",");  // Joins the array items into a single string separated by commas.

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);  // Encodes the joined string for safe use in a URL. Important: encodeURIComponent("nike,adidas") will turn the comma into %2C, so the final encoded value becomes "nike%2Cadidas".
    }//Adds a key=encodedValue string to the queryParams array 
  }  

  return queryParams.join("&"); // Joins all key=value entries with & to create a query-string body like:
}  //  "brand=nike%2Cadidas&color=red%2Cblue"

function ShoppingListing() {
  const dispatch = useDispatch();  // use bcz store se kuch lana h 
  const { productList, productDetails } = useSelector((state) => state.shopProducts); // shpproductslice ka nam store me shopproduct h and hum isse productlist and productdetails le rhe h from store
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});  // filter functionality
  const [sort, setSort] = useState(null); // sort functionality
  const [searchParams, setSearchParams] = useSearchParams(); // comes from React Router v6 (react-router-dom).
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {  // getSectionId and getCurrentOption are just parameter names. They are names you (or the code’s author) chose to receive values when the function is called. You can give them any name you want — they’re just placeholders (parameters). When you call this function, you must pass actual values.
    let cpyFilters = { ...filters }; // see this in notes
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId); // Checks whether getSectionId (e.g. "brand") exists as a key in filters. Returns -1 if not found.

    if (indexOfCurrentSection === -1) {  // mtlb abhi tk koi filter checked nhi kiya h 
      cpyFilters = { // If the section/key doesn't exist yet, it adds a new entry where the value is an array with the clicked option: { ... , [getSectionId]: [getCurrentOption] }.
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption = // If the section exists, it finds indexOfCurrentOption inside the section array.
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1) // Toggle behavior: if option not present → add it; if present → remove it.
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1); // splice is use to remove
    }

    setFilters(cpyFilters); // Updates React state with the (shallow-copied) object.
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));  // see in notes
  }

  function handleGetProductDetails(getCurrentProductId) { 
    dispatch(fetchProductDetails(getCurrentProductId)); // fetchProductDetails productslice me h
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

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

    dispatch(
      addToCart({
        userId: user?.id, // user ko upar import kiya h auth se
        productId: getCurrentProductId, // ye teno isliye liye h kyu ki ye addtocart me use hui h cartslice ke
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
    setSort("price-lowtohigh"); // page load hone pr price low to high ho jaega apne aap
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {}); // page load pr jo filter phle se checked tha wahi ajega 
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {  // It runs code after render whenever the dependency array ([filters]) changes.Here it means: "Whenever filters state changes → run this effect."
      const createQueryString = createSearchParamsHelper(filters); // createQueryString becomes:"brand=Nike%2CAdidas&category=Shoes"
      setSearchParams(new URLSearchParams(createQueryString)); // It updates the URL query string in the browser without reloading the page.
    }  //URLSearchParams: It’s a built-in JavaScript Web API class that helps you work with URL query strings (the part after ? in a URL).
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }) // fetchAllFilteredProducts is a Redux Thunk/async action that fetches products from backend API. it sends:  selected filters (brand, category, etc.) sorting option (price low→high, etc.)
      );
  }, [dispatch, sort, filters]);  // So whenever:
//filters changes
//OR sort changes
//OR dispatch (which is stable, but still included for good practice)
//The effect will run.

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter} /> {/* product filter is from filter.jsx */}
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"  // h-9 px-3 rounded-md
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (  // sort option is from config file 
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile // ye shop ke product.tile se aaya h jo product card ko dikhata h  
                  handleGetProductDetails={handleGetProductDetails}  // ye sare shopingproducttile ke props h 
                  product={productItem} // ye functions hmne yhi bnai h or as a prop waha(shopingproducttile) pass kiye h,  handleGetProductDetails, product, handleAddtoCart are called props (properties). You are passing props into the ShoppingProductTile component.
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            : null}
        </div>
      </div>
      <ProductDetailsDialog  // take this from productdatail.jsx
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;
