import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Our Store" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 container mx-auto px-4 flex flex-col justify-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our Story
          </motion.h1>
          <motion.p 
            className="text-xl text-white max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Discover the journey behind our passion for delivering quality products and exceptional customer experiences.
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="mb-16 text-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              To provide exceptional shopping experiences through innovative technology, curated products, and unparalleled customer service.
            </p>
          </motion.div>

          {/* Company History */}
          <motion.div 
            className="grid md:grid-cols-2 gap-12 mb-20"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Journey</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Founded in 2015, E-Store began with a simple idea: make online shopping simple, enjoyable, and accessible to everyone. What started as a small operation has grown into a platform serving thousands of customers worldwide.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Through continuous innovation and a customer-first approach, we've expanded our product lines and enhanced our services while maintaining our core values of quality, integrity, and exceptional service.
              </p>
            </div>
            <div className="relative h-64 md:h-auto rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Company History" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Values */}
          <motion.div 
            className="mb-20"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Our Core Values</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">Quality</h4>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  We never compromise on the quality of our products, ensuring that each item meets our high standards.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">Customer Focus</h4>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Our customers are at the heart of everything we do, driving our decisions and innovations.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-2 text-center text-gray-900 dark:text-white">Innovation</h4>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  We continuously seek new ways to improve our products, services, and customer experiences.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Meet Our Team</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: "Alex Johnson", role: "Founder & CEO", image: "https://randomuser.me/api/portraits/men/32.jpg" },
                { name: "Sarah Williams", role: "Chief Product Officer", image: "https://randomuser.me/api/portraits/women/44.jpg" },
                { name: "Michael Chen", role: "Head of Design", image: "https://randomuser.me/api/portraits/men/67.jpg" },
                { name: "Priya Sharma", role: "Customer Experience", image: "https://randomuser.me/api/portraits/women/74.jpg" }
              ].map((member, i) => (
                <div key={i} className="text-center">
                  <div className="mb-4 relative mx-auto w-32 h-32 rounded-full overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white">{member.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Join Our Journey</h3>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
              Discover the difference with E-Store. Explore our products and become part of our growing community.
            </p>
            <Link to="/products" className="inline-block px-8 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-900 transition-colors">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;