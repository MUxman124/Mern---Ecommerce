import ProductDetailView from "../views/ProductDetailView";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
const ProductDetail = () => {
  return (
    <div>
      <NavBar />
      <ProductDetailView />
      <Footer />
    </div>
  );
};

export default ProductDetail;
