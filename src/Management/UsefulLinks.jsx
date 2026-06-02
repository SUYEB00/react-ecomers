import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineClipboardCopy, HiOutlineExternalLink } from "react-icons/hi";

const UsefulLinks = () => {
  const chatgptPrompt = `product photography,
studio lighting from top-left,
soft realistic shadow below,
pure white background,
sharp mesh texture detail,
e-commerce product photo,
centered, clean edges,
no logo distortion, no reflections,
amazon catalog style`;

  const links = [
    {
      title: "ChatGPT",
      description:
        "AI assistant for content, coding, product descriptions and more",
      url: "https://chatgpt.com",
      logo: "https://chatgpt.com/favicon.ico",
      type: "chatgpt",
    },
    {
      title: "Canva Templates",
      description: "Banner & Product design templates",
      logo: "https://www.canva.com/favicon.ico",
      templates: [
        {
          name: "Banner Template",
          url: "https://canva.link/xmag04wxgo7se4u",
        },
        {
          name: "Product Template",
          url: "https://canva.link/975ptp16h3xnx29",
        },
      ],
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
      description: "Learn how to manage payment methods",
      url: "https://www.youtube.com/watch?v=VIDEO_ID_3",
      logo: "https://www.youtube.com/favicon.ico",
    },
    {
      title: "YouTube – Order Management",
      description: "Learn how to manage orders",
      url: "https://www.youtube.com/watch?v=VIDEO_ID_4",
      logo: "https://www.youtube.com/favicon.ico",
    },
    {
      title: "YouTube – Message Management",
      description: "Learn how to manage messages",
      url: "https://www.youtube.com/watch?v=VIDEO_ID_5",
      logo: "https://www.youtube.com/favicon.ico",
    },
    {
      title: "YouTube – User Management",
      description: "Learn how to manage users",
      url: "https://www.youtube.com/watch?v=VIDEO_ID_6",
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
      {" "}
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center mb-2">
        Useful Links & Resources
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Helpful tools, tutorials & quick contacts
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {links.map((link, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow hover:shadow-lg transition group"
          >
            {/* Header */}
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

            {/* ChatGPT Prompt */}
            {link.type === "chatgpt" && (
              <div className="mt-4 p-3 bg-gray-50 border border-dashed rounded-xl">
                <p className="font-semibold text-sm mb-2">
                  Ready-to-Use Prompt
                </p>

                <pre className="text-xs text-gray-700 whitespace-pre-wrap mb-3">
                  {chatgptPrompt}
                </pre>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(chatgptPrompt);
                    toast.success("Prompt copied!");
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-lg text-xs hover:bg-gray-800 transition"
                >
                  <HiOutlineClipboardCopy />
                  Copy Prompt
                </button>
              </div>
            )}

            {/* Canva Templates */}
            {link.templates && (
              <div className="mt-4 flex flex-col gap-2">
                {link.templates.map((template, i) => (
                  <a
                    key={i}
                    href={template.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition"
                  >
                    {template.name}
                  </a>
                ))}
              </div>
            )}

            {/* Regular Link */}
            {link.url && (
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 mt-4 hover:underline"
              >
                Open Link
                <HiOutlineExternalLink />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsefulLinks;
