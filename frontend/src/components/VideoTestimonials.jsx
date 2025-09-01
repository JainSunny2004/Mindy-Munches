import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

// Video testimonials data - now exported for use in other components
export const videoTestimonialsData = [
  {
    id: 1,
    name: "Rajesh Patel",
    location: "Mumbai, Maharashtra",
    title: "Health Enthusiast & Father",
    videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=710&fit=crop",
    fullQuote: "I was introduced to Mindy Munchs through a friend and I'm so glad I discovered these amazing traditional snacks. My whole family loves them!",
    rating: 5,
    duration: "2:15"
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Delhi, India",
    title: "Working Mother",
    videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=710&fit=crop",
    fullQuote: "When my son told me that no other snacks taste as good as Mindy Munchs, I knew we had found something special. Perfect for our family!",
    rating: 5,
    duration: "1:45"
  },
  {
    id: 3,
    name: "Anita Gupta",
    location: "Bangalore, Karnataka",
    title: "Fitness Coach",
    videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=710&fit=crop",
    fullQuote: "These traditional superfoods have transformed my client's snacking habits completely. I recommend Mindy Munchs to all my fitness clients!",
    rating: 5,
    duration: "1:30"
  },
  {
    id: 4,
    name: "Amit Kumar",
    location: "Chennai, Tamil Nadu",
    title: "Software Engineer",
    videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=710&fit=crop",
    fullQuote: "Working from home, I needed healthy snacks that wouldn't make me feel sluggish. Mindy Munchs has been a game-changer for my productivity!",
    rating: 5,
    duration: "2:00"
  },
  {
    id: 5,
    name: "Meera Joshi",
    location: "Pune, Maharashtra",
    title: "Nutritionist",
    videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=710&fit=crop",
    fullQuote: "As a nutritionist, I recommend Mindy Munchs to all my clients. These traditional superfoods are packed with nutrients and taste amazing!",
    rating: 5,
    duration: "1:50"
  },
  {
    id: 6,
    name: "Karan Singh",
    location: "Jaipur, Rajasthan",
    title: "College Student",
    videoSrc: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=710&fit=crop",
    fullQuote: "Perfect snacks for study sessions! Keeps me energized without the sugar crash. My hostel friends are all obsessed now!",
    rating: 5,
    duration: "1:25"
  }
];

// Custom hook to fetch video testimonials
export const useVideoTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        
        // Try to fetch from API first
        const apiUrl = import.meta.env.VITE_API_URL;
        
        if (apiUrl) {
          const response = await fetch(`${apiUrl}/testimonials/videos`);
          
          if (response.ok) {
            const data = await response.json();
            
            // Handle different response formats
            if (data.success && data.data && data.data.videoTestimonials) {
              setTestimonials(data.data.videoTestimonials);
            } else if (data.videoTestimonials) {
              setTestimonials(data.videoTestimonials);
            } else {
              throw new Error('Invalid API response format');
            }
          } else {
            throw new Error(`API responded with status ${response.status}`);
          }
        } else {
          throw new Error('No API URL configured');
        }
      } catch (err) {
        console.warn('Failed to fetch video testimonials, using static data:', err);
        
        // Fallback to static data
        setTestimonials(videoTestimonialsData);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return { testimonials, loading, error };
};

const VideoTestimonials = () => {
  const [activeVideo, setActiveVideo] = useState(null);
  const scrollRef = useRef(null);
  
  const { testimonials: videoTestimonials, loading } = useVideoTestimonials();

  const closeVideo = () => setActiveVideo(null);

  if (loading) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading video testimonials...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Customer Video Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Authentic testimonials from real customers who love our traditional superfoods.
          </p>
        </div>

        <div className="overflow-hidden">
          <div 
            ref={scrollRef} 
            className="flex gap-6 pb-6 overflow-x-auto scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {Array.isArray(videoTestimonials) && videoTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-64 cursor-pointer"
                onClick={() => setActiveVideo(testimonial)}
              >
                <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={testimonial.thumbnail}
                      alt={testimonial.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=710&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white bg-opacity-90 rounded-full p-4 transform scale-90 hover:scale-100 transition-transform duration-300">
                        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                      {testimonial.duration}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1">{testimonial.name}</h4>
                    <p className="text-sm text-green-600 mb-1">{testimonial.title}</p>
                    <p className="text-sm text-gray-500 mb-2">{testimonial.location}</p>
                    
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full transition-colors duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={closeVideo}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={closeVideo}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 z-10 hover:bg-opacity-70 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <video
                controls
                autoPlay
                className="w-full aspect-video bg-black"
                poster={activeVideo.thumbnail}
              >
                <source src={activeVideo.videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{activeVideo.name}</h3>
                <p className="text-green-600 font-medium mb-1">{activeVideo.title}</p>
                <p className="text-gray-600 mb-4">{activeVideo.location}</p>
                <p className="text-gray-800 italic text-lg">"{activeVideo.fullQuote}"</p>
                
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < activeVideo.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({activeVideo.rating}/5)</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default VideoTestimonials;
