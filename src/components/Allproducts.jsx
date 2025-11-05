import React, { useEffect, useState } from 'react'
import CatagoriesNav from './CatagoriesNav';
import toast from 'react-hot-toast';
import ProductCard from './ProductCard';

const Allproducts = () => {
  const [products, setProducts] = useState ([]);
  const [loading, setLoading] = useState(true);
  const [selectCategory, setSelectCategory] = useState("All");
  const [showAll, setShowall] = useState(false)

  useEffect (()=>{
    fetch("/Products.json")
    .then(res => res.json())
    .then(data => setProducts(data))
    .catch((error)=>{
      console.log(error);
      toast.error("Failed to products Data!!!")
    })
    .finally(()=> setLoading(false))
  },[])

 const cetgories = ["All", ...new Set(products.map(m => m.category))];
 const filterproducts = selectCategory === "All" ? products : products.filter(m=> m.category === selectCategory);
 const visibleproducts = showAll ? filterproducts : filterproducts.slice(0,8);

  return (
    <div className='w-11/12 mx-auto'>
      <CatagoriesNav
        cetgories ={cetgories}
        selectCategory ={selectCategory}
        setSelectCategory = {setSelectCategory}
      ></CatagoriesNav>
      {
        loading ?
        (
          <div className='flex justify-content-center items-center h-64'>   
            <span className="loading loading-dots loading-xs text-[#ad191b]"></span>
          </div>
        )
        : filterproducts.length > 0 ? 
        (
          <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {
           visibleproducts.map(products=>(
            <ProductCard 
              key = {products.id}
              products = {products}
            ></ProductCard>
           ))
          }
          </div>
          {
            filterproducts.length > 8 && (
              <div className='flex justify-center mt-8'>
                <button
                className='px-6 py-2 rounded-full font-medium transition-all duration-300 border border-red-500 text-[#ad191b] hover:bg-[#ad191b] hover:text-white mb-5'
                onClick={() => setShowall(!showAll)}
                >{showAll ? "Show Less" : "Show More"}</button>
              </div>
            )
          }
          </>
        ): (
          <p className='text-[#ad191b] text-center'>No Products Found</p>
        )
      }
    </div>
  )
}

export default Allproducts
