import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const navigate = useNavigate();

 const handleSignup = async () => {
  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user.user, { displayName: name });

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
     <div className="min-h-screen flex items-center justify-center bg-gray-100 font-pop">
      <Toaster  position='top-right'></Toaster>
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

        <input
          type="Name"
          placeholder="Name"
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#000000]"
          onChange={e => setName(e.target.value)}
        />
        
         <input
          type="Email"
          placeholder="Email"
          className="w-full mb-5 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#000000]"
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-5 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#000000]"
          onChange={e => setPassword(e.target.value)}
        />

         <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
          onChange={e => setConfirmPassword(e.target.value)}
        />

        <div className="text-sm mb-5" onClick={() => navigate("/login")}>
        <p className="text-gray-600">Already have an account yet?</p>
        <p className="text-red-500">Login instead</p>
      </div>

        <button
          onClick={handleSignup}
          className="w-full bg-[#ff8f9c] text-white py-3 rounded-xl hover:bg-[#000000] transition"
        >
         Sign Up
        </button>
      </div>
    </div>
  );
}
