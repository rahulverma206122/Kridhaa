// ========================================
// AI Visual Jewelry Search
// ========================================
// Now a standalone page (accessed via the camera icon in the header,
// Myntra-style) instead of a section embedded in the Home page.
//
// Flow:
//
// User selects/drags/photographs an image
//        ↓
// Image preview
//        ↓
// Click "Find Similar Jewelry"
//        ↓
// Send image to backend
//        ↓
// Backend processes image using AI
//        ↓
// Similar products returned in a horizontal scrollable row
//        ↓
// Click a result → opens ProductDetailsDialog (own local state,
// does NOT touch global Redux productDetails — avoids the
// double-dialog bug that ShoppingHome's own dialog would cause)
// ========================================

import { useRef, useState } from "react";
import {
  Upload,
  X,
  Search,
  Sparkles,
  Loader2,
  ImageOff,
  Camera,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
  searchVisualJewelry,
  clearVisualSearch,
} from "@/store/shop/visual-search-slice";

import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";

function VisualSearch() {
  const dispatch = useDispatch();
  const { toast } = useToast();

  const fileInputRef = useRef(null); // gallery / drag-drop picker
  const cameraInputRef = useRef(null); // NEW: dedicated camera-capture input for mobile
  const scrollRef = useRef(null); // NEW: for the horizontal results carousel

  // ========================================
  // Local State
  // ========================================

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // This component's OWN product-details dialog state — deliberately NOT
  // tied to global Redux `productDetails`, same pattern as AIJewelryAssistant,
  // so it never fights another page's dialog.
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  const {
    isLoading,
    products,
    error,
  } = useSelector((state) => state.visualSearch);

  // ========================================
  // Shared file-handling logic (file picker,
  // camera capture, AND drag-and-drop all use this)
  // ========================================

  function processFile(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Image size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    dispatch(clearVisualSearch());
  }

  function handleImageChange(event) {
    processFile(event.target.files?.[0]);
  }

  // NEW: same handler works for the camera input too — file shape is identical
  function handleCameraCapture(event) {
    processFile(event.target.files?.[0]);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setIsDraggingOver(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    setIsDraggingOver(false);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDraggingOver(false);
    processFile(event.dataTransfer.files?.[0]);
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  // NEW: opens the device camera directly (on mobile). On desktop, browsers
  // without a camera just fall back to the regular file picker.
  function handleTakePhotoClick() {
    cameraInputRef.current?.click();
  }

  function handleRemoveImage() {
    setSelectedImage(null);
    setPreviewUrl("");
    dispatch(clearVisualSearch());

    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  }

  function handleVisualSearch() {
    if (!selectedImage) {
      toast({
        title: "Please upload a jewelry image first",
        variant: "destructive",
      });
      return;
    }

    dispatch(searchVisualJewelry(selectedImage));
  }

  async function handleGetProductDetails(productId) {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/products/get/${productId}`
      );
      setSelectedProductDetails(result?.data?.data);
      setOpenDetailsDialog(true);
    } catch (err) {
      console.error("Error fetching product details:", err);
      toast({
        title: "Could not load product details",
        variant: "destructive",
      });
    }
  }

  function handleAddtoCart(productId, totalStock) {
    const getCartItems = cartItems?.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === productId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > totalStock) {
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
        userId: user?.id,
        productId,
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

  // NEW: scroll the results row left/right by roughly one card-width's worth
  function scrollResults(direction) {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.9;
    scrollRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }

  // ========================================
  // UI
  // ========================================

  return (
    <section className="w-full py-10 bg-gradient-to-b from-cyan-50/40 to-white min-h-screen">

      {/* Heading */}
      <div className="text-center mb-8 px-4">
        <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full bg-cyan-800/10 text-cyan-800">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-wide uppercase">
            Powered by Gemini AI
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Visual Jewelry Search
        </h1>

        <p className="text-gray-500 max-w-md mx-auto text-sm">
          Upload or snap a photo of any jewelry piece — our AI finds
          visually similar items from our collection.
        </p>
      </div>

      {/* ========================================
          Upload Area — NEW: significantly smaller and more compact
          than before, with two clear actions (gallery / camera) instead
          of one large dashed box.
      ======================================== */}

      <div className="max-w-md mx-auto px-4">

        {!previewUrl ? (

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border rounded-xl p-6 text-center transition-colors duration-200 bg-white
              ${isDraggingOver ? "border-cyan-800 bg-cyan-50" : "border-gray-200"}
            `}
          >
            <div className="w-12 h-12 rounded-full bg-cyan-800/10 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-5 h-5 text-cyan-800" />
            </div>

            <p className="text-sm font-medium mb-1">
              {isDraggingOver ? "Drop your image here" : "Drag & drop an image"}
            </p>
            <p className="text-xs text-gray-400 mb-4">JPG, PNG • Max 5MB</p>

            {/* NEW: two compact action buttons instead of one big "Choose Image" button */}
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={handleUploadClick}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border
                border-cyan-800 text-cyan-800 text-sm font-medium hover:bg-cyan-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>

              {/* NEW: Take Photo — opens device camera directly on mobile */}
              <button
                type="button"
                onClick={handleTakePhotoClick}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-cyan-800
                text-white text-sm font-medium hover:bg-cyan-700 transition-colors"
              >
                <Camera className="w-4 h-4" />
                Take Photo
              </button>
            </div>
          </div>

        ) : (

          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Selected jewelry"
                className="w-full max-h-64 object-contain rounded-lg bg-gray-50"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/80
                text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-2 text-center truncate">
              {selectedImage?.name}
            </p>

            <button
              type="button"
              onClick={handleVisualSearch}
              disabled={isLoading}
              className="w-full mt-3 py-2.5 rounded-full bg-cyan-800 text-white text-sm font-medium
              flex items-center justify-center gap-2 hover:bg-cyan-700 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing image...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Find Similar Jewelry
                </>
              )}
            </button>
          </div>

        )}

        {/* Hidden gallery/drag-drop file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />

        {/* NEW: hidden camera-capture input — `capture="environment"` opens
            the rear camera directly on mobile devices. Falls back to the
            normal file picker on desktop where there's no camera API support. */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-md mx-auto mt-4 px-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-red-600 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && previewUrl && products.length === 0 && (
        <div className="max-w-md mx-auto mt-6 px-4 text-center text-gray-400">
          <ImageOff className="w-6 h-6 mx-auto mb-2" />
          <p className="text-sm">
            No similar products found — try a clearer photo or a different angle.
          </p>
        </div>
      )}

      {/* ========================================
          Search Results — NEW: horizontal scrollable row instead of a
          static grid. ~4 cards visible at once, scroll/swipe for the rest.
          No more "% match" badges.
      ======================================== */}
      {products?.length > 0 && (

        <div className="max-w-7xl mx-auto mt-10 px-4">

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Similar Jewelry ✨</h2>
              <p className="text-xs text-gray-500">
                {products.length} visually similar {products.length === 1 ? "piece" : "pieces"} found
              </p>
            </div>

            {/* NEW: scroll arrows, same visual pattern as the hero slider's arrows */}
            <div className="hidden sm:flex gap-2">
              <button
                type="button"
                onClick={() => scrollResults("left")}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center
                justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollResults("right")}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center
                justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory
            scrollbar-hide [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-200
            [&::-webkit-scrollbar-thumb]:rounded-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* NEW: same width/compact pattern as RecommendedProducts.jsx, so
                these cards match that section's size instead of being tall
                full-size tiles */}
            {products.map((product) => (
              <div
                key={product._id}
                className="flex-none w-[calc((100%-120px)/5)] snap-start
                max-lg:w-[calc((100%-80px)/4)] max-md:w-[calc((100%-24px)/2)] max-sm:w-full"
              >
                <ShoppingProductTile
                  product={product}
                  handleGetProductDetails={handleGetProductDetails}
                  handleAddtoCart={handleAddtoCart}
                  compact={true}
                />
              </div>
            ))}
          </div>

        </div>

      )}

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={selectedProductDetails}
      />

    </section>
  );
}

export default VisualSearch;