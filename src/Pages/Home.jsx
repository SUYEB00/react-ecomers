import ImageCarousel from "../components/ImageCarousel";
import Allproducts from "../components/Allproducts";
import { Toaster } from "react-hot-toast";
import LatestProducts from "../produts/LatestProducts";
import Partner from "../components/Partner";
import NewArrivals from "../produts/NewArrivals";
import BestDeals from "../produts/BestDeals";

export default function Home() {
  return (
    <div>
      <ImageCarousel />
      <main>
        <Allproducts></Allproducts>
        <Toaster position="top-right"></Toaster>
        <NewArrivals></NewArrivals>
        <BestDeals></BestDeals>
        <LatestProducts></LatestProducts>
        <Partner></Partner>
      </main>
    </div>
  );
}
