/* eslint-disable no-unused-vars */
import React from 'react';
import { FaBook } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
const HomeNav = () => {



    const navigate = useNavigate();
    // Navigation items can be dynamically generated or hardcoded
    // Here, we are using a hardcoded array for simplicity
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Forums', path: '/forum' },
    ];

    return (
        <>
            {/* Navigation Bar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="bg-blue-700 text-white shadow-lg sticky top-0 z-50"
            >
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2 cursor-pointer"
                    >
                        <FaBook className="text-2xl" />
                        <span className="text-xl font-bold">Edunika</span>
                    </motion.div>

                    <div className="hidden md:flex space-x-6">
                        {navItems.map((item, index) => (
                            <motion.a
                                key={index}
                                whileHover={{ scale: 1.05, color: '#93c5fd' }}
                                href={item.path}
                                className="font-medium"
                            >
                                {item.name}
                            </motion.a>
                        ))}
                    </div>

                    <div className="flex items-center space-x-4">
                        <motion.button
                            onClick={() => navigate('/login')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-md font-medium"
                        >
                            Login
                        </motion.button>
                        <motion.button
                            onClick={() => navigate('/register')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-blue-700 hover:bg-gray-100 px-4 py-2 rounded-md font-medium"
                        >
                            Register
                        </motion.button>
                    </div>
                </div>
            </motion.nav>
        </>
    );
};

export default HomeNav;