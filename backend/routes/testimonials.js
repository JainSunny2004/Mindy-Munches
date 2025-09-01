const express = require('express');
const router = express.Router();

// Temporary testimonials data (replace with database later)
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    message: "Amazing organic products! My family loves the quality and freshness.",
    rating: 5,
    image: "/images/testimonial1.jpg",
    location: "Mumbai, India",
    date: "2024-12-15"
  },
  {
    id: 2,
    name: "Raj Patel", 
    message: "Best superfoods I've ever tried. Fast delivery and excellent packaging!",
    rating: 5,
    image: "/images/testimonial2.jpg",
    location: "Delhi, India", 
    date: "2024-12-10"
  },
  {
    id: 3,
    name: "Priya Sharma",
    message: "Mindy Munchs has transformed our family's health. Highly recommended!",
    rating: 5,
    image: "/images/testimonial3.jpg",
    location: "Bangalore, India",
    date: "2024-12-08"
  }
];

const videoTestimonials = [
  {
    id: 1,
    name: "Dr. Anjali Mehta",
    title: "Nutritionist",
    videoUrl: "/videos/testimonial1.mp4",
    thumbnail: "/images/video-thumb1.jpg",
    message: "I recommend Mindy Munchs to all my patients for their organic quality.",
    duration: "2:30",
    location: "Chennai, India"
  },
  {
    id: 2, 
    name: "Chef Vikram Singh",
    title: "Professional Chef",
    videoUrl: "/videos/testimonial2.mp4", 
    thumbnail: "/images/video-thumb2.jpg",
    message: "The spices and oils from Mindy Munchs elevate every dish I create.",
    duration: "1:45",
    location: "Pune, India"
  }
];

// Get all testimonials
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      testimonials,
      videoTestimonials,
      totalCount: testimonials.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials',
      error: error.message
    });
  }
});

// Get video testimonials only
router.get('/videos', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        videoTestimonials
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch video testimonials',
      error: error.message
    });
  }
});

module.exports = router;
