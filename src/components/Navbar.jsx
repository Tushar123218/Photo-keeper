import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col md:flex-row md:justify-between items-center px-4 py-3 bg-gray-800 shadow-md z-50"
      >
        <div className="text-xl font-bold tracking-wide mb-2 md:mb-0">📷 Photo Keeper</div>
        <div className="space-y-2 md:space-y-0 md:space-x-4 flex flex-col md:flex-row text-sm md:text-base text-center">
          <Link
            to="/dashboard"
            className="hover:underline transition duration-300"
          >
            Dashboard
          </Link>
          <Link
            to="/gallery"
            className="hover:underline transition duration-300"
          >
            Gallery
          </Link>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition duration-300"
          >
            Logout
          </button>
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}

export default Navbar;
