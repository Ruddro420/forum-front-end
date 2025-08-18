/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { FaQuestionCircle } from "react-icons/fa";

const FAQPage = () => {
  const faqs = [
    {
      question: "How do I create an account on Edunika?",
      answer: "Click the 'Register' button in the top right corner and follow the simple sign-up process with your email or social media accounts."
    },
    {
      question: "Is Edunika free to use?",
      answer: "Yes, our basic features are completely free. We offer premium subscriptions for additional features and resources."
    },
    {
      question: "How can I join a discussion forum?",
      answer: "Browse our forums section and click 'Join Discussion' on any topic that interests you. Some specialized forums may require moderator approval."
    },
    {
      question: "Can I share my own study materials?",
      answer: "Absolutely! We encourage knowledge sharing. Use the 'Create Post' button and select 'Share Resource' to upload your materials."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "Click the three dots (...) on any post and select 'Report'. Our moderation team will review it promptly."
    }
  ];

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
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Find answers to common questions about using Edunika
          </p>
        </div>
      </motion.section>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <FaQuestionCircle className="text-2xl text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="mt-12 bg-blue-50 p-6 rounded-lg border border-blue-200 text-center">
            <h3 className="text-xl font-bold mb-4">Still have questions?</h3>
            <p className="text-gray-700 mb-4">
              Our support team is ready to help you with any other questions you might have.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;