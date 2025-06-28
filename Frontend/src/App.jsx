import { Route, BrowserRouter as Router, Routes, Outlet } from 'react-router-dom';
import Header from './pages/public/header';
import Footer from './pages/public/footer';
import Home from './pages/public/home';
import Authenticate from './pages/authentication';
import Admin from './pages/admin/admin';
import Customers from './pages/admin/customers';
import Sellers from './pages/admin/sellers';
import Products from './pages/admin/products';
import Cart from './pages/public/cart';
import Client from './pages/client/client';
import ProfileInfo from './pages/client/profileInfo';
import Address from './pages/client/address';
import Orders from './pages/client/order';
import Wishlist from './pages/client/wishlist';
import Checkout from './pages/public/checkout';
import { AuthProvider } from './Context/AuthContext';
import './App.css';

function BasicLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

function ClientLayout() {
  return (
    <>
      <Header />
      <div style={{ display: 'flex' }}>
        <Client />
        <Outlet />
      </div>
      <Footer />
    </>
  )
}

function AdminLayout() {
  return (
    <div style={{ display: 'flex', padding: '0.5rem' }}>
      <Admin />
      <Outlet />
    </div>
  )
}

function CheckoutLayout() {
  return <Outlet />
}

function App() {

  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path='/' element={<BasicLayout />}>
              <Route index element={<Home />} />
              <Route path='/auth' element={<Authenticate />} />
              <Route path='/cart' element={<Cart />} />

            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Customers />} />
              <Route path='/admin/sellers' element={<Sellers />} />
              <Route path='/admin/products' element={<Products
              />} />
            </Route>
            <Route path="/account" element={<ClientLayout />}>
              <Route index element={<ProfileInfo />} />
              <Route path='/account/addresses' element={<Address />} />
              <Route path='/account/orders' element={<Orders />} />
              <Route path='/account/wishlist' element={<Wishlist />} />
            </Route>
            <Route path='/checkout' element={<CheckoutLayout />}>
              <Route index element={<Checkout />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
