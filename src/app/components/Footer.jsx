import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-800 pt-12 text-sm border-t border-gray-200 mt-20">

      <div className="max-w-7xl mx-auto px-6">
        {/* Columns */}
        <div className="flex flex-wrap justify-between gap-y-12">
          {/* About */}
          <div className="w-full sm:w-1/2 lg:w-[22%]">
            <h4 className="font-semibold mb-4 text-blue-900 uppercase">About FlyDream</h4>
            <ul className="space-y-2">
              <li>Our Story</li>
              <li>Press Room</li>
              <li>Sustainability</li>
              <li>Careers</li>
            </ul>
          </div>

          {/* Loyalty */}
          <div className="w-full sm:w-1/2 lg:w-[22%]">
            <h4 className="font-semibold mb-4 text-blue-900 uppercase">Loyalty Program</h4>
            <ul className="space-y-2">
              <li>How It Works</li>
              <li>Tier Benefits</li>
              <li>Reward Catalog</li>
              <li>Calculate XP</li>
            </ul>
          </div>

          {/* Support */}
          <div className="w-full sm:w-1/2 lg:w-[22%]">
            <h4 className="font-semibold mb-4 text-blue-900 uppercase">Support</h4>
            <ul className="space-y-2">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Feedback</li>
              <li>Live Chat</li>
            </ul>
          </div>

          {/* FlyDream XP */}
          <div className="w-full sm:w-1/2 lg:w-[22%]">
            <h4 className="font-semibold mb-4 text-blue-900 uppercase">FlyDream XP</h4>
            <ul className="space-y-2">
              <li>Join Now</li>
              <li>Dashboard</li>
              <li>Partner With Us</li>
            </ul>
          </div>
        </div>

        {/* Social icons + copyright */}
        <div className="mt-16 text-center pt-0">
          <div className="flex justify-center gap-6 text-sky-700 mb-6">
            <a href="#" aria-label="Facebook" className="hover:text-blue-800 transition">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-800 transition">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-blue-800 transition">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-blue-800 transition">
              <Linkedin size={20} />
            </a>
          </div>

          <p className="text-xs text-gray-500 pb-5">
            &copy; {new Date().getFullYear()} FlyDream Airline. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
