import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa'

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">GiftedBooks</h3>
            <p>Empowering minds, resolving issues.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-[#FF0000]">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#1a73e8]">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <ul className="space-y-2">
                <li>contact@giftedbooks.com</li>
                <li>(123) 456-7890</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2024 GiftedBooks. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-[#1a73e8]"><FaFacebook size={24} /></a>
            <a href="#" className="hover:text-[#1a73e8]"><FaTwitter size={24} /></a>
            <a href="#" className="hover:text-[#1a73e8]"><FaLinkedin size={24} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

