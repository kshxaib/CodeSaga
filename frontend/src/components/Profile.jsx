import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  Edit,
  Loader2,
  Globe,
  Linkedin,
  User,
  BookOpen,
  Users,
  Mail,
  Home,
  Trophy,
  Code,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  BarChart2,
  PieChart,
  Calendar,
  Tag,
  Star,
  Zap,
  Shield,
  ShoppingBag,
  Activity,
  List,
  Grid,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "../store/useUserStore";
import { axiosInstance } from "../libs/axios";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Profile = () => {
  const { user, isLoading, getUserDetails, updateProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      await getUserDetails();
    };
    fetchData();
  }, [getUserDetails]);

  useEffect(() => {
    if (user) {
      reset({
        bio: user?.user?.profile?.bio || "",
        linkedin: user?.user?.profile?.linkedin || "",
        portfolio: user?.user?.profile?.portfolio || "",
      });
      setPreviewImage(user?.user?.profile?.image);
    }
  }, [user, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setUpdateLoading(true);
    const formData = new FormData();

    if (data.bio) formData.append("bio", data.bio);
    if (data.linkedin) formData.append("linkedin", data.linkedin);
    if (data.portfolio) formData.append("portfolio", data.portfolio);

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      await updateProfile(formData);
      setIsEditing(false);
      await getUserDetails();
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return <OverviewTab user={user} />;
      case "activity":
        return <ActivityTab user={user} />;
      case "contests":
        return <ContestsTab user={user} />;
      case "contributions":
        return <ContributionsTab user={user} />;
      default:
        return <OverviewTab user={user} />;
    }
  };

  if (isLoading && !user) {
    return (
      <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/home"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 rounded-2xl border border-gray-700 shadow-xl overflow-hidden"
        >
          <div className="relative h-48 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
            <div className="absolute -bottom-16 left-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="h-32 w-32 rounded-full border-4 border-gray-800 bg-gray-700 overflow-hidden shadow-lg">
                  {previewImage ? (
                    <img
                      src={user?.user?.profile.image || previewImage}
                      alt={user?.user?.profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-600">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label
                    htmlFor="profile-image"
                    className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg transition-all transform group-hover:scale-110"
                  >
                    <Edit className="h-4 w-4" />
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </motion.div>
            </div>

            <div className="absolute bottom-6 right-6">
              {isEditing ? (
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedFile(null);
                      setPreviewImage(user?.user?.profile?.image);
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-sm font-medium transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit(onSubmit)}
                    disabled={updateLoading}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-md text-sm font-medium transition-colors flex items-center disabled:opacity-70"
                  >
                    {updateLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </motion.button>
              )}
            </div>
          </div>

          {user && (
            <div className="pt-20 px-8 pb-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                <div className="flex-1">
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                      {user?.user?.profile?.name}
                      {user?.user?.profile?.role === "PRO" && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          <Zap className="w-3 h-3" /> PRO
                        </span>
                      )}
                      {user?.user?.profile?.role === "ADMIN" && (
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          <Shield className="w-3 h-3" /> ADMIN
                        </span>
                      )}
                    </h1>
                    <p className="text-gray-400">
                      @{user?.user?.profile.username}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="text-center bg-gray-700/50 px-4 py-3 rounded-lg"
                    >
                      <span className="block text-xl font-bold text-indigo-400">
                        {new Date(
                          user?.user?.profile?.memberSince
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-sm text-gray-400">
                        Member Since
                      </span>
                    </motion.div>

                    {user?.user?.profile?.proSince && (
                      <motion.div
                        whileHover={{ y: -3 }}
                        className="text-center bg-gradient-to-r from-yellow-900/50 to-yellow-800/50 px-4 py-3 rounded-lg"
                      >
                        <span className="block text-xl font-bold text-yellow-400">
                          {new Date(
                            user?.user?.profile?.proSince
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span className="text-sm text-yellow-300/80">
                          PRO Since
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="mb-6">
                      <label
                        htmlFor="bio"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        {...register("bio", { maxLength: 200 })}
                        rows="3"
                        className="block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="Tell us about yourself..."
                      />
                      {errors.bio && (
                        <p className="mt-2 text-sm text-red-400">
                          Bio should be less than 200 characters
                        </p>
                      )}
                    </div>
                  ) : (
                    user?.user?.profile?.bio && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-300 mb-2">
                          About
                        </h3>
                        <div className="flex items-start bg-gray-700/50 p-4 rounded-lg">
                          <BookOpen className="h-5 w-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-300">
                            {user?.user?.profile?.bio}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="md:w-80 space-y-6">
                  <div className="bg-gray-700/50 p-5 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-blue-400 mr-3" />
                        <span className="text-gray-300">
                          {user?.user?.profile?.email}
                        </span>
                      </div>

                      {isEditing ? (
                        <>
                          <div>
                            <label
                              htmlFor="linkedin"
                              className="block text-sm font-medium text-gray-300 mb-1"
                            >
                              LinkedIn
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                <Linkedin className="h-5 w-5" />
                              </div>
                              <input
                                type="url"
                                id="linkedin"
                                {...register("linkedin")}
                                className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                placeholder="https://linkedin.com/in/username"
                              />
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="portfolio"
                              className="block text-sm font-medium text-gray-300 mb-1"
                            >
                              Portfolio
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                                <Globe className="h-5 w-5" />
                              </div>
                              <input
                                type="url"
                                id="portfolio"
                                {...register("portfolio")}
                                className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                placeholder="https://yourportfolio.com"
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {user?.user?.profile?.linkedin && (
                            <div className="flex items-center">
                              <Linkedin className="h-5 w-5 text-blue-400 mr-3" />
                              <a
                                href={user?.user?.profile?.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 hover:underline"
                              >
                                LinkedIn
                              </a>
                            </div>
                          )}
                          {user?.user?.profile?.portfolio && (
                            <div className="flex items-center">
                              <Globe className="h-5 w-5 text-blue-400 mr-3" />
                              <a
                                href={user?.user?.profile?.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 hover:underline"
                              >
                                Portfolio
                              </a>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="mt-8 border-b border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  {["overview", "activity", "contests", "contributions"].map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                          activeTab === tab
                            ? "border-blue-500 text-blue-400"
                            : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {tab === "overview" && <User className="h-4 w-4" />}
                        {tab === "activity" && <Activity className="h-4 w-4" />}
                        {tab === "contests" && <Trophy className="h-4 w-4" />}
                        {tab === "contributions" && (
                          <List className="h-4 w-4" />
                        )}
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    )
                  )}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="mt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {renderTabContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Tab Components
const OverviewTab = ({ user }) => {
  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Coding Stats */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Code className="text-blue-400" />
          Coding Statistics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<CheckCircle className="text-green-400" />}
            title="Problems Solved"
            value={user?.user?.activity?.problemsSolved || 0}
            description={`${
              user?.user?.activity?.acceptedSubmissions || 0
            } correct submissions`}
            color="bg-green-900/30"
          />

          <StatCard
            icon={<XCircle className="text-red-400" />}
            title="Wrong Submissions"
            value={
              (user?.user?.activity?.totalSubmissions || 0) -
              (user?.user?.activity?.acceptedSubmissions || 0)
            }
            description={`${
              user?.user?.activity?.totalSubmissions || 0
            } total attempts`}
            color="bg-red-900/30"
          />

          <StatCard
            icon={<Clock className="text-yellow-400" />}
            title="Current Streak"
            value={user?.user?.activity?.streak?.currentStreak || 0}
            description={`Longest: ${
              user?.user?.activity?.streak?.longestStreak || 0
            } days`}
            color="bg-yellow-900/30"
          />

          <StatCard
            icon={<Award className="text-purple-400" />}
            title="Accuracy"
            value={`${Math.round(
              (user?.user?.activity?.acceptedSubmissions /
                user?.user?.activity?.totalSubmissions) *
                100 || 0
            )}%`}
            description="Based on accepted/total submissions"
            color="bg-purple-900/30"
          />
        </div>
      </div>

     {/* Tags/Strengths */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Tag className="text-blue-400" />
          Your Strengths
        </h3>
        
        <div className="flex flex-wrap gap-3">
          {user?.user?.tags?.slice(0, 10).map((tag, index) => (
            <motion.div
              key={tag.tag}
              whileHover={{ scale: 1.05 }}
              className={`px-3 py-2 rounded-full text-sm font-medium ${
                index % 3 === 0 ? 'bg-blue-900/50 text-blue-300' :
                index % 3 === 1 ? 'bg-purple-900/50 text-purple-300' :
                'bg-green-900/50 text-green-300'
              }`}
            >
              {tag.tag} <span className="text-white">({tag.count})</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ActivityTab = ({ user }) => {
  if (!user) return null;

  // Mock data for charts - replace with real data from stats
  const submissionData = [
    { name: "Jan", submissions: 12, accepted: 8 },
    { name: "Feb", submissions: 19, accepted: 13 },
    { name: "Mar", submissions: 15, accepted: 10 },
    { name: "Apr", submissions: 8, accepted: 5 },
    { name: "May", submissions: 22, accepted: 18 },
    { name: "Jun", submissions: 17, accepted: 12 },
  ];

  const dailyActivity = [
    { day: "Mon", activity: 10 },
    { day: "Tue", activity: 22 },
    { day: "Wed", activity: 15 },
    { day: "Thu", activity: 18 },
    { day: "Fri", activity: 12 },
    { day: "Sat", activity: 8 },
    { day: "Sun", activity: 5 },
  ];

  return (
    <div className="space-y-8">
      {/* Submissions Timeline */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Calendar className="text-blue-400" />
          Submissions Timeline
        </h3>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={submissionData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderColor: "#374151",
                }}
                itemStyle={{ color: "#E5E7EB" }}
                labelStyle={{ color: "#9CA3AF" }}
              />
              <Area
                type="monotone"
                dataKey="submissions"
                stackId="1"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="accepted"
                stackId="2"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.2}
              />
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Activity */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Activity className="text-blue-400" />
          Weekly Activity
        </h3>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderColor: "#374151",
                }}
                itemStyle={{ color: "#E5E7EB" }}
                labelStyle={{ color: "#9CA3AF" }}
              />
              <Bar dataKey="activity" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Solved Problems */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <CheckCircle className="text-blue-400" />
          Recently Solved Problems
        </h3>

        <div className="space-y-3">
          {user?.user?.activity?.recentSolvedProblems
            ?.slice(0, 5)
            .map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-gray-400">{index + 1}.</div>
                  <div>
                    <h4 className="font-medium text-white">
                      {problem.problem.title}
                    </h4>
                    <div className="flex gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          problem.problem.difficulty === "EASY"
                            ? "bg-green-900/50 text-green-400"
                            : problem.problem.difficulty === "MEDIUM"
                            ? "bg-yellow-900/50 text-yellow-400"
                            : "bg-red-900/50 text-red-400"
                        }`}
                      >
                        {problem.problem.difficulty}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(problem.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  to={`/problem/${problem.problem.id}`}
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  View <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

const ContestsTab = ({ user }) => {
  if (!user) return null;

  // Mock data for charts - replace with real data from stats
  const contestPerformance = [
    { name: "Contest 1", rank: 15, score: 120 },
    { name: "Contest 2", rank: 8, score: 180 },
    { name: "Contest 3", rank: 3, score: 250 },
    { name: "Contest 4", rank: 12, score: 150 },
    { name: "Contest 5", rank: 5, score: 210 },
  ];

  return (
    <div className="space-y-8">
      {/* Contest Stats */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Trophy className="text-blue-400" />
          Contest Statistics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<Users className="text-purple-400" />}
            title="Contests Joined"
            value={user?.user?.contests?.totalContests || 0}
            description={`${user?.user?.contests?.contestsWon || 0} wins`}
            color="bg-purple-900/30"
          />

          <StatCard
            icon={<Award className="text-yellow-400" />}
            title="Best Rank"
            value={`#${user?.user?.contests?.bestRank || "N/A"}`}
            description={`Average: #${
              Math.round(user?.user?.contests?.averageRank) || "N/A"
            }`}
            color="bg-yellow-900/30"
          />

          <StatCard
            icon={<Star className="text-blue-400" />}
            title="Total Score"
            value={
              user?.user?.contests?.scoreTimeline?.reduce(
                (sum, s) => sum + (s.totalScore || 0),
                0
              ) || 0
            }
            description="Across all contests"
            color="bg-blue-900/30"
          />
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <BarChart2 className="text-blue-400" />
          Contest Performance
        </h3>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={contestPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis yAxisId="left" orientation="left" stroke="#9CA3AF" />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  borderColor: "#374151",
                }}
                itemStyle={{ color: "#E5E7EB" }}
                labelStyle={{ color: "#9CA3AF" }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="rank"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
                name="Rank"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="score"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Score"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Score Timeline */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Activity className="text-blue-400" />
          Score Progression
        </h3>

        {user?.user?.contests?.scoreTimeline?.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={user?.user?.contests?.scoreTimeline}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="joinedAt"
                  stroke="#9CA3AF"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                    })
                  }
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    borderColor: "#374151",
                  }}
                  itemStyle={{ color: "#E5E7EB" }}
                  labelStyle={{ color: "#9CA3AF" }}
                  formatter={(value, name) => [
                    name === "totalScore" ? value : `#${value}`,
                    name === "totalScore" ? "Score" : "Rank",
                  ]}
                  labelFormatter={(value) =>
                    `Date: ${new Date(value).toLocaleDateString()}`
                  }
                />
                <Area
                  type="monotone"
                  dataKey="totalScore"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No contest data available
          </div>
        )}
      </div>
    </div>
  );
};

const ContributionsTab = ({ user }) => {
  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Community Contributions */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Users className="text-blue-400" />
          Community Contributions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<BookOpen className="text-green-400" />}
            title="Dev Logs"
            value={user?.user?.contributions?.devLogsWritten || 0}
            description={`${
              user?.user?.contributions?.devLogUpvotes || 0
            } upvotes`}
            color="bg-green-900/30"
          />

          <StatCard
            icon={<MessageSquare className="text-purple-400" />}
            title="Discussions"
            value={user?.user?.contributions?.discussions || 0}
            description={`${user?.user?.contributions?.replies || 0} replies`}
            color="bg-purple-900/30"
          />

          <StatCard
            icon={<ThumbsUp className="text-yellow-400" />}
            title="Upvotes Received"
            value={user?.user?.contributions?.upvotesReceived || 0}
            description="On your posts"
            color="bg-yellow-900/30"
          />

          <StatCard
            icon={<AlertCircle className="text-red-400" />}
            title="Problem Reports"
            value={
              user?.user?.contributions?.reports?.reduce(
                (sum, r) => sum + r._count._all,
                0
              ) || 0
            }
            description="Submitted"
            color="bg-red-900/30"
          />
        </div>
      </div>

      {/* Playlists */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <List className="text-blue-400" />
          Playlists
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 p-6 rounded-lg border border-blue-700/30">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Plus className="text-blue-400" />
              Created Playlists
            </h4>
            <div className="text-3xl font-bold text-blue-400">
              {user?.user?.contributions?.playlistsCreated || 0}
            </div>
            <p className="text-gray-400 mt-2">
              Problem collections you've created
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 p-6 rounded-lg border border-purple-700/30">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ShoppingBag className="text-purple-400" />
              Purchased Playlists
            </h4>
            <div className="text-3xl font-bold text-purple-400">
              {user?.user?.contributions?.playlistsPurchased || 0}
            </div>
            <p className="text-gray-400 mt-2">
              Premium content you've unlocked
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon, title, value, description, color }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className={`p-4 rounded-lg border ${color} border-gray-700`}
  >
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-full bg-gray-700/50">{icon}</div>
      <h4 className="font-medium text-gray-300">{title}</h4>
    </div>
    <div className="text-2xl font-bold text-white">{value}</div>
    <p className="text-sm text-gray-400 mt-1">{description}</p>
  </motion.div>
);

const DifficultyProgress = ({ difficulty, solved, total, color }) => {
  const percentage = (solved / total) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{difficulty}</span>
        <span className="text-gray-400">
          {solved} / {total}
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Profile;