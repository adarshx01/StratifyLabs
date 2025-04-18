import { FaBook, FaClipboardList, FaHandsHelping } from 'react-icons/fa'

export function WhatWeOffer() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FaBook className="text-[#1a73e8] text-4xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Education Tools</h3>
            <p className="text-gray-600">
              Enhance your learning experience with our AI-powered educational tools.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FaClipboardList className="text-[#1a73e8] text-4xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Grievance Management System</h3>
            <p className="text-gray-600">
              Efficiently report and track social grievances for faster resolution.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FaHandsHelping className="text-[#1a73e8] text-4xl" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Book Donation & Marketplace</h3>
            <p className="text-gray-600">
              Connect with others to donate or purchase books for a good cause.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

