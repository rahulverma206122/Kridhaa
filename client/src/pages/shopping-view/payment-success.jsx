import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <Card className="p-4 sm:p-6 md:p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-2xl sm:text-3xl md:text-4xl">
          Payment is successfull!
        </CardTitle>
      </CardHeader>

      <Button
        className="mt-4 sm:mt-5 w-full sm:w-auto"
        onClick={() => navigate("/shop/account")}
      >
        View Orders
      </Button>
    </Card>
  );
}

export default PaymentSuccessPage;

// done