import React, { useEffect, useState } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlineGlobe } from "react-icons/hi";

const WebsiteSettings = () => {
  const [settings, setSettings] = useState({
    websiteName: "",
    email: "",
    phone: "",
    facebook: "",
    instagram: "",
    youtube: "",
    whatsapp: "",
  });

  const loadData = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, "Settings", "Website"));

      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data());
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load settings");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveSettings = async () => {
    try {
      await setDoc(doc(db, "Settings", "Website"), settings);

      toast.success("Settings Saved Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="w-11/12 mx-auto py-10 font-mon">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <HiOutlineGlobe className="text-3xl text-gray-700" />
        <h1 className="text-3xl font-bold">Website Settings</h1>
      </div>

      {/* WEBSITE INFORMATION */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-5">Website Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Website Name"
            value={settings.websiteName}
            onChange={(e) =>
              setSettings({
                ...settings,
                websiteName: e.target.value,
              })
            }
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
          />

          <input
            type="email"
            placeholder="Email Address"
            value={settings.email}
            onChange={(e) =>
              setSettings({
                ...settings,
                email: e.target.value,
              })
            }
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
          />

          <input
            type="text"
            placeholder="Contact Number"
            value={settings.phone}
            onChange={(e) =>
              setSettings({
                ...settings,
                phone: e.target.value,
              })
            }
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* SOCIAL LINKS */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-5">Social Media Links</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="url"
            placeholder="Facebook URL"
            value={settings.facebook}
            onChange={(e) =>
              setSettings({
                ...settings,
                facebook: e.target.value,
              })
            }
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
          />

          <input
            type="url"
            placeholder="Instagram URL"
            value={settings.instagram}
            onChange={(e) =>
              setSettings({
                ...settings,
                instagram: e.target.value,
              })
            }
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
          />

          <input
            type="url"
            placeholder="YouTube URL"
            value={settings.youtube}
            onChange={(e) =>
              setSettings({
                ...settings,
                youtube: e.target.value,
              })
            }
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
          />

          <input
            type="url"
            placeholder="WhatsApp Link"
            value={settings.whatsapp}
            onChange={(e) =>
              setSettings({
                ...settings,
                whatsapp: e.target.value,
              })
            }
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black"
          />
        </div>
      </div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default WebsiteSettings;
