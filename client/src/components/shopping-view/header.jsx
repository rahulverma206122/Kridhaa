import {
  House,
  LogOut,
  Menu,
  ShoppingCart,
  UserCog,
  Camera,
  UserRound,
} from "lucide-react";
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
import { resetTokenAndCredentials } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import {
  fetchCartItems,
  syncGuestCart,
} from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import logo from "../../assets/kridha.png";

function MenuItems({ closeMobileSheet }) {
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

    sessionStorage.setItem(
      "filters",
      JSON.stringify(currentFilter)
    );  // se notes for home.jsx

    {/* If user is already on listing page and you have a filter → update query string (so page updates without redirect)
        Example: ?category=men.
        Else → just navigate to the menu’s path (navigate(getCurrentMenuItem.path)). */}

    // 🔥 Mobile menu close before navigation
    if (closeMobileSheet) {
      closeMobileSheet();
    }

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => ( // {/* this comes from config ke andar index.js */}
        // NEW: wrapped each item in a flex container so the camera icon can
        // sit directly next to the "Search" label specifically, instead of
        // living on the opposite side of the header near the cart.
        <div key={menuItem.id} className="flex items-center gap-2">
          <Label
            onClick={() => handleNavigate(menuItem)}
            className="font-medium text-base cursor-pointer transition-transform duration-200 hover:scale-125 hover:text-red-400"
          >
            {menuItem.label}
          </Label>

          {/* NEW: AI Visual Search camera icon — placed right after "Search"
              specifically, per request, rather than near the cart/profile. */}
          {menuItem.id === "search" && (
            <button
              type="button"
              onClick={() => {
                // 🔥 Close mobile menu before opening visual search
                if (closeMobileSheet) {
                  closeMobileSheet();
                }

                navigate("/shop/visual-search");
              }}
              className="w-8 h-8 rounded-full border flex items-center justify-center
              hover:bg-gray-100 hover:scale-125 transition-all ml-3"
            >
              <Camera className="w-6 h-6" />
              <span className="sr-only">AI Visual Search</span>
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}

function HeaderRightContent({
  closeMobileSheet,
  openCartSheet,
  setOpenCartSheet,
}) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    // 🔥 Close mobile menu first
    if (closeMobileSheet) {
      closeMobileSheet();
    }

    dispatch(resetTokenAndCredentials());
    sessionStorage.clear();
    navigate("/shop/home");
  }

  // function handleCartClick() {
  //   // 🔥 IMPORTANT:
  //   // Do NOT close mobile menu here.
  //   //
  //   // Earlier we were doing:
  //   // closeMobileSheet();
  //   // setOpenCartSheet(true);
  //   //
  //   // That caused HeaderRightContent to unmount and
  //   // the cart sheet state to reset immediately.
  //   setOpenCartSheet(true);
  // }


  function handleCartClick() {
  // 🔥 First close the mobile header sheet
  if (closeMobileSheet) {
    closeMobileSheet();
  }

  // 🔥 Then open the cart sheet
  setOpenCartSheet(true);
}

  function handleAccountClick() {
    // 🔥 Close mobile menu before navigating to account
    if (closeMobileSheet) {
      closeMobileSheet();
    }

    navigate("/shop/account");
  }

  function handleLoginClick() {
    // 🔥 Close mobile menu before navigating to login
    if (closeMobileSheet) {
      closeMobileSheet();
    }

    navigate("/auth/login");
  }

  useEffect(() => {
    // 🔥 Guest user ke liye localStorage wala cart load hoga
    if (!isAuthenticated || !user?.id) {
      dispatch(fetchCartItems(null));
      return;
    }

    // 🔥 Login hone ke baad pehle guest cart ko user ke MongoDB cart me sync karenge
    dispatch(syncGuestCart(user.id)).then(() => {
      // 🔥 Sync complete hone ke baad latest user cart fetch karenge
      dispatch(fetchCartItems(user.id));
    });
  }, [dispatch, isAuthenticated, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-7">

      {/* 
        🔥 Cart Sheet is controlled by ShoppingHeader.
        This is important for mobile because the mobile menu
        can close without destroying the cart state.
      */}
      <Button
        onClick={handleCartClick}
        variant="outline"
        size="icon"
        className="relative transition-transform duration-100 hover:scale-110"
      >
        <ShoppingCart className="w-6 h-6" />

        <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
          {cartItems?.items?.length || 0}
        </span>

        <span className="sr-only">
          User cart
        </span>
      </Button>

      {/* 🔥 Logged-in user ko existing black avatar dikhega
          🔥 Guest user ko User/Login icon dikhega */}

      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black transition-transform duration-100 hover:scale-110">
              <AvatarFallback className="bg-black text-white font-extrabold">
                {user?.userName?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="right" className="w-56">
            <DropdownMenuLabel>
              Logged in as {user?.userName}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleAccountClick}>
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
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={handleLoginClick}
          className="rounded-full transition-transform duration-100 hover:scale-110"
        >
          <UserRound className="w-6 h-6" />

          <span className="sr-only">
            Login
          </span>
        </Button>
      )}
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

  // 🔥 Mobile menu state
  const [openMobileSheet, setOpenMobileSheet] = useState(false);

  // 🔥 IMPORTANT:
  // Cart state is kept HERE, outside the mobile Sheet.
  // So closing the mobile menu will NOT close the cart.
  const [openCartSheet, setOpenCartSheet] = useState(false);

  const { cartItems } = useSelector((state) => state.shopCart);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 border-b bg-background">

        <div className="flex h-16 items-center justify-between px-4 md:px-6">

          <Link to="/shop/home" className="flex items-center gap-2">
            <img
              className="h-[62px] w-[250px] rounded-full transition-transform duration-100 hover:scale-75"
              src={logo}
            />

            {/* <span className="font-bold  text-xl">Kridha Jewellers</span> */}
          </Link>


          {/* 🔥 Mobile menu Sheet */}
          <Sheet
            open={openMobileSheet}
            onOpenChange={setOpenMobileSheet}
          >

            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
              >
                <Menu className="h-6 w-6" />
                {/* hemburger menu */}

                <span className="sr-only">
                  Toggle header menu
                </span>
              </Button>
            </SheetTrigger>


            {/* Mobile menu width reduced without affecting desktop header */}
            <SheetContent
              side="left"
              className="w-[50vw] max-w-sm"
            >

              <MenuItems
                closeMobileSheet={() =>
                  setOpenMobileSheet(false)
                }
              />

              <HeaderRightContent
                closeMobileSheet={() =>
                  setOpenMobileSheet(false)
                }
                openCartSheet={openCartSheet}
                setOpenCartSheet={setOpenCartSheet}
              />

            </SheetContent>

          </Sheet>


          <div className="hidden lg:block">
            {/* hidden → hides the element (display: none) on all screen sizes by default. */}

            <MenuItems />
          </div>


          <div className="hidden lg:block">

            <HeaderRightContent
              openCartSheet={openCartSheet}
              setOpenCartSheet={setOpenCartSheet}
            />

          </div>

        </div>

      </header>


      {/* 
        🔥 CART SHEET IS NOW OUTSIDE THE MOBILE MENU SHEET.

        This means:
        Mobile Menu
             ↓
        Click Cart
             ↓
        Cart state stays alive
             ↓
        Cart opens from right
      */}

      <Sheet
        open={openCartSheet}
        onOpenChange={setOpenCartSheet}
      >

        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems &&
            cartItems.items &&
            cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />

      </Sheet>

    </>
  );
}

export default ShoppingHeader;