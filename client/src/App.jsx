import "./App.css";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginForm } from "./components/auth/LoginForm";
import { SignupForm } from "./components/auth/SignupForm";
import { ProductManagement } from "./components/admin/ProductManagement";
import { ProductForm } from "./components/admin/ProductForm";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/ContactUs";
import Cart from "./pages/Cart";
import UserLogin from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import AllProducts from "./pages/AllProducts";
import useCartStore from "./store/ecomStore";
import  useAuthStore  from "./store/AuthStore";
function App() {
  const { isAuthenticated } = useAuthStore();
  const {fetchProducts} = useCartStore();
  console.log(isAuthenticated, "is Authenticated");

  useEffect(() => {
   fetchProducts();
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
      <Router>
        <div className="min-h-screen bg-background">
          <div className="">
            <Routes>
              <Route
                path="/admin/login"
                element={
                  !isAuthenticated ? (
                    <LoginForm />
                  ) : (
                    <Navigate to="/admin/products" />
                  )
                }
              />
              <Route
                path="/admin/signup"
                element={
                  !isAuthenticated ? <SignupForm /> : <Navigate to="/" />
                }
              />

              <Route path="/login" element={<UserLogin />} />
              <Route path="/register" element={<Register />} />

              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />

              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductDetail />} />

              <Route path="/products" element={<AllProducts />} />
              

              {/* Admin Routes */}
              <Route
                path="/admin/products"
                element={
                  isAuthenticated ? (
                    <ProductManagement />
                  ) : (
                    <Navigate to="/admin/login" />
                  )
                }
              />
              <Route
                path="/admin/products/new"
                element={
                  isAuthenticated ? (
                    <ProductForm />
                  ) : (
                    <Navigate to="/admin/login" />
                  )
                }
              />
              <Route
                path="/admin/products/edit/:id"
                element={
                  isAuthenticated ? (
                    <ProductForm isEditing={true} />
                  ) : (
                    <Navigate to="/admin/login" />
                  )
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
