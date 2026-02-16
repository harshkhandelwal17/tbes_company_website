import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Users, Award, BookOpen, Target, CheckCircle } from 'lucide-react';

const LearningPage = () => {
  const testimonials = [
    {
      name: "Debaprasad Santra",
      position: "BIM Engineer At Sudlows Consulting, Dubai",
      content: "I am truly grateful for the opportunity to undergo training in TBES, as it has been a transformative experience. Arup Sir played a pivotal role in making this journey so impactful. His approach to teaching is exceptional—he takes the time to thoroughly explain every topic, ensuring clarity and mastery of the subject matter. His dedication to ensuring that every detail is fully understood before moving on is a remarkable quality that I deeply appreciate. This personalized and meticulous attention has been a significant advantage for me, and I feel much more confident in my skills because of it.",
      image: "/debaprasad-santra.jpeg"
    },
    {
      name: "Kunal Das",
      position: "MEP Engineer at ITD Cementation, Kolkata",
      content: "TBES Training institute provided me comprehensive and practical learning with knowledgeable instructors. Also there is room for enhanced placement support and advanced training modules.",
      image: "/kunal-das.jpeg"
    },
    {
      name: "Kousik Ghosh",
      position: "BIM Professional",
      content: "I pursued the BIM Advanced Training. Here I got training on AutoCAD and Revit and information of project handling workflow. After completion finally got started in TBES itself.",
      image: "/kousik-ghosh.jpeg"
    }
  ];

  const courses = [
    {
      name: "AutoCAD",
      icon: "/autocad.png",
      description: "Master 2D and 3D design with industry-standard CAD software"
    },
    {
      name: "Revit",
      icon: "/revit.png", 
      description: "Building Information Modeling (BIM) for architectural design"
    },
    {
      name: "Navisworks",
      icon: "/navis.png",
      description: "Project review and collaboration for construction workflows"
    }
  ];

  const benefits = [
    "Enhanced learning experience with practical sessions",
    "Trained by industry led professionals having long term industry involvement", 
    "Live exposure on projects with real time scenarios/situations",
    "Budget friendly courses to help you achieve the best"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-20 px-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            An Art Infused Learning
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Your Door to the Future
          </p>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl leading-relaxed mb-8 opacity-95">
              At TBES Global, we offer excellent learning opportunities to students as well as professionals by providing them with quality knowledge and a state-of-art learning experience. We have come up with various level of courses to cater the needs from basic to advanced level of learning various Autodesk products.
            </p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl">
              Start Learning Today
            </button>
          </div>
        </div>
      </section>

      {/* Learn With Us Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Learn With Us
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                At TBES Global, we excel in providing the best-in-class platform of training and knowledge sharing to our learners. We have come up with various level of courses to cater the needs from basic to advanced level of learning for various Autodesk products. All courses include enhanced technical and practical classes merged together to provide a complete balance of theoretical and practical knowledge to the learner.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                It helps our learners to level up with the industry level skills and expertise in various fields related to the AECO industry.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Benefits of our program:</h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" size={20} />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/businessman-learning.jpg"
                  alt="Professional learning environment"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-6 rounded-xl shadow-lg">
                <Award size={40} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Module Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
            <Image
              src="/training-module.png"
              alt="Training Module Overview"
              width={800}
              height={500}
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our Courses Primarily Focus On
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 relative">
                    <Image
                      src={course.icon}
                      alt={course.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{course.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{course.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Testimonials
            </h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear what our students and professionals have to say about their learning experience
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.position}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-gray-800 to-black py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who have advanced their careers with TBES Global
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearningPage;