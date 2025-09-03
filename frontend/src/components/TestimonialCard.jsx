import { motion } from "framer-motion";

const TestimonialCard = ({ testimonial, index }) => {
  return (
    <motion.div
      className="bg-white rounded-lg p-6 shadow-md flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Stars */}
      <div className="flex space-x-1 mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <svg
            key={i}
            aria-hidden="true"
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Star</title>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.384 2.455a1 1 0 00-.364 1.118l1.287 3.975c.3.92-.755 1.688-1.54 1.118l-3.384-2.455a1 1 0 00-1.175 0l-3.384 2.455c-.784.57-1.838-.197-1.54-1.118l1.287-3.975a1 1 0 00-.364-1.118L2.034 9.4c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.974z" />
          </svg>
        ))}
      </div>

      {/* Quote / Message */}
      <p className="text-gray-600 italic mb-4">"{testimonial.message || testimonial.quote}"</p>

      {/* Author Info */}
      <div className="flex items-center space-x-3">
        <div className="bg-gray-300 rounded-full h-10 w-10 flex items-center justify-center text-gray-700 font-bold">
          {testimonial.name?.charAt(0).toUpperCase()}
        </div>
        <div className="text-left">
          <p className="font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-500">{testimonial.location}</p>
          {testimonial.verified && (
            <span className="inline-flex items-center px-2 py-0.5 mt-1 text-xs font-medium text-green-800 bg-green-100 rounded">
              Verified Purchase
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
