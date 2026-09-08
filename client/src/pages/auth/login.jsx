import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";  // Link ek component hai jo use hota hai page navigation ke liye (without reload)

// 🔹 Normal <a> vs Link
// ❌ HTML <a>
// <a href="/about">About</a>

// 👉 Page reload ho jata hai
// 👉 React state reset ho jati hai

// ✅ React Link
// <Link to="/about">About</Link>

// 👉 Page reload nahi hota
// 👉 Smooth navigation (SPA behavior)

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // 🔥 Ye pata karega ki login page par user kahan se aaya tha
  const location = useLocation();

  // 🔥 Login ke baad required page par bhejne ke liye
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault(); // isse form submit hone ke bad reload nhi hoga page

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });

        // 🔥 IMPORTANT:
        // Login response se logged-in user ka role check kar rahe hain.
        // Agar admin hai → direct Admin Dashboard par bhejo.
        if (data?.payload?.user?.role === "admin") {
          navigate("/admin/dashboard");
          return;
        }

        // 🔥 Normal user ke case me:
        // Agar user checkout ya kisi protected page se login karne aaya tha,
        // to login ke baad usi page par wapas bhejenge.
        if (location.state?.from) {
          navigate(location.state.from);
        } else {
          // Normal login ke case me home page par jayega
          navigate("/shop/home");
        }
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>

        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium text-blue-700 ml-2 px-2 hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>

      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />

      {/* 🔥 Back to Home button */}
      <div className="text-left">
        <Link
          to="/shop/home"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to Home
        </Link>
      </div>

    </div>
  );
}

export default AuthLogin;