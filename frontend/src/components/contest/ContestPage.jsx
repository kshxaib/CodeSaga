import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trophy } from "lucide-react";
import CreateContest from "./CreateContest";
import ContestList from "./ContestList";
import ContestDetail from "./ContestDetail";
import { useAuthStore } from "../../store/useAuthStore";
import { useUserStore } from "../../store/useUserStore";

const ContestPage = () => {
  const [activeTab, setActiveTab] = useState("contests");
  const [selectedContest, setSelectedContest] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { authUser } = useAuthStore();
  const {user} = useUserStore()
  const isAdmin =   user?.user?.profile?.role === "ADMIN" || 
  user?.user?.profile?.email === "khanshoaibishtiyak@gmail.com";

  const handleContestCreated = (newContest) => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab("contests");
  };

  const handleContestSelect = (contest) => {
    setSelectedContest(contest);
  };

  const handleBackToList = () => {
    setSelectedContest(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleJoinContest = (contest, problem = null) => {
    console.log("Joining contest:", contest, "Problem:", problem);
  };

  if (selectedContest) {
    return (
      <ContestDetail
        contestId={selectedContest.id}
        onBack={handleBackToList}
        onJoinContest={handleJoinContest}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen min-w-screen bg-gradient-to-br from-gray-900 to-gray-800"
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2 flex items-center gap-3">
                <Trophy className="w-10 h-10 text-yellow-400" />
                Contest Arena
              </h1>
              <p className="text-gray-300 text-lg">
                Compete, learn, and showcase your programming skills
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setActiveTab("create")}
                className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Contest
              </button>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-full">
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab("contests")}
                className={`py-4 px-6 text-sm font-medium flex items-center gap-2 ${
                  activeTab === "contests"
                    ? "border-b-2 border-purple-500 text-purple-400"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Trophy className="w-4 h-4" />
                All Contests
              </button>
              {isAdmin && (
                <button
                  onClick={() => setActiveTab("create")}
                  className={`py-4 px-6 text-sm font-medium flex items-center gap-2 ${
                    activeTab === "create"
                      ? "border-b-2 border-purple-500 text-purple-400"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Create Contest
                </button>
              )}
            </div>

            <div className="mt-6">
              <AnimatePresence mode="wait">
                {activeTab === "contests" && (
                  <motion.div
                    key="contests"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ContestList
                      onContestSelect={handleContestSelect}
                      refreshTrigger={refreshTrigger}
                    />
                  </motion.div>
                )}

                {isAdmin && activeTab === "create" && (
                  <motion.div
                    key="create"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <CreateContest onContestCreated={handleContestCreated} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContestPage;