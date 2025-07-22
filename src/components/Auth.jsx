import { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async () => {
    setLoading(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto mt-24 bg-white text-black rounded-lg shadow-xl p-8 relative"
    >
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-lg"
        >
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </motion.div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-center">
        {isSignup ? "Sign Up" : "Login"}
      </h1>

      <input
        type="email"
        placeholder="Email"
        className="w-full p-3 mb-4 border rounded shadow-sm focus:outline-none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-3 mb-4 border rounded shadow-sm focus:outline-none"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <button
        onClick={handleEmailAuth}
        className="w-full bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded mb-2 font-semibold"
        disabled={loading}
      >
        {loading ? "Loading..." : isSignup ? "Sign Up" : "Login"}
      </button>
      <button
        onClick={loginWithGoogle}
        className="w-full bg-red-600 hover:bg-red-700 transition text-white p-3 rounded mb-4 font-semibold"
        disabled={loading}
      >
        {loading ? "Loading..." : "Continue with Google"}
      </button>
      <p
        onClick={() => !loading && setIsSignup(!isSignup)}
        className="text-blue-600 hover:underline text-center cursor-pointer"
      >
        {isSignup
          ? "Already have an account? Login"
          : "Don't have an account? Sign up"}
      </p>
    </motion.div>
  );
}

export default Auth;
