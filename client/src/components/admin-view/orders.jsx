import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector(
    (state) => state.adminOrder
  );
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => { // iska mtlb h jab page load ho tb .... dispatch ho jae apne aap
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);  // jb bhi order details ke sath kuch hoga ye hook run krega

  return (
    <Card className="w-full">
      <CardHeader className="px-4 py-4 md:p-6">
        <CardTitle className="text-xl md:text-2xl">
          All Orders
        </CardTitle>
      </CardHeader>

      <CardContent className="px-3 pb-4 md:p-6">

        {/* =========================================================
            💻 DESKTOP / LAPTOP VIEW
            Table ko desktop par exactly same rakha gaya hai.
            ========================================================= */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Order Price</TableHead>
                <TableHead>
                  <span className="sr-only">Details</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orderList && orderList.length > 0
                ? orderList.map((orderItem) => (
                    <TableRow key={orderItem?._id}>
                      <TableCell>{orderItem?._id}</TableCell>

                      <TableCell>
                        {orderItem?.orderDate?.split("T")[0]}
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={`py-1 px-3 ${
                            orderItem?.orderStatus === "confirmed"
                              ? "bg-green-500"
                              : orderItem?.orderStatus === "rejected"
                              ? "bg-red-600"
                              : "bg-black"
                          }`}
                        >
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        ₹{orderItem?.totalAmount}
                      </TableCell>

                      <TableCell>
                        <Dialog
                          open={openDetailsDialog}
                          onOpenChange={() => {  // “Jab open/close state change ho, tab ye function call karo”
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails());  // ye slice ke andr reducer se aara h
                          }}
                        >
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                          >
                            View Details
                          </Button>

                          <AdminOrderDetailsView
                            orderDetails={orderDetails}
                          />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>


        {/* =========================================================
            📱 MOBILE VIEW
            Mobile par table ki jagah cards use honge.
            Isse 5 columns squeeze nahi honge.
            ========================================================= */}
        <div className="md:hidden space-y-3">

          {orderList && orderList.length > 0
            ? orderList.map((orderItem) => (
                <Card
                  key={orderItem?._id}
                  className="w-full border rounded-xl shadow-sm"
                >
                  <CardContent className="p-4">

                    {/* Order ID */}
                    <div className="space-y-1 mb-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        Order ID
                      </p>

                      <p className="text-sm font-semibold break-all">
                        {orderItem?._id}
                      </p>
                    </div>


                    {/* Date + Status */}
                    <div className="grid grid-cols-2 gap-3 mb-3">

                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Order Date
                        </p>

                        <p className="text-sm font-medium">
                          {orderItem?.orderDate?.split("T")[0]}
                        </p>
                      </div>


                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Status
                        </p>

                        <Badge
                          className={`py-1 px-2 text-xs ${
                            orderItem?.orderStatus === "confirmed"
                              ? "bg-green-500"
                              : orderItem?.orderStatus === "rejected"
                              ? "bg-red-600"
                              : "bg-black"
                          }`}
                        >
                          {orderItem?.orderStatus}
                        </Badge>
                      </div>

                    </div>


                    {/* Order Price */}
                    <div className="flex items-center justify-between border-t pt-3">

                      <div>
                        <p className="text-xs font-medium text-muted-foreground">
                          Order Price
                        </p>

                        <p className="text-base font-bold mt-1">
                          ₹{orderItem?.totalAmount}
                        </p>
                      </div>


                      {/* View Details */}
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {  // “Jab open/close state change ho, tab ye function call karo”
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());  // ye slice ke andr reducer se aara h
                        }}
                      >
                        <Button
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                          className="text-sm px-3"
                        >
                          View Details
                        </Button>

                        <AdminOrderDetailsView
                          orderDetails={orderDetails}
                        />
                      </Dialog>

                    </div>

                  </CardContent>
                </Card>
              ))
            : null}

        </div>

      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;