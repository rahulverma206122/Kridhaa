import { House, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser, resetTokenAndCredentials } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import logo from "../../assets/kridha.png";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");   // 1. Clear old filters
    const currentFilter =   // 2. Prepare a new filter (only if menu item is not "home/products/search")
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));  // se notes for home.jsx
    {/* If user is already on listing page and you have a filter → update query string (so page updates without redirect)
        Example: ?category=men.
        Else → just navigate to the menu’s path (navigate(getCurrentMenuItem.path)). */}
    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => ( // {/* this comes from config ke andar index.js */}
        <Label
          onClick={() => handleNavigate(menuItem)}
          className=" font-medium text-base cursor-pointer transition-transform duration-200 hover:scale-125 hover:text-red-400"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth); // useSelector is a React-Redux hook that lets you read data from the Redux store.(state) => state.auth → We are accessing the auth slice of the Redux state.{ user } → We extract the user property from that slice.
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    //dispatch(logoutUser());  // logoutuser hmne store me auth me bna rkha h 
   dispatch(resetTokenAndCredentials());
   sessionStorage.clear();
   navigate("/auth/login");
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  
  return (

    <div className="flex lg:items-center lg:flex-row flex-col gap-7">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline" // variant="outline" gives the button an outlined style, making it visually distinct and suitable for secondary actions.
          size="icon"
          className="relative transition-transform duration-100 hover:scale-125"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span> {/*On the screen, "User cart" won’t be visible. Screen readers (for blind/low-vision users) will still read “User cart”. */}
        </Button>
        <UserCartWrapper //  come from cartwrapper.jsx
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black transition-transform duration-100 hover:scale-125">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}






function ShoppingHeader() {
  // const { isAuthenticated } = useSelector((state) => state.auth);

  // const [isScrolled, setIsScrolled] = useState(false);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 50);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  // <header  replace this with header after return 
  //     className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
  //       isScrolled
  //         ? "bg-white/40 backdrop-blur-md shadow-md"
  //         : "bg-white shadow-none"
  //     }`}
  //   > 

  return (

    <header className= "fixed top-0 left-0 w-full z-50 border-b bg-background">
    
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <img
           className="h-[62px] w-[250px] rounded-full transition-transform duration-100 hover:scale-75"
           src={logo} />
          {/* <span className="font-bold  text-xl">Kridha Jewellers</span> */}
        </Link>
        <Sheet> {/* this sheet works for mobile smaller devices */}
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" /> {/* hemburger menu */}
              <span className="sr-only">Toggle header menu</span> 
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block"> {/* hidden → hides the element (display: none) on all screen sizes by default. lg:block → when the screen size is large (≥1024px) or bigger, the element will be displayed as block. */}
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
