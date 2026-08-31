import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewAddress,
  deleteAddress,
  editaAddress,
  fetchAllAddresses,
} from "@/store/shop/address-slice";


// What is @ ?

// @ is an alias (shortcut path).

// It usually points to the src folder of your project.
// Avoid long paths like

// ../../../store/shop/address-slice

// So:

// @  →  src

// Without alias you would write: from "../../store/shop/address-slice";

// @/store/shop/address-slice

// This is shorter and cleaner.


import AddressCard from "./address-card";  //    ./ se shopping view pr jaege 
import { useToast } from "../ui/use-toast";

// This is an object that stores default (initial) form values.

// Why we create this?

// We create it for 3 main reasons:

// 1️⃣ To initialize form (start with empty fields)
// const [formData, setFormData] = useState(initialAddressFormData);

// 👉 Jab page load hota hai:

// formData =
// {
//  address: "",
//  city: "",
//  state: "",
//  phone: "",
//  pincode: "",
//  notes: ""
// }

// So form empty start hota hai.

// 2️⃣ To reset form after submit

// After adding address:

// setFormData(initialAddressFormData);

// 👉 Meaning:

// form ko wapas empty kar do

const initialAddressFormData = {
  address: "",   // suru me ye sb field khali aaegi
  city: "",
  state:"",
  phone: "",
  pincode: "",
  notes: "",
};

function Address({ setCurrentSelectedAddress, selectedId }) {  // yha pr props me setCurrentSelectedAddress or selectedId pass kr rhe h   yha p selectedId ka use isliye kr rhe h taki jab user kisi address card pr click kre to us card ko highlight kr ske taki user ko pata chale ki usne konsa address select kiya h  or setCurrentSelectedAddress ka use isliye kr rhe h taki jab user kisi address card pr click kre to us address ka data parent component me store ho jaye taki jab user checkout page pr jaye to uska selected address waha pr show ho
  const [formData, setFormData] = useState(initialAddressFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const dispatch = useDispatch();  // useDispatch is a React Redux hook. use to call thunks

// Without dispatch (not possible)

// You cannot call Redux actions directly.

// ❌ Wrong:

// fetchAllAddresses()

// ✅ Correct:

// dispatch(fetchAllAddresses())

// 🔹 What is useSelector()?

// useSelector is a React Redux hook.

// It is used to:

// read (get) data from Redux store

// 🔹 Simple Meaning
// useSelector(...)

// means:

// 👉 “Redux store se data leke aao”

  const { user } = useSelector((state) => state.auth); // We are extracting user. and yha pr state ka mtlb h Redux store ka state. aur state.auth ka mtlb h auth slice ka state. aur usme se user ko extract kr rhe h taki hume user ki information mil jaye jaise ki user id jo ki address se related API calls me chahiye hota h
  const { addressList } = useSelector((state) => state.shopAddress);  // yha pr auth and shopaddress dono store ke andar slice ka name h 
  const { toast } = useToast();  // yha toast ek function h jiska use hum user ko message dikhane ke liye krte h jaise ki address add ho gya h ya address delete ho gya h ya address update ho gya h to uske liye hum toast function ka use krte h taki user ko pata chale ki uska action successful tha ya nhi

  function handleManageAddress(event) {
    event.preventDefault();  // form submit hone par page reload hota h usko prevent krne ke liye use krte h

    if (addressList.length >= 4 && currentEditedId === null) {   // currentEditedId === null mtlb 4 hone bad bhi edit kr skte h 
//       1️⃣ addressList.length >= 4
// → user ke paas already 4 ya usse zyada addresses hain

// 2️⃣ currentEditedId === null
// → user edit nahi kar raha (new address add kar raha hai)
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 4 addresses",
        variant: "destructive",
      });

      return;
    }

// Thoda aur clear flow
// Step 1: Component
// dispatch(editaAddress({...}))

// 👉 yaha se Redux thunk call hota hai

// API call
// axios.put("/api/shop/address/update/...")

// 👉 backend ko request jati hai

// Step 4: Backend
// Route → Controller → Model → MongoDB

// 👉 database update hota hai

// Step 5: Response

// Backend → Redux → Component

// Simple Flow (best to remember)
// Component
//    ↓
// dispatch()
//    ↓
// Redux Thunk (editaAddress)
//    ↓
// axios PUT request
//    ↓
// Backend API
//    ↓
// Database update
//    ↓
// Response
//    ↓
// Redux state update
//    ↓
// UI update
 currentEditedId !== null  // mtlb edit kr rhe ho 
      ? dispatch(   // Redux thunk ke andar editaAddress ko call kar rahe hain aur uske through data backend ko bhej rahe hain.
          editaAddress({
            userId: user?.id,
            addressId: currentEditedId,
            formData,
          })
        ).then((data) => {   // This runs after API response comes back
          if (data?.payload?.success) {  // If backend says update successful payload ka mtlb h backend se jo response aayega usme ek field hota h payload jisme backend se data aata h aur usme success field hota h jiska value true ya false hota h agar update successful hota h to success ka value true hota h aur agar update unsuccessful hota h to success ka value false hota h isliye hum yaha pr check kr rhe h ki data?.payload?.success true hai ya nhi taki user ko pata chale ki address update hua h ya nhi
            dispatch(fetchAllAddresses(user?.id));
            setCurrentEditedId(null);  //  exit edited mode after successful edit
            setFormData(initialAddressFormData);
            toast({
              title: "Address updated successfully",
            });
          }
        })
      : dispatch(
          addNewAddress({
            ...formData,  // formdata ko spread kro or usme userid ko add krdo  see notes
            userId: user?.id,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllAddresses(user?.id));
            setFormData(initialAddressFormData);
            toast({
              title: "Address added successfully",
            });
          }
        });
  }

  function handleDeleteAddress(getCurrentAddress) {
    dispatch(
      deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })
    ).then((data) => {  // why we pass data - > data is the response that comes after API call completes
      if (data?.payload?.success) {
        dispatch(fetchAllAddresses(user?.id));
        toast({
          title: "Address deleted successfully",
        });
      }
    });
  }

  function handleEditAddress(getCuurentAddress) {  // This function runs when user clicks Edit button.
    setCurrentEditedId(getCuurentAddress?._id); // when edit first to save the id → uSo later we know: Which address to update in DB
    setFormData({
      ...formData,  // pass the info of form first as we click on edit  Spread old form data
      address: getCuurentAddress?.address,  // Form ke andar old address ka data bhar do taki user ko pata chale ki uska old address kya tha aur wo usko edit kar ske
      city: getCuurentAddress?.city,
      state: getCuurentAddress?.state,
      phone: getCuurentAddress?.phone,
      pincode: getCuurentAddress?.pincode,
      notes: getCuurentAddress?.notes,
    });
  }

  function isFormValid() { // see notes  // Kya form ke sab fields filled hain ya nahi
    return Object.keys(formData)   // give all field name in formData as array → ["address", "city", "state", "phone", "pincode", "notes"]
      .map((key) => formData[key].trim() !== "")  // formData[key] → value of field .trim() → remove spaces !== "" → check empty hai ya nahi
      .every((item) => item);
  }

