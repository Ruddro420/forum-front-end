/* eslint-disable no-unused-vars */
import React from "react";
// Animation variants
import { motion } from "framer-motion";
import { FaBook, FaFacebook, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";
import { Link } from "react-router";
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

export default function PublicFooter() {
return (
    <div>
        {/* Footer */}
        <motion.footer
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            className="bg-gray-900 text-white pt-16 pb-8"
        >
            <div className="container mx-auto px-4 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <motion.div variants={itemVariants}>
                        <h3 className="text-xl font-bold mb-4 flex items-center">
                            <FaBook className="mr-2" /> Edunika
                        </h3>
                        <p className="text-gray-400 mb-4">
                            Bangladesh's leading educational forum connecting students,
                            educators, and researchers.
                        </p>
                        <div className="flex space-x-4">
                            {[
                                {
                                    name: "Facebook",
                                    icon: <i className="fab fa-facebook-f" />,
                                    link: "#",
                                    reactIcon: <FaFacebook/>,
                                },
                                {
                                    name: "Twitter",
                                    icon: <i className="fab fa-twitter" />,
                                    link: "#",
                                    reactIcon: <FaTwitter/>,
                                },
                                {
                                    name: "LinkedIn",
                                    icon: <i className="fab fa-linkedin-in" />,
                                    link: "#",
                                    reactIcon: <FaLinkedinIn/>,
                                },
                                {
                                    name: "YouTube",
                                    icon: <i className="fab fa-youtube" />,
                                    link: "#",
                                    reactIcon: <FaYoutube/>,
                                },
                            ].map((social, index) => {
                                const Icon = social.reactIcon;
                                return (
                                    <motion.a
                                        key={index}
                                        whileHover={{ y: -3 }}
                                        href={social.link}
                                        className="bg-gray-800 hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center"
                                        title={social.name}
                                    >
                                        {social.reactIcon}
                                    </motion.a>
                                );
                            })}
                        </div>
                    </motion.div>

                    {[
                        {
                            title: "Quick Links",
                            links: [
                                { name: "Home", path: "/" },
                                { name: "Forums", path: "/forum/" },
                                { name: "Resources", path: "/forum/shop" },
                            ],
                        },
                        {
                            title: "Support",
                            links: [
                                { name: "Community Guidelines", path: "/community-guidelines" },
                                { name: "Contact Us", path: "/contact" },
                                { name: "FAQs", path: "/faqs" },
                            ],
                        },
                        {
                            title: "Legal",
                            links: [
                                { name: "Terms of Service", path: "/terms" },
                                { name: "Privacy Policy", path: "/terms" },
                                { name: "Cookie Policy", path: "/terms" },
                            ],
                        },
                    ].map((column, colIndex) => (
                        <motion.div key={colIndex} variants={itemVariants}>
                            <h4 className="text-lg font-bold mb-4">{column.title}</h4>
                            <ul className="space-y-2">
                                {column.links.map((link, linkIndex) => (
                                    <motion.li key={linkIndex} whileHover={{ x: 5 }}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-400 hover:text-white"
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    variants={itemVariants}
                    className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
                >
                    <p>© {new Date().getFullYear()} Edunika. All rights reserved.</p>
                    <p className="mt-2">Dhaka, Bangladesh</p>
                </motion.div>
            </div>
        </motion.footer>
    </div>
);
}
