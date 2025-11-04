import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import DonatePage from './pages/DonatePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import HelpPage from './pages/HelpPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PartnersPage from './pages/PartnersPage';
import ProgramsPage from './pages/ProgramsPage';
import NGOsPage from './pages/NGOsPage';
import ProfilePage from './pages/ProfilePage';
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import UsersPage from './pages/admin/UsersPage';
import QueriesPage from './pages/admin/QueriesPage';
import ProgramsPageAdmin from './pages/admin/ProgramsPage';
import NGOsPageAdmin from './pages/admin/NGOsPage';
import GalleryPageAdmin from './pages/admin/GalleryPage';
import PartnersPageAdmin from './pages/admin/PartnersPage';
import AboutPageAdmin from './pages/admin/AboutPage';

function App() {
  useEffect(() => {
    // Initialize AOS when component mounts
    import('aos').then(AOS => {
      AOS.init({
        duration: 700,
        easing: 'ease-in-out',
        once: true,
        offset: 50
      });
    });

    // Import AOS CSS
    import('aos/dist/aos.css');
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="users" element={<UsersPage />} />
                    <Route path="queries" element={<QueriesPage />} />
                    <Route path="programs" element={<ProgramsPageAdmin />} />
                    <Route path="ngos" element={<NGOsPageAdmin />} />
                    <Route path="gallery" element={<GalleryPageAdmin />} />
                    <Route path="partners" element={<PartnersPageAdmin />} />
                    <Route path="about" element={<AboutPageAdmin />} />
                    <Route path="*" element={<UsersPage />} />
                  </Routes>
                </AdminLayout>
              </AdminRoute>
            }
          />
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/donate" element={<DonatePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/help" element={<HelpPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/partners" element={<PartnersPage />} />
                  <Route path="/programs" element={<ProgramsPage />} />
                  <Route path="/ngos" element={<NGOsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
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
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
