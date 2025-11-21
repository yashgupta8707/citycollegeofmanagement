import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loading from './components/Loading';
import RegistrationDetails from './pages/RegistrationDetails';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const Facilities = lazy(() => import('./pages/Facilities'));
const Founder = lazy(() => import('./pages/Founder'));
const Director = lazy(() => import('./pages/Director'));
const Contact = lazy(() => import('./pages/Contact'));
const Registration = lazy(() => import('./pages/Registration'));
const DElEd = lazy(() => import('./pages/Deled'));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/founder-message" element={<Founder />} />
              <Route path="/director-message" element={<Director />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/registration-details/:id" element={<RegistrationDetails />} />
              <Route path="/deled" element={<DElEd />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
}

export default App;