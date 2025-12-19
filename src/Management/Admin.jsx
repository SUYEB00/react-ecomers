import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaEnvelopeOpenText,
  FaUsers,
  FaImages,
  FaCreditCard,
  FaBoxOpen,
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Order Management",
      desc: "View & verify customer orders",
      icon: <FaClipboardList />,
      path: "/ordermanagement",
    },
    {
      title: "Message Management",
      desc: "Customer messages & inquiries",
      icon: <FaEnvelopeOpenText />,
      path: "/messagemanagement",
    },
    {
      title: "User Management",
      desc: "Manage registered users",
      icon: <FaUsers />,
      path: "/usermanagement",
    },
    {
      title: "Slider Management",
      desc: "Homepage slider banners",
      icon: <FaImages />,
      path: "/addslider",
    },
    {
      title: "Payment Methods",
      desc: "Add or update payment numbers",
      icon: <FaCreditCard />,
      path: "/addpaymentnumber",
    },
    {
      title: "Product Management",
      desc: "Add, update & manage products",
      icon: <FaBoxOpen />,
      path: "/addproducts",
    },
  ];

  return (
    <div className="w-11/12 mx-auto mt-10 font-pop">
      <h1 className="text-3xl font-bold mb-2 text-black">🛠 Admin Dashboard</h1>
      <p className="text-gray-500 mb-8">Manage your store content and orders</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.path)}
            className="cursor-pointer bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl text-black">{item.icon}</div>
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
