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
} from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";

const CodeSagaLanding = () => {
  const [activeTab, setActiveTab] = useState("features");
  const [email, setEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Update active tab based on scroll position
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
    alert(`Thanks for your interest! We'll contact you at ${email}`);
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

  const companies = [
    { name: "Google", logo: "G", color: "from-red-500 to-yellow-500" },
    { name: "Amazon", logo: "A", color: "from-yellow-500 to-orange-500" },
    { name: "Microsoft", logo: "M", color: "from-green-500 to-blue-500" },
    { name: "Facebook", logo: "F", color: "from-blue-500 to-indigo-500" },
    {
      name: "Apple",
      logo: "A",
      logoColor: "text-gray-900",
      color: "from-gray-200 to-gray-400",
    },
    { name: "Netflix", logo: "N", color: "from-red-600 to-red-800" },
    { name: "Uber", logo: "U", color: "from-black to-gray-800" },
    { name: "Airbnb", logo: "A", color: "from-pink-500 to-red-500" },
  ];

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
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

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Crack Tech Interviews with{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                CodeSaga
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Master company-specific coding questions with our curated
              playlists. Practice real interview questions from top tech
              companies and track your progress.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to={"/signup"}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition shadow-lg hover:shadow-blue-500/30"
              >
                Get Started
              </Link>
              <button className="border border-gray-600 hover:border-blue-400 text-gray-300 hover:text-blue-400 px-6 py-3 rounded-lg font-medium transition flex items-center justify-center">
                <FiPlay className="mr-2" /> Watch Demo
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute top-20 -right-4 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              <div className="relative bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-gray-400">Google Playlist</span>
                </div>
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center text-white font-bold mr-2">
                      G
                    </div>
                    <span className="font-medium">Google Top 50 Questions</span>
                  </div>
                  <div className="text-sm text-gray-400 mb-3">
                    Completed: 12/50
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                      style={{ width: "24%" }}
                    ></div>
                  </div>
                </div>
                <pre className="text-sm text-gray-300 overflow-x-auto bg-gray-900/50 p-3 rounded-lg mb-3">
                  <code>
                    {`// Google's most asked question
function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`}
                  </code>
                </pre>
                <div className="mt-4 flex justify-between items-center">
                  <button className="text-xs text-gray-400 hover:text-blue-400 flex items-center">
                    <FiPlay className="mr-1" /> Run Code
                  </button>
                  <div className="flex space-x-2">
                    <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded">
                      Save
                    </button>
                    <button className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to prepare for technical interviews at top
              companies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-xl p-6 transition hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How CodeSaga Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Get interview-ready in just three simple steps
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0">
            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Choose Your Target Companies
              </h3>
              <p className="text-gray-400">
                Select the companies you're interviewing with from our extensive
                list.
              </p>
            </div>

            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Purchase Question Playlists
              </h3>
              <p className="text-gray-400">
                Get access to curated question lists that match each company's
                interview patterns.
              </p>
            </div>

            <div className="flex flex-col items-center text-center max-w-xs">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Practice & Track Progress
              </h3>
              <p className="text-gray-400">
                Solve problems, see community solutions, and monitor your
                improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Company Question Playlists
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Purchase access to curated question lists from top tech companies
            </p>
          </div>

          {/* Company Playlist Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {companies.slice(0, 4).map((company, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition"
              >
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${
                    company.color
                  } flex items-center justify-center text-white text-xl font-bold mb-4 ${
                    company.logoColor || ""
                  }`}
                >
                  {company.logo}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {company.name} Top Questions
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  50 most frequently asked coding questions
                </p>
                <div className="flex items-end mb-4">
                  <span className="text-2xl font-bold">$19</span>
                  <span className="text-gray-400 text-sm ml-1">
                    one-time purchase
                  </span>
                </div>
                <Link to="/login" className="px-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-medium transition">
                  Add to Library
                </Link>
              </div>
            ))}
          </div>

          {/* Bundle Pricing */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Looking for more?</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get access to all company playlists with our premium bundles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2">Starter Pack</h3>
              <p className="text-3xl font-bold mb-4">
                $49<span className="text-lg text-gray-400">/one-time</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" /> 3 Company
                  Playlists
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" /> Basic
                  Problem Access
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" /> Code
                  Execution
                </li>
                <li className="flex items-center text-gray-500">
                  <FiCheckCircle className="mr-2" /> All Company Playlists
                </li>
                <li className="flex items-center text-gray-500">
                  <FiCheckCircle className="mr-2" /> Premium Analytics
                </li>
              </ul>
              <button className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-medium transition">
                Choose Starter
              </button>
            </div>

            <div className="bg-gray-800 border-2 border-blue-500 rounded-xl p-6 transform md:-translate-y-4 shadow-lg shadow-blue-500/20">
              <div className="absolute top-0 right-0 bg-blue-500 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                BEST VALUE
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro Bundle</h3>
              <p className="text-3xl font-bold mb-4">
                $99<span className="text-lg text-gray-400">/one-time</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" /> All 8
                  Company Playlists
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" /> Premium
                  Problem Access
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" /> Advanced
                  Analytics
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" /> Priority
                  Support
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" /> New
                  Playlists Added Free
                </li>
              </ul>
              <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-medium transition">
                Choose Pro
              </button>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-2">Team License</h3>
              <p className="text-3xl font-bold mb-4">
                $299<span className="text-lg text-gray-400">/one-time</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" /> All Pro
                  Features
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" /> Up to 5
                  Members
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" /> Team
                  Progress Tracking
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" /> Shared
                  Playlists
                </li>
                <li className="flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" /> Dedicated
                  Support
                </li>
              </ul>
              <button className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-medium transition">
                Contact for Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
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
              className="flex-grow px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium transition shadow-lg"
            >
              Get Started
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FiCode className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  CodeSaga
                </span>
              </div>
              <p className="text-gray-400">
                The ultimate platform for technical interview preparation with
                company-specific question playlists.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-blue-400 transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-gray-400 hover:text-blue-400 transition"
                  >
                    Playlists
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition"
                  >
                    Roadmap
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition"
                  >
                    Interview Tips
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition"
                  >
                    Success Stories
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#contact"
                    className="text-gray-400 hover:text-blue-400 transition"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} CodeSaga. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FiGithub className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CodeSagaLanding;
