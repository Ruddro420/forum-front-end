/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";

const TermsOfService = () => {
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
            Terms of Service
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </motion.section>

      {/* Terms Content */}
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
                title: "1. Acceptance of Terms",
                content: "By accessing or using the Edunika platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service."
              },
              {
                title: "2. User Responsibilities",
                content: "You are responsible for maintaining the confidentiality of your account and password. All activities under your account are your responsibility."
              },
              {
                title: "3. Content Policy",
                content: "Users retain ownership of content they post, but grant Edunika a license to use it. Prohibited content includes illegal material, spam, and copyrighted content without permission."
              },
              {
                title: "4. Privacy",
                content: "Your use of the service is subject to our Privacy Policy, which explains how we collect, use, and disclose information."
              },
              {
                title: "5. Modifications",
                content: "Edunika reserves the right to modify these terms at any time. Continued use after changes constitutes acceptance of the new terms."
              }
            ].map((item, index) => (
              <motion.div 
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: index * 0.1 } }
                }}
              >
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.content}</p>
              </motion.div>
            ))}

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { delay: 0.5 } }
              }}
              className="mt-12 bg-blue-50 p-6 rounded-lg border border-blue-200"
            >
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <p className="text-gray-700">
                For questions about these Terms, please contact us at:
              </p>
              <p className="text-blue-600 mt-2">legal@edunika.edu.bd</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;