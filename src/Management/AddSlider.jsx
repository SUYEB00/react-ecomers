import React from "react";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import toast, { Toaster } from "react-hot-toast";
import { HiOutlinePhotograph, HiOutlineTrash } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";

const AddSlider = () => {
  // SLIDER STATE
  const [slider, setSlider] = useState({
    slider_img: "",
  });

  const [sliderList, setSliderList] = useState([]);

  const handleSliderChange = (e) => {
    setSlider({ ...slider, [e.target.name]: e.target.value });
  };

  // ADD SLIDER
  const handleSliderSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "Sliders"), slider);
      toast.success("Slider Added!");

      setSlider({ slider_img: "" });
      fetchSlider();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add Slider");
    }
  };

  // FETCH SLIDER
  const fetchSlider = async () => {
    const querySnapshot = await getDocs(collection(db, "Sliders"));
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSliderList(items);
  };

  useEffect(() => {
    fetchSlider();
  }, []);

  // DELETE SLIDER
  const deleteSlider = async (id) => {
    await deleteDoc(doc(db, "Sliders", id));
    toast.success("Slider deleted!");
    setSliderList(sliderList.filter((item) => item.id !== id));
  };

  return (
    <div className="w-11/12 mx-auto font-mon mt-10">
      <Toaster position="top-right" />

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-2 text-black">
          <HiOutlinePhotograph className="text-gray-600" />
          Slider Management
        </h2>

        <div className="text-lg font-semibold text-gray-700">
          Total Sliders:
          <span className="ml-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
            {sliderList.length}
          </span>
        </div>
      </div>

      {/* ADD SLIDER */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FiPlus />
          Add New Slider
        </h3>

        <form
          onSubmit={handleSliderSubmit}
          className="flex flex-col md:flex-row gap-4"
        >
          <input
            name="slider_img"
            value={slider.slider_img}
            onChange={handleSliderChange}
            placeholder="Paste slider image URL"
            className="flex-1 p-3 bg-gray-50 border border-gray-300 rounded-xl focus:border-black focus:outline-none"
            required
          />

          <button
            type="submit"
            className="px-6 py-3 bg-black text-white rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 transition"
          >
            <FiPlus />
            Add Slider
          </button>
        </form>
      </div>

      {/* SLIDER GRID */}
      <h3 className="text-2xl font-bold mb-4">All Sliders</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {sliderList.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >
            {/* IMAGE PREVIEW */}
            <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={item.slider_img}
                alt="Slider"
                className="h-full w-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>

            {/* CONTENT */}
            <div className="p-4 flex flex-col gap-3">
              <p className="text-xs text-gray-500 break-all">
                {item.slider_img}
              </p>

              <button
                onClick={() => deleteSlider(item.id)}
                className="mt-2 inline-flex items-center justify-center gap-1 px-4 py-2 bg-black text-white rounded-xl text-sm hover:bg-red-600 transition"
              >
                <HiOutlineTrash />
                Delete
              </button>
            </div>
          </div>
        ))}

        {sliderList.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No sliders added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default AddSlider;
