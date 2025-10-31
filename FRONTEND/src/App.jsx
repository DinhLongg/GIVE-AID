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
import PartnersPage from './pages/PartnersPage';
import ProgramsPage from './pages/ProgramsPage';
import ProfilePage from './pages/ProfilePage';

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
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Layout>
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
