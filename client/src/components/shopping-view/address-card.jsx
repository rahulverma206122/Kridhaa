import { Button } from "../ui/button"; // thse are provied by shadcn/ui. We have just added some custom styling to it. You can check the code in client/src/components/ui/button.jsx to see how we have created this Button component using shadcn/ui and how you can create your own custom components using shadcn/ui.
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({
  addressInfo,     // These are props (properties) that the component receives from its parent component.
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer w-[92%] mx-auto md:w-full md:mx-0 border-green-400 ${
        selectedId?._id === addressInfo?._id
          ? "border-green-600 border-[3px]"
          : "border-black"
      }`}
    >
      <CardContent className="grid p-2 md:p-4 gap-1.5 md:gap-4">
        <Label className="text-xs md:text-base leading-4 md:leading-normal">
          Address: {addressInfo?.address}
        </Label>

        <Label className="text-xs md:text-base leading-4 md:leading-normal">
          City: {addressInfo?.city}
        </Label>

        <Label className="text-xs md:text-base leading-4 md:leading-normal">
          State: {addressInfo?.state}
        </Label>

        <Label className="text-xs md:text-base leading-4 md:leading-normal">
          pincode: {addressInfo?.pincode}
        </Label>

        <Label className="text-xs md:text-base leading-4 md:leading-normal">
          Phone: {addressInfo?.phone}
        </Label>

        <Label className="text-xs md:text-base leading-4 md:leading-normal">
          Notes: {addressInfo?.notes}
        </Label>
      </CardContent>

      <CardFooter className="p-2 md:p-3 flex justify-between">
        <Button
          onClick={(event) => {
            event.stopPropagation();
            handleEditAddress(addressInfo);
          }}
          className="h-8 px-3 text-xs md:h-10 md:px-4 md:text-base"
        >
          Edit
        </Button>

        <Button
          onClick={(event) => {
            event.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
          className="h-8 px-3 text-xs md:h-10 md:px-4 md:text-base"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;