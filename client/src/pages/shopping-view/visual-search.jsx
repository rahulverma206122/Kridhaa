import VisualSearch from "@/components/shopping-view/visual-search";

// Header is `fixed`, so this page needs top padding — otherwise the header
// would overlap the first bit of content (unlike Home, which has a hero
// video that's fine bleeding under the nav).
function VisualSearchPage() {
  return (
    <div className="pt-16 min-h-screen">
      <VisualSearch />
    </div>
  );
}

export default VisualSearchPage;