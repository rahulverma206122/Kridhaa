import ProductImageUpload from "@/components/admin-view/image-upload";

import { Button } from "@/components/ui/button";

import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Separator } from "@/components/ui/separator"; // ✅ import separator

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);

  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const [imageLoadingState, setImageLoadingState] = useState(false);

  const dispatch = useDispatch();

  const { featureImageList } = useSelector(
    (state) => state.commonFeature
  );

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
    <div className="w-full px-3 md:px-0">

      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true} // agar aapko custom styling chahiye to true kare otherwise false
      />

      <Button
        onClick={handleUploadFeatureImage}
        className="mt-4 md:mt-5 w-full"
      >
        Upload
      </Button>

      <Separator className="my-4 md:my-5 bg-black" />

      <div className="bg-background mt-5 md:mt-8 text-center font-bold text-xl md:text-2xl">
        Uploaded Images and Videos
      </div>

      <div className="flex flex-col gap-4 mt-4 md:mt-5">

        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((featureImgItem, index) => {
              const isVideo =
                featureImgItem?.image?.match(
                  /\.(mp4|webm|ogg)$/i
                );

              return (
                <div
                  key={featureImgItem._id}
                  className="relative w-full"
                >

                  {isVideo ? (
  <video
    src={featureImgItem.image}
    className="w-full h-auto max-h-[300px] md:h-[300px] object-contain md:object-cover rounded-t-lg"
    controls
  />
) : (
  <img
    src={featureImgItem.image}
    className="w-full h-auto max-h-[300px] md:h-[300px] object-contain md:object-cover rounded-t-lg"
    alt="Uploaded media"
  />
)}

                  <Button
                    className="w-full mt-1 text-red-400 text-base md:text-xl mb-3 md:mb-5 mx-auto block"
                    onClick={() =>
                      handleDelete(featureImgItem._id)
                    }
                  >
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