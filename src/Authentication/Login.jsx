import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successfully!");
      navigate("/");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        toast.error("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password. Try again.");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Invalid email format.");
      } else {
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-pop">
      <Toaster position="top-right"></Toaster>
      <div className="w-11/12 max-w-sm bg-white p-8 rounded-2xl border border-gray-200 shadow">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#202020]"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#202020]"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="text-sm mb-5" onClick={() => navigate("/signup")}>
          <p className="text-gray-600">Don’t have an account yet?</p>
          <p className="text-red-500">Register instead</p>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-[#ff8f9c] text-white py-3 rounded-xl hover:bg-[#000000] transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
