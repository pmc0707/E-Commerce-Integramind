import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./utils/authContext";
import LandingPage from "./pages/landing/landingPage";
import PageNotImplemented from "./pages/pageEmpty";
import DashboardPage from "@/pages/dashboard";
import CommonHeader from "@/Components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductList from "./pages/productList/ProductList";
import Order from "./pages/order/Order";
import Product from "./Components/Product";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import OrderHistory from "./pages/OrderHistory/index";
import Address from "./pages/Profile/Address";
import Cart from "./Components/Cart";
import Buy from "./Components/Buy";
import OrderTracking from "./pages/OrderTrackingPage";
import ContactInfo from "./pages/Contact";
import About from "./pages/About";
import CouponForm from "./pages/Coupons/CouponForm";
import CouponList from "./pages/Coupons/CouponList";
import EditCoupon from "./pages/Coupons/EditCoupon";
import UserCoupons from "./pages/Coupons/UserCoupons";
import Checkout from "./pages/Coupons/Checkout";


import Review_Rating from "./pages/OrderHistory/Review_rating"

const BlankLayout = () => {
  return (
    <>
      <CommonHeader />
      <main>
        <div className="bg-overlay"></div>
        <Outlet />
        <ToastContainer />
      </main>
    </>
  );
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <BlankLayout />,
      children: [
        { path: "/", element: <LandingPage /> },
        { path: "/dashboard", element: <DashboardPage /> },
        { path: "/product/:id", element: <Product /> },
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        {path:"/tracking",element:<OrderTracking/>},
        { path: "/profile", element: <Profile /> },
        { path: "/order-history", element: <OrderHistory /> },
        { path: "/cart", element: <Cart /> },
        { path: "/buy/:id", element: <Buy /> },
        { path:"/review_rating/:id",element:<Review_Rating/>},
        { path: "/contact", element: <ContactInfo  /> },
        { path: "/services", element: <main>Services</main> },
        { path: "/about", element:<About /> },
        { path: "/order", element: <Order /> },
        { path: "/address", element: <Address /> },
        { path: "*", element: <PageNotImplemented /> },
        { path: "/productList", element: <ProductList /> },
        { path: "/coupan-form", element: <CouponForm /> },
        { path: "/coupons", element: <CouponList /> },
        { path:"/edit-coupon/:id" , element:<EditCoupon />},
        { path:"/user-coupons" , element:<UserCoupons />},
        { path:"/checkout" , element:<Checkout />},
        {path: "/",element: <LandingPage />,},
        {path: "/dashboard",element: <DashboardPage />,},
        {path: "/product/:id",element: <Product />,},
        {path: "/login",element: <Login />,},
        {path: "/register",element: <Register />,},
        {path: "/profile",element: <Profile />,},
        {path: "/order-history",element: <OrderHistory />,},
        {path: "/cart",element: <Cart />,},
        {path: "/buy",element: <Buy />,},
        {path: "/contact",element: <main>Contact Us</main>,},
        {path: "/services",element: <main>Services</main>,},
        {path: "/Orders",element: <Order />,},
        {path: "/address",element: <Address />,},
        {path: "*",element: <PageNotImplemented />,},
        {path: "/productList",element: <ProductList />,},
      ],
    },
  ]);

  return (
    <AuthProvider><RouterProvider router={router} /></AuthProvider>
  );
};

export default App;
