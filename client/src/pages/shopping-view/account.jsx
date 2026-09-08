import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/y.mp4";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col">

      {/* Account Video */}
      <div className="relative h-[250px] sm:h-[350px] md:h-[550px] w-full overflow-hidden">
        <video
          src={accImg}
          className="h-full w-full object-cover object-center"
          autoPlay
          muted
          // loop
          playsInline // mtlb mobile devices pr bhi video autoplay ho jayega without user interaction ke, kyunki kuch mobile browsers me autoplay tabhi work karta hai jab video muted hota hai aur playsInline attribute diya hota hai, isse ensure hota hai ki video mobile devices pr bhi smoothly play ho jaye without any issues
        />
      </div>

      <div className="container mx-auto grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 py-4 sm:py-6 md:py-8 px-3 sm:px-4">

        <div className="flex flex-col rounded-lg border bg-background p-3 sm:p-4 md:p-6 shadow-sm">

          <Tabs defaultValue="orders"> {/* default value se mtlb h ki page load ke tym konsa khula aana chaiye */}

            <TabsList className="w-full sm:w-auto">
              <TabsTrigger
                value="orders"
                className="flex-1 sm:flex-none"
              >
                Orders
              </TabsTrigger> {/*  value se mtlb h ki ye trigger kis content se linked hai, yha ye "orders" content se linked hai, jab user is trigger pr click karega to "orders" content show hoga */}

              <TabsTrigger
                value="address"
                className="flex-1 sm:flex-none"
              >
                Address
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="orders"
              className="mt-4 sm:mt-6"
            >
              <ShoppingOrders />
            </TabsContent>

            <TabsContent
              value="address"
              className="mt-4 sm:mt-6"
            >
              <Address /> {/* "address" means the file address.jsx mtlb kisi componet ko use kiya mtlb us file ko use kiya thats why export everyfile to import somewhere else */}
            </TabsContent>

          </Tabs>

        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;