"use client"
import { Carousel } from 'antd';
import { HeartFilled, BookFilled } from '@ant-design/icons';
// import { useEffect, useState } from 'react';

const Testimonials = () => {
//   const [gradientPos, setGradientPos] = useState(0);

  // Animate gradient background
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setGradientPos((prev) => (prev + 0.5) % 100);
//     }, 2000);
//     return () => clearInterval(interval);
//   }, []);

  const allItems = [
    // Real testimonials
    {
      id: 1,
      type: "testimonial",
      quote: "Donating my old textbooks helped clear space and gave students access to materials they couldn't afford. Knowing my books are helping others learn is priceless.",
      author: "Sarah K., College Professor",
      location: "New York",
      icon: <HeartFilled className="text-red-500" />
    },
    {
      id: 2,
      type: "testimonial",
      quote: "Our school library received 200 donated books last month! These donations are helping us build a reading culture in our community.",
      author: "Mr. Rodriguez, School Librarian",
      location: "Chicago",
      icon: <HeartFilled className="text-red-500" />
    },
    // Famous quotes
    {
      id: 3,
      type: "quote",
      quote: "The meaning of life is to find your gift. The purpose of life is to give it away.",
      author: "Pablo Picasso",
      icon: <BookFilled className="text-blue-500" />
    },
    {
      id: 4,
      type: "quote",
      quote: "A book is a gift you can open again and again.",
      author: "Garrison Keillor",
      icon: <BookFilled className="text-blue-500" />
    },
    {
      id: 5,
      type: "quote",
      quote: "We make a living by what we get, but we make a life by what we give.",
      author: "Winston Churchill",
      icon: <BookFilled className="text-blue-500" />
    },
    {
      id: 6,
      type: "testimonial",
      quote: "As a parent, I love that my children can exchange books they've outgrown for new ones. It's teaching them about sharing while saving us money.",
      author: "The Johnson Family",
      location: "Austin",
      icon: <HeartFilled className="text-red-500" />
    },
    {
      id: 7,
      type: "quote",
      quote: "There is no exercise better for the heart than reaching down and lifting people up.",
      author: "John Holmes",
      icon: <BookFilled className="text-blue-500" />
    },
    {
      id: 8,
      type: "testimonial",
      quote: "The book donation program helped our shelter start a reading corner. For many residents, these are the first books they've ever owned.",
      author: "Community Shelter Staff",
      location: "Seattle",
      icon: <HeartFilled className="text-red-500" />
    }
  ];

  return (
    <section 
      className="py-16 px-4 relative md:h-[70vh] "
    //   style={{
    //     background: `linear-gradient(${gradientPos}deg, 
    //       rgba(249, 249, 249, 1) 0%, 
    //       rgba(240, 248, 255, 0.8) 30%, 
    //       rgba(240, 248, 255, 0.8) 70%, 
    //       rgba(249, 249, 249, 1) 100%)`,
    //     transition: 'background 1s ease-out'
    //   }}
    >
      {/* Animated floating circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full opacity-10"
            // style={{
            //   background: i % 2 === 0 ? '#3b82f6' : '#ef4444',
            //   width: `${Math.random() * 200 + 100}px`,
            //   height: `${Math.random() * 200 + 100}px`,
            //   top: `${Math.random() * 100}%`,
            //   left: `${Math.random() * 100}%`,
            //   animation: `float ${Math.random() * 10 + 10}s linear infinite`,
            //   animationDelay: `${Math.random() * 5}s`
            // }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Stories & Wisdom About Giving
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Real impact and inspirational thoughts about book donations
        </p>

        <Carousel 
          autoplay 
          speed={1000}
          autoplaySpeed={5000}
          dotPosition="bottom"
          className="mx-auto"
          
        >
{allItems.map((item) => (
  <div key={item.id} className="px-4 h-full">
    <div className={`p-8 rounded-lg h-full min-h-[300px] shadow-md mb-1 backdrop-blur-sm bg-white/70 flex flex-col ${
      item.type === 'testimonial' 
        ? 'border-t-4 border-red-400'    
        : 'border-t-4 border-blue-400'
    }`}>
      {/* Icon (top-aligned) */}


      {/* Quote (centered vertically + horizontally) */}
      <div className="flex-grow flex flex-col items-center justify-center">
      {item.icon}
        <p className="text-lg text-gray-700 text-center italic">
          &quot;{item.quote}&quot;
        </p>
      </div>

      {/* Author + Location (bottom-aligned) */}
      <div>
        <div className={`text-center font-medium ${
          item.type === 'testimonial' 
            ? 'text-red-500' 
            : 'text-blue-500'
        }`}>
          — {item.author}
        </div>
        {item.location && (
          <div className="text-center text-gray-500 text-sm mt-1">
            {item.location}
          </div>
        )}
      </div>
    </div>
  </div>
))}

        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;