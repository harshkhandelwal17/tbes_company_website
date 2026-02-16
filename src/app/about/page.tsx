import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-black text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            About Us
          </h1>
          <p className="text-xl text-center max-w-3xl mx-auto opacity-90">
            Building the future through innovative BIM solutions and engineering excellence
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Who We Are Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-4 border-black pb-4">
            Who We Are
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                TBES Global is an innovative Building Information Modeling (BIM) solutions and services provider for architects, engineers, contractors, sub-contractors and consultants around the globe. We established ourselves in 2018 on the eastern part of India.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our primary objective is to provide collaborative and coordinated design and support for our clients which helps us to provide them with the desired outputs.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                BIM is an integral part of our progress towards better construction and engineering services to uplift the engineering value for our clients. We are one of the premier organizations involved in adoption of BIM in the construction and infrastructure segment.
              </p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold text-black mb-4">Our Expertise</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  Building Information Modeling (BIM)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  Engineering Consultation
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-black rounded-full mr-3"></div>
                  Resource Allocation
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Laying Stones Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-4 border-black pb-4">
            Laying Stones
          </h2>
          <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The journey began in 2018 with professionals having industry experience in some of the leading construction companies in India. We toddled down the road step by step undertaking new responsibilities and challenges on the way. We ventured into new possibilities and look forward to continue our exciting journey ahead.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              TBES Global has been associated with some of the most prestigious projects in the MENA region which includes Doha Metro and Lusail City (infrastructure) among the most prominent ones.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              During our advancements, we came across various working professionals with like-minded independent zeal which ultimately concluded in strengthening our organization with a global approach. The team agreed to work on a common platform to make a difference in the rapidly transforming AEC industry.
            </p>
          </div>
          
          {/* Notable Projects */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-xl font-semibold text-black mb-3">Doha Metro</h4>
              <p className="text-gray-600">Major infrastructure project in Qatar showcasing our expertise in large-scale BIM implementation.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-xl font-semibold text-black mb-3">Lusail City</h4>
              <p className="text-gray-600">Comprehensive infrastructure development project demonstrating our global project capabilities.</p>
            </div>
          </div>
        </section>

        {/* Our Approach Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b-4 border-black pb-4">
            Our Approach
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border-l-4 border-black p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Client Commitment</h4>
              <p className="text-gray-600">Commitment to our clients is our prime motto that sets us apart.</p>
            </div>
            <div className="bg-white border-l-4 border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Continuous Excellence</h4>
              <p className="text-gray-600">Our passion and continuous effort to excel to meet the rising demands of the market.</p>
            </div>
            <div className="bg-white border-l-4 border-gray-600 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Core Values</h4>
              <p className="text-gray-600">Dedication, consistency, trust and commitment is our organizational religion.</p>
            </div>
            <div className="bg-white border-l-4 border-gray-500 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Trust Building</h4>
              <p className="text-gray-600">Developing trust and continued services with our valuable clients is our primary vision.</p>
            </div>
            <div className="bg-white border-l-4 border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Engineering Value</h4>
              <p className="text-gray-600">Adding value to engineering is our mission that drives us for the future.</p>
            </div>
            <div className="bg-white border-l-4 border-gray-400 p-6 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Cost Effectiveness</h4>
              <p className="text-gray-600">Our optimized and cost effective approach drives us in reaching milestones within time and budgets.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-gray-800 to-black text-white rounded-lg p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Project?</h3>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss how our BIM solutions can add value to your engineering projects
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
            <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Us
            </button>
            </Link>
            <Link href="/projects">
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors">
              View Projects
            </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;