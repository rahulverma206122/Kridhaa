import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent
  className="
    w-[88vw]
    max-w-[380px]
    max-h-[82vh]
    overflow-y-auto
    p-3
    sm:max-w-[600px]
    sm:max-h-none
    sm:overflow-visible
    sm:p-6
  "
>
      <div className="grid gap-4 sm:gap-6">

        {/* Order Summary */}
        <div className="grid gap-1 sm:gap-2">

          <div className="flex mt-4 sm:mt-6 items-start justify-between gap-3">
            <p className="font-medium text-sm sm:text-base whitespace-nowrap">
              Order ID
            </p>

            <Label className="text-xs sm:text-base text-right break-all">
              {orderDetails?._id}
            </Label>
          </div>

          <div className="flex mt-2 items-center justify-between gap-3">
            <p className="font-medium text-sm sm:text-base whitespace-nowrap">
              Order Date
            </p>

            <Label className="text-xs sm:text-base whitespace-nowrap">
              {orderDetails?.orderDate.split("T")[0]}
            </Label>

            {/* 🔥 Problem kya hai?

            👉 orderDate usually aata hai ISO format me:

            2026-04-25T14:30:45.123Z

            👉 Isme:

            Date + Time dono hote hain
            But UI me hume sirf date chahiye */}

            {/*result - ["2026-04-25", "14:30:45.123Z"] */}

          </div>

          <div className="flex mt-2 items-center justify-between gap-3">
            <p className="font-medium text-sm sm:text-base">
              Order Price
            </p>

            <Label className="text-xs sm:text-base whitespace-nowrap">
              ₹{orderDetails?.totalAmount}
            </Label>
          </div>

          <div className="flex mt-2 items-center justify-between gap-3">
            <p className="font-medium text-sm sm:text-base">
              Payment method
            </p>

            <Label className="text-xs sm:text-base">
              {orderDetails?.paymentMethod}
            </Label>
          </div>

          <div className="flex mt-2 items-center justify-between gap-3">
            <p className="font-medium text-sm sm:text-base">
              Payment Status
            </p>

            <Label className="text-xs sm:text-base">
              {orderDetails?.paymentStatus}
            </Label>
          </div>

          <div className="flex mt-2 items-center justify-between gap-3">
            <p className="font-medium text-sm sm:text-base">
              Order Status
            </p>

            <Label>
              <Badge
                className={`py-1 px-2 sm:px-3 text-xs sm:text-sm ${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "rejected"
                    ? "bg-red-600"
                    : "bg-black"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>

        </div>

        <Separator />

        {/* Order Details */}
        <div className="grid gap-3 sm:gap-4">

          <div className="grid gap-2">

            <div className="font-medium text-sm sm:text-base">
              Order Details
            </div>

            <ul className="grid gap-2 sm:gap-3">

              {orderDetails?.cartItems &&
              orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item, index) => (

                    <li
                      key={item?.productId || index}
                      className="
                        flex
                        flex-col
                        gap-1
                        rounded-md
                        border
                        p-2
                        text-xs
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:gap-3
                        sm:border-0
                        sm:p-0
                        sm:text-base
                      "
                    >

                      <span className="font-medium break-words">
                        Title: {item.title}
                      </span>

                      <div className="flex justify-between gap-3 sm:gap-4">
                        <span className="whitespace-nowrap">
                          Quantity: {item.quantity}
                        </span>

                        <span className="whitespace-nowrap">
                          Price: ₹{item.price}
                        </span>
                      </div>

                    </li>

                  ))
                : null}

            </ul>

          </div>

        </div>

        {/* Shipping Info */}
        <div className="grid gap-3 sm:gap-4">

          <div className="grid gap-2">

            <div className="font-medium text-sm sm:text-base">
              Shipping Info
            </div>

            <div className="grid gap-0.5 text-xs sm:text-base text-muted-foreground break-words">
              <span>{user?.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.pincode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>

          </div>

        </div>

      </div>
    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;