import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AdminRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "Users", user.uid));

      if (snap.exists() && snap.data().role === "admin") {
        setIsAdmin(true);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return null;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
