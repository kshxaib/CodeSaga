import React, { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiCode, FiUsers, FiBarChart2, FiCheckCircle, FiPlay, FiBookmark, FiFlag, FiSend, FiGithub, FiTwitter, FiLinkedin, FiInstagram, FiChevronRight, FiZap, FiAward, FiClock, FiTrendingUp } from "react-icons/fi";
import { FaGoogle, FaDiscord, FaRobot, FaGamepad, FaMusic, FaLaughSquint } from "react-icons/fa";
import { SiOpenai } from "react-icons/si";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const CodeSagaLanding = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [email, setEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeBreakFeature, setActiveBreakFeature] = useState(0);

  // Animation controls
  const controls = useAnimation();
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1 });
  const [aiRef, aiInView] = useInView({ threshold: 0.1 });
  const [communityRef, communityInView] = useInView({ threshold: 0.1 });
  const [devlogRef, devlogInView] = useInView({ threshold: 0.1 });
  const [breakRef, breakInView] = useInView({ threshold: 0.1 });
  const [sheetsRef, sheetsInView] = useInView({ threshold: 0.1 });
  const [proRef, proInView] = useInView({ threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ["hero", "features", "ai", "community", "devlog", "break", "sheets", "pro", "cta"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveTab(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (heroInView) controls.start("visible");
    if (featuresInView) controls.start("visible");
    if (aiInView) controls.start("visible");
    if (communityInView) controls.start("visible");
    if (devlogInView) controls.start("visible");
    if (breakInView) controls.start("visible");
    if (sheetsInView) controls.start("visible");
    if (proInView) controls.start("visible");
    if (ctaInView) controls.start("visible");
  }, [heroInView, featuresInView, aiInView, communityInView, devlogInView, breakInView, sheetsInView, proInView, ctaInView, controls]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBreakFeature((prev) => (prev + 1) % breakFeatures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(`Thanks for your interest! We'll contact you at ${email}`);
    setEmail("");
  };

  const features = [
    {
      icon: <FiCode className="w-8 h-8" />,
      title: "Multi-Language Support",
      description: "Solve problems in 15+ languages with real-time execution and debugging.",
    },
    {
      icon: <FaRobot className="w-8 h-8" />,
      title: "AI Pair Programming",
      description: "Get intelligent code suggestions with our OpenAI-powered assistant.",
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Community Solutions",
      description: "Learn from thousands of alternative solutions and approaches.",
    },
    {
      icon: <FiBarChart2 className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Detailed analytics to track your improvement over time.",
    },
    {
      icon: <FiFlag className="w-8 h-8" />,
      title: "Daily Challenges",
      description: "New problems every day to keep your skills sharp.",
    },
    {
      icon: <FiAward className="w-8 h-8" />,
      title: "Contests & Leaderboards",
      description: "Compete with others and climb the ranks.",
    },
  ];

  const testimonials = [
    {
      quote: "CodeSaga helped me land my dream job at Google. The company-specific playlists were spot on!",
      author: "Sarah K., Software Engineer at Google",
      role: "ex-Amazon",
    },
    {
      quote: "The AI assistant is a game-changer. It's like having a senior engineer looking over my shoulder.",
      author: "Michael T., Full Stack Developer",
      role: "Freelancer",
    },
    {
      quote: "I went from failing coding interviews to getting multiple offers in 3 months. Best investment ever.",
      author: "David P., Frontend Engineer at Meta",
      role: "Bootcamp Grad",
    },
  ];

  const breakFeatures = [
    {
      icon: <FaGamepad className="text-2xl" />,
      title: "Coding Games",
      description: "Fun challenges that sharpen your skills",
    },
    {
      icon: <FiZap className="text-2xl" />,
      title: "Brain Teasers",
      description: "Puzzles to stretch your mind",
    },
    {
      icon: <SiOpenai className="text-2xl" />,
      title: "Tech Facts",
      description: "AI-generated tech trivia",
    },
    {
      icon: <FaMusic className="text-2xl" />,
      title: "Focus Music",
      description: "Curated coding playlists",
    },
    {
      icon: <FaLaughSquint className="text-2xl" />,
      title: "Dev Humor",
      description: "Because we all need a laugh",
    },
  ];

  const proFeatures = [
    "Full AI Assistant Access",
    "Unlimited Solution Views",
    "Premium Problem Sets",
    "Advanced Analytics",
    "Priority Support",
    "Exclusive Contests",
  ];

  const stats = [
    { value: "10,000+", label: "Active Developers" },
    { value: "50+", label: "Company Playlists" },
    { value: "95%", label: "Success Rate" },
    { value: "1M+", label: "Problems Solved" },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  const slideInLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  const slideInRight = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.6 } },
  };

  const scaleUp = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-gray-100 overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full filter blur-[100px] opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-purple-600 rounded-full filter blur-[100px] opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500 rounded-full filter blur-[100px] opacity-10 animate-blob"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
      </div>

      {/* Navigation */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-gray-900/90 backdrop-blur-md py-2" : "py-4"}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <FiCode className="w-8 h-8 text-blue-400" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              CodeSaga
            </span>
          </motion.div>

          <nav className="hidden md:flex space-x-8">
            {["features", "ai", "community", "devlog", "break", "sheets", "pro"].map((tab) => (
              <a
                key={tab}
                href={`#${tab}`}
                className={`capitalize hover:text-blue-400 transition ${activeTab === tab ? "text-blue-400 font-medium" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(tab).scrollIntoView({ behavior: "smooth" });
                  setActiveTab(tab);
                }}
              >
                {tab.replace("-", " ")}
              </a>
            ))}
          </nav>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center space-x-4"
          >
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium hover:text-blue-400 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition"
            >
              Get Started
            </Link>
          </motion.div>

          <button
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-sm py-4 px-6 shadow-lg"
            >
              <div className="flex flex-col space-y-4">
                {["features", "ai", "community", "devlog", "break", "sheets", "pro"].map((tab) => (
                  <a
                    key={tab}
                    href={`#${tab}`}
                    className={`capitalize hover:text-blue-400 transition ${activeTab === tab ? "text-blue-400 font-medium" : ""}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(tab).scrollIntoView({ behavior: "smooth" });
                      setActiveTab(tab);
                      setIsMenuOpen(false);
                    }}
                  >
                    {tab.replace("-", " ")}
                  </a>
                ))}
                <div className="pt-4 border-t border-gray-800 flex flex-col space-y-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium hover:text-blue-400 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-medium text-center hover:shadow-lg hover:shadow-blue-500/30 transition"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Code rain animation */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-green-400 font-mono text-xs"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, window.innerHeight],
                  opacity: [0.2, 0.8, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              >
                {Math.random() > 0.5 ? "function() {" : "const x = () =>"}
              </motion.div>
            ))}
          </div>
          
          {/* Pulsing AI orb */}
          <motion.div
            className="absolute top-1/3 right-1/4 w-32 h-32 bg-blue-500 rounded-full filter blur-[60px] opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            className="text-center"
          >
            <motion.div variants={item} className="mb-6">
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-900/50 text-blue-400 rounded-full border border-blue-800">
                Welcome to Your CodeSaga
              </span>
            </motion.div>
            
            <motion.h1 variants={item} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block">Level Up Your</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Coding Game
              </span>
            </motion.h1>
            
            <motion.p variants={item} className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10">
              Not just problems. A whole devverse to explore – with AI by your side.
            </motion.p>
            
            <motion.div variants={item} className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link
                to="/signup"
                className="relative px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-1"
              >
                Start Solving
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              </Link>
              <Link
                to="/signup"
                className="px-8 py-4 rounded-full bg-gray-800 hover:bg-gray-700 font-medium border border-gray-700 hover:border-gray-600 transition-all hover:-translate-y-1"
              >
                Try AI Assistant
              </Link>
            </motion.div>
            
            <motion.div variants={item} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scrolling indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce flex flex-col items-center">
            <span className="text-xs text-gray-400 mb-1">Scroll to explore</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-20 px-6 relative">
        <div className="container mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2 variants={item} className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Problem Solving Like Never Before
              </span>
            </motion.h2>
            <motion.p variants={item} className="text-xl text-gray-400 max-w-3xl mx-auto">
              Solve real coding problems with hints, discussions, and AI assistance – all in one place.
            </motion.p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ y: -10 }}
                className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="text-blue-400 mb-4 text-4xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

         
        </div>
      </section>

      {/* AI Assistant Section */}
      <section id="ai" ref={aiRef} className="py-20 px-6 bg-gradient-to-br from-gray-950 to-gray-900 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-[80px]"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full filter blur-[80px]"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate={aiInView ? "visible" : "hidden"}
            className="flex flex-col lg:flex-row items-center gap-12"
          >
            <motion.div variants={slideInLeft} className="lg:w-1/2">
              <div className="mb-2 text-sm font-semibold text-blue-400 flex items-center">
                <SiOpenai className="mr-2" /> Powered by OpenAI
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Your AI Pair Programmer
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Get intelligent code suggestions, debug errors, and learn best practices with our AI assistant.
              </p>
              
              <div className="mb-8">
                <div className="flex items-center mb-4 p-3 bg-gray-800/50 rounded-lg border-l-4 border-blue-500">
                  <FiZap className="text-blue-400 mr-3" />
                  <div>
                    <h4 className="font-medium">Smart Autocomplete</h4>
                    <p className="text-sm text-gray-400">Context-aware suggestions as you type</p>
                  </div>
                </div>
                <div className="flex items-center mb-4 p-3 bg-gray-800/50 rounded-lg border-l-4 border-purple-500">
                  <FiCode className="text-purple-400 mr-3" />
                  <div>
                    <h4 className="font-medium">Debug Assist</h4>
                    <p className="text-sm text-gray-400">Identify and fix errors in your code</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-gray-800/50 rounded-lg border-l-4 border-cyan-500">
                  <FiCheckCircle className="text-cyan-400 mr-3" />
                  <div>
                    <h4 className="font-medium">Optimization Tips</h4>
                    <p className="text-sm text-gray-400">Improve your code's performance</p>
                  </div>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                  <button className="relative px-8 py-3.5 bg-gray-900 rounded-lg leading-none flex items-center">
                    <span className="mr-2">Try AI Assistant</span>
                    <FiChevronRight className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={slideInRight} className="lg:w-1/2 mt-12 lg:mt-0">
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl transform rotate-1">
                <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex space-x-1 mr-4">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-sm text-gray-400">ai-assistant.js</div>
                  </div>
                  <div className="text-xs px-2 py-1 bg-gray-700 rounded text-gray-300">
                    Ctrl+Shift
                  </div>
                </div>
                <div className="p-6 font-mono text-sm">
                  <div className="text-gray-500 mb-4">// AI Assistant activated. What do you need help with?</div>
                  <div className="flex mb-4">
                    <div className="w-8 text-gray-500">1</div>
                    <div className="flex-1">
                      <span className="text-purple-400">function</span> 
                      <span className="text-blue-400"> reverseString</span>(
                      <span className="text-yellow-400">str</span>) {"{"}
                    </div>
                  </div>
                  <div className="flex mb-4">
                    <div className="w-8 text-gray-500">2</div>
                    <div className="flex-1 text-gray-500 pl-4">// Your code here</div>
                  </div>
                  <div className="flex mb-4">
                    <div className="w-8 text-gray-500">3</div>
                    <div className="flex-1">{"}"}</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4 mb-4 border-l-2 border-blue-500">
                    <div className="text-blue-400 mb-2">AI Suggestion:</div>
                    <div className="text-gray-300">
                      <span className="text-purple-400">return</span> 
                      <span className="text-yellow-400"> str</span>.
                      <span className="text-blue-400">split</span>("")
                      .<span className="text-blue-400">reverse</span>()
                      .<span className="text-blue-400">join</span>("");
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <FiClock className="mr-1" /> Generated in 0.8s
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" ref={communityRef} className="py-20 px-6 relative overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            animate={communityInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2 variants={item} className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Community at Core
              </span>
            </motion.h2>
            <motion.p variants={item} className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join the chatter. Discuss every problem, share insights, and upvote the best replies – live.
            </motion.p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate={communityInView ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={slideInLeft}>
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
                  <h3 className="font-semibold">Problem Discussion</h3>
                  <div className="flex items-center text-sm text-green-400">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    24 active users
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Sample discussion messages */}
                    <div className="flex">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                          JS
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">JohnSmith</div>
                        <div className="text-sm text-gray-400 mb-1">2 minutes ago</div>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <p>Has anyone tried solving this with a hash map? I think it would reduce the time complexity to O(n).</p>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <button className="flex items-center mr-4 hover:text-blue-400">
                            <FiChevronRight className="mr-1" /> Reply
                          </button>
                          <button className="flex items-center hover:text-green-400">
                            <FiTrendingUp className="mr-1" /> 12
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                          AD
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">AliceDev</div>
                        <div className="text-sm text-gray-400 mb-1">Just now</div>
                        <div className="bg-gray-800 rounded-lg p-4">
                          <p>@JohnSmith Yes! Here's my implementation:</p>
                          <div className="mt-2 bg-gray-900 rounded p-3 font-mono text-sm">
                            const map = new Map();<br />
                            for (let i = 0; i {'<'} nums.length; i++) {"{"}<br />
                            &nbsp;&nbsp;const complement = target - nums[i];<br />
                            &nbsp;&nbsp;if (map.has(complement)) {"{"}<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;return [map.get(complement), i];<br />
                            &nbsp;&nbsp;{"}"}<br />
                            &nbsp;&nbsp;map.set(nums[i], i);<br />
                            {"}"}
                          </div>
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <button className="flex items-center mr-4 hover:text-blue-400">
                            <FiChevronRight className="mr-1" /> Reply
                          </button>
                          <button className="flex items-center hover:text-green-400">
                            <FiTrendingUp className="mr-1" /> 8
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="text"
                        placeholder="Join the discussion..."
                        className="flex-grow bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg">
                        <FiSend />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={slideInRight} className="space-y-8">
              <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 hover:border-blue-500/30 transition-all">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FiUsers className="text-blue-400 mr-3" />
                  Real-Time Collaboration
                </h3>
                <p className="text-gray-400 mb-6">
                  Socket-powered discussions allow you to see replies as they happen, creating a vibrant community around each problem.
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="flex -space-x-2 mr-3">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-900"
                        style={{ zIndex: 5 - i }}
                      ></div>
                    ))}
                  </div>
                  24 developers active now
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 hover:border-purple-500/30 transition-all">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FiAward className="text-purple-400 mr-3" />
                  Upvote System
                </h3>
                <p className="text-gray-400 mb-6">
                  The best solutions rise to the top with our community voting system. Earn reputation points for helpful contributions.
                </p>
                <div className="flex items-center">
                  <div className="px-3 py-1 bg-purple-900/50 text-purple-400 rounded-full text-sm mr-3">
                    Top Solution
                  </div>
                  <div className="text-sm text-gray-400">
                    92% found this helpful
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 hover:border-cyan-500/30 transition-all">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FiCode className="text-cyan-400 mr-3" />
                  Code Review Exchange
                </h3>
                <p className="text-gray-400 mb-6">
                  Submit your solutions for peer review and get feedback from other developers. Learn from different approaches.
                </p>
                <button className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center">
                  Submit for review <FiChevronRight className="ml-1" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* DevLog Section */}
      <section id="devlog" ref={devlogRef} className="py-20 px-6 bg-gradient-to-br from-gray-950 to-black relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate={devlogInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2 variants={item} className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Your DevLog, Your Journey
              </span>
            </motion.h2>
            <motion.p variants={item} className="text-xl text-gray-400 max-w-3xl mx-auto">
              Track your daily grind. Share goals. Get inspired. One dev log at a time.
            </motion.p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate={devlogInView ? "visible" : "hidden"}
            className="max-w-4xl mx-auto"
          >
            {/* Sample DevLog Feed */}
            <div className="space-y-6">
              {/* Log Entry 1 */}
              <motion.div
                variants={item}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-blue-500/30 transition-all"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      SK
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Shoaib Khan</div>
                      <div className="text-sm text-gray-500">2 hours ago</div>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Just solved the "Trapping Rain Water" problem after 3 attempts! Finally grokked the two-pointer approach. 💡
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-gray-500 hover:text-blue-400 cursor-pointer">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span>24</span>
                      </div>
                      <div className="flex items-center text-gray-500 hover:text-green-400 cursor-pointer">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>5</span>
                      </div>
                      <div className="flex items-center text-gray-500 hover:text-purple-400 cursor-pointer">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span>Share</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Log Entry 2 */}
              <motion.div
                variants={item}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                      AM
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">Alice Martin</div>
                      <div className="text-sm text-gray-500">5 hours ago</div>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Day 37 of #100DaysOfCode: Implemented a Redux middleware from scratch. Feeling proud! 🚀
                    </p>
                    <div className="bg-gray-800 rounded-lg p-4 mb-4">
                      <div className="font-mono text-sm text-gray-300">
                        const loggerMiddleware = store {'=>'} next {'=>'} action {'=>'} {"{"}<br />
                        &nbsp;&nbsp;console.log('Dispatching:', action);<br />
                        &nbsp;&nbsp;let result = next(action);<br />
                        &nbsp;&nbsp;console.log('Next state:', store.getState());<br />
                        &nbsp;&nbsp;return result;<br />
                        {"}"};
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-gray-500 hover:text-blue-400 cursor-pointer">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span>42</span>
                      </div>
                      <div className="flex items-center text-gray-500 hover:text-green-400 cursor-pointer">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>8</span>
                      </div>
                      <div className="flex items-center text-gray-500 hover:text-purple-400 cursor-pointer">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span>Share</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Log Entry 3 */}
              <motion.div
                variants={item}
                className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-green-500/30 transition-all"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold">
                      DJ
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">David Johnson</div>
                      <div className="text-sm text-gray-500">1 day ago</div>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Just completed my first full stack project using MERN stack! Deployed it on Vercel. Check it out and let me know your thoughts.
                    </p>
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 text-xs bg-blue-900/50 text-blue-400 rounded-full mr-2">React</span>
                      <span className="inline-block px-3 py-1 text-xs bg-green-900/50 text-green-400 rounded-full mr-2">Node.js</span>
                      <span className="inline-block px-3 py-1 text-xs bg-yellow-900/50 text-yellow-400 rounded-full">MongoDB</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center text-gray-500 hover:text-blue-400 cursor-pointer">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span>36</span>
                      </div>
                      <div className="flex items-center text-gray-500 hover:text-green-400 cursor-pointer">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>12</span>
                      </div>
                      <div className="flex items-center text-gray-500 hover:text-purple-400 cursor-pointer">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span>Share</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={item}
              className="mt-12 text-center"
            >
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Explore DevLogs
                <FiChevronRight className="ml-2" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* BreakZone Section */}
      <section id="break" ref={breakRef} className="py-20 px-6 relative overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            animate={breakInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2 variants={item} className="text-3xl md:text-5xl font-bold mb-6 flex items-center justify-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                BreakZone
              </span>
              <span className="ml-4 text-3xl">🧘‍♂️</span>
            </motion.h2>
            <motion.p variants={item} className="text-xl text-gray-400 max-w-3xl mx-auto">
              When the brain is full, it's time to play.
            </motion.p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate={breakInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          >
            {breakFeatures.map((feature, i) => (
              <motion.div
                key={i}
                variants={item}
                whileHover={{ scale: 1.05 }}
                className={`bg-gray-900/50 rounded-xl p-8 border ${i === activeBreakFeature ? "border-cyan-500/50 shadow-lg shadow-cyan-500/10" : "border-gray-800"} transition-all cursor-pointer`}
                onClick={() => setActiveBreakFeature(i)}
              >
                <div className={`text-3xl mb-4 ${i === activeBreakFeature ? "text-cyan-400" : "text-gray-400"}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${i === activeBreakFeature ? "text-white" : "text-gray-300"}`}>
                  {feature.title}
                </h3>
                <p className={`${i === activeBreakFeature ? "text-gray-300" : "text-gray-500"}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate={breakInView ? "visible" : "hidden"}
            className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8">
                <h3 className="text-2xl font-bold mb-4">Fun meets focus.</h3>
                <p className="text-gray-400 mb-6">
                  Our BreakZone is designed to help you recharge while still engaging your developer brain. Build streaks while you unwind.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mr-4">
                      <FiClock />
                    </div>
                    <div>
                      <h4 className="font-medium">Daily Streaks</h4>
                      <p className="text-sm text-gray-500">Earn rewards for consistent breaks</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mr-4">
                      <FiTrendingUp />
                    </div>
                    <div>
                      <h4 className="font-medium">Skill Building</h4>
                      <p className="text-sm text-gray-500">Games that sharpen your coding skills</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mr-4">
                      <FiAward />
                    </div>
                    <div>
                      <h4 className="font-medium">Leaderboards</h4>
                      <p className="text-sm text-gray-500">Compete with other developers</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 bg-gray-800 p-8 flex items-center justify-center">
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeBreakFeature}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center bg-gray-700 rounded-lg"
                    >
                      {activeBreakFeature === 0 && (
                        <div className="text-center p-6">
                          <div className="text-5xl mb-4">🎮</div>
                          <h3 className="text-xl font-semibold mb-2">Coding Games</h3>
                          <p className="text-gray-400">Solve puzzles and climb levels</p>
                        </div>
                      )}
                      {activeBreakFeature === 1 && (
                        <div className="text-center p-6">
                          <div className="text-5xl mb-4">🧩</div>
                          <h3 className="text-xl font-semibold mb-2">Brain Teasers</h3>
                          <p className="text-gray-400">Challenge your problem-solving skills</p>
                        </div>
                      )}
                      {activeBreakFeature === 2 && (
                        <div className="text-center p-6">
                          <div className="text-5xl mb-4">🤖</div>
                          <h3 className="text-xl font-semibold mb-2">Tech Facts</h3>
                          <p className="text-gray-400">Learn something new every day</p>
                        </div>
                      )}
                      {activeBreakFeature === 3 && (
                        <div className="text-center p-6">
                          <div className="text-5xl mb-4">🎵</div>
                          <h3 className="text-xl font-semibold mb-2">Focus Music</h3>
                          <p className="text-gray-400">Curated playlists for coding</p>
                        </div>
                      )}
                      {activeBreakFeature === 4 && (
                        <div className="text-center p-6">
                          <div className="text-5xl mb-4">😂</div>
                          <h3 className="text-xl font-semibold mb-2">Dev Humor</h3>
                          <p className="text-gray-400">Because we all need a laugh</p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom Sheets Section */}
      <section id="sheets" ref={sheetsRef} className="py-20 px-6 bg-gradient-to-br from-gray-950 to-black relative overflow-hidden">
        <div className="container mx-auto relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate={sheetsInView ? "visible" : "hidden"}
            className="flex flex-col lg:flex-row items-center gap-12"
          >
            <motion.div variants={slideInLeft} className="lg:w-1/2">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                  Custom Sheets
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Create your own problem sheets, save progress, or purchase curated packs from the store.
              </p>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-4 text-blue-400">
                    <FiCheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Make Your Own</h3>
                    <p className="text-gray-400">
                      Organize problems by topic, difficulty, or company. Perfect for focused practice.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-4 text-purple-400">
                    <FiCheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Track Progress</h3>
                    <p className="text-gray-400">
                      See your completion rate and time spent on each sheet.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-4 text-cyan-400">
                    <FiCheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Premium Content</h3>
                    <p className="text-gray-400">
                      Access expert-curated sheets for top tech companies and specific roles.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="px-6 py-3.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all text-center"
                >
                  Create Sheet
                </Link>
                <Link
                  to="/singup"
                  className="px-6 py-3.5 rounded-lg bg-gray-800 hover:bg-gray-700 font-medium border border-gray-700 hover:border-gray-600 transition-all text-center"
                >
                  Visit Store
                </Link>
              </div>
            </motion.div>

            <motion.div variants={slideInRight} className="lg:w-1/2 mt-12 lg:mt-0">
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
                  <h3 className="font-semibold">My Sheets</h3>
                  <button className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded">
                    New +
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border-l-4 border-blue-500">
                      <div>
                        <h4 className="font-medium">FAANG Interview Prep</h4>
                        <p className="text-sm text-gray-400">23/75 problems solved</p>
                      </div>
                      <div className="text-blue-400">
                        <FiChevronRight />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border-l-4 border-purple-500">
                      <div>
                        <h4 className="font-medium">Dynamic Programming</h4>
                        <p className="text-sm text-gray-400">12/50 problems solved</p>
                      </div>
                      <div className="text-purple-400">
                        <FiChevronRight />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border-l-4 border-green-500">
                      <div>
                        <h4 className="font-medium">JavaScript Concepts</h4>
                        <p className="text-sm text-gray-400">8/30 problems solved</p>
                      </div>
                      <div className="text-green-400">
                        <FiChevronRight />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border-l-4 border-yellow-500">
                      <div>
                        <h4 className="font-medium">Amazon SDE Sheet</h4>
                        <p className="text-sm text-gray-400">Premium • 45 problems</p>
                      </div>
                      <div className="text-yellow-400">
                        <FiChevronRight />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pro Section */}
      <section id="pro" ref={proRef} className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 z-0"></div>
        <div className="container mx-auto relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate={proInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2 variants={item} className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                Power Up with PRO
              </span>
            </motion.h2>
            <motion.p variants={item} className="text-xl text-gray-400 max-w-3xl mx-auto">
              Go PRO. Get more power, speed, and smartness.
            </motion.p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate={proInView ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={item} className="bg-gray-900 rounded-xl border border-gray-800 p-8 hover:border-cyan-500/50 transition-all">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-gray-400 mb-6">For developers who want to level up their skills</p>
              <div className="text-4xl font-bold mb-6">
                $9.99<span className="text-lg text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {proFeatures.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <FiCheckCircle className="text-green-400 mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                Upgrade to PRO
              </button>
            </motion.div>

            <motion.div variants={item}>
              <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-8 mb-6">
                <h3 className="text-xl font-semibold mb-4">Compare Plans</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="pb-4 text-left">Feature</th>
                        <th className="pb-4 text-center">Free</th>
                        <th className="pb-4 text-center">PRO</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-800">
                        <td className="py-4 text-left">AI Assistant</td>
                        <td className="py-4 text-center text-gray-400">Limited</td>
                        <td className="py-4 text-center text-green-400">Full Access</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-4 text-left">Solutions</td>
                        <td className="py-4 text-center text-gray-400">First 2</td>
                        <td className="py-4 text-center text-green-400">All Solutions</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-4 text-left">Problem Sets</td>
                        <td className="py-4 text-center text-gray-400">Basic</td>
                        <td className="py-4 text-center text-green-400">Premium</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-4 text-left">Analytics</td>
                        <td className="py-4 text-center text-gray-400">Basic</td>
                        <td className="py-4 text-center text-green-400">Advanced</td>
                      </tr>
                      <tr>
                        <td className="py-4 text-left">Support</td>
                        <td className="py-4 text-center text-gray-400">Community</td>
                        <td className="py-4 text-center text-green-400">Priority</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-gray-500 text-sm text-center">
                7-day money-back guarantee. Cancel anytime.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" ref={ctaRef} className="py-20 px-6 bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full filter blur-[80px] animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-400 rounded-full filter blur-[80px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-purple-500 rounded-full filter blur-[80px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            className="text-center"
          >
            <motion.h2 variants={item} className="text-3xl md:text-5xl font-bold mb-6 text-white">
              Join the Developer Movement
            </motion.h2>
            <motion.p variants={item} className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Thousands of coders. One playground. Infinite growth.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <Link
                to="/signup"
                className="px-8 py-3.5 rounded-full bg-white text-blue-700 font-medium hover:bg-gray-100 transition-all"
              >
                Get Started Free
              </Link>
              <Link
                to="/signup"
                className="px-8 py-3.5 rounded-full bg-black/30 text-white font-medium border border-white/20 hover:bg-black/40 hover:border-white/30 transition-all"
              >
                Go PRO
              </Link>
            </motion.div>
          </motion.div>

          {/* Testimonials carousel */}
          <motion.div
            variants={container}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            className="mt-20 max-w-4xl mx-auto"
          >
            <div className="relative h-64">
              <AnimatePresence mode="wait">
                {testimonials.map((testimonial, i) => (
                  activeTestimonial === i && (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 bg-gray-900/50 rounded-xl border border-gray-800 p-8 backdrop-blur-sm"
                    >
                      <div className="flex items-start">
                        <div className="text-4xl mr-6 text-gray-600">"</div>
                        <div>
                          <p className="text-lg italic mb-6">{testimonial.quote}</p>
                          <div className="font-medium">{testimonial.author}</div>
                          <div className="text-sm text-gray-400">{testimonial.role}</div>
                        </div>
                      </div>
                    </motion.div>
                  )
                ))}
              </AnimatePresence>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-3 h-3 rounded-full ${activeTestimonial === i ? 'bg-white' : 'bg-gray-600'}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-950 px-6 py-12 text-gray-400 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600 rounded-full filter blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600 rounded-full filter blur-[100px]"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FiCode className="w-8 h-8 text-blue-400" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  CodeSaga
                </span>
              </div>
              <p className="mb-4">
                The ultimate coding playground for developers to practice, compete, and grow.
              </p>
              <div className="flex space-x-4 text-xl">
                <a href="#" className="hover:text-blue-400 transition">
                  <FiGithub />
                </a>
                <a href="https://x.com/khansho28034439?s=21" className="hover:text-blue-400 transition">
                  <FiTwitter />
                </a>
                <a href="https://www.linkedin.com/in/shoaib-khan-7308932a9/" className="hover:text-blue-400 transition">
                  <FiLinkedin />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">Features</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">AI Assistant</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Problem Sets</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">BreakZone</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Documentation</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Community</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Support</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition">About</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} CodeSaga. All rights reserved.
            </p>
            <p className="text-sm flex items-center">
              <span className="mr-1">Built with</span>
              <span className="text-red-500 mr-1">❤</span>
              <span className="mr-1">by</span>
              <a href="www.linkedin.com/in/shoaib-khan-7308932a9" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Shoaib
              </a>         
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CodeSagaLanding;