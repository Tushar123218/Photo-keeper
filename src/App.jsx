import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { AnimatePresence, motion } from 'framer-motion';
import { auth } from './firebase';

import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Gallery from './components/Gallery';
import Navbar from './components/Navbar';

function App() {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) return <div className="text-white p-8 animate-pulse">Loading...</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {user && <Navbar />}

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public route */}
          <Route
            path="/login"
            element={
              !user ? (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5 }}
                >
                  <Auth />
                </motion.div>
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              user ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <Dashboard />
                </motion.div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/gallery"
            element={
              user ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <Gallery />
                </motion.div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Default route */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
