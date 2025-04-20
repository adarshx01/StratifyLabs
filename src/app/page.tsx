import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown, Menu, Play, MessageSquare, Code, Box, Shield, Database, Layers, ArrowRight } from "lucide-react"
import HeroGeometric from "@/components/hero-geometric"
import { SignUpButton } from "@clerk/nextjs"; // Importing SignUpButton from Clerk

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <HeroGeometric />

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-950 border-b border-gray-800"> {/* Added border-b */}
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Vision Training</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Supporting classification, detection, and segmentation tasks with popular models like YOLO, ResNet, UNet,
              and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
              <div className="mb-4">
                <MessageSquare className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Collaboration</h3>
              <p className="text-gray-300">
                RAG-powered messaging system for seamless team collaboration and knowledge sharing.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
              <div className="mb-4">
                <Code className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Code Customization</h3>
              <p className="text-gray-300">
                Direct access to code and model customization for complete control over your projects.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
              <div className="mb-4">
                <Box className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">3D Visualization</h3>
              <p className="text-gray-300">
                Web-based 3D robot visualization using URDF and Three.js for intuitive model testing.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
              <div className="mb-4">
                <Shield className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Authentication</h3>
              <p className="text-gray-300">
                Clerk-based authentication system ensuring your data and models remain protected.
              </p>
            </div>

            {/* Feature Card 5 */}
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
              <div className="mb-4">
                <Database className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Reliable Storage</h3>
              <p className="text-gray-300">
                Secure storage via Supabase for datasets, models, and project configurations.
              </p>
            </div>

            {/* Feature Card 6 */}
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
              <div className="mb-4">
                <Layers className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Flexible Deployment</h3>
              <p className="text-gray-300">
                Deploy models on cloud or edge using containerized environments for maximum flexibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-24 px-4 bg-gray-900 border-b border-gray-800"> {/* Changed background and added border */}
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Real-World Applications</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Manufacturing QA",
                image: "/images/UseCase/manufacture.webp",
                description: "Detect defects and ensure quality control in real-time",
              },
              {
                title: "Retail Analytics",
                image: "/images/UseCase/retail.webp",
                description: "Track customer behavior and optimize store layouts",
              },
              {
                title: "Security Systems",
                image: "/images/UseCase/security.webp",
                description: "Monitor and analyze security camera feeds",
              },
              {
                title: "PPE Compliance Monitoring",
                image: "/images/UseCase/healthcare.webp",
                description: "Automatically detect face masks, gloves, and protective gear in healthcare settings to ensure safety and compliance.",

              },
              {
                title: "Agriculture",
                image: "/images/UseCase/agriculture.webp",
                description: "Monitor crop health and optimize farming operations",
              },
              {
                title: "Smart Cities",
                image: "/images/UseCase/government.webp",
                description: "Improve traffic flow and urban planning",
              },
            ].map((useCase, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg bg-gray-800">
                <Image
                  src={useCase.image || "/placeholder.svg"}
                  alt={useCase.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-64 transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent opacity-80" />
                <div className="absolute bottom-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{useCase.title}</h3>
                  <p className="text-gray-300">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Animation */}
      <section className="py-24 px-4 bg-gray-950 border-b border-gray-800"> {/* Added border */}
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { number: "100%", label: "Local Processing", sublabel: "Complete data privacy" },
              { number: "50x", label: "Faster Training", sublabel: "Than cloud solutions" },
              { number: "24/7", label: "Availability", sublabel: "No internet required" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-blue-400 mb-4">{stat.number}</div>
                <div className="text-xl font-semibold mb-2 text-white">{stat.label}</div>
                <div className="text-gray-300">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-900 border-b border-gray-800"> {/* Changed background and added border */}
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Everything you need for Computer Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Local GPU Training</h3>
              <p className="text-gray-300">
                Train models using your own hardware for complete data privacy and control
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Model Management</h3>
              <p className="text-gray-300">Version control and experiment tracking built specifically for CV models</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">Easy Deployment</h3>
              <p className="text-gray-300">Deploy models to production with just a few clicks</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-950"> {/* Kept the darker background for CTA */}
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Start Training Your Models Today</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are building the future of computer vision
          </p>
          <SignUpButton>
            <button className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-lg hover:from-blue-400 hover:to-blue-600 hover:shadow-xl transition-all duration-300">
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </SignUpButton>
        </div>
      </section>
    </div>
  )
}

