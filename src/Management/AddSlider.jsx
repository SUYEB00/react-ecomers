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

      <h2 className="text-2xl font-bold mb-5">Add Slider</h2>

      {/* SLIDER LIST */}
      <h2 className="text-xl font-bold mt-5 mb-3">All Sliders</h2>

      {/* TOTAL SLIDER */}
      <div className="mb-5 text-xl font-semibold text-[#21214c]">
        Total Sliders: <span className="text-red-500">{sliderList.length}</span>
      </div>

      <form onSubmit={handleSliderSubmit} className="space-y-4">
        <input
          name="slider_img"
          value={slider.slider_img}
          onChange={handleSliderChange}
          placeholder="Slider IMG URL"
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:border-[#000000] focus:outline-none transition"
          required
        />

        <button
          type="submit"
          className="px-4 py-2 bg-[#000000] text-white rounded mb-5"
        >
          Add Slider
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {sliderList.map((item) => (
          <div
            className="border p-4 rounded-xl flex justify-between items-center border-gray-300"
            key={item.id}
          >
            <div>
              <p className="font-bold mb-2">{item.slider_img}</p>

              <button
                onClick={() => deleteSlider(item.id)}
                className="bg-[#000000] text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddSlider;
