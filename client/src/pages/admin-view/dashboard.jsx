import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Separator } from "@/components/ui/separator";  // ✅ import separator

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);  

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

      const handleDelete = (id) => {
      dispatch(deleteFeatureImage(id)).then((action) => {
      if (action?.payload?.success) {
        dispatch(getFeatureImages()); // refresh list
      } else {
        console.error("Delete failed:", action?.payload);
      }
    });
  };


  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />

      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>
       
       <Separator className="my-5 bg-black" />
      
       <div  className="bg-background mt-8 text-center font-bold text-2xl">Uploaded Images and Videos</div> 
      <div className="flex flex-col gap-4 mt-5">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem, index) => {
              const isVideo = featureImgItem?.image?.match(/\.(mp4|webm|ogg)$/i);
              return (
                <div key={featureImgItem._id} className="relative">
                  {isVideo ? (
                    <video
                      src={featureImgItem.image}
                      className="w-full h-[300px] object-cover rounded-t-lg"
                      controls
                    />
                  ) : (
                    <img
                      src={featureImgItem.image}
                      className="w-full h-[300px] object-cover rounded-t-lg"
                      alt="Uploaded media"
                    />
                  )}
                  <Button
                  className = "w-full mt-1 text-red-400 text-xl mb-5 mx-auto block"
                  onClick={() => handleDelete(featureImgItem._id)}>
                    Delete
                  </Button>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default AdminDashboard;
