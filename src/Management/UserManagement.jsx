import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  // FETCH ALL USERS
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

  // DELETE USER
  const deleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "Users", id));
      fetchUsers(); // refresh list
    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-5 w-11/12 mx-auto font-pop">
      <h1 className="text-3xl font-bold mb-5 text-[#000000]">
        User Management
      </h1>

      {/* TOTAL USERS */}
      <div className="mb-5 text-xl font-semibold text-[#21214c]">
        Total Users: <span className="text-red-500">{users.length}</span>
      </div>

      {/* USERS TABLE */}
      <div className="overflow-x-auto bg-white rounded-2xl p-4 border border-gray-200 shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Action</th> {/* DELETE COLUMN */}
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">{u.createdAt?.slice(0, 10)}</td>

                {/* DELETE BUTTON */}
                <td className="p-3">
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="bg-[#000000] text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
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
