import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Clock,
  Users,
  X,
  Code,
  CheckCircle,
  XCircle,
  Circle,
  ChevronLeft,
  Menu,
  Lock,
  Loader2,
} from "lucide-react";
import { axiosInstance } from "../../libs/axios";
import { toast } from "sonner";
import ResizableEditor from "../problemSolvingPage/ResizableEditor";
import { useExecutionStore } from "../../store/useExecutionStore";
import { getJudge0LangaugeId } from "../../libs/getLanguageId";

const LiveContestPage = () => {
  const { contestId, problemId } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [submissions, setSubmissions] = useState([]);
  const [showProblemsSidebar, setShowProblemsSidebar] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const { executeCode, isExecuting } = useExecutionStore();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const fetchContestData = useCallback(async () => {
    try {
      setLoading(true);
      const [contestRes, problemsRes, userScoreRes] = await Promise.all([
        axiosInstance.get(`/contests/${contestId}`),
        axiosInstance.get(`/contests/${contestId}/problems`),
        axiosInstance.get(`/contests/${contestId}/score`),
      ]);

      if (contestRes.data.success && problemsRes.data.success) {
        setContest(contestRes.data.contest);
        setProblems(problemsRes.data.problems);
        setUserScore(userScoreRes.data.score || 0);

        if (problemId) {
          const problem = problemsRes.data.problems.find(
            (p) => p.problem.id === problemId
          );
          if (problem) {
            setSelectedProblem(problem);
            setCode(problem.problem.codeSnippets?.JAVASCRIPT || "");
            setShowProblemsSidebar(false);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching contest data:", error);
      toast.error("Failed to load contest data");
    } finally {
      setLoading(false);
    }
  }, [contestId, problemId]);

  useEffect(() => {
    fetchContestData();
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [fetchContestData]);

  useEffect(() => {
    if (problemId && problems.length > 0) {
      const problem = problems.find((p) => p.problem.id === problemId);
      if (problem) {
        setSelectedProblem(problem);
        setCode(problem.problem.codeSnippets?.[selectedLanguage] || "");
      }
    }
  }, [problemId, problems, selectedLanguage]);

  const getTimeRemaining = () => {
    if (!contest) return null;
    const end = new Date(contest.endTime);
    const diff = end - currentTime;
    if (diff <= 0) return null;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleProblemSelect = (problem) => {
    navigate(`/contests/${contestId}/live/${problem.problem.id}`);
    setShowProblemsSidebar(false);
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    if (selectedProblem) {
      setCode(selectedProblem.problem.codeSnippets?.[language] || "");
    }
  };

  const handleRunCode = async () => {
    try {
      const language_id = getJudge0LangaugeId(selectedLanguage);
      const stdin = selectedProblem.problem.testcases.map((tc) => tc.input);
      const expected_outputs = selectedProblem.problem.testcases.map(
        (tc) => tc.output
      );

      const result = await executeCode(
        code,
        language_id,
        stdin,
        expected_outputs,
        selectedProblem.problem.id
      );

      if (result?.success) {
        const submissionRes = await axiosInstance.post(
          `/contests/${contestId}/submit`,
          {
            problemId: selectedProblem.problem.id,
            sourceCode: code,
            language: selectedLanguage,
            status: result.submission.status,
            score:
              result.submission.status === "Accepted"
                ? selectedProblem.points
                : 0,
          }
        );

        if (submissionRes.data.success) {
          toast.success("Submission successful!");
          fetchSubmissions();
          const scoreRes = await axiosInstance.get(
            `/contests/${contestId}/score`
          );
          setUserScore(scoreRes.data.score || 0);
        }
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      toast.error("Failed to submit code");
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await axiosInstance.get(
        `/contests/${contestId}/submissions/${selectedProblem.problem.id}`
      );
      if (res.data.success) {
        setSubmissions(res.data.submissions);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  useEffect(() => {
    if (selectedProblem) {
      fetchSubmissions();
    }
  }, [selectedProblem]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Wrong Answer":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Circle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const isContestActive = () => {
    if (!contest) return false;
    const now = new Date();
    return (
      now >= new Date(contest.startTime) && now <= new Date(contest.endTime)
    );
  };

  if (loading) {
    return (
      <div className="min-w-screen min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className=" min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-center py-12">
        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-100 mb-2">
          Contest not found
        </h3>
        <button
          onClick={() => navigate("/contests")}
          className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Contests
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Contest Header */}
      
      <div className="bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowProblemsSidebar(!showProblemsSidebar)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:bg-gray-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                {contest.name}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 rounded-full">
                  <span className="font-medium">Score: {userScore}</span>
                </div>
                {isContestActive() && (
                  <div className="flex items-center gap-1 bg-gray-700/50 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4" />
                    <span>{getTimeRemaining() || "Contest ended"}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 bg-gray-700/50 px-3 py-1 rounded-full">
                  <Users className="w-4 h-4" />
                  <span>
                    {contest.participantCount || 0}
                    {contest.maxParticipants &&
                      ` / ${contest.maxParticipants}`}{" "}
                    participants
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate("/home")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <X className="w-4 h-4 mr-2" />
                Leave Contest
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen sm:px-6 lg:px-2">
        <div className="flex h-[calc(100vh-80px)]">
          {/* Problems Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
               className="sticky top-16 h-[calc(100vh-80px)] flex flex-col bg-gray-800/50 rounded-lg border border-gray-700"
    >
              {/* Header (fixed inside the sticky box) */}
              <div className="px-4 py-3 border-b border-gray-700 rounded-t-lg">
                <h2 className="text-lg font-medium text-white">Problems</h2>
              </div>

              {/* Scrollable Problem List */}
              <div className="flex-1 overflow-y-auto divide-y divide-gray-700">
                {problems.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => handleProblemSelect(problem)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-700/50 transition-colors ${
                      selectedProblem?.problem.id === problem.problem.id
                        ? "bg-blue-900/30 border-l-4 border-l-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">
                        {problem.order}. {problem.problem.title}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          problem.problem.difficulty === "EASY"
                            ? "bg-green-900/30 text-green-400"
                            : problem.problem.difficulty === "MEDIUM"
                            ? "bg-yellow-900/30 text-yellow-400"
                            : "bg-red-900/30 text-red-400"
                        }`}
                      >
                        {problem.problem.difficulty}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                      {(() => {
                        const submission = submissions?.find(
                          (s) => s.problemId === problem.problem.id
                        );

                        if (submission) {
                          return (
                            <>
                              {getStatusIcon(submission.status)}
                              <span>{submission.status}</span>
                            </>
                          );
                        } else {
                          return <span>Not attempted</span>;
                        }
                      })()}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Problems Sidebar - Mobile */}
          <AnimatePresence>
            {showProblemsSidebar && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-lg lg:hidden"
              >
                <div className="h-full overflow-y-auto">
                  <div className="px-4 py-3 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-white">Problems</h2>
                    <button
                      onClick={() => setShowProblemsSidebar(false)}
                      className="p-1 rounded-md text-gray-400 hover:bg-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="divide-y divide-gray-700">
                    {problems.map((problem) => (
                      <button
                        key={problem.id}
                        onClick={() => handleProblemSelect(problem)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-700/50 transition-colors ${
                          selectedProblem?.problem.id === problem.problem.id
                            ? "bg-blue-900/30 border-l-4 border-l-blue-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-white">
                            {problem.order}. {problem.problem.title}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              problem.problem.difficulty === "EASY"
                                ? "bg-green-900/30 text-green-400"
                                : problem.problem.difficulty === "MEDIUM"
                                ? "bg-yellow-900/30 text-yellow-400"
                                : "bg-red-900/30 text-red-400"
                            }`}
                          >
                            {problem.problem.difficulty}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                          {(() => {
                            const submission = submissions?.find(
                              (s) => s.problemId === problem.problem.id
                            );

                            if (submission) {
                              return (
                                <>
                                  {getStatusIcon(submission.status)}
                                  <span>{submission.status}</span>
                                </>
                              );
                            } else {
                              return <span>Not attempted</span>;
                            }
                          })()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto ">
            {selectedProblem ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800/50 w-[calc(100%-1rem)] backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-700 bg-gray-800/50">
                  <h2 className="text-lg font-medium text-white">
                    {selectedProblem.order}. {selectedProblem.problem.title}
                  </h2>
                </div>
                <div className="p-4">
                  <div className="prose prose-invert max-w-none mb-6">
                    <p className="text-gray-300">
                      {selectedProblem.problem.description}
                    </p>{" "}
                    <div className="mt-4">
                      <h3 className="font-medium text-white">Examples:</h3>
                      <div className="bg-gray-700/50 p-4 rounded-md mt-2">
                        <div className="mb-2">
                          <span className="font-medium text-gray-300">
                            Input:
                          </span>
                          <pre className="bg-gray-800 p-2 rounded mt-1 text-sm text-gray-200 overflow-x-auto">
                            {selectedProblem.problem.testcases[0].input}
                          </pre>
                        </div>
                        <div>
                          <span className="font-medium text-gray-300">
                            Output:
                          </span>
                          <pre className="bg-gray-800 p-2 rounded mt-1 text-sm text-gray-200 overflow-x-auto">
                            {selectedProblem.problem.testcases[0].output}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-300">
                          Language:
                        </label>
                        <select
                          value={selectedLanguage}
                          onChange={(e) => handleLanguageChange(e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                          <option value="JAVASCRIPT">JavaScript</option>
                          <option value="PYTHON">Python</option>
                          <option value="JAVA">Java</option>
                        </select>
                      </div>
                    </div>

                    <div
                      id="editor-wrapper"
                      className="min-h-[300px] h-[400px]"
                    >
                      <ResizableEditor
                        code={code}
                        language={selectedLanguage}
                        onCodeChange={setCode}
                        onRunCode={handleRunCode}
                        isExecuting={isExecuting}
                        showFullscreen={false}
                        showProblemTabs={false}
                        editorRef={editorRef}
                        monacoRef={monacoRef}
                        theme="vs-dark"
                        isContestActive={isContestActive()}
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-white mb-3">
                      Your Submissions
                    </h3>
                    {submissions?.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="overflow-x-auto"
                      >
                        <table className="min-w-full divide-y divide-gray-700">
                          <thead className="bg-gray-700/50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Time
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Language
                              </th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Score
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-800/30 divide-y divide-gray-700">
                            {submissions.map((submission) => (
                              <motion.tr
                                key={submission.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400">
                                  {new Date(
                                    submission.submittedAt
                                  ).toLocaleTimeString()}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                  <span className="flex items-center gap-1">
                                    {getStatusIcon(submission.status)}
                                    {submission.status}
                                  </span>
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400">
                                  {submission.language}
                                </td>
                                <td className={` ${submission.score > 0 ? "text-green-400" : "text-red-400"} px-4 py-2 whitespace-nowrap text-sm`}>
                                  {submission.score}
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </motion.div>
                    ) : (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-400"
                      >
                        No submissions yet
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 text-center"
              >
                <Code className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  Select a problem to start coding
                </h3>
                <p className="text-gray-400">
                  Choose a problem from the sidebar to view its details and
                  submit your solution
                </p>
                <button
                  onClick={() => setShowProblemsSidebar(true)}
                  className="mt-4 lg:hidden inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Menu className="w-4 h-4 mr-2" />
                  View Problems
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveContestPage;
