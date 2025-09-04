import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

//ye filter wala section bna rha h 

function ProductFilter({ filters, handleFilter }) { // filters and handleFilter are props being passed from the parent component ( Listing.jsx) and here this function receive . Inside ProductFilter, you can directly use handleFilter because it comes from the parent.
  return (  
    <div className="bg-background rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((keyItem) => (  // filteroption is from config
          <Fragment>
            <div>
              <h3 className="text-xl font-bold">{keyItem}</h3>  {/* keyitem se filter me catogory and carat lkha aaega */}
              <div className="grid gap-2 mt-2">
                {filterOptions[keyItem].map((option) => (  
                  <Label className="flex font-medium items-center gap-2 ">
                    <Checkbox
                      checked={  // is a property jo btaega check h y nhi
                        filters &&                                // ✅ only proceed if filters object exists
                        Object.keys(filters).length > 0 &&        // ✅ make sure filters is not empty
                        filters[keyItem] &&                       // ✅ make sure the specific filter (carat/category) exists
                        filters[keyItem].indexOf(option.id) > -1  // ✅ check if the option.id exists inside filters[keyItem]
                        // ➡ then the checkbox will be checked (true).
                      }
                      onCheckedChange={() => handleFilter(keyItem, option.id)}  // handlefilter in listing.jsx  This is the event handler when the checkbox is clicked. If the option.id is not present in filters[keyItem], it adds it. If it is already present, it removes it.
                    />
                    {option.label}
                  </Label>
                ))}
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;