import { useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

import { fetchRecommendations } from "@/store/shop/recommendation-slice";

import ShoppingProductTile from "./product-tile";

function RecommendedProducts({
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const dispatch = useDispatch();

  const sliderRef = useRef(null);

  const {
    products,
    isLoading,
  } = useSelector(
    (state) => state.recommendations
  );

  // Fetch recommendations
  useEffect(() => {
    const viewedProducts =
      JSON.parse(
        localStorage.getItem("recentlyViewed")
      ) || [];

    dispatch(
      fetchRecommendations(viewedProducts)
    );
  }, [dispatch]);

  // Slide left
  function handlePrevious() {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  }

  // Slide right
  function handleNext() {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: sliderRef.current.clientWidth,
        behavior: "smooth",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        Finding products you might like...
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-1">

      <div className="container mx-auto px-4">

        {/* Heading */}
        <div className="flex items-center justify-between mb-2">

          <div>
            <h2 className="text-2xl font-bold">
              Recommended For You
            </h2>

            <p className="text-gray-500 mt-1">
              Based on products you've recently viewed
            </p>
          </div>

          {/* Arrows */}
          <div className="flex gap-2">

            <button
              onClick={handlePrevious}
              className="w-10 h-10 rounded-full border
              bg-white shadow-sm
              hover:bg-gray-100
              flex items-center justify-center
              text-xl transition"
            >
              ←
            </button>

            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full
              bg-cyan-800 text-white
              shadow-sm
              hover:bg-cyan-700
              flex items-center justify-center
              text-xl transition"
            >
              →
            </button>

          </div>

        </div>

        {/* Products Slider */}
        <div
          ref={sliderRef}
          className="
            flex
            gap-6
            overflow-x-auto
            scroll-smooth
            snap-x
            snap-mandatory
            scrollbar-hide
            pb-4
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >

          {products.map((product) => (

            <div
  key={product._id}
  className="
    flex-none
    w-[calc((100%-120px)/5)]
    snap-start
    max-lg:w-[calc((100%-80px)/4)]
    max-md:w-[calc((100%-24px)/2)]
    max-sm:w-full
  "
>

              <ShoppingProductTile

                product={product}

                handleGetProductDetails={
                  handleGetProductDetails
                }

                handleAddtoCart={
                  handleAddtoCart
                }
            compact={true} // NEW: compact mode for smaller tiles
              />

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default RecommendedProducts;