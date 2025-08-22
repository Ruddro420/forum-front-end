/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaBook, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

const HomeNav = () => {
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  // Navigation items
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Forums", path: "/forum" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <>
      {/* Navigation Bar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="bg-blue-700 text-white shadow-lg sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <motion.div
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <FaBook className="text-2xl" />
            <span className="text-xl font-bold">Edunika</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, color: "#93c5fd" }}
                onClick={() => navigate(item.path)}
                className="font-medium"
              >
                {item.name}
              </motion.button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {userId ? (
              <motion.button
                onClick={() => navigate("/forum/profile")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-md font-medium"
              >
                Profile
              </motion.button>
            ) : (
              <>
                <motion.button
                  onClick={() => navigate("/login")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-md font-medium"
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => navigate("/register")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded-md font-medium"
                >
                  Register
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-blue-800 text-white flex flex-col space-y-4 px-6 py-4"
            >
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setMenuOpen(false);
                  }}
                  className="text-left w-full font-medium hover:text-blue-300"
                >
                  {item.name}
                </button>
              ))}

              {userId ? (
                <button
                  onClick={() => {
                    navigate("/forum/profile");
                    setMenuOpen(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-md font-medium"
                >
                  Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMenuOpen(false);
                    }}
                    className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-md font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate("/register");
                      setMenuOpen(false);
                    }}
                    className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded-md font-medium"
                  >
                    Register
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default HomeNav;
