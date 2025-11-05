import React from 'react'
import { FaStar } from 'react-icons/fa'
import { FaRegStarHalfStroke } from 'react-icons/fa6'

const ProductCard = ({products}) => {
  return (
    <div className='font-mon transition-transform duration-300 hover:scale-105 border border-[#E5E7EB] rounded-2xl bg-[#ffffff]'>
     <img src={products.product_picture} alt={products.title}
     className='h-[80%] mx-auto w-[80%] object-cover rounded-lg'
     />
     <div className='flex p-2'>
        <div>
            <h3 className='text-[#21214c] fonr-mon'>
                {products.title}
            </h3>
            <div className='flex text-[#f6a355]'><FaStar/> <FaStar/> <FaStar/> <FaStar/> <FaRegStarHalfStroke/></div>
            <p className='flex gap-2 mb-6'><div className='line-through'>{products.withoutdis}</div> <strong>{products.price}</strong>  BDT</p>
        </div>
     </div>
    </div>
  )
}

export default ProductCard