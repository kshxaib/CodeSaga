import React, { useState, useEffect } from "react";
import {
  FiCode,
  FiUsers,
  FiBarChart2,
  FiCheckCircle,
  FiPlay,
  FiBookmark,
  FiFlag,
  FiSend,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
} from "react-icons/fi";

import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CodeSagaLanding = () => {
  const [activeTab, setActiveTab] = useState("features");
  const [email, setEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ["features", "how-it-works", "pricing", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast(`Thanks for your interest! We'll contact you at ${email}`);
    setEmail("");
  };

  const features = [
    {
      icon: <FiCode className="w-8 h-8" />,
      title: "Code Execution",
      description:
        "Execute code in multiple languages with real-time results and debugging support.",
    },
    {
      icon: <FiBookmark className="w-8 h-8" />,
      title: "Company Playlists",
      description:
        "Access curated question lists from top tech companies to prepare for interviews.",
    },
    {
      icon: <FiBarChart2 className="w-8 h-8" />,
      title: "Track Progress",
      description:
        "Monitor your coding journey with detailed analytics and submission history.",
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Community Solutions",
      description:
        "See how others solved the same problems and learn different approaches.",
    },
    {
      icon: <FiFlag className="w-8 h-8" />,
      title: "Difficulty Levels",
      description:
        "Problems categorized by difficulty to match your skill level.",
    },
    {
      icon: <FiCheckCircle className="w-8 h-8" />,
      title: "Personalized Recommendations",
      description:
        "Get problem recommendations based on your performance and goals.",
    },
  ];


  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-950 to-black px-6 text-gray-100">
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-gray-900/90 backdrop-blur-md py-2" : "py-4"
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FiCode className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              CodeSaga
            </span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className={`hover:text-blue-400 transition ${
                activeTab === "features" ? "text-blue-400 font-medium" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("features")
                  .scrollIntoView({ behavior: "smooth" });
                setActiveTab("features");
              }}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className={`hover:text-blue-400 transition ${
                activeTab === "how-it-works" ? "text-blue-400 font-medium" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("how-it-works")
                  .scrollIntoView({ behavior: "smooth" });
                setActiveTab("how-it-works");
              }}
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className={`hover:text-blue-400 transition ${
                activeTab === "pricing" ? "text-blue-400 font-medium" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("pricing")
                  .scrollIntoView({ behavior: "smooth" });
                setActiveTab("pricing");
              }}
            >
              Pricing
            </a>
          </nav>

          <button
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-800 py-4 px-4 shadow-lg rounded-b-lg">
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className={`text-left hover:text-blue-400 transition ${
                    activeTab === "features" ? "text-blue-400 font-medium" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("features")
                      .scrollIntoView({ behavior: "smooth" });
                    setActiveTab("features");
                    setIsMenuOpen(false);
                  }}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className={`text-left hover:text-blue-400 transition ${
                    activeTab === "how-it-works"
                      ? "text-blue-400 font-medium"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("how-it-works")
                      .scrollIntoView({ behavior: "smooth" });
                    setActiveTab("how-it-works");
                    setIsMenuOpen(false);
                  }}
                >
                  How It Works
                </a>
                <a
                  href="#pricing"
                  className={`text-left hover:text-blue-400 transition ${
                    activeTab === "pricing" ? "text-blue-400 font-medium" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("pricing")
                      .scrollIntoView({ behavior: "smooth" });
                    setActiveTab("pricing");
                    setIsMenuOpen(false);
                  }}
                >
                  Pricing
                </a>
                <a
                  href="#contact"
                  className={`text-left hover:text-blue-400 transition ${
                    activeTab === "contact" ? "text-blue-400 font-medium" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("contact")
                      .scrollIntoView({ behavior: "smooth" });
                    setActiveTab("contact");
                    setIsMenuOpen(false);
                  }}
                >
                  Contact
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center py-20">
        {/* Border gradients */}
        <div className="absolute inset-y-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        <div className="absolute inset-y-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        <div className="px-4 py-10 md:py-20">
          {/* Animated heading */}
          <h1 className="relative z-10 mx-auto max-w-4xl text-center text-4xl font-bold text-slate-800 md:text-5xl lg:text-7xl ">
            {"Crack Tech Interviews with".split(" ").map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600"
            >
              {" CodeSaga"}
            </motion.span>
          </h1>

          <span>Where Coders Become Heroes</span>

          {/* Animated description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="relative z-10 mx-auto max-w-2xl py-6 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
          >
            Master company-specific coding questions with our curated playlists.
            Practice real interview questions from top tech companies.
          </motion.p>

          {/* Animated buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="relative z-10 mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/signup"
              className="relative flex w-full sm:w-auto items-center justify-center px-8 py-3.5 text-base font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 focus:outline-none"
            >
              Get Started
            </Link>
            <button className="relative flex w-full sm:w-auto items-center justify-center px-8 py-3.5 text-base font-medium text-black bg-white transition-all duration-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:-translate-y-1 focus:outline-none">
              <FiPlay className="mr-2" /> Watch Demo
            </button>
          </motion.div>

          {/* Stats or testimonials can go here */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="relative z-10 mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-center"
          >
            <div>
              <div className="text-3xl font-bold text-blue-500">10,000+</div>
              <div className="text-gray-600 dark:text-gray-400">Developers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500">50+</div>
              <div className="text-gray-600 dark:text-gray-400">Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-500">95%</div>
              <div className="text-gray-600 dark:text-gray-400">
                Success Rate
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to prepare for technical interviews at top
              companies
            </p>
          </div>

          {/* Hover Effect Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group h-full rounded-xl bg-gray-900 border border-gray-800 overflow-hidden"
              >
                {/* Gradient Glow (Hidden until hover) */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card Content */}
                <div className="p-6 h-full flex flex-col">
                  {/* Icon with Floating Effect */}
                  <div className="text-blue-400 mb-4 text-3xl transition-transform duration-300 group-hover:-translate-y-2">
                    {feature.icon}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 flex-grow">
                    {feature.description}
                  </p>

                  {/* Learn More Link (Slides up on hover) */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                    <a
                      href="#"
                      className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300"
                    >
                      Learn more
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="relative py-20 px-4 bg-gradient-to-b from-gray-950 to-black overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-[80px]"></div>
          <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-[80px]"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              How CodeSaga Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Get interview-ready in just three simple steps
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-4 lg:gap-8">
            {[
              {
                num: 1,
                title: "Choose Your Target Companies",
                desc: "Select the companies you're interviewing with from our extensive list.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                num: 2,
                title: "Purchase Question Playlists",
                desc: "Get access to curated question lists that match each company's interview patterns.",
                color: "from-purple-500 to-pink-500",
              },
              {
                num: 3,
                title: "Practice & Track Progress",
                desc: "Solve problems, see community solutions, and monitor your improvement.",
                color: "from-pink-500 to-rose-500",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="group flex-1 flex flex-col items-center text-center p-8 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-transparent transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/10"
              >
                {/* Animated gradient circle */}
                <div
                  className={`relative w-20 h-20 mb-6 rounded-full bg-gradient-to-br ${step.color} p-0.5`}
                >
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {step.num}
                  </div>
                  {/* Pulsing glow effect */}
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500 -z-10`}
                  ></div>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-white group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {step.desc}
                </p>

                {/* Animated connecting line (except last item) */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/4 right-0 translate-x-1/2 w-16 h-px bg-gray-700 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all duration-500">
                    <div className="absolute -right-1 -top-1 w-2 h-2 rounded-full bg-gray-600 group-hover:bg-cyan-400 group-hover:shadow-[0_0_8px_2px_rgba(34,211,238,0.3)] transition-all duration-500"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button with animated gradient */}
          <div className="mt-16 text-center">
            <button className="relative px-8 py-3.5 rounded-full bg-gray-800 hover:bg-gray-700/50 border border-gray-700 group transition-all duration-300 overflow-hidden">
              <Link to="/signup" className="relative z-10 font-medium text-white group-hover:text-gray-100 transition-colors duration-300">
                Get Started Now
              </Link>
              <span
                className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
              ></span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 blur-md transition-opacity duration-500 -z-10"></span>
            </button>
          </div>
        </div>
      </section>


      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 overflow-hidden">
        {/* Aceternity-style blobs */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500 rounded-full opacity-30 blur-3xl mix-blend-lighten animate-blob"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-500 rounded-full opacity-30 blur-3xl mix-blend-lighten animate-blob animation-delay-2000"></div>

        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">
            Ready for Your Dream Tech Job?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who cracked their interviews with
            CodeSaga
          </p>
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-4"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition shadow-lg"
            >
              Get Started
            </button>
          </form>
        </div>
      </section>

      <footer className="relative bg-gradient-to-b from-gray-950 to-black px-6 py-20 text-gray-400 overflow-hidden">
        {/* Background Glow Blobs */}
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-blue-600 rounded-full opacity-10 blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-purple-600 rounded-full opacity-10 blur-[100px]"></div>

        <div className="relative z-10 container mx-auto">
          {/* Main Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FiCode className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  CodeSaga
                </span>
              </div>
              <p className="text-gray-400">
                Unlock your dream tech job with curated company-wise playlists
                and AI-powered learning.
              </p>
              <p className="text-sm mt-4 text-gray-500">
                Trusted by{" "}
                <span className="text-blue-400 font-medium">
                  10k+ developers
                </span>{" "}
                worldwide.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-white">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="hover:text-blue-400 transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-blue-400 transition">
                    Playlists
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    Roadmap
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-white">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    Interview Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-3 text-white">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#contact" className="hover:text-blue-400 transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-blue-400 transition">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Socials */}
            <div className="flex space-x-6 text-xl">
              <a
                href="https://www.linkedin.com/in/shoaib-khan-7308932a9/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                <FiLinkedin />
              </a>
              <a
                href="https://x.com/khansho28034439?s=21"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition"
              >
                <FiTwitter />
              </a>
            </div>

            {/* Trust + Built By */}
            <div className="text-sm text-center md:text-right space-y-1 md:space-y-2 text-gray-500">
              <p>
                Built with <span className="text-red-500">❤</span> by{" "}
                <a href="www.linkedin.com/in/shoaib-khan-7308932a9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 font-semibold hover:underline">Shoaib</a>.
                
              </p>
              <p>
                Guided by{" "}
                <a
                  href="https://x.com/hiteshdotcom?s=11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 font-semibold hover:underline"
                >
                  Hitesh Choudhary
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CodeSagaLanding;
