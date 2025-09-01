import { motion } from "framer-motion";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <Heart className="h-8 w-8 text-red-500 heart-pulse" />
              <h3 className="text-2xl font-bold">CVD Prediction System</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Advanced AI-powered cardiovascular disease prediction system
              providing personalized health insights and risk assessments to
              help you maintain optimal heart health.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "#", label: "Facebook" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Instagram, href: "#", label: "Instagram" },
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                "Home",
                "About Us",
                "How It Works",
                "Health Resources",
                "Blog",
                "FAQs",
              ].map((link, index) => (
                <motion.li key={link}>
                  <motion.a
                    href="#"
                    whileHover={{ x: 5 }}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-gray-300">
                  123 Health Street
                  <br />
                  Medical District, MD 12345
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-gray-300">support@cvdprediction.com</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm"
            >
              © {currentYear} CVD Prediction System. All rights reserved.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-6 text-sm"
            >
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Disclaimer",
              ].map((link, index) => (
                <motion.a
                  key={link}
                  href="#"
                  whileHover={{ y: -1 }}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {link}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-red-900/20 border-t border-red-800/30">
        <div className="container mx-auto px-6 py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-red-200 text-sm">
              <strong>Medical Disclaimer:</strong> This tool is for
              informational purposes only and should not replace professional
              medical advice. Always consult with healthcare professionals for
              medical decisions.
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
