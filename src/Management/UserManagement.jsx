import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { HiOutlineMail, HiOutlineTrash, HiOutlineUser } from "react-icons/hi";
import { FiCalendar } from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Users"));
      const userData = snapshot.docs.map((docu) => ({
        id: docu.id,
        ...docu.data(),
      }));
      setUsers(userData);
    } catch (error) {
      console.log("Error loading users:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "Users", id));
      fetchUsers();
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 w-11/12 mx-auto font-pop">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-black flex items-center gap-2">
          <HiOutlineUser className="text-gray-600" />
          User Management
        </h1>

        <div className="text-lg font-semibold text-gray-700">
          Total Users:
          <span className="ml-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
            {users.length}
          </span>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200 shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Joined</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50 transition">
                {/* NAME */}
                <td className="p-4">
                  <div className="flex items-center gap-2 font-medium text-gray-800">
                    <HiOutlineUser className="text-gray-500" />
                    {u.name || "Unnamed"}
                  </div>
                </td>

                {/* EMAIL */}
                <td className="p-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <HiOutlineMail />
                    {u.email}
                  </div>
                </td>

                {/* ROLE */}
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                ${
                  u.role === "admin"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-200 text-gray-700"
                }`}
                  >
                    <MdAdminPanelSettings />
                    {u.role}
                  </span>
                </td>

                {/* CREATED */}
                <td className="p-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiCalendar />
                    {u.createdAt?.slice(0, 10) || "—"}
                  </div>
                </td>

                {/* ACTION */}
                <td className="p-4 text-center">
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-lg text-xs hover:bg-red-600 transition"
                  >
                    <HiOutlineTrash />
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
