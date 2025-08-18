/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';

const TeamMemberCard = ({ name, role, bio, image, variants }) => {
  return (
    <motion.div 
      variants={variants}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden transition-all"
    >
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-blue-600 font-medium mb-3">{role}</p>
        <p className="text-gray-600">{bio}</p>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;