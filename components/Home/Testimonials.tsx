"use client"
import { Carousel } from 'antd';
import { HeartOutlined, BookOutlined } from '@ant-design/icons';

const Testimonials = () => {
    const testimonials = [
        // Donor testimonials
        {
          id: 1,
          role: "donor",
          quote: "Donating my books through this platform was so easy. I love knowing my pre-loved books are finding new readers instead of collecting dust on my shelves."
        },
        {
          id: 2,
          role: "donor", 
          quote: "As someone who moves frequently, this service helped me declutter while doing good. I've donated over 50 books in the past year!"
        },
        {
          id: 3,
          role: "donor",
          quote: "The donation process was seamless. The transparency about where my books were going made me feel confident in using this platform."
        },
      
        // Recipient testimonials
        {
          id: 4,
          role: "recipient",
          quote: "These donated books have been a blessing for our after-school program. The kids are excited to have fresh reading material every month."
        },
        {
          id: 5,
          role: "recipient",
          quote: "As a teacher in a low-income school, these free books allow me to build a classroom library I could never afford otherwise."
        },
        {
          id: 6,
          role: "recipient",
          quote: "Receiving these books has helped our community center start a reading club that's bringing neighbors together."
        }
      ];

  return (
    <section className="bg-[#f9f9f9] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Voices From Our Community
        </h2>
        
        <div className="flex justify-center gap-8 mb-8">
          <div className="flex items-center">
            <HeartOutlined className="text-red-500 text-xl mr-2" />
            <span className="font-medium">Donors</span>
          </div>
          <div className="flex items-center">
            <BookOutlined className="text-blue-500 text-xl mr-2" />
            <span className="font-medium">Recipients</span>
          </div>
        </div>

        <Carousel autoplay className="max-w-4xl mx-auto">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="px-4">
              <div className={`p-8 rounded-lg shadow-md ${
                testimonial.role === 'donor' 
                  ? 'bg-red-50 border-l-4 border-red-400' 
                  : 'bg-blue-50 border-l-4 border-blue-400'
              }`}>
                <p className="text-lg italic text-gray-700 mb-6">
                  {testimonial.quote}
                </p>
                <div className="font-medium text-gray-700">
                  {testimonial.role === 'donor' ? (
                    <span className="text-red-600">Book Donor</span>
                  ) : (
                    <span className="text-blue-600">Book Recipient</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        <div className="text-center mt-12">
          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full transition">
            Share Your Experience
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;