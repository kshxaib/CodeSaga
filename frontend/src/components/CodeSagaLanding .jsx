import React, { useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FiCode, FiUsers, FiBarChart2, FiAward, FiGithub, FiTwitter, FiLinkedin } from "react-icons/fi";
import { FaRobot, FaGamepad, FaMusic, FaLaughSquint } from "react-icons/fa";
import { SiOpenai } from "react-icons/si";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const CodeSagaLanding = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Animation controls
  const controls = useAnimation();
  const [heroRef, heroInView] = useInView({ threshold: 0.1 });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ["hero", "features", "cta"];
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
    if (ctaInView) controls.start("visible");
  }, [heroInView, featuresInView, ctaInView, controls]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
      icon: <FiAward className="w-8 h-8" />,
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

  const stats = [
    { value: "10,000+", label: "Active Developers" },
    { value: "50+", label: "Company Playlists" },
    { value: "95%", label: "Success Rate" },
    { value: "1M+", label: "Problems Solved" },
  ];

  // Enhanced animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      },
    },
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const featureItem = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
    hover: {
      y: -15,
      scale: 1.03,
      boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)"
    }
  };

  const textGradient = "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400";
  const buttonGradient = "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 overflow-x-hidden">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient blobs with smoother animation */}
        <motion.div
          className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full filter blur-[100px] opacity-10"
          animate={{
            x: [0, 20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/4 right-0 w-72 h-72 bg-purple-600 rounded-full filter blur-[100px] opacity-10"
          animate={{
            x: [0, -20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-80 h-80 bg-cyan-500 rounded-full filter blur-[100px] opacity-10"
          animate={{
            x: [0, 15, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        
        {/* Grid pattern with subtle animation */}
        <motion.div 
          className="absolute inset-0 opacity-[3%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 2 }}
        />
      </div>

      {/* Navigation with improved transitions */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-gray-900/95 backdrop-blur-md py-2 shadow-lg" : "py-4"}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center space-x-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <FiCode className="w-8 h-8 text-blue-400" />
            </motion.div>
            <span className={`text-2xl font-bold ${textGradient}`}>
              CodeSaga
            </span>
          </motion.div>

          <nav className="hidden md:flex space-x-8">
            {["features", "cta"].map((tab) => (
              <motion.a
                key={tab}
                href={`#${tab}`}
                className={`capitalize hover:text-blue-400 transition ${activeTab === tab ? "text-blue-400 font-medium" : "text-gray-300"}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(tab).scrollIntoView({ behavior: "smooth" });
                  setActiveTab(tab);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.replace("-", " ")}
              </motion.a>
            ))}
          </nav>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="hidden md:flex items-center space-x-4"
          >
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 transition"
            >
              Login
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/signup"
                className={`px-6 py-2.5 rounded-full ${buttonGradient} text-sm font-medium hover:shadow-lg hover:shadow-blue-500/30 transition`}
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>

          <motion.button
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile menu with better animation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="md:hidden absolute top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-sm overflow-hidden"
            >
              <div className="py-4 px-6">
                <div className="flex flex-col space-y-4">
                  {["features", "cta"].map((tab) => (
                    <motion.a
                      key={tab}
                      href={`#${tab}`}
                      className={`capitalize py-2 hover:text-blue-400 transition ${activeTab === tab ? "text-blue-400 font-medium" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(tab).scrollIntoView({ behavior: "smooth" });
                        setActiveTab(tab);
                        setIsMenuOpen(false);
                      }}
                      whileHover={{ x: 5 }}
                    >
                      {tab.replace("-", " ")}
                    </motion.a>
                  ))}
                  <div className="pt-4 border-t border-gray-800 flex flex-col space-y-3">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium hover:text-blue-400 transition"
                    >
                      Login
                    </Link>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Link
                        to="/signup"
                        className={`px-6 py-2.5 rounded-full ${buttonGradient} text-sm font-medium text-center hover:shadow-lg hover:shadow-blue-500/30 transition`}
                      >
                        Get Started
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section with enhanced animations */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Enhanced code rain animation */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-green-400 font-mono text-xs"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * -50}%`,
                }}
                animate={{
                  y: [0, window.innerHeight + 100],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 8 + Math.random() * 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "linear",
                }}
              >
                {Math.random() > 0.5 ? 
                  `function ${Math.random().toString(36).substring(7)}() {` : 
                  `const ${Math.random().toString(36).substring(7)} = () =>`}
              </motion.div>
            ))}
          </div>
          
          {/* Pulsing AI orb with better animation */}
          <motion.div
            className="absolute top-1/3 right-1/4 w-32 h-32 bg-blue-500 rounded-full filter blur-[60px] opacity-20"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: 6,
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
              <motion.span 
                className="inline-block px-3 py-1 text-xs font-semibold bg-blue-900/50 text-blue-400 rounded-full border border-blue-800"
                whileHover={{ scale: 1.05 }}
              >
                Welcome to Your CodeSaga
              </motion.span>
            </motion.div>
            
            <motion.h1 variants={item} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <motion.span className="block" variants={item}>Level Up Your</motion.span>
              <motion.span 
                className={textGradient}
                variants={item}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                Coding Game
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={item}
              className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10"
            >
              Not just problems. A whole devverse to explore – with AI by your side.
            </motion.p>
            
            <motion.div 
              variants={item}
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/signup"
                  className={`relative px-8 py-4 rounded-full ${buttonGradient} font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all`}
                >
                  Start Solving
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/signup"
                  className="px-8 py-4 rounded-full bg-gray-800 hover:bg-gray-700 font-medium border border-gray-700 hover:border-gray-600 transition-all"
                >
                  Try AI Assistant
                </Link>
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={container}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, i) => (
                <motion.div 
                  key={i} 
                  variants={item}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`text-3xl md:text-4xl font-bold ${textGradient} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced scrolling indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div 
            className="animate-bounce flex flex-col items-center"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-xs text-gray-400 mb-1">Scroll to explore</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" ref={featuresRef} className="py-20 px-6 relative">
        <div className="container mx-auto">
          <motion.div
            variants={container}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={item} 
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              <motion.span 
                className={textGradient}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                Problem Solving Like Never Before
              </motion.span>
            </motion.h2>
            <motion.p 
              variants={item} 
              className="text-xl text-gray-400 max-w-3xl mx-auto"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Solve real coding problems with our interactive platform featuring:
              </motion.span>
            </motion.p>
            
            {/* Animated feature highlights */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 mt-8 max-w-4xl mx-auto"
              variants={container}
            >
              {["AI Assistance", "Multi-Language Support", "Community Solutions", "Progress Tracking"].map((text, i) => (
                <motion.span
                  key={i}
                  variants={item}
                  className="px-4 py-2 bg-gray-800/50 text-blue-400 rounded-full border border-gray-700 text-sm"
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(30, 41, 59, 0.5)" }}
                >
                  {text}
                </motion.span>
              ))}
            </motion.div>
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
                variants={featureItem}
                whileHover="hover"
                className="bg-gray-900/50 rounded-xl p-8 border border-gray-800 hover:border-cyan-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/10 backdrop-blur-sm"
              >
                <motion.div 
                  className="text-blue-400 mb-4 text-4xl"
                  whileHover={{ rotate: 10 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section id="cta" ref={ctaRef} className="py-20 px-6 bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full filter blur-[80px]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-400 rounded-full filter blur-[80px]"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-purple-500 rounded-full filter blur-[80px]"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.1, 0.18, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            className="text-center"
          >
            <motion.h2 
              variants={item} 
              className="text-3xl md:text-5xl font-bold mb-6 text-white"
            >
              Join the Developer Movement
            </motion.h2>
            <motion.p 
              variants={item} 
              className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto"
            >
              Thousands of coders. One playground. Infinite growth.
            </motion.p>

            <motion.div 
              variants={item} 
              className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
            >
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/signup"
                  className="px-8 py-3.5 rounded-full bg-white text-blue-700 font-medium hover:bg-gray-100 transition-all"
                >
                  Get Started Free
                </Link>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  to="/signup"
                  className="px-8 py-3.5 rounded-full bg-black/30 text-white font-medium border border-white/20 hover:bg-black/40 hover:border-white/30 transition-all"
                >
                  Go PRO
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Enhanced Testimonials carousel */}
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
                      initial={{ opacity: 0, y: 20, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.98 }}
                      transition={{ type: "spring", damping: 15, stiffness: 100 }}
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
                <motion.button
                  key={i}
                  onClick={() => setActiveTestimonial(i)}
                  className={`w-3 h-3 rounded-full ${activeTestimonial === i ? 'bg-white' : 'bg-gray-600'}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative bg-gray-950 px-6 py-12 text-gray-400 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <motion.div
            className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600 rounded-full filter blur-[100px]"
            animate={{
              y: [0, 20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600 rounded-full filter blur-[100px]"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
        </div>

        <div className="container mx-auto relative z-10">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12"
          >
            <motion.div variants={item}>
              <div className="flex items-center space-x-2 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <FiCode className="w-8 h-8 text-blue-400" />
                </motion.div>
                <span className={`text-2xl font-bold ${textGradient}`}>
                  CodeSaga
                </span>
              </div>
              <p className="mb-4">
                The ultimate coding playground for developers to practice, compete, and grow.
              </p>
              <div className="flex space-x-4 text-xl">
                <motion.a 
                  href="#" 
                  className="hover:text-blue-400 transition"
                  whileHover={{ y: -3 }}
                >
                  <FiGithub />
                </motion.a>
                <motion.a 
                  href="https://x.com/khansho28034439?s=21" 
                  className="hover:text-blue-400 transition"
                  whileHover={{ y: -3 }}
                >
                  <FiTwitter />
                </motion.a>
                <motion.a 
                  href="https://www.linkedin.com/in/shoaib-khan-7308932a9/" 
                  className="hover:text-blue-400 transition"
                  whileHover={{ y: -3 }}
                >
                  <FiLinkedin />
                </motion.a>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                {["Features", "Pricing", "AI Assistant"].map((item, i) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 5 }}
                  >
                    <a href="#" className="hover:text-blue-400 transition">{item}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={item}>
              <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                {["Blog", "Documentation", "Community"].map((item, i) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 5 }}
                  >
                    <a href="#" className="hover:text-blue-400 transition">{item}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={item}>
              <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {["About", "Privacy", "Terms"].map((item, i) => (
                  <motion.li 
                    key={i}
                    whileHover={{ x: 5 }}
                  >
                    <a href="#" className="hover:text-blue-400 transition">{item}</a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <motion.div 
            className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
            variants={container}
          >
            <motion.p variants={item} className="text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} CodeSaga. All rights reserved.
            </motion.p>
            <motion.p variants={item} className="text-sm flex items-center">
              <span className="mr-1">Built with</span>
              <motion.span 
                className="text-red-500 mr-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ❤
              </motion.span>
              <span className="mr-1">by</span>
              <a 
                href="https://www.linkedin.com/in/shoaib-khan-7308932a9/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 hover:underline"
              >
                Shoaib
              </a>         
            </motion.p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default CodeSagaLanding;