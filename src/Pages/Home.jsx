import ImageCarousel from '../components/ImageCarousel'
import Allproducts from '../components/Allproducts'
import { Toaster } from 'react-hot-toast'
import LatestProducts from '../components/LatestProducts'



export default function Home() {
  return (
    <div>
      <ImageCarousel/>
      <main>
        <Allproducts></Allproducts>
        <Toaster position='top-right'></Toaster>
        <LatestProducts></LatestProducts>
      </main>
    </div>
  )
}


