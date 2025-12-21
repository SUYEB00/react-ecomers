import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineClipboardCopy, HiOutlineExternalLink } from "react-icons/hi";

const UsefulLinks = () => {
  const playgroundPrompt = `
product photography,
studio lighting from top-left,
soft realistic shadow below,
pure white background,
sharp mesh texture detail,
e-commerce product photo,
centered, clean edges,
no logo distortion, no reflections,
amazon catalog style
`;

  const links = [
    {
      title: "Playground AI",
      description: "Generate AI product images",
      url: "https://playgroundai.com",
      logo: "https://playgroundai.com/favicon.ico",
      type: "playground",
    },
    {
      title: "Canva Templates",
      description: "Ready-made design templates",
      url: "https://www.canva.com/templates/EAFxnNPk5SE/",
      logo: "https://www.canva.com/favicon.ico",
    },
    {
      title: "ImageBB",
      description: "Free image hosting service",
      url: "https://imgbb.com/",
      logo: "https://i.ibb.co/2k0X1Yb/imgbb-logo.png",
    },

    {
      title: "YouTube – Banner Management",
      description: "Learn how to manage banner",
      url: "https://www.youtube.com/watch?v=VIDEO_ID_1",
      logo: "https://www.youtube.com/favicon.ico",
    },
    {
      title: "YouTube – Products Management",
      description: "Learn how to manage products",
      url: "https://www.youtube.com/watch?v=VIDEO_ID_2",
      logo: "https://www.youtube.com/favicon.ico",
    },
    {
      title: "YouTube – Payment Method Management",
      description: "Learn how to manage payment method",
      url: "https://www.youtube.com/watch?v=VIDEO_ID_2",
      logo: "https://www.youtube.com/favicon.ico",
    },
    {
      title: "YouTube – Order Management",
      description: "Learn how to manage order",
      url: "https://www.youtube.com/watch?v=VIDEO_ID_2",
      logo: "https://www.youtube.com/favicon.ico",
    },
    {
      title: "YouTube – Message Management",
      description: "Learn how to manage message",
      url: "https://www.youtube.com/watch?v=VIDEO_ID_2",
      logo: "https://www.youtube.com/favicon.ico",
    },
    {
      title: "YouTube – User Management",
      description: "Learn how to manage users",
      url: "https://www.youtube.com/watch?v=VIDEO_ID_2",
      logo: "https://www.youtube.com/favicon.ico",
    },
    {
      title: "Developer WhatsApp",
      description: "Contact developer for support",
      url: "https://wa.me/8801940686844",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
    },
  ];

  return (
    <div className="w-11/12 mx-auto mt-10 mb-10 font-pop">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold text-center mb-2">
        Useful Links & Resources
      </h1>

      <p className="text-center text-gray-500 mb-8">
        Helpful tools, tutorials & quick contacts
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow hover:shadow-lg transition group"
          >
            {/* HEADER */}
            <div className="flex items-center gap-3 mb-3">
              <img
                src={link.logo}
                alt={link.title}
                className="w-8 h-8 object-contain"
              />

              <h3 className="font-bold text-lg flex items-center gap-1">
                {link.title}
                <HiOutlineExternalLink className="text-sm text-gray-400 group-hover:text-black" />
              </h3>
            </div>

            <p className="text-sm text-gray-600">{link.description}</p>

            {/* PLAYGROUND PROMPT */}
            {link.type === "playground" && (
              <div className="mt-4 p-3 bg-gray-50 border border-dashed rounded-xl">
                <p className="font-semibold text-sm mb-2">
                  Ready-to-Use Prompt
                </p>

                <pre className="text-xs text-gray-700 whitespace-pre-wrap mb-3">
                  {playgroundPrompt}
                </pre>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigator.clipboard.writeText(playgroundPrompt);
                    toast.success("Prompt copied!");
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-lg text-xs hover:bg-gray-800 transition"
                >
                  <HiOutlineClipboardCopy />
                  Copy Prompt
                </button>
              </div>
            )}

            <p className="text-xs text-blue-600 mt-4">Open link →</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default UsefulLinks;
