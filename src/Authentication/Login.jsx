import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successfully!");
      navigate("/");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email format.");
      } else {
        toast.error("Login failed. Try again.");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(
        doc(db, "Users", user.uid),
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: "user",
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      toast.success("Logged in with Google!");
      navigate("/");
    } catch (err) {
      toast.error("Google login failed. Try again.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent.");
    } catch (err) {
      toast.error("Failed to send reset email.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 font-pop p-4">
      <Toaster position="top-right" />
      <div className="w-full p-6 sm:p-8 max-w-sm bg-white rounded-2xl shadow-lg border border-gray-200">
        {/* Title */}
        <h2 className="text-center text-3xl text-gray-900 font-semibold mb-2">
          Welcome Back
        </h2>

        {/* Signup Link */}
        <div className="flex justify-center gap-1 mb-6">
          <p className="text-sm text-gray-600">Don’t have an account?</p>
          <p
            onClick={() => navigate("/signup")}
            className="text-[#000000] text-sm cursor-pointer hover:underline"
          >
            Sign Up
          </p>
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          className="w-full mb-4 p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-2 p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Forgot Password */}
        <p
          onClick={handleForgotPassword}
          className="text-right text-sm text-[#000000] mb-4 cursor-pointer hover:underline"
        >
          Forgot Password?
        </p>

        {/* Login Button */}
        <button
          className="w-full p-3 rounded-xl bg-[#000000] text-[#ffffff] font-semibold mb-6"
          onClick={handleLogin}
        >
          Login
        </button>

        {/* Divider */}
        <p className="text-gray-500 text-center text-sm mb-5 border-b border-gray-300 pb-2">
          or login with
        </p>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold rounded-xl py-3 mb-6 hover:bg-gray-100 transition border border-gray-300 shadow-sm"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Terms */}
        <p className="text-[13px] text-center text-gray-600">
          By logging in, you agree to Recognotes
        </p>

        <div className="flex gap-2 justify-center mt-1 text-[13px]">
          <p
            onClick={() => navigate("/terms")}
            className="text-[#000000] cursor-pointer hover:underline"
          >
            Terms of use
          </p>
          <p className="text-gray-600">and</p>
          <p
            onClick={() => navigate("/privacy")}
            className="text-[#000000] cursor-pointer hover:underline"
          >
            Privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}
