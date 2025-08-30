/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Story", href: "/story" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
    products: [
      { name: "Makhana", href: "/products?category=makhana" },
      { name: "Sattu", href: "/products?category=sattu" },
      { name: "Bestsellers", href: "/products?bestsellers=true" },
      { name: "New Arrivals", href: "/products?new=true" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Returns", href: "/returns" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Disclaimer", href: "/disclaimer" },
    ],
  };

  const socialLinks = [
    {
      name: "Instagram",
      href: "#",
      iconSvg: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "#",
      iconSvg: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "#",
      iconSvg: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      className="relative bg-white overflow-hidden min-h-screen"
      style={{ color: "#1C1E19" }}
    >
      {/* Background Image Container - Bottom Half Only */}
      <div className="absolute bottom-0 left-0 w-full h-2/3 z-0">
        <img
          src="/footer-bg.png" // Replace with your image path
          alt="Traditional Indian farm landscape"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 ">
        {/* Top Section: Logo + Newsletter + Location in a single row */}
        <motion.div
          className="flex justify-between items-start gap-16 w-full"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Left: Logo + Social Media */}
          <div className="flex flex-col gap-12">
            {/* Logo */}
            <Link to="/" className="flex items-center justify-center space-x-3">
              <div className="w-35 h-35 rounded-lg flex items-center justify-center">
                <img
                  src="/Mindy Munchs_Logo-01.png"
                  alt="Mindy Munchs Logo"
                  className="mx-auto"
                />
              </div>
            </Link>

            {/* Social Media */}
            <div className="flex flex-row items-center gap-4">
              <span className="font-medium" style={{ color: "#1C1E19" }}>
                Follow us:
              </span>
              <div className="flex gap-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-200 hover:bg-primary-500 rounded-full flex items-center justify-center hover:text-white hover:scale-110 transition-all duration-200"
                    title={social.name}
                    style={{ color: "#1C1E19" }}
                  >
                    {social.iconSvg}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Center: Newsletter Signup */}
          <div className="text-center flex flex-col items-center gap-10">
            <p
              className="max-w-md text-base leading-relaxed"
              style={{ color: "#1C1E19" }}
            >
              Subscribe for special offers, newsletters and become a part of our
              movement towards traditional Indian superfoods
            </p>

            {/* Newsletter Signup */}
            <div className="flex rounded-lg overflow-hidden shadow-lg">
              <input
                type="email"
                placeholder="Your e-mail"
                className="px-4 py-3 text-gray-900 placeholder-gray-600 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                style={{ width: "500px" }}
              />
              <button
                type="submit"
                className="px-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Location */}
          <div className="text-right space-y-4">
            <p className="font-semibold" style={{ color: "#1C1E19" }}>
              Mumbai, Maharashtra
            </p>
            <p style={{ color: "#1C1E19" }}>India</p>
            <p style={{ color: "#1C1E19" }}>
              <span className="font-medium">Email ID: </span>
              <a
                href="mailto:hello@mindymunchs.com"
                className="underline hover:text-primary-600 transition-colors duration-200"
                style={{ color: "#1C1E19" }}
              >
                hello@mindymunchs.com
              </a>
            </p>
          </div>
        </motion.div>

        {/* Dropdown Navigation Links */}
        <div className="flex flex-wrap justify-center gap-8 lg:gap-12 mb-20">
          {Object.entries(footerLinks).map(([section, links], index) => (
            <motion.div
              key={section}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                className="font-semibold text-lg uppercase tracking-wide cursor-pointer flex items-center gap-1 hover:text-primary-600 transition-colors duration-200"
                style={{ color: "#1C1E19" }}
              >
                {section}
                <svg
                  className="w-4 h-4 transform group-hover:rotate-180 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20">
                <div className="py-2">
                  {links.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-200"
                      style={{ color: "#1C1E19" }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Copyright & Certifications */}
        <div className=" mt-16 pt-12 relative z-20"></div>
      </div>
    </footer>
  );
};

export default Footer;