{/* Because we want to automatically fetch the user’s addresses as soon as the component loads (mounts).
Instead of calling dispatch(fetchAllAddresses(...)) manually every time, useEffect lets React do it right after the first render.
If you don’t write this, the addresses won’t load automatically when the page opens. You would need to trigger it manually (like on a button click). */}
 
useEffect(() => {  // useEffect is a React hook that runs a function after the component loads. Here, we use it to fetch all addresses when the component loads.
    dispatch(fetchAllAddresses(user?.id));  // Jaise hi component open hota hai → addresses fetch karo backend se
  }, [dispatch]);  // Ye dependency array hai. yha disptach ka mtlb h kuch bhi dispatch ho to useEffect ko run kr do.

  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
              />
            ))
          : null}
      </div>
      <CardHeader>
        <CardTitle>
          {currentEditedId !== null ? "Edit Address" : "Add New Address"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 ">
        <CommonForm 
          formControls={addressFormControls}
          formData={formData}
          setFormData={setFormData}
          buttonText={currentEditedId !== null ? "Edit" : "Add"}
          onSubmit={handleManageAddress}
          isBtnDisabled={!isFormValid()}
        />
      </CardContent>
    </Card>
  );
}

export default Address;




// Why we create this?

// We create it for 3 main reasons:

// 1️⃣ To initialize form (start with empty fields)
// const [formData, setFormData] = useState(initialAddressFormData);

// 👉 Jab page load hota hai:

// formData =
// {
//  address: "",
//  city: "",
//  state: "",
//  phone: "",
//  pincode: "",
//  notes: ""
// }

// So form empty start hota hai.