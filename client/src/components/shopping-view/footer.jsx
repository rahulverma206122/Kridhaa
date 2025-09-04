// src/components/Footer.jsx
import { Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-300">
      {/* Top banner */}
      <div className="bg-pink-100 text-center text-lg  py-2 text-gray-700">
        Know More about KRIDHA
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick links</h3>
          <ul className="space-y-2 text-gray-700">
            <li><a href="#" className="hover:underline">Customer Reviews</a></li>
            <li><a href="#" className="hover:underline">Our Blogs</a></li>
            <li><a href="#" className="hover:underline">Store Locator</a></li>
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Join Us</a></li>
            <li><a href="#" className="hover:underline">Kridha Gift Cards</a></li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Info</h3>
          <ul className="space-y-2 text-gray-700">
            <li><a href="#" className="hover:underline">Shipping & Returns</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">International Shipping</a></li>
            <li><a href="#" className="hover:underline">FAQs & Support</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact us</h3>
          <p className="text-gray-700 mb-2">
            For any suggestions, queries or complaints please contact us:
          </p>
          <p className="text-gray-700 mb-2">SK Jewellers Private Limited</p>
          <p className="text-gray-700 mb-2">
             Homeganj <br />Auraiya 206122
          </p>
          <p className="text-gray-700 mb-2">kridha.com</p>
          <p className="text-gray-700">+91 7217293004 (10 AM to 7:30 PM)</p>
        </div>
      </div>

              {/* Subscribe */}
        <div className="bg-gray-200 py-4 text-center text-gray-700">
          <p className="font-medium">
            Subscribe for exclusive offers and updates!
          </p>

          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook className="w-6 h-6 text-black hover:text-pink-600" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-6 h-6 text-black hover:text-pink-600" />
            </a>
            <a href="https://www.linkedin.com/in/rahul-verma-33480b201/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-6 h-6 text-black hover:text-pink-600" />
            </a>
          </div>
        </div>
      
    </footer>
  );
}
