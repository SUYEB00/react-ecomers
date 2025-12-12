import React from "react";

const CatagoriesNav = ({ cetgories, selectCategory, setSelectCategory }) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 md:gap-5 py-6 sm:py-8 md:py-10">
      {cetgories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectCategory(cat)}
          className={`px-3 py-1 text-sm sm:px-4 sm:py-1.5 sm:text-base 
            rounded-md font-medium transition-all duration-200
            ${
              selectCategory === cat
                ? "bg-black text-white shadow-sm"
                : "border border-gray-600 text-gray-800 hover:bg-black hover:text-white"
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CatagoriesNav;
