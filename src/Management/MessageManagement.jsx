import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import toast, { Toaster } from "react-hot-toast";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const snapshot = await getDocs(collection(db, "ContactMessages"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch messages.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const deleteMessage = async (id) => {
    try {
      await deleteDoc(doc(db, "ContactMessages", id));
      toast.success("Message deleted!");
      setMessages(messages.filter((msg) => msg.id !== id));
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete message.");
    }
  };

  return (
    <div className="w-11/12 mx-auto mt-10 font-pop">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center text-[#ff8f9c] mb-6">
        Message Management
      </h1>

      {/* TOTAL ORDERS */}
      <div className="mb-5 text-xl font-semibold text-[#21214c]">
        Total Messages:{" "}
        <span className="text-[#ff8f9c]">{messages.length}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-xl">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Message</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="text-center">
                <td className="p-2 border">{msg.name}</td>
                <td className="p-2 border">{msg.email}</td>
                <td className="p-2 border">{msg.message}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
