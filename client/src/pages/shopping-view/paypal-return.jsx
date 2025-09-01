import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturnPage() {

  const dispatch = useDispatch();
  const location = useLocation(); // → gives access to the current URL,
  const params = new URLSearchParams(location.search); // PayPal appends paymentId and PayerID to the return_url after the user approves payment.
  const paymentId = params.get("paymentId"); // URLSearchParams is used to extract these query parameters from the URL.
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) { // If the user canceled the payment, these won’t be present.
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId")); // sessionStorage is a browser API that stores data only for the current session.Data is cleared automatically when the browser/tab is closed.Stores data as strings (key-value pairs).Retrieves the value stored under the key "currentOrderId".Converts a JSON string back into a JavaScript value.

      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => { // Calls your backend to capture/execute the PayPal payment.Sends paymentId, payerId, and orderId.
        if (data?.payload?.success) { //If the payment is successful:
          sessionStorage.removeItem("currentOrderId");
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
