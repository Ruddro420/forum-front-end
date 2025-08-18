/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaUsers, FaHandshake, FaComments, FaBookOpen } from "react-icons/fa";

const CommunityGuidelines = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Community Guidelines
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Our rules and expectations to maintain a positive learning environment
          </p>
        </div>
      </motion.section>

      {/* Guidelines Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {[
              {
                icon: <FaUsers className="text-3xl text-blue-600" />,
                title: "Respect All Members",
                content: "Treat all community members with respect. Personal attacks, harassment, or discrimination of any kind will not be tolerated."
              },
              {
                icon: <FaHandshake className="text-3xl text-blue-600" />,
                title: "Academic Integrity",
                content: "Do not post plagiarized content or help others cheat. Share knowledge ethically and cite sources when appropriate."
              },
              {
                icon: <FaComments className="text-3xl text-blue-600" />,
                title: "Constructive Discussions",
                content: "Keep discussions focused on educational topics. Avoid spam, off-topic posts, or self-promotion without relevance."
              },
              {
                icon: <FaBookOpen className="text-3xl text-blue-600" />,
                title: "Quality Content",
                content: "Ensure your posts are well-structured and provide value. Use proper formatting and clear language to help others understand."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: index * 0.1 } }
                }}
                className="flex items-start gap-6"
              >
                <div className="bg-blue-100 p-3 rounded-full">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.content}</p>
                </div>
              </motion.div>
            ))}

            <div className="mt-12 bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold mb-4">Reporting Violations</h3>
              <p className="text-gray-700 mb-4">
                If you encounter any content that violates these guidelines, please use the report feature or contact our moderation team immediately.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                Contact Moderators
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CommunityGuidelines;