import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";  // useLocation ek hook hai jo current URL ki information deta hai mtlb abhi user kis url pr h 

function PaypalReturnPage() {

  const dispatch = useDispatch();
  const location = useLocation(); // → gives access to the current URL,
  const params = new URLSearchParams(location.search); // PayPal appends paymentId and PayerID to the return_url after the user approves payment.
  
//   👉 location.search = URL ka query part

// Example: /products?category=men&sort=price-lowtohigh
// urlsearchparams - -Ye ek built-in JavaScript object hai jo query string ko easy format me convert karta hai
// URL → ?category=men&sort=price →

// URLSearchParams →
// { category: "men", sort: "price" }  
// params.get("category")  // "men"
// params.get("sort")      // "price-lowtohigh"

  const paymentId = params.get("paymentId"); // URLSearchParams is used to extract these query parameters from the URL.
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) { // If the user canceled the payment, these won’t be present.
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId")); // sessionStorage is a browser API that stores data only for the current session.Data is cleared automatically when the browser/tab is closed.Stores data as strings (key-value pairs).Retrieves the value stored under the key "currentOrderId".Converts a JSON string back into a JavaScript value.
// Browser ke temporary storage se data le raha hai
// key: "currentOrderId"
// value: string me stored hoti hai
      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => { // Calls your backend to capture/execute the PayPal payment.Sends paymentId, payerId, and orderId.
        if (data?.payload?.success) { //If the payment is successful:
          sessionStorage.removeItem("currentOrderId");
          //👉 Order ID hata diya storage se (kyunki ab kaam complete ho gaya)
          window.location.href = "/shop/payment-success"; //window.location is a JavaScript object representing the current URL in the browser..href is the full URL of the page.
        } // After the payment is successfully captured, this line sends the user to the /shop/payment-success page.
      }); // Alternative navigate("/shop/payment-success");
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;


// window.location.href kya hai? - Sirf full URL string deta hai - https://example.com/shop?id=10

// 🔹 window.location kya hai?
// 👉 Ye ek object hai (browser ka built-in)
// 👉 Isme current URL ki saari info hoti hai

// {
//   href: "https://example.com/shop",
//   pathname: "/shop",
//   search: "?id=10",
//   ...
// }