
import { createContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import app from "../../firebase/firebase.init";
import axiosPublic from "../api/axiosPublic";

export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register User
  const registerUser = async (email, password, userData = {}) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // ✅ Safe access - কোন error হবে না
      const displayName = userData?.name || "LifeDrop User";
      const photoURL = userData?.avatar || "";

      await updateProfile(result.user, {
        displayName,
        photoURL,
      });

      console.log("✅ Firebase user created:", displayName);
      return result.user;
    } catch (error) {
      console.error("Register Error:", error.message);
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Login User
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error("Firebase Login Error:", error.code, error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const googleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userInfo = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL || "",
        role: "donor",
        status: "active",
      };

      // 🔥 SAFE API CALL
      await axiosPublic.post("/users", userInfo)
        .catch(err => {
          console.log("User already exists or backend error:", err.message);
        });

      return user;
    } catch (error) {
      console.error("Google Sign In Error:", error.code, error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    registerUser,
    loginUser,
    googleSignIn,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;