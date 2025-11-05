import React from 'react'

const CatagoriesNav = ({cetgories, selectCategory, setSelectCategory}) => {
  return (
    <div className='flex flex-wrap justify-center items-center gap-3 md:gap-5 py-10'>
       {
       cetgories.map(cat=>(
        <button 
        key={cat}
        onClick={()=> setSelectCategory(cat)}
        className={`px-4 py-2 sm:px-2 sm:py-1 rounded-full font-medium transition-all duration-300
           ${selectCategory === cat ? "bg-[#ad191b] text-white" : "border border-red-500 text-[#ad191b] hover:bg-[#ad191b] hover:text-white"} 
            
            `}
        >{cat}
            </button>
       ))
       }
    </div>
  )
}

export default CatagoriesNav
