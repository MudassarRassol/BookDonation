"use client"
import Homevideo from "@/components/Home/Homevideo"
import GetRecentBOOK from "@/components/Home/GetRecentCard"
import Testimonials from "@/components/Home/Testimonials"
const Page = () => {

  return (
    <div>
      <Homevideo />
      <GetRecentBOOK />
      <Testimonials />
    </div>
  )
}

export default Page