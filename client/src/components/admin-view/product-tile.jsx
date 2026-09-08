import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  return (
    <Card className="w-full overflow-hidden">
      <div>

        {/* Product Image */}
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="
              w-full
              h-[150px]
              sm:h-[220px]
              md:h-[300px]
              object-cover
              rounded-t-lg
            "
          />
        </div>

        {/* Product Details */}
        <CardContent className="p-3 sm:p-4 md:p-6">
          <h2 className="text-sm sm:text-lg md:text-xl font-bold mb-2 mt-1 line-clamp-2">
            {product?.title}
          </h2>

          <div className="flex flex-col gap-1 mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-sm sm:text-base md:text-lg font-semibold text-primary`}
            >
              ₹{product?.price}
            </span>

            {product?.salePrice > 0 ? (
              <span className="text-sm sm:text-base md:text-lg font-bold">
                ₹{product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>

        {/* Buttons */}
        <CardFooter className="flex justify-between items-center p-3 sm:p-4 md:p-6 pt-0">
          <Button
            className="text-xs sm:text-sm md:text-base px-3 sm:px-4"
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            Edit
          </Button>

          <Button
            className="text-xs sm:text-sm md:text-base px-3 sm:px-4"
            onClick={() => handleDelete(product?._id)}
          >
            Delete
          </Button>
        </CardFooter>

      </div>
    </Card>
  );
}

export default AdminProductTile;

// done