import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useRef } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);  // useRef makes a box that can hold something.  At first, that box is empty (null).  When you connect it to an element (like an <input>), React will put that element inside the box.

  console.log(isEditMode, "isEditMode");

  function handleImageFileChange(event) {
    console.log(event.target.files, "event.target.files");
    const selectedFile = event.target.files?.[0];  // event.target.files is a list (array-like) of all the files the user selected.  ?.[0] means: take the first file if it exists (safe optional chaining). File {name: "photo.png", size: 12345, type: "image/png", ...}
    console.log(selectedFile);

    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0]; // dataTransfer.files gives the list of files the user dropped. If you drag photo.png → it becomes a File object.
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";  
    }
  }

  async function uploadImageToCloudinary() { // change this function from chatgpt to upload the images 
   // if(!imageFile) return;
    setImageLoadingState(true); // Shows a loading spinner (or disables button) while upload is happening.
    const data = new FormData();
    data.append("my_file", imageFile);
    try{
     // Adds the file (imageFile) into the form data with key "my_file". This key must match what your backend expects.
    const response = await axios.post(  // Backend will upload the file to Cloudinary and return the result.
      `${import.meta.env.VITE_API_URL}/api/admin/products/upload-image`,
      data,
    );
    console.log(response, "response");

    if (response?.data?.success) {
      //setUploadedImageUrl(response.data.imageUrl); ye line phle add thi jiski wjh se hi image show nhi ho rhi thi card me 
      setUploadedImageUrl(response.data.result.url);
     // const url = response.data.result?.secure_url || response.data.result?.url || "";
      //setUploadedImageUrl(url); //Cloudinary URL of the uploaded image.
      
    } 
  }catch(err){
    console.error("upload error",err);
  }finally{
    setImageLoadingState(false); // Stop loading
  }
}

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div
      className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}
    >
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode} 
        />
        {!imageFile ? ( // agar image upload nhi kri h to   
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 text-primary mr-2 h-8" />
            </div>
            <p className="text-sm font-medium"> {imageFile ? imageFile.name : "Image uploaded"}</p> 
            <Button 
              variant="ghost"  // Transparent background
              size="icon"  // "icon" means the button is square, just enough to fit an icon inside.
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
