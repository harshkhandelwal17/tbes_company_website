'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Briefcase, Users, Award, Target, ArrowRight } from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  active: boolean;
  createdAt: string;
}

const CareerPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (response.ok) {
          const data = await response.json();
          // Filter only active jobs if the API returns everything
          setJobs(data.filter((job: Job) => job.active !== false));
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const companyBenefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Collaborative Environment",
      description: "Work with talented professionals in a supportive team atmosphere"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Professional Growth",
      description: "Opportunities for skill development and career advancement"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Challenging Projects",
      description: "Work on diverse and exciting projects that shape the future"
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Competitive Package",
      description: "Attractive compensation and comprehensive benefits"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Team at TBES Global
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Shape the future of design and construction with us
            </p>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              We're looking for talented individuals who are passionate about innovation,
              excellence, and making a difference in the world of engineering and design.
            </p>
          </div>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-black">
              Why Choose TBES Global?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {companyBenefits.map((benefit, index) => (
                <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow border border-gray-200">
                  <div className="text-black mb-4 flex justify-center">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-black">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Current Openings Section */}
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-black">
              Current Openings
            </h2>

            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <div key={job._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-2 space-x-3">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {job.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {job.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 line-clamp-3 text-sm">
                      {job.description}
                    </p>

                    <button className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors flex items-center justify-center group-hover:bg-blue-600">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="max-w-2xl mx-auto">
                  <div className="mb-6">
                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  </div>
                  <h3 className="text-2xl font-semibold text-black mb-4">
                    No Current Openings
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    We don't have any job openings at the moment, but we're always interested in connecting with talented professionals.
                    Feel free to send us your resume for future opportunities.
                  </p>
                  <p className="text-gray-500">
                    We'll keep your information on file and reach out when a suitable position becomes available.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 text-gray-100">
              We'd love to hear from you. Send us your resume and let's discuss how you can contribute to our team.
            </p>
            <div className="text-center">
              <p className="text-lg text-gray-100 mb-2">
                Contact us at:
              </p>
              <a
                href="mailto:hr@tbesglobal.com"
                className="text-xl font-semibold text-white hover:text-gray-200 transition-colors underline"
              >
                hr@tbesglobal.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPage;