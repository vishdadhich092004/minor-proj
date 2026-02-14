import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MainLayout from './layouts/MainLayout';
import { useAuth } from './context/AuthContext';
import { Outlet } from 'react-router-dom';
import ProductList from './pages/Products/ProductList';
import ProductForm from './pages/Products/ProductForm';
import CategoryList from './pages/Categories/CategoryList';
import CategoryForm from './pages/Categories/CategoryForm';
import SubCategoryList from './pages/SubCategories/SubCategoryList';
import SubCategoryForm from './pages/SubCategories/SubCategoryForm';
import BrandList from './pages/Brands/BrandList';
import BrandForm from './pages/Brands/BrandForm';
import OrderList from './pages/Orders/OrderList';
import OrderDetails from './pages/Orders/OrderDetails';
import VariantTypeList from './pages/Variants/VariantTypeList';
import VariantTypeForm from './pages/Variants/VariantTypeForm';
import VariantList from './pages/Variants/VariantList';
import VariantForm from './pages/Variants/VariantForm';
import PosterList from './pages/Posters/PosterList';
import PosterForm from './pages/Posters/PosterForm';
import NotificationList from './pages/Notifications/NotificationList';
import NotificationForm from './pages/Notifications/NotificationForm';
import CouponList from './pages/Coupons/CouponList';
import CouponForm from './pages/Coupons/CouponForm';
import UserList from './pages/Users/UserList';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Product Routes */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />

          {/* Category Routes */}
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/new" element={<CategoryForm />} />
          <Route path="/categories/edit/:id" element={<CategoryForm />} />

          {/* SubCategory Routes */}
          <Route path="/sub-categories" element={<SubCategoryList />} />
          <Route path="/sub-categories/new" element={<SubCategoryForm />} />
          <Route path="/sub-categories/edit/:id" element={<SubCategoryForm />} />

          {/* Brand Routes */}
          <Route path="/brands" element={<BrandList />} />
          <Route path="/brands/new" element={<BrandForm />} />
          <Route path="/brands/edit/:id" element={<BrandForm />} />

          {/* Order Routes */}
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/:id" element={<OrderDetails />} />

          {/* Variant Type Routes */}
          <Route path="/variant-types" element={<VariantTypeList />} />
          <Route path="/variant-types/new" element={<VariantTypeForm />} />
          <Route path="/variant-types/edit/:id" element={<VariantTypeForm />} />

          {/* Variant Routes */}
          <Route path="/variants" element={<VariantList />} />
          <Route path="/variants/new" element={<VariantForm />} />
          <Route path="/variants/edit/:id" element={<VariantForm />} />

          {/* Poster Routes */}
          <Route path="/posters" element={<PosterList />} />
          <Route path="/posters/new" element={<PosterForm />} />
          <Route path="/posters/edit/:id" element={<PosterForm />} />

          {/* Notification Routes */}
          <Route path="/notifications" element={<NotificationList />} />
          <Route path="/notifications/new" element={<NotificationForm />} />

          {/* Coupon Routes */}
          <Route path="/coupons" element={<CouponList />} />
          <Route path="/coupons/new" element={<CouponForm />} />
          <Route path="/coupons/edit/:id" element={<CouponForm />} />

          {/* User Routes */}
          <Route path="/users" element={<UserList />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
