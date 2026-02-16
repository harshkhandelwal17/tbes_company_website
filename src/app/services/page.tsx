import React from 'react';
import Link from 'next/link';

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-32">
        <div className="max-w-6xl mx-auto px-5 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 drop-shadow-lg">
            Our Services
          </h1>
          <p className="text-2xl md:text-3xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed">
            Comprehensive BIM and CAD Solutions for Architecture, Engineering & Construction
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Services Introduction */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-8">
              BIM & Engineering Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our experienced and passionate team of professionals delivers the best quality to our clients with a guaranteed satisfaction.
               We have come up with the following innovative and cost effective solutions for our clients:
            </p>
          </div>
        </div>
      </section>

      {/* Services Section - Vertical Layout */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 space-y-24">
          
          {/* Architectural Service */}
<div className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 group">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-2 rounded-full text-blue-800 font-semibold text-sm mb-6">
            Core Service
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Architectural Services
          </h3>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            At TBES Global we produce digital models which are used for coordination with architects and MEP engineers. These BIM models help us in collaboration with design, coordination and document assets to explore design analysis and clash coordination with the stake holders of the project.
            It also assists the architects through the design lifecycle and generates a flawless design. At the same time helping them to get a realistic approach of the design.
          </p>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Software Expertise:</h4>
            <div className="flex flex-wrap gap-4">
              {['Revit'].map((software, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                    {software === 'Revit' ? (
                      <img 
                        src="/Revit.jpg" 
                        alt="Revit Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-600">
                        {software[0]}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">{software}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="w-full h-80 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
            <img 
              src="/architectural_services.jpg" 
              alt="BIM Modeling and Architectural Services" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>


{/* You can add new one */}
{/* Structural Services */}
<div className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 group">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-2 rounded-full text-blue-800 font-semibold text-sm mb-6">
            Core Service
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Structural Services
          </h3>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            At TBES Global we are well versed with structural design approach which helps our team to model and generate structural components including precast & reinforced concrete, steel & composite structures. Our knowledge helps us to involve in foundation design, roof, frame and RCC detailing leading to an enhanced error free design.

Our structural modeling has helped structural engineers to visualize impacts and handle critical designing methodologies. It also plays a pivotal role in the design cycle and generate a real time overview of the design.
          </p>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Software Expertise:</h4>
            <div className="flex flex-wrap gap-4">
              {['Revit'].map((software, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                    {software === 'Revit' ? (
                      <img 
                        src="/Revit.jpg" 
                        alt="Revit Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-600">
                        {software[0]}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">{software}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="w-full h-80 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
            <img 
              src="/structural_services.jpg" 
              alt="BIM Modeling and Architectural Services" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>

{/* Mechanical Services */}
    <div className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 group">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-2 rounded-full text-blue-800 font-semibold text-sm mb-6">
            Core Service
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Mechanical Services
          </h3>
          <h5 className="text-2xl font-bold text-gray-900 mb-6">
            • Ducting Services
          </h5>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            At TBES Global our platform covers the system of HVAC following SMACNA/IPC/UPC standards and local applicable codes for the engineers and designers. We provide a complete package from modeling, design coordination, clash detection, services coordination, cost estimation and value engineering. Our team of experts is proficient in working on various platforms – AutoCAD, Revit, AutoCAD MEP, AutoCAD Fabrication etc.
          </p>
          <h5 className="text-2xl font-bold text-gray-900 mb-6">
            • Piping Services
          </h5>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            We are specialized in modeling of Mechanical Piping systems which is done aligned to our ducting services generating a parallel design workflow. It is done by close collaboration of internal team which provides a combined constructive product to our clients.

            Our approach helps the stake holders to resolve the issues and receive a coordinated design at the pre-construction phase itself. It simultaneously helps to reduce cost, optimal resources utilization and time management.
          </p>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Software Expertise:</h4>
            <div className="flex flex-wrap gap-4">
              {['Revit','AutoCAD','AutoCAD Fabrication'].map((software, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                    {software === 'Revit' ? (
                      <img 
                        src="/Revit.jpg" 
                        alt="Revit Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : software === 'AutoCAD' ? (
                      <img 
                        src="/Autocad.png" 
                        alt="AutoCAD Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : software === 'AutoCAD Fabrication' ? (
                      <img 
                        src="/AutoCAD_Fabrication.png" 
                        alt="AutoCAD Fabrication Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-600">
                        {software[0]}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">{software}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="w-full h-80 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
            <img 
              src="/mechanical_services.jpg" 
              alt="BIM Modeling and Mechanical Services" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>

{/* Electrical Services */}
<div className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 group">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-2 rounded-full text-blue-800 font-semibold text-sm mb-6">
            Core Service
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Electrical Services
          </h3>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
           At TBES Global we specialize in modeling of containments including cable trays, bus duct, trunking, conduits, lighting arrangements, MCCs, transformers, DB panels and detail drawings of small power & lighting circuits, fire alarm, BMS, lightning & earth protection and ELV services which makes us a one stop solution for our clients.

We are also proficient in family creation of electrical components and fixtures for manufacturers as per the product specifications. The output is a standardized file format which can be used on different softwares platforms and as a virtual sample of the exact product.
          </p>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Software Expertise:</h4>
            <div className="flex flex-wrap gap-4">
              {['Revit','AutoCAD','AutoCAD Fabrication'].map((software, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                    {software === 'Revit' ? (
                      <img 
                        src="/Revit.jpg" 
                        alt="Revit Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : software === 'AutoCAD' ? (
                      <img 
                        src="/Autocad.png" 
                        alt="AutoCAD Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : software === 'AutoCAD Fabrication' ? (
                      <img 
                        src="/AutoCAD_Fabrication.png" 
                        alt="AutoCAD Fabrication Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-600">
                        {software[0]}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">{software}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="w-full h-80 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
            <img 
              src="/electrical_services.jpg" 
              alt="BIM Modeling and Electrical Services" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>

{/* Plumbing Services */}
<div className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 group">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-2 rounded-full text-blue-800 font-semibold text-sm mb-6">
            Core Service
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Plumbing Services
          </h3>
          <h5 className="text-2xl font-bold text-gray-900 mb-6">
            • DWV (Drainage, Waste, Vent)
          </h5>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
At TBES Global our experts deal with one of the biggest challenges of building technology where a slight error can turn out futile leading to a huge impact to the project. We are committed to assist our clients with the Plumbing and venting systems proving a complete deal of modeling, coordination, bill of material, installation drawings and value addition to the design. It helps to get a complete overview of the network system and identify as well as rectify the design errors and calculations.
</p>
<h5 className="text-2xl font-bold text-gray-900 mb-6">
            • Water Supply
          </h5>
 <p className="text-xl text-gray-600 mb-8 leading-relaxed">
We specialize in solutions for Water Supply systems for projects of various verticals. Our experienced team provides support and collaborates with engineers, designers and consultants globally. These include a complete package of modeling, design coordination, clash detection and cost estimations. It adds an edge to our clients at the initial preconstruction phase.
          </p>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Software Expertise:</h4>
             <div className="flex flex-wrap gap-4">
              {['Revit','AutoCAD','AutoCAD Fabrication'].map((software, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                    {software === 'Revit' ? (
                      <img 
                        src="/Revit.jpg" 
                        alt="Revit Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : software === 'AutoCAD' ? (
                      <img 
                        src="/Autocad.png" 
                        alt="AutoCAD Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : software === 'AutoCAD Fabrication' ? (
                      <img 
                        src="/AutoCAD_Fabrication.png" 
                        alt="AutoCAD Fabrication Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-600">
                        {software[0]}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">{software}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="w-full h-80 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
            <img 
              src="/plumbing_services.jpg" 
              alt="BIM Modeling and Plumbing Services" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>

{/* Fire Protection Services */}
<div className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 group">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-2 rounded-full text-blue-800 font-semibold text-sm mb-6">
            Core Service
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Fire Protection Services
          </h3>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Fire protection is the study and practice of mitigating the unwanted effects of potentially destructive fires.  It involves the study of the behavior, compartmentalization, suppression and investigation of fire and its related emergencies, as well as the research and development, production, testing and application of mitigating systems.

Buildings must be constructed in accordance with the version of the building code that is in effect when an application for a building permit is made.

At TBES Global we cater our clients Fire Protection needs with utmost care. We provide 3D modeling and services with a through checking for design flaws, NFPA codes and also keeping in mind constructability. We make sure that the models and drawings delivered from our end help our clients in getting their design and concerned authority approvals.
          </p>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Software Expertise:</h4>
            <div className="flex flex-wrap gap-4">
              {['Revit','AutoCAD','AutoCAD Fabrication'].map((software, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                    {software === 'Revit' ? (
                      <img 
                        src="/Revit.jpg" 
                        alt="Revit Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : software === 'AutoCAD' ? (
                      <img 
                        src="/Autocad.png" 
                        alt="AutoCAD Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : software === 'AutoCAD Fabrication' ? (
                      <img 
                        src="/AutoCAD_Fabrication.png" 
                        alt="AutoCAD Fabrication Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-600">
                        {software[0]}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">{software}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="w-full h-80 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
            <img 
              src="/fireprotection_services.jpg" 
              alt="BIM Modeling and Fireprotection Services" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>

{/* Clash Identification and Coordination */}
<div className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 group">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-block bg-gradient-to-r from-green-100 to-blue-50 px-4 py-2 rounded-full text-green-800 font-semibold text-sm mb-6">
            Corodination Service
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Clash Identification and Coordination
          </h3>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
           At TBES Global we believe a well-coordinated project can result in many millions of dollars saved and a project that stays on schedule. But traditional coordination processes can be costly and time-consuming as well as bottlenecks can occur when clash detection is handled by an individual.

We put clash detection in the hands of our entire project team to resolve clashes quicker simplifying BIM coordination by ensuring each project participant can view multi-discipline models, all from a single platform.
          </p>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Software Expertise:</h4>
            <div className="flex flex-wrap gap-4">
              {['NavisWorks'].map((software, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                    {software === 'NavisWorks' ? (
                      <img 
                        src="/Navis.png" 
                        alt="Navis Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-600">
                        {software[0]}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">{software}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="w-full h-80 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
            <img 
              src="/clash_services.jpg" 
              alt="BIM Modeling and Clash Detection Services" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>

{/* Shop Drawing */}
<div className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 group">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-2 rounded-full text-blue-800 font-semibold text-sm mb-6">
            Core Service
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Shop Drawing
          </h3>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          We know every building has a set of components. For example -windows, cabinets, elevators etc.
At TBES Global, through Shop Drawings  we provide detail of these components and help to identify how they will fit into the building structure. Shop Drawings also include all the MEP components, fabrication and other types of detailing and also helps in identifying what kind of materials will be needed for the construction process.
          </p>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Software Expertise:</h4>
            <div className="flex flex-wrap gap-4">
              {['Revit','AutoCAD','AutoCAD Fabrication'].map((software, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                    {software === 'Revit' ? (
                      <img 
                        src="/Revit.jpg" 
                        alt="Revit Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : software === 'AutoCAD' ? (
                      <img 
                        src="/Autocad.png" 
                        alt="AutoCAD Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : software === 'AutoCAD Fabrication' ? (
                      <img 
                        src="/AutoCAD_Fabrication.png" 
                        alt="AutoCAD Fabrication Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-600">
                        {software[0]}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">{software}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="w-full h-80 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
            <img 
              src="/shopdrawing.jpg" 
              alt="ShopDrawing Services" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Scan to BIM */}
<div className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 group">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-2 rounded-full text-blue-800 font-semibold text-sm mb-6">
            Core Service
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Scan to BIM
          </h3>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          The technology known as point cloud is becoming the next big thing for the construction industry. Point clouds are mostly generated with the help of 3D laser scanners and LiDAR (light detection and ranging) technology and techniques. 3D scanners gather point measurements from real-world objects or photos for a point cloud that can then be translated to a 3D mesh or a CAD model.

Point cloud scan to BIM is used nowadays by a number of sectors including retailers, main contractors, and architects. It is also used by MEP designers, MEP contractors, and consulting engineers. The main advantage of scan to BIM is its ability to analyze the differences between point cloud and model geometry by creating native Revit geometry from and to a point cloud.

At TBES Global, we leverage the potential of point cloud technology by integrating it with our BIM expertise. We have great expertise in converting the Point Cloud Data into a digital twin using the BIM platform.
          </p>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Software Expertise:</h4>
            <div className="flex flex-wrap gap-4">
              {['Revit','Recap Pro','Matterport'].map((software, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                    {software === 'Revit' ? (
                      <img 
                        src="/Revit.jpg" 
                        alt="Revit Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : software === 'Recap Pro' ? (
                      <img 
                        src="/recap.png" 
                        alt="Recap Pro Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : software === 'Matterport' ? (
                      <img 
                        src="/matterport.png" 
                        alt="Mattterport Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-600">
                        {software[0]}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">{software}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="w-full h-80 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
            <img 
              src="/pointcloud.jpg" 
              alt="Scan to BIM Services" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>

{/* Rendering */}
<div className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 group">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-block bg-gradient-to-r from-pink-100 to-blue-50 px-4 py-2 rounded-full text-pink-800 font-semibold text-sm mb-6">
            Rendering Service
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
            Rendering
          </h3>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Rendering or image synthesis is the process of generating a photorealistic or non-photorealistic image from a 2D or 3D model by means of a computer program. Multiple models can be defined in a scene file containing objects in a strictly defined language or data structure. The scene file contains geometry, viewpoint, texture, lighting, and shading information describing the virtual scene.

As technology has evolved, so has the process of producing all architectural design documentation. Long gone are the days of setting out and manually drawing a 2-point perspective. We at TBES Global are delivering our customers with incredible renders on software’s like Twinmotion, 3D Max with the highest level of realism. With the money that’s currently being thrown in to the gaming industry, we look forward to be able to master “Real time Rendering” techniques.
          </p>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Software Expertise:</h4>
            <div className="flex flex-wrap gap-4">
              {['Revit','TwinMotion'].map((software, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                    {software === 'Revit' ? (
                      <img 
                        src="/Revit.jpg" 
                        alt="Revit Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : software === 'TwinMotion' ? (
                      <img 
                        src="/twinmotion.png" 
                        alt="TTwinMotion Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-600">
                        {software[0]}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">{software}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="w-full h-80 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
            <img 
              src="/rendering.jpg" 
              alt="Rendering Services" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>

{/* Family Creation */}
<div className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 group">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-block bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-2 rounded-full text-blue-800 font-semibold text-sm mb-6">
            Core Service
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
           Family Creation
          </h3>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          We expertise in combining up with small components and binding up into a family using Revit.

 In addition blocks can also be created using AutoCAD. Using Revit’s family editor tool we can develop immense number of detailed family components ranging from Architectural, Structural, Mechanical, Electrical etc.

We have been building up Electrical equipment and fixtures, Mechanical Equipment etc.
          </p>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Software Expertise:</h4>
            <div className="flex flex-wrap gap-4">
              {['Revit'].map((software, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                    {software === 'Revit' ? (
                      <img 
                        src="/Revit.jpg" 
                        alt="Revit Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-600">
                        {software[0]}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">{software}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="w-full h-80 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
            <img 
              src="/familycreation.png" 
              alt="Family Creation" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>


{/* CAD Conversion */}
<div className="bg-white rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 group">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="inline-block bg-gradient-to-r from-red-100 to-blue-50 px-4 py-2 rounded-full text-red-800 font-semibold text-sm mb-6">
            Drafting Service
          </div>
          <h3 className="text-4xl font-bold text-gray-900 mb-6">
           CAD Conversion
          </h3>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
         In the past, all of the designs, whether Architectural, Mechanical, or Civil, would be made by hand on a set of blueprints or paper. These blueprints contained all the necessary information to correctly design the intended project. But the industry standard today is CAD. So in other words, there are a lot of blueprints that need to be updated or converted to CAD. This is where we get the term CAD conversion from. There are numerous organizations where technical data is treated as a critical asset. Efficient management of this data is important for the functioning of the business. Similarly, for companies where blueprints need to be created and stored, CAD conversion comes in handy. Converting hard copy paper work to electronic format makes archiving, retrieving, copying, editing, and sharing of the drawings easier.

We at TBES Global, Computer Aided Designing using the latest CAD conversion software deliver advantage through technology to our clients. It enhances skills and expertise of professionals through better management of complex designs, while improved visual presentation adds to the market trust and quality.
          </p>
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Software Expertise:</h4>
            <div className="flex flex-wrap gap-4">
              {['AutoCAD'].map((software, index) => (
                <div key={index} className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                    {software === 'AutoCAD' ? (
                      <img 
                        src="/Autocad.png" 
                        alt="Autocad Logo" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center text-xs text-gray-600">
                        {software[0]}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">{software}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="w-full h-80 rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-lg">
            <img 
              src="/cad.jpg" 
              alt="Drafting Services" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>

        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Why Choose Our Services?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We combine technical expertise with innovative solutions to deliver exceptional results
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Team",
                description: "Industry leading professionals with 10+ years of industry experience",
                icon: "👨‍💼"
              },
              {
                title: "Quality Assurance",
                description: "Rigorous quality control processes ensure error-free deliverables",
                icon: "✅"
              },
              {
                title: "On-Time Delivery",
                description: "Committed to meeting deadlines without compromising quality",
                icon: "⏰"
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center p-8 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-32">
        <div className="max-w-5xl mx-auto px-5 text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            Ready to Transform Your Project?
          </h2>
          <p className="text-2xl mb-12 opacity-90 leading-relaxed max-w-3xl mx-auto">
            Get in touch with our experts to discuss how our BIM solutions can 
            optimize your construction workflow and reduce costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/contact">
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-5 px-12 rounded-full text-xl font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 hover:-translate-y-2 shadow-2xl">
              Contact Us Today
            </button>
            </Link>
            <Link href="/projects">
            <button className="border-2 border-white text-white py-5 px-12 rounded-full text-xl font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 hover:-translate-y-2">
              View Portfolio
            </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;