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
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => { // is use effect ka mtlb ye h ki jaise hi hum order ko open krege sare order apne aap page khulte hi ajaege
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {// mtlb ki agar oder details h to orderdetails ko kholte hi dialog khol do
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);


  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-2xl md:text-2xl">
          Order History
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 md:p-6">

        {/* =========================================================
            💻 LAPTOP / DESKTOP ORDER TABLE
            md se upar tumhara original table hi dikhega
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

                      <TableCell>
                        {orderItem?._id}
                      </TableCell>

                      <TableCell>
                        {orderItem?.orderDate.split("T")[0]}
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
                          onOpenChange={() => {   // onopenchange ka mtlb ye h ki jab bhi dialog close ya open ho to ye function call hoga
                            setOpenDetailsDialog(false);
                            dispatch(resetOrderDetails()); // ye orderslice me reducer me h
                          }}
                        >
                          <Button
                            onClick={() =>
                              handleFetchOrderDetails(orderItem?._id)
                            }
                          >
                            View Details
                          </Button>

                          <ShoppingOrderDetailsView
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
            📱 MOBILE ORDER CARDS
            Mobile par table ki jagah ye clean cards dikhenge
            ========================================================= */}
        <div className="md:hidden space-y-3">

          {orderList && orderList.length > 0
            ? orderList.map((orderItem) => (

                <Card
                  key={orderItem?._id}
                  className="w-full border shadow-sm"
                >

                  <CardContent className="p-3">

                    {/* Order ID */}
                    <div className="flex items-start justify-between gap-3 mb-3">

                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">
                          Order ID
                        </p>

                        <p className="text-sm font-medium truncate">
                          {orderItem?._id}
                        </p>
                      </div>

                      {/* Order Status */}
                      <Badge
                        className={`shrink-0 py-1 px-2 text-xs ${
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


                    {/* Order Information */}
                    <div className="grid grid-cols-2 gap-3 mb-3">

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Order Date
                        </p>

                        <p className="text-sm font-medium">
                          {orderItem?.orderDate.split("T")[0]}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">
                          Order Price
                        </p>

                        <p className="text-sm font-bold">
                          ₹{orderItem?.totalAmount}
                        </p>
                      </div>

                    </div>


                    {/* View Details */}
                    <Dialog
                      open={openDetailsDialog}
                      onOpenChange={() => {   // onopenchange ka mtlb ye h ki jab bhi dialog close ya open ho to ye function call hoga
                        setOpenDetailsDialog(false);
                        dispatch(resetOrderDetails()); // ye orderslice me reducer me h
                      }}
                    >

                      <Button
                        onClick={() =>
                          handleFetchOrderDetails(orderItem?._id)
                        }
                        className="w-full h-9 text-sm"
                      >
                        View Details
                      </Button>

                      <ShoppingOrderDetailsView
                        orderDetails={orderDetails}
                      />

                    </Dialog>

                  </CardContent>

                </Card>

              ))
            : (
              <p className="text-center text-sm text-muted-foreground py-6">
                No orders found.
              </p>
            )}

        </div>

      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;