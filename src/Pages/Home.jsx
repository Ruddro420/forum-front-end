/* eslint-disable no-unused-vars */
import {
  FaSearch,
  FaBook,
  FaUsers,
  FaQuestionCircle,
  FaChartLine,
  FaUniversity,
  FaGraduationCap,
  FaRegLightbulb,
  FaLaptopCode,
  FaMicroscope,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

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

const slideInFromLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
};

const slideInFromRight = {
  hidden: { x: 100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
};

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = e.target[0].value.trim();
    if (query) {
      navigate(`/forum/?search=${query}`);
    }
    e.target.reset();
    // setIsSearchFocused(false);
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative py-20 text-white min-h-[80vh] overflow-hidden flex flex-col items-center justify-center "
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://i.postimg.cc/K8svpyL7/bg-image.jpg"
            alt="Students studying together"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900 opacity-70"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Welcome to <span className="text-yellow-300">Edunika</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
          >
            Bangladesh's Premier Educational Forum Connecting Students,
            Teachers, and Researchers
          </motion.p>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            className="max-w-2xl mx-auto relative"
          >
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                onChange={(e) => e.target.value.length}
                placeholder="Search forums, questions, or resources..."
                className="w-full py-4 px-6 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
              />

              <motion.button
                whileHover={{ scale: 1.1 }}
                type="submit"
                whileTap={{ scale: 0.9 }}
                className="absolute right-2 top-2 bg-blue-700 text-white p-2 rounded-full hover:bg-blue-900 shadow-md"
              >
                <FaSearch className="text-xl" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto px-4 lg:px-20 py-16 "
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold mb-12 text-center"
        >
          Our <span className="text-blue-600">Community</span> in Numbers
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-css-4 gap-6 text-center">
          {[
            {
              icon: <FaUsers className="text-4xl text-blue-600 mx-auto mb-3" />,
              number: "10,000+",
              label: "Active Members",
            },
            {
              icon: (
                <FaQuestionCircle className="text-4xl text-blue-600 mx-auto mb-3" />
              ),
              number: "25,000+",
              label: "Questions Answered",
            },
            {
              icon: (
                <FaUniversity className="text-4xl text-blue-600 mx-auto mb-3" />
              ),
              number: "50+",
              label: "Universities",
            },
            {
              icon: (
                <FaGraduationCap className="text-4xl text-blue-600 mx-auto mb-3" />
              ),
              number: "100+",
              label: "Subjects",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {stat.icon}
              <h3 className="text-2xl font-bold">{stat.number}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
        className="bg-gray-100  py-16"
      >
        <div className="container mx-auto px-4 lg:px-20">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold mb-4 text-center"
          >
            Why Choose <span className="text-blue-600">Edunika</span>?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto text-center"
          >
            We provide the best platform for educational discussions in
            Bangladesh
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={slideInFromLeft}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-600"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FaRegLightbulb className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Expert Knowledge</h3>
              <p className="text-gray-600">
                Access insights from professors, researchers, and top students
                across Bangladesh.
              </p>
            </motion.div>

            <motion.div
              variants={fadeIn}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-600"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FaLaptopCode className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Modern Platform</h3>
              <p className="text-gray-600">
                Our intuitive interface makes learning and sharing knowledge
                effortless.
              </p>
            </motion.div>

            <motion.div
              variants={slideInFromRight}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-600"
            >
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FaMicroscope className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Research Focus</h3>
              <p className="text-gray-600">
                Specialized forums for academic research and collaboration.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Popular Forums Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16"
      >
        <div className="container mx-auto px-4 lg:px-20">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold mb-4 text-center"
          >
            Popular <span className="text-blue-600">Discussion</span> Forums
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto text-center"
          >
            Join active conversations in our most engaged communities
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "University Admissions",
                desc: "Discuss admission procedures, requirements, and deadlines",
                icon: <FaUniversity className="text-3xl text-blue-600" />,
                color: "bg-blue-100",
              },
              {
                title: "Academic Research",
                desc: "Share research papers, methodologies, and findings",
                icon: <FaBook className="text-3xl text-blue-600" />,
                color: "bg-blue-100",
              },
              {
                title: "Career Guidance",
                desc: "Get advice on career paths, internships, and job opportunities",
                icon: <FaChartLine className="text-3xl text-blue-600" />,
                color: "bg-blue-100",
              },
              {
                title: "STEM Education",
                desc: "Science, Technology, Engineering, and Mathematics discussions",
                icon: <FaMicroscope className="text-3xl text-blue-600" />,
                color: "bg-blue-100",
              },
              {
                title: "Scholarships",
                desc: "Find and discuss scholarship opportunities in Bangladesh",
                icon: <FaGraduationCap className="text-3xl text-blue-600" />,
                color: "bg-blue-100",
              },
              {
                title: "Online Learning",
                desc: "Platforms, courses, and digital education resources",
                icon: <FaLaptopCode className="text-3xl text-blue-600" />,
                color: "bg-blue-100",
              },
            ].map((forum, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className={`${forum.color} p-3 rounded-full`}>
                    {forum.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{forum.title}</h3>
                    <p className="text-gray-600">{forum.desc}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  Browse Discussions <span className="ml-1">→</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="bg-blue-700 text-white py-16"
      >
        <div className="container mx-auto px-4 lg:px-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What Our <span className="text-yellow-300">Community</span> Says
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Edunika helped me navigate the complex university admission process in Bangladesh. The community support was invaluable!",
                author: "Ayesha Rahman",
                role: "Dhaka University Student",
              },
              {
                quote:
                  "As a professor, I find Edunika to be an excellent platform for engaging with students beyond the classroom.",
                author: "Dr. Mohammad Ali",
                role: "Professor, BUET",
              },
              {
                quote:
                  "Found my research collaborators through Edunika. The specialized forums are perfect for academic discussions.",
                author: "Tahmina Akter",
                role: "Research Scholar",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.2 }}
                className="bg-blue-800 p-6 rounded-lg"
              >
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-300">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-blue-200">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Resources */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="container mx-auto px-4 py-16 lg:px-20"
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold mb-4 text-center"
        >
          Featured <span className="text-blue-600">Educational</span> Resources
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto text-center"
        >
          Curated learning materials for Bangladeshi students
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Bangladesh University Rankings 2023",
              category: "Guide",
              color: "bg-blue-600",
            },
            {
              title: "Scholarship Opportunities for Bangladeshi Students",
              category: "Scholarship",
              color: "bg-green-600",
            },
            {
              title: "How to Write a Research Paper - Complete Guide",
              category: "Research",
              color: "bg-purple-600",
            },
            {
              title: "Public vs Private Universities in Bangladesh",
              category: "Analysis",
              color: "bg-red-600",
            },
            {
              title: "STEM Career Paths in Bangladesh",
              category: "Career",
              color: "bg-yellow-600",
            },
            {
              title: "Preparing for University Admission Tests",
              category: "Admission",
              color: "bg-indigo-600",
            },
          ].map((resource, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden"
            >
              <div className={`h-2 ${resource.color}`}></div>
              <div className="p-6">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${resource.color} text-white`}
                >
                  {resource.category}
                </span>
                <h3 className="text-xl font-bold mt-3 mb-4">
                  {resource.title}
                </h3>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  View Resource <span className="ml-1">→</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* University Partners Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="bg-gray-100 py-16"
      >
        <div className="container mx-auto px-4 lg:px-20">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Partner <span className="text-blue-600">Universities</span>
          </h2>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-css-6 gap-8"
            variants={containerVariants}
          >
            {[
              { name: "DU", fullName: "Dhaka University" },
              {
                name: "BUET",
                fullName: "Bangladesh University of Engineering and Technology",
              },
              { name: "JU", fullName: "Jahangirnagar University" },
              { name: "RU", fullName: "Rajshahi University" },
              { name: "CU", fullName: "Chittagong University" },
              { name: "KU", fullName: "Khulna University" },
            ].map((uni, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center flex-col h-32 cursor-pointer"
                title={uni.fullName}
              >
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
                  <FaUniversity className="text-blue-600" />
                </div>
                <span className="font-bold text-center">{uni.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20"
      >
        <div className="container mx-auto px-4 text-center lg:px-20">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Join Our{" "}
            <span className="text-yellow-300">Educational</span> Community?
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Connect with students, teachers, and researchers across Bangladesh
            to share knowledge and grow together.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <motion.button
              onClick={() => navigate("/register")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-4 rounded-md font-bold text-lg shadow-lg"
            >
              Register Now - It's Free!
            </motion.button>
            <motion.button
              onClick={() => navigate("/about")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white hover:bg-blue-800 px-8 py-4 rounded-md font-bold text-lg shadow-lg"
            >
              Learn More About Edunika
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

   
    </div>
  );
};

export default Home;
