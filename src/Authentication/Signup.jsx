import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore"; // ✅ ADD THIS
import { db } from "../firebase"; // ✅ ADD THIS
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const googleProvider = new GoogleAuthProvider();

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user to Firestore if new
      await setDoc(
        doc(db, "Users", user.uid),
        {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          role: "user",
          createdAt: new Date().toISOString(),
        },
        { merge: true } // ⬅ If user exists, don't overwrite
      );

      toast.success("Logged in with Google!");
      navigate("/");
    } catch (err) {
      toast.error("Google login failed. Try again.");
    }
  };

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      // 🔥 Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // 🔥 Update display name
      await updateProfile(user, { displayName: name });

      // 🔥 Save user to Firestore → Users collection
      await setDoc(doc(db, "Users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        role: "user", // <— default role
        createdAt: new Date().toISOString(),
      });

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        toast.error("This email is already registered.");
      } else if (err.code === "auth/weak-password") {
        toast.error("Password must be at least 6 characters.");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email format.");
      } else {
        toast.error("Signup failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 font-pop p-4">
      <Toaster position="top-right" />

      <div className="w-full p-6 sm:p-8 max-w-sm bg-white rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-center text-3xl text-gray-900 font-semibold mb-2">
          Create an account
        </h2>

        <div className="flex justify-center gap-1 mb-6">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <p
            onClick={() => navigate("/login")}
            className="text-[#000000] text-sm cursor-pointer hover:underline"
          >
            Login
          </p>
        </div>

        <input
          type="text"
          placeholder="Name"
          className="w-full mb-4 p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email address"
          className="w-full mb-4 p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-4 p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          className="w-full p-3 rounded-xl bg-[#000000] text-[#ffffff] font-semibold mb-6"
          onClick={handleSignup}
        >
          Continue
        </button>

        <p className="text-gray-500 text-center text-sm mb-5 border-b border-gray-300 pb-2">
          or sign up with
        </p>

        <button
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold rounded-xl py-3 mb-6 hover:bg-gray-100 transition border border-gray-300 shadow-sm"
          onClick={handleGoogleSignup}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-[13px] text-center text-gray-600">
          By clicking continue, you agree to Recognotes
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
