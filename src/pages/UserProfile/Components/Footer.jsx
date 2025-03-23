import React from "react";
import { FaQuestionCircle, FaCog, FaShieldAlt } from "react-icons/fa";

function Footer() {
  return (
    <footer className="text-gray-500 text-xs py-6 px-4 w-full max-w-3xl mx-auto font-semibold ">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-x-0">
        <div className="space-y-2">
          <a href="#" className="hover:underline block hover:text-blue-700">
            About
          </a>
          <a href="#" className="hover:underline block hover:text-blue-700">
            Community Policies
          </a>
          <a href="#" className="hover:underline block hover:text-blue-700">
            Privacy & Terms
          </a>
          <a href="#" className="hover:underline block hover:text-blue-700">
            Sales Solutions
          </a>
          <a href="#" className="hover:underline block hover:text-blue-700">
            Safety Center
          </a>
        </div>

        {/* Column 2 - Services */}
        <div className="space-y-2">
          <a href="#" className="hover:underline block hover:text-blue-700">
            Accessibility
          </a>
          <a href="#" className="hover:underline block hover:text-blue-700">
            Careers
          </a>
          <a href="#" className="hover:underline block hover:text-blue-700">
            Ad Choices
          </a>
          <a href="#" className="hover:underline block hover:text-blue-700">
            Mobile
          </a>
        </div>

        {/* Column 3 - Business Solutions */}
        <div className="space-y-2">
          <a href="#" className="hover:underline block hover:text-blue-700">
            Talent Solutions
          </a>
          <a href="#" className="hover:underline block hover:text-blue-700">
            Marketing Solutions
          </a>
          <a href="#" className="hover:underline block hover:text-blue-700">
            Advertising
          </a>
          <a href="#" className="hover:underline block hover:text-blue-700">
            Small Business
          </a>
        </div>

        {/* Column 4 - Help & Settings */}
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <FaQuestionCircle className="text-gray-500 mt-1" />
            <div>
              <p className="font-semibold text-gray-800">Questions?</p>
              <a href="#" className="hover:underline block hover:text-blue-700">
                Visit our Help Center.
              </a>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FaCog className="text-gray-500 mt-1" />
            <div>
              <p className="font-semibold text-gray-800">
                Manage your account & privacy
              </p>
              <a href="#" className="hover:underline block hover:text-blue-700">
                Go to Settings.
              </a>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <FaShieldAlt className="text-gray-500 mt-1" />
            <div>
              <p className="font-semibold text-gray-800">
                Recommendation Transparency
              </p>
              <a href="#" className="hover:underline block hover:text-blue-700">
                Learn more about Recommended Content.
              </a>
            </div>
          </div>
        </div>

        {/* Column 5 - Language Selector (Properly aligned) */}
        <div className="flex flex-col items-start space-y-2">
          <p className="font-semibold text-gray-800">Select Language</p>
          <select className="border border-gray-300 rounded-md px-3 py-2 w-full min-w-[180px]">
            <option>English (English)</option>
            <option>العربية (Arabic)</option>
            <option>Français (French)</option>
            <option>Deutsch (German)</option>
            <option>Español (Spanish)</option>
          </select>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="text-center text-gray-500 text-xs mt-6">
        LinkedIn Corporation © 2025
      </div>
    </footer>
  );
}

export default Footer;
