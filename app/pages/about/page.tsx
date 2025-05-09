'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Head from 'next/head';
import aboutimg from "@/assests/pexels-rdne-8364640.jpg"
const page = () => {
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
        <title>About Us | BookShare</title>
        <meta name="description" content="Learn about our book donation platform" />
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
              About <span className="text-indigo-600">BookShare</span>
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Connecting book lovers and spreading knowledge
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Image with Animation */}
            <motion.div
              variants={itemVariants}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2"
            >
              <div className="relative  h-[100vh] w-full rounded-xl overflow-hidden shadow-2xl">
                <Image
                  src={aboutimg} // Replace with your image path
                  alt="Team donating books"
                  // width={'100%'}
                //   fill
                  className="object-cover w-full h-[100%]"
                //   priority
                />
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div 
              variants={containerVariants}
              className="w-full lg:w-1/2 space-y-8"
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
                <p className="mt-4 text-lg text-gray-600">
                  BookShare was founded in 2023 with a simple mission: to connect book lovers and make reading accessible to everyone. 
                  What started as a small community initiative has grown into a nationwide platform connecting thousands of donors 
                  with readers in need.
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                <p className="mt-4 text-lg text-gray-600">
                  We believe books have the power to change lives. Our platform makes it easy to donate books {`you've`} loved 
                  and find new ones to explore. By keeping books in circulation,{` we're`} reducing waste and building a more 
                  literate, connected community.
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold text-gray-900">The Impact</h2>
                <motion.ul 
                  className="mt-4 space-y-3 text-lg text-gray-600"
                  variants={containerVariants}
                >
                  <motion.li variants={itemVariants} className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2">Over 50,000 books donated since launch</span>
                  </motion.li>
                  <motion.li variants={itemVariants} className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2">Serving 200+ communities nationwide</span>
                  </motion.li>
                  <motion.li variants={itemVariants} className="flex items-start">
                    <svg className="h-6 w-6 flex-shrink-0 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2">Partnered with 50+ schools and libraries</span>
                  </motion.li>
                </motion.ul>
              </motion.div>
            </motion.div>
          </div>

          {/* Team Section */}
          <motion.div 
            variants={itemVariants}
            className="mt-24 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: 'Mudassar Rasool', role: 'Developer', image: '/WhatsApp Image 2025-05-09 at 11.15.05_948b6445.jpg' },
                { name: 'Uzair Afzal', role: 'Documentation', image: '/WhatsApp Image 2025-05-09 at 05.44.19_d4e7ce3d.jpg' },
                { name: 'Huzaifa', role: 'Testing', image: '/WhatsApp Image 2025-05-09 at 11.20.33_39ec9f9e.jpg' },
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-lg"
                >
                  <div className="relative w-48 h-48  mx-auto rounded-full overflow-hidden mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className=" object-cover w-48 h-48 "
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-indigo-600">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={itemVariants}
            className="mt-24 bg-indigo-700 rounded-xl p-8 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Movement</h2>
            <p className="text-xl text-indigo-100 mb-6">
              Whether you want to donate books or find your next read, {`we'd `} love to have you as part of our community.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-bold text-lg shadow-lg"
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default page;