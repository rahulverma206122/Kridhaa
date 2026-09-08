import { useState } from "react";
import CommonForm from "../common/form";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView({ orderDetails }) {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateStatus(event) {
    event.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({
        id: orderDetails?._id,
        orderStatus: status,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));

        dispatch(getAllOrdersForAdmin());
        // ise nhi krege to jab hum productdetails ke andar jakr
        // jab status ko update kr dege or jab bahar aaege
        // to hme status purana wala hi dikhae dega

        setFormData(initialFormData);

        toast({
          title: data?.payload?.message,
        });
      }
    });
  }

  return (
    <DialogContent
      className="
        w-[84vw]
        max-w-[600px]
        max-h-[82vh]
        overflow-y-auto
        p-3
        sm:p-6
        sm:max-h-[90vh]
      "
    >
      {/* =========================================================
          🔥 Radix accessibility

          DialogTitle and DialogDescription are required by
          Radix UI for screen readers.

          sr-only means:
          👉 They exist for accessibility
          👉 They are NOT visible on the screen
          ========================================================= */}

      <DialogTitle className="sr-only">
        Order Details
      </DialogTitle>

      <DialogDescription className="sr-only">
        Detailed information about the selected customer order.
      </DialogDescription>

      <div className="grid gap-4 sm:gap-6">

        {/* =========================================================
            ORDER BASIC INFORMATION
            Desktop layout same rahega.
            Mobile par compact layout.
            ========================================================= */}

        <div className="grid gap-2 sm:gap-2">

          {/* Order ID */}

          <div className="flex flex-col gap-0.5 sm:flex-row sm:mt-6 sm:items-center sm:justify-between">
            <p className="text-sm sm:text-base font-medium">
              Order ID
            </p>

            <Label className="text-sm sm:text-base break-all text-left sm:text-right">
              {orderDetails?._id}
            </Label>
          </div>


          {/* Order Date */}

          <div className="flex flex-col gap-0.5 sm:flex-row sm:mt-2 sm:items-center sm:justify-between">
            <p className="text-sm sm:text-base font-medium">
              Order Date
            </p>

            <Label className="text-sm sm:text-base">
              {orderDetails?.orderDate?.split("T")[0]}
            </Label>
          </div>


          {/* Order Price */}

          <div className="flex flex-col gap-0.5 sm:flex-row sm:mt-2 sm:items-center sm:justify-between">
            <p className="text-sm sm:text-base font-medium">
              Order Price
            </p>

            <Label className="text-sm sm:text-base">
              ₹{orderDetails?.totalAmount}
            </Label>
          </div>


          {/* Payment Method */}

          <div className="flex flex-col gap-0.5 sm:flex-row sm:mt-2 sm:items-center sm:justify-between">
            <p className="text-sm sm:text-base font-medium">
              Payment method
            </p>

            <Label className="text-sm sm:text-base">
              {orderDetails?.paymentMethod}
            </Label>
          </div>


          {/* Payment Status */}

          <div className="flex flex-col gap-0.5 sm:flex-row sm:mt-2 sm:items-center sm:justify-between">
            <p className="text-sm sm:text-base font-medium">
              Payment Status
            </p>

            <Label className="text-sm sm:text-base">
              {orderDetails?.paymentStatus}
            </Label>
          </div>


          {/* Order Status */}

          <div className="flex flex-col gap-0.5 sm:flex-row sm:mt-2 sm:items-center sm:justify-between">
            <p className="text-sm sm:text-base font-medium">
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


        {/* =========================================================
            ORDER ITEMS

            Desktop:
            Title | Quantity | Price

            Mobile:
            Product title
            Quantity + Price
            ========================================================= */}

        <div className="grid gap-3 sm:gap-4">

          <div className="grid gap-2">

            <div className="text-sm sm:text-base font-medium">
              Order Details
            </div>

            <ul className="grid gap-2 sm:gap-3">

              {orderDetails?.cartItems &&
              orderDetails?.cartItems.length > 0
                ? orderDetails.cartItems.map((item) => (
                    <li
                      key={
                        item?._id ||
                        item?.productId ||
                        item?.title
                      }
                      className="
                        flex
                        flex-col
                        gap-1.5
                        rounded-md
                        border
                        p-2.5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:gap-3
                        sm:border-0
                        sm:p-0
                      "
                    >

                      {/* Product title */}

                      <span className="text-sm sm:text-base font-medium break-words">
                        Title: {item?.title}
                      </span>


                      {/* Quantity + Price */}

                      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm sm:gap-6">

                        <span>
                          Quantity: {item?.quantity}
                        </span>

                        <span className="font-medium">
                          Price: ₹{item?.price}
                        </span>

                      </div>

                    </li>
                  ))
                : null}

            </ul>

          </div>

        </div>


        {/* =========================================================
            SHIPPING INFORMATION
            ========================================================= */}

        <div className="grid gap-3 sm:gap-4">

          <div className="grid gap-2">

            <div className="text-sm sm:text-base font-medium">
              Shipping Info
            </div>

            <div className="grid gap-0.5 text-xs sm:text-sm text-muted-foreground">

              <span>
                {user?.userName}
              </span>

              <span className="break-words">
                {orderDetails?.addressInfo?.address}
              </span>

              <span>
                {orderDetails?.addressInfo?.city}
              </span>

              <span>
                {orderDetails?.addressInfo?.pincode}
              </span>

              <span>
                {orderDetails?.addressInfo?.phone}
              </span>

              {orderDetails?.addressInfo?.notes && (
                <span className="break-words">
                  {orderDetails?.addressInfo?.notes}
                </span>
              )}

            </div>

          </div>

        </div>


        {/* =========================================================
            UPDATE ORDER STATUS
            ========================================================= */}

        <div className="pt-0.5 sm:pt-1">

          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "pending", label: "Pending" },
                  { id: "inProcess", label: "In Process" },
                  { id: "inShipping", label: "In Shipping" },
                  { id: "delivered", label: "Delivered" },
                  { id: "rejected", label: "Rejected" },
                ],
              },
            ]}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />

        </div>

      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;

// done