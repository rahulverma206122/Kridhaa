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
    // Special case for phone number
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
          // only allow digits
          if (/^\d*$/.test(newValue) && newValue.length <= 10) {
            setFormData({
              ...formData,
              [getControlItem.name]: newValue,
            });
          }
        }}
        onBlur={() => {
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
    // Special case for pincode
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
          // only allow digits, max 6
          if (/^\d*$/.test(newValue) && newValue.length <= 6) {
            setFormData({
              ...formData,
              [getControlItem.name]: newValue,
            });
          }
        }}
        onBlur={() => {
          if (value.length !== 6) {
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
    // Normal input
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

      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
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
              })
            }
          />
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
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
