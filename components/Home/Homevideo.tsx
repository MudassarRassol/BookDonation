import React from 'react'
import Video from '@/components/Home/Video'
import Image from 'next/image'
import mobilescrenn from "@/assests/StockCake-Books Awaiting Readers_1743162504.jpg"
const Homevideo = () => {
  return (
    <div className="relative flex items-center justify-center h-[90vh] md:h-screen w-full bg-[#000000a5]">
    {/* Video container - ensure it covers full area */}
    <div className="  hidden lg:block  absolute -z-10 inset-0 overflow-hidden">
      <Video />
    </div>
    <div className=" bg  block lg:hidden   absolute -z-10 inset-0 overflow-hidden">
      <Image  
      src={mobilescrenn}
      alt="Home Book Aid Image"
      layout="fill"
      objectFit="cover"
      className='h-[80vh] md:h-screen w-full object-cover'
        
      />
    </div>
    
    
    {/* Foreground content */}
    <div className="relative z-10 p-8 text-white bg-opacity-50 rounded-lg max-w-3xl mx-auto text-center">
  <h1 className="text-4xl md:text-5xl font-bold mb-6">Give the Gift of Reading</h1>
  {/* <p className="text-xl mb-6">
    Every donated book opens a new world of possibilities. Join our mission to 
    put books in the hands of those who need them most - students, underprivileged 
    communities, and future leaders.
  </p> */}
</div>
  </div>
  )
}

export default Homevideo