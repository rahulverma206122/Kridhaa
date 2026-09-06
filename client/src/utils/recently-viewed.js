export const addRecentlyViewedProduct = (productId) => {
  let recentlyViewed = JSON.parse(
    localStorage.getItem("recentlyViewed")
  ) || [];

  // Remove duplicate
  recentlyViewed = recentlyViewed.filter(
    (id) => id !== productId
  );

  // Add latest viewed product at beginning
  recentlyViewed.unshift(productId);

  // Keep only last 10 products
  recentlyViewed = recentlyViewed.slice(0, 10);

  localStorage.setItem(
    "recentlyViewed",
    JSON.stringify(recentlyViewed)
  );
};