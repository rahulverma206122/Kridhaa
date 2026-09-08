import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        if (getControlItem.name === "phone") {
          element = (
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type="text"
              maxLength={10}
              value={value}
              onChange={(event) => {
                const newValue = event.target.value;

                if (/^\d*$/.test(newValue) && newValue.length <= 10) {
                  setFormData({
                    ...formData,
                    [getControlItem.name]: newValue,
                  });
                }
              }}
              onBlur={() => {
                // “User ne input chhod diya (click bahar / tab press)” → function run karo
                if (value.length !== 10) {
                  alert("Phone number must be exactly 10 digits");

                  setFormData({
                    ...formData,
                    [getControlItem.name]: "",
                  });
                }
              }}
            />
          );
        } else if (getControlItem.name === "pincode") {
          element = (
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type="text"
              maxLength={6}
              value={value}
              onChange={(event) => {
                const newValue = event.target.value;
                // User ne jo type kiya, wo value le rahe ho

                if (
                  /^\d*$/.test(newValue) &&
                  newValue.length <= 6
                ) {
                  // “Kya value me sirf digits (0–9) hi hain?”
                  // and value 6 ya 6 se kam h to ok

                  setFormData({
                    ...formData,
                    [getControlItem.name]: newValue,
                  });
                }
              }}
              onBlur={() => {
                if (value.length !== 6) {
                  // exact 6 hona chiaye
                  alert("Pincode must be exactly 6 digits");

                  setFormData({
                    ...formData,
                    [getControlItem.name]: "",
                  });
                }
              }}
            />
          );
        } else {
          element = (
            <Input
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              type={getControlItem.type}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
            />
          );
        }
        break;

      // 👉 Ye dropdown (select box) bana raha hai
      //👉 Aur user jo option choose karega → wo state me save ho raha hai
      case "select":
        element = (
          <Select
            // Ye dropdown component hai
            onValueChange={(value) =>
              // Jab user koi option select kare:
              setFormData({
                ...formData,
                [getControlItem.name]: value,
                // 👉 Field ka naam - [getControlItem.name]
              })
            }
            value={value} //Ye current selected value ko control karta hai
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>

            <SelectContent>
              {getControlItem.options &&
                getControlItem.options.map((optionItem) => {
                  // =====================================================
                  // 🔥 IMPORTANT:
                  // options object bhi ho sakta hai:
                  //
                  // { id: "men", label: "Men" }
                  //
                  // aur string bhi ho sakta hai:
                  //
                  // "Men"
                  //
                  // Isliye dono cases handle kar rahe hain.
                  // =====================================================

                  const optionValue =
                    typeof optionItem === "object"
                      ? optionItem.id
                      : optionItem;

                  const optionLabel =
                    typeof optionItem === "object"
                      ? optionItem.label
                      : optionItem;

                  return (
                    <SelectItem
                      key={optionValue}
                      value={optionValue}
                    >
                      {/* 
                        //🔥 key kya hai?
                        👉 React ke liye hota hai (user ke liye nahi)
                        👉 Purpose:
                        list me har item ko uniquely identify karna

                        🔥 value kya hai?
                        👉 Ye actual data hai jo select hone par milega
                      */}

                      {optionLabel}
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
                // “jo hum type kar rahe wo UI me dikhega .name se” nhi

                // 🔹 Example

                // Agar:

                // getControlItem.name = "email"

                // Aur tum type karte ho:

                // rahul@gmail.com
                // }

                // 👉 To ye banega:

                // formData = {
                //   email: "rahul@gmail.com"
                // }
              })
            }
          />
        );
        break;

      case "autocomplete":
        // this is only for suggest for states
        element = (
          <div className="relative">
            <Input
              list={getControlItem.name + "-list"}
              name={getControlItem.name}
              placeholder={getControlItem.placeholder}
              id={getControlItem.name}
              value={value}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  [getControlItem.name]: event.target.value,
                })
              }
            />

            <datalist id={getControlItem.name + "-list"}>
              {getControlItem.options &&
                getControlItem.options.map((option, index) => (
                  <option key={index} value={option} />
                ))}
            </datalist>
          </div>
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div
            className="grid w-full gap-1.5"
            key={controlItem.name}
          >
            {/* 
              🔥 key kyun dete hain?
              👉 key React ko help karta hai:
              list me har element ko uniquely pehchanne ke liye
            */}

            <Label className="mb-1">
              {controlItem.label}
            </Label>

            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>

      <Button
        disabled={isBtnDisabled}
        type="submit"
        className="mt-2 w-full"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;