'use client';

import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import Head from 'next/head';

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactUs = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Here you would typically send the data to your backend
    console.log('Form submitted:', data);
    alert('Thank you for your message! We will get back to you soon.');
    reset();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <>
      <Head>
        <title>Contact Us | BookShare</title>
        <meta name="description" content="Get in touch with our book donation platform" />
      </Head>

      <div className=" py-12 px-4 sm:px-6 lg:px-8 md:mt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Contact <span className="text-indigo-600">BookShare</span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              {`We'd`} love to hear from you! Reach out with questions or feedback.
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Form */}
            <motion.div
              variants={itemVariants}
              className="w-full lg:w-1/2 bg-white p-8 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <motion.div whileHover={{ scale: 1.01 }} className="mt-1">
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      className={`block w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.name && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.name.message}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <motion.div whileHover={{ scale: 1.01 }} className="mt-1">
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className={`block w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.email && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <motion.div whileHover={{ scale: 1.01 }} className="mt-1">
                    <input
                      id="subject"
                      type="text"
                      {...register('subject')}
                      className={`block w-full px-4 py-3 rounded-lg border ${errors.subject ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.subject && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.subject.message}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Your Message
                  </label>
                  <motion.div whileHover={{ scale: 1.01 }} className="mt-1">
                    <textarea
                      id="message"
                      rows={4}
                      {...register('message')}
                      className={`block w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-300'} shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                    {errors.message && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.message.message}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-2"
                >
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-bold text-lg shadow-md hover:bg-indigo-700 transition-colors"
                  >
                    Send Message
                  </button>
                </motion.div>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div 
              variants={containerVariants}
              className="w-full lg:w-1/2 space-y-8"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in touch</h2>
                <p className="text-lg text-gray-600">
                  Have questions about donating books or using our platform? Fill out the form or 
                  reach out to us directly using the contact information below.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-start">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 bg-indigo-100 p-3 rounded-full"
                  >
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </motion.div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email us</h3>
                    <p className="text-gray-600">contact@bookshare.org</p>
                    <p className="text-gray-600">support@bookshare.org</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 bg-indigo-100 p-3 rounded-full"
                  >
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </motion.div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Call us</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-gray-600">Mon-Fri: 9am-5pm</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 bg-indigo-100 p-3 rounded-full"
                  >
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </motion.div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Visit us</h3>
                    <p className="text-gray-600">123 Book Street</p>
                    <p className="text-gray-600">Literary City, LC 12345</p>
                  </div>
                </div>
              </motion.div>

              {/* Map Placeholder */}
              <motion.div 
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative h-64 w-full rounded-xl overflow-hidden shadow-lg mt-8"
              >
                <Image
                  src="/map-placeholder.jpg" // Replace with your map image or use an actual map API
                  alt="Our location on map"
                  fill
                  className="object-cover"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md font-medium text-indigo-600"
                >
                  View Larger Map
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Social Media Section */}
          <motion.div 
            variants={itemVariants}
            className="mt-24 text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect With Us</h2>
            <div className="flex justify-center space-x-6">
              {[
                { name: 'Facebook', icon: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z' },
                { name: 'Twitter', icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
                { name: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href="#"
                  whileHover={{ y: -5 }}
                  className="text-gray-400 hover:text-indigo-600"
                  aria-label={social.name}
                >
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d={social.icon} clipRule="evenodd" />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default ContactUs;