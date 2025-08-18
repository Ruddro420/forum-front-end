/* eslint-disable no-unused-vars */
import {
  FaBook,
  FaUsers,
  FaGraduationCap,
  FaUniversity,
  FaChalkboardTeacher,
  FaHandsHelping,
} from "react-icons/fa";
import { motion } from "framer-motion";
import TeamMemberCard from "../components/TeamMemberCard";
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

const AboutPage = () => {
  const navigate = useNavigate();
  const teamMembers = [
    {
      name: "Dr. Ahmed Khan",
      role: "Founder & CEO",
      bio: "Professor of Computer Science with 15+ years of teaching experience",
      image: "/ceo.jpg",
    },
    {
      name: "Fatima Rahman",
      role: "Head of Community",
      bio: "Education specialist focused on student engagement",
      image: "/community-head.jpg",
    },
    {
      name: "Rahim Islam",
      role: "Tech Lead",
      bio: "Full-stack developer passionate about educational technology",
      image: "/tech-lead.jpg",
    },
  ];

  const milestones = [
    { year: "2018", event: "Edunika founded by university professors" },
    { year: "2019", event: "First 1,000 members joined the platform" },
    { year: "2020", event: "Partnership with 10 Bangladeshi universities" },
    { year: "2021", event: "Mobile app launched with 10,000+ downloads" },
    {
      year: "2022",
      event: "Recognized as top educational platform in Bangladesh",
    },
    { year: "2023", event: "Expanded to include research collaboration tools" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 w-full"
      >
        <div className="mx-auto px-4 lg:px-0 lg:w-4/5 xl:w-3/4 2xl:w-2/3">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 text-center"
          >
            About <span className="text-yellow-300">Edunika</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-center"
          >
            Empowering Bangladesh's educational community through collaboration
            and knowledge sharing
          </motion.p>
        </div>
      </motion.section>

      {/* Mission Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 w-full"
      >
        <div className="mx-auto px-4 lg:px-0 lg:w-4/5 xl:w-3/4 2xl:w-2/3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl font-bold mb-6">
                Our <span className="text-blue-600">Mission</span>
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                Edunika was founded in 2018 with a simple goal: to create a
                vibrant online community where students, teachers, and
                researchers across Bangladesh could connect, collaborate, and
                grow together.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We believe that education thrives when knowledge flows freely
                between institutions and individuals. Our platform breaks down
                barriers between universities and creates opportunities for
                meaningful academic exchange.
              </p>
              <div className="bg-blue-100 border-l-4 border-blue-600 p-4">
                <p className="text-blue-800 font-medium italic">
                  "To democratize access to quality educational resources and
                  foster collaboration across Bangladesh's academic landscape."
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="relative h-80 bg-gray-200 rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src="/about-1.jpg"
                alt="Bangladeshi students collaborating"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-blue-800 opacity-20"></div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="bg-gray-100 py-16 w-full"
      >
        <div className="mx-auto px-4 lg:px-0 lg:w-4/5 xl:w-3/4 2xl:w-2/3">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold mb-12 text-center"
          >
            Our Core <span className="text-blue-600">Values</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaBook className="text-4xl text-blue-600 mb-4" />,
                title: "Knowledge Sharing",
                description:
                  "We believe education grows when knowledge is shared openly and accessibly",
              },
              {
                icon: <FaUsers className="text-4xl text-blue-600 mb-4" />,
                title: "Community First",
                description:
                  "Our platform exists to serve Bangladesh's educational community",
              },
              {
                icon: (
                  <FaGraduationCap className="text-4xl text-blue-600 mb-4" />
                ),
                title: "Academic Excellence",
                description:
                  "We maintain high standards for content quality and discourse",
              },
              {
                icon: <FaUniversity className="text-4xl text-blue-600 mb-4" />,
                title: "Institutional Collaboration",
                description:
                  "We bridge gaps between universities and educational institutions",
              },
              {
                icon: (
                  <FaChalkboardTeacher className="text-4xl text-blue-600 mb-4" />
                ),
                title: "Teacher Empowerment",
                description:
                  "We provide tools for educators to extend their impact",
              },
              {
                icon: (
                  <FaHandsHelping className="text-4xl text-blue-600 mb-4" />
                ),
                title: "Student Support",
                description:
                  "We create pathways for student success at all levels",
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-all text-center"
              >
                <div className="flex justify-center">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 w-full"
      >
        <div className="mx-auto px-4 lg:px-0 lg:w-4/5 xl:w-3/4 2xl:w-2/3">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold mb-4 text-center"
          >
            Meet Our <span className="text-blue-600">Team</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto text-center"
          >
            Passionate educators and technologists dedicated to improving
            education in Bangladesh
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard
                key={index}
                name={member.name}
                role={member.role}
                bio={member.bio}
                image={member.image}
                variants={itemVariants}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Milestones Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="bg-blue-700 text-white py-16 w-full"
      >
        <div className="mx-auto px-4 lg:px-0 lg:w-4/5 xl:w-3/4 2xl:w-2/3">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold mb-12 text-center"
          >
            Our <span className="text-yellow-300">Journey</span>
          </motion.h2>

          <div className="relative">
            {/* Timeline line */}
            {/* <div className="hidden md:block absolute left-1/2 h-full w-1 bg-blue-600 transform -translate-x-1/2"></div> */}

            {/* Milestones */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="py-8"
            >
              <div className="flex flex-col space-y-8">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start gap-4"
                  >
                    {/* Year indicator */}
                    <div className="bg-blue-700 text-white w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold">
                      {milestone.year}
                    </div>

                    {/* Event card */}
                    <div className="bg-white text-blue-800 p-4 rounded-lg shadow-md flex-1">
                      <h3 className="text-lg font-bold">{milestone.event}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Partners Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
        className="py-16 w-full"
      >
        <div className="mx-auto px-4 lg:px-0 lg:w-4/5 xl:w-3/4 2xl:w-2/3">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold mb-12 text-center"
          >
            Our <span className="text-blue-600">Partners</span>
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {[
              {
                name: "University of Dhaka",
                logo: "https://i.postimg.cc/jqJM1drv/download-2.jpg",
              },
              {
                name: "BUET",
                logo: "https://i.postimg.cc/RFWg4vJS/download.png",
              },
              {
                name: "BRAC University",
                logo: "https://i.postimg.cc/RhfGJGT2/download-1.png",
              },
              {
                name: "North South University",
                logo: "https://i.postimg.cc/1tbJzbDp/download-2.png",
              },
              {
                name: "Education Ministry",
                logo: "https://i.postimg.cc/3wStskRf/download-3.jpg",
              },
            ].map((partner, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-32"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-16 max-w-full object-contain"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 w-full"
      >
        <div className="mx-auto px-4 lg:px-0 lg:w-4/5 xl:w-3/4 2xl:w-2/3 text-center">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Join Bangladesh's Largest Educational Community
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Whether you're a student, teacher, or researcher, Edunika has
            something for you.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/register")}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-4 rounded-md font-bold text-lg shadow-lg"
            >
              Register Now
            </motion.button>
            <motion.button
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white hover:bg-blue-800 px-8 py-4 rounded-md font-bold text-lg shadow-lg"
            >
              Login
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
