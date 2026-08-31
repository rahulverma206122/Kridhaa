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
      className={`cursor-pointer border-green-400 ${
        selectedId?._id === addressInfo?._id
          ? "border-green-600 border-[3px]"
          : "border-black"
      }`}
    >
      <CardContent className="grid p-4 gap-4">
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>State: {addressInfo?.state}</Label>
        <Label>pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
        <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
