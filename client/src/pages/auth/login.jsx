import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { googleLoginUser, loginUser } from "@/store/auth-slice";
import { useEffect, useState } from "react";
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

  console.log(
  "DEPLOYED GOOGLE CLIENT ID:",
  import.meta.env.VITE_GOOGLE_CLIENT_ID
);

  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // 🔥 Ye pata karega ki login page par user kahan se aaya tha
  const location = useLocation();

  // 🔥 Login ke baad required page par bhejne ke liye
  const navigate = useNavigate();

  // 🔥 Normal email/password login ke baad common navigation logic
  function handleLoginSuccess(user) {
    // 🔥 IMPORTANT:
    // Login response se logged-in user ka role check kar rahe hain.
    // Agar admin hai → direct Admin Dashboard par bhejo.
    if (user?.role === "admin") {
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
  }

  function onSubmit(event) {
    event.preventDefault(); // isse form submit hone ke bad reload nhi hoga page

    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });

        handleLoginSuccess(data?.payload?.user);
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }


  // 🔥 Google Login
  // Google Identity Services se credential milega
  // ↓
  // Redux googleLoginUser ko credential bhejega
  // ↓
  // Backend Google token verify karega
  // ↓
  // JWT milega
  // ↓
  // Existing login flow ki tarah user redirect hoga
  function handleGoogleLogin(response) {
    if (!response?.credential) {
      toast({
        title: "Google login failed!",
        variant: "destructive",
      });

      return;
    }

    dispatch(googleLoginUser(response.credential)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });

        handleLoginSuccess(data?.payload?.user);
      } else {
        toast({
          title: data?.payload?.message || "Google login failed!",
          variant: "destructive",
        });
      }
    });
  }


  // 🔥 Google Identity Services initialize
  // Google ki script browser me load hogi
  // ↓
  // Google Sign-In button create hoga
  // ↓
  // User Google button par click karega
  // ↓
  // Google credential callback me bhejega
  useEffect(() => {
    const initializeGoogleLogin = () => {
      if (!window.google) {
        return;
      }

      const googleButton = document.getElementById(
        "google-signin-button"
      );

      if (!googleButton) {
        return;
      }

      // Agar button already render ho chuka hai
      // to dobara render nahi karna
      googleButton.innerHTML = "";

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleGoogleLogin,
      });

      window.google.accounts.id.renderButton(googleButton, {
        theme: "outline",
        size: "large",
        width: 400,
        text: "signin_with",
        shape: "rectangular",
      });
    };


    // 🔥 Agar Google script already loaded hai
    if (window.google) {
      initializeGoogleLogin();
      return;
    }


    // 🔥 Google Identity Services script dynamically load karna
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = initializeGoogleLogin;

    document.head.appendChild(script);


    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);


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


      {/* 🔥 Google Sign-In */}
      <div className="flex flex-col items-center gap-3">

        {/* OR divider */}
        <div className="flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-gray-200"></div>

          <span className="text-sm text-gray-500">
            OR
          </span>

          <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        {/* Google button container */}
        <div
          id="google-signin-button"
          className="flex w-full justify-center"
        >
        </div>

      </div>


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