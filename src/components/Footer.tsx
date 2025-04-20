import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-3xl font-bold mb-4 text-white">StratifyLabs</h3>
            <p className="text-gray-400 leading-relaxed">
              <strong>StratifyLabs</strong> is a web platform for training, testing, and deploying computer vision models. 
              It supports classification, detection, and segmentation with real-time collaboration, chatbot assistance, 
              and both cloud and edge deployment options.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 pl-8"> {/* Increased pl-8 for more padding */}
            <div>
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-red-500 transition-colors duration-300">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-500 transition-colors duration-300">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-3">
                <li>stratifylabs@info.com</li>
                <li>+91 8590215314</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">&copy; 2025 StratifyLabs. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-500 transition-transform transform hover:scale-110">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="hover:text-blue-400 transition-transform transform hover:scale-110">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="hover:text-blue-600 transition-transform transform hover:scale-110">
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

