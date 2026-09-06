// import { Outlet } from "react-router-dom"; // outlet is used to render the child routes in the parent route component
// import ShoppingHeader from "./header";

// function ShoppingLayout() {
//   return (
//     <div className="flex flex-col bg-white overflow-hidden">
//       {/* common header */}
//       <ShoppingHeader />
//       <main className="flex flex-col w-full">
//         <Outlet />   
//         {/* // 👉 Yaha dynamic content aayega
// → jo bhi current route hoga */}
//       </main>
//     </div>
//   );
// }

// export default ShoppingLayout;


// // “saare pages me header chipka rahega, content change hota rahega”



import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      
      {/* Common Header */}
      <ShoppingHeader />

      {/* Page Content */}
      <main className="flex flex-col w-full pt-16">
        <Outlet />
      </main>

    </div>
  );
}

export default ShoppingLayout;