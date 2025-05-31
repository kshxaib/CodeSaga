import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Share2, Users, Mail,
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Clock,
  Terminal,
  Code2,
  ThumbsUp,
  Loader,
  ThumbsDown,
  Star,
  CircleArrowLeft,
  Bug,
  BookOpenText,
  Lock,
} from "lucide-react";
import { useProblemStore } from "../../store/useProblemStore";
import { useExecutionStore } from "../../store/useExecutionStore";
import { useSubmissionStore } from "../../store/useSubmissionStore";
import { useEditorSizeStore } from "../../store/useEditorSizeStore";
import { getJudge0LangaugeId } from "../../libs/getLanguageId";
import SubmissionResults from "../Submission";
import SubmissionsList from "../SubmissionList";
import AddToPlaylist from "../AddToPlaylist";
import BugModal from "./BugModal";
import DiscussionSection from "./DiscussionSection";
import ResizableEditor from "./ResizableEditor";
import InviteModal from "../InviteModal";
import useInvitationStore from "../../store/useInvitationStore";

const ProblemPage = () => {
  const { id } = useParams();
  const { isFullscreen } = useEditorSizeStore();
  const {
    getProblemById,
    problem,
    isLoading,
    isReactingToProblem,
    reactToProblem,
    checkProblemInPlaylist,
  } = useProblemStore();
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [testcases, setTestcases] = useState([]);
  const {
    submission: submissions,
    isLoading: isSubmissionLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();
  const [isInPlaylist, setIsInPlaylist] = useState(false);
  const [openBugModal, setOpenBugModal] = useState(false);
  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { isExecuting, executeCode, submission } = useExecutionStore();

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    if (problem) {
      const defaultLang = problem.codeSnippets?.JAVASCRIPT
        ? "JAVASCRIPT"
        : Object.keys(problem.codeSnippets || {})[0] || "JAVASCRIPT";

      setSelectedLanguage(defaultLang);
      setCode(problem.codeSnippets?.[defaultLang] || "");
      setTestcases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem]);

  useEffect(() => {
    const checking = async () => {
      const exists = await checkProblemInPlaylist(id);
      setIsInPlaylist(exists);
    };

    if (id) {
      checking();
    }
  }, [id, checkProblemInPlaylist]);

  useEffect(() => {
    if (activeTab === "submissions") {
      getSubmissionForProblem(id);
    }
  }, [id, activeTab, getSubmissionForProblem]);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    setCode(problem?.codeSnippets?.[newLanguage] || "");
  };

  const handleRunCode = async (e) => {
    e.preventDefault();

    try {
      const language_id = getJudge0LangaugeId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);

      await executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.log("Error while executing code", error);
    }
  };

  const handleLikeClick = async (problemId) => {
    await reactToProblem(problemId, true);
  };

  const handleDislikeClick = async (problemId) => {
    await reactToProblem(problemId, false);
  };

  const handleAddtoPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setAddToPlaylistModalOpen(true);
  };

  const successRate =
    submissionCount === 0 || !problem?.solvedBy
      ? 0
      : Math.round((problem.solvedBy.length / submissionCount) * 100);

  if (isLoading || !problem) {
    return (
      <div className="min-w-screen min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <Loader className="size-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description": {
        const examples =
          problem.examples?.[selectedLanguage] || problem.examples?.javascript;
        return (
          <div className="prose max-w-none">
            {problem.isPaid && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-yellow-900/20 rounded-lg border border-yellow-600/50">
                <Lock className="w-5 h-5 text-yellow-500" />
                <span className="font-medium text-yellow-400">
                  Premium Problem - Subscription Required
                </span>
              </div>
            )}

            <p className="text-lg mb-6 text-gray-300">{problem.description}</p>

            {examples && (
              <>
                <h3 className="text-xl font-bold mb-4 text-indigo-400">
                  Examples:
                </h3>
                <div className="bg-gray-800 p-6 rounded-xl mb-6 font-mono border border-gray-700">
                  <div className="mb-4">
                    <div className="text-indigo-300 mb-2 text-base font-semibold">
                      Input:
                    </div>
                    <span className="bg-gray-900 px-4 py-2 rounded-lg font-semibold text-gray-200 block">
                      {examples.input}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="text-indigo-300 mb-2 text-base font-semibold">
                      Output:
                    </div>
                    <span className="bg-gray-900 px-4 py-2 rounded-lg font-semibold text-gray-200 block">
                      {examples.output}
                    </span>
                  </div>
                  {examples.explanation && (
                    <div>
                      <div className="text-emerald-300 mb-2 text-base font-semibold">
                        Explanation:
                      </div>
                      <p className="text-gray-400 text-lg">
                        {examples.explanation}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-xl font-bold mb-4 text-indigo-400">
                  Constraints:
                </h3>
                <div className="bg-gray-800 p-6 rounded-xl mb-6 border border-gray-700">
                  <span className="bg-gray-900 px-4 py-2 rounded-lg font-semibold text-gray-200 block">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      }
      case "submissions": {
        return (
          <SubmissionsList
            submissions={submissions}
            isLoading={isSubmissionLoading}
          />
        );
      }
      case "discussion": {
        return <DiscussionSection problemId={id} />;
      }
      case "hints": {
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <span className="bg-gray-900 px-4 py-2 rounded-lg font-semibold text-gray-200 block">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                No hints available
              </div>
            )}
          </div>
        );
      }
      case "solution": {
        const solution =
          problem.referenceSolutions?.[selectedLanguage.toUpperCase()] ||
          "No solution available for this language.";
        return (
          <div className="p-6">
            <h3 className="text-xl font-bold mb-4 text-indigo-400">
              Solution for {selectedLanguage}
            </h3>
            <div className="bg-gray-800 p-6 rounded-xl font-mono whitespace-pre-wrap text-gray-300 border border-gray-700">
              {solution}
            </div>
          </div>
        );
      }
      default: {
        return null;
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 min-w-screen mx-auto text-gray-200">
      <nav
        className={`navbar bg-gray-850 shadow-lg px-6 py-3 border-b border-gray-700 ${
          isFullscreen ? "fixed top-0 w-full z-50" : ""
        }`}
      >
        <div className="flex-1 gap-2">
          <Link
            to={"/problems"}
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mr-4"
          >
            <CircleArrowLeft className="w-6 h-6" />
          </Link>

          <div className="mt-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-100">
                {problem.title}
              </h1>
              {problem.isPaid && (
                <span className="flex items-center gap-1 text-xs bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded-full border border-yellow-700/50">
                  <Lock className="w-3 h-3" />
                  Premium
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mt-3">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {problem.isPaid ? "Asked in " : "Updated "}
                  {new Date(problem.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <span className="text-gray-600">•</span>

              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{submissionCount} Submissions</span>
              </div>

              <span className="text-gray-600">•</span>

              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>{successRate}% Success Rate</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleLikeClick(problem.id)}
              className="flex items-center gap-1 text-gray-300 hover:text-green-400 transition-colors"
              disabled={isReactingToProblem}
            >
              {isReactingToProblem ? (
                <Loader className="animate-spin w-4 h-4" />
              ) : (
                <ThumbsUp className="w-5 h-5" />
              )}
              <span className="text-sm">{problem.likes}</span>
            </button>

            <button
              onClick={() => handleDislikeClick(problem.id)}
              className="flex items-center gap-1 text-gray-300 hover:text-red-400 transition-colors ml-2"
              disabled={isReactingToProblem}
            >
              {isReactingToProblem ? (
                <Loader className="animate-spin w-4 h-4" />
              ) : (
                <ThumbsDown className="w-5 h-5" />
              )}
              <span className="text-sm">{problem.dislikes}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              title={isInPlaylist ? "Already in Playlist" : "Add to Playlist"}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isInPlaylist
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-indigo-400"
              }`}
              onClick={() => handleAddtoPlaylist(problem.id)}
            >
              <Bookmark
                className={`w-5 h-5 ${
                  isInPlaylist ? "fill-white" : "fill-none"
                }`}
              />
            </button>

            <button
  title="Invite Collaborators"
  className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-indigo-400 transition-colors"
  onClick={() => setIsInviteModalOpen(true)}
>
  <Users className="w-5 h-5" />
</button>

            <button
              title="Report Bug"
              className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-red-400 transition-colors"
              onClick={() => setOpenBugModal(true)}
            >
              <Bug className="w-5 h-5" />
            </button>
          </div>

          <select
            className="select select-bordered bg-gray-800 border-gray-700 text-gray-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-sm"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option
                key={lang}
                value={lang}
                className="bg-gray-800 text-gray-200"
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <div
        className={`container mx-auto py-3 min-w-full ${
          isFullscreen ? "pt-20" : ""
        }`}
      >
        <div
          className={`grid grid-cols-1 ${
            isFullscreen ? "" : "lg:grid-cols-2"
          } gap-4 px-4`}
        >
          {!isFullscreen && (
            <div className="card bg-gray-850 shadow-xl border border-gray-700">
  <div className="card-body p-0">
    <div className="tabs tabs-boxed bg-gray-800 flex flex-wrap sm:flex-nowrap px-2">
      <div className="flex w-full overflow-x-auto gap-2 py-2">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${activeTab === "description"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          onClick={() => setActiveTab("description")}
        >
          <FileText className="w-4 h-4" />
          Description
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${activeTab === "submissions"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          onClick={() => setActiveTab("submissions")}
        >
          <Code2 className="w-4 h-4" />
          Submissions
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${activeTab === "discussion"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          onClick={() => setActiveTab("discussion")}
        >
          <MessageSquare className="w-4 h-4" />
          Discussion
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${activeTab === "hints"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          onClick={() => setActiveTab("hints")}
        >
          <Lightbulb className="w-4 h-4" />
          Hints
        </button>

        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${activeTab === "solution"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          onClick={() => setActiveTab("solution")}
        >
          <BookOpenText className="w-4 h-4" />
          Solution
        </button>
      </div>
    </div>

    <div className="p-6">{renderTabContent()}</div>
  </div>
</div>

          )}

          <ResizableEditor
            code={code}
            language={selectedLanguage}
            onCodeChange={(value) => setCode(value || "")}
            onRunCode={handleRunCode}
            isExecuting={isExecuting}
          />
        </div>

        {!isFullscreen && (
          <div className="card bg-gray-850 shadow-xl mt-6 border border-gray-700 mx-4">
            <div className="card-body">
              {submission ? (
                <SubmissionResults submission={submission} />
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-indigo-400">
                      Test Cases
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr className="border-gray-700">
                          <th className="bg-gray-800 text-gray-300">Input</th>
                          <th className="bg-gray-800 text-gray-300">
                            Expected Output
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {testcases.map((testcase, index) => (
                          <tr
                            key={index}
                            className="border-gray-700 hover:bg-gray-800"
                          >
                            <td className="font-mono text-gray-300">
                              {testcase.input}
                            </td>
                            <td className="font-mono text-gray-300">
                              {testcase.output}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <AddToPlaylist
        isOpen={addToPlaylistModalOpen}
        onClose={() => setAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />

      <BugModal
        isOpen={openBugModal}
        onClose={() => setOpenBugModal(false)}
        problemId={problem.id}
      />

      <InviteModal
  problemId={id}
  isOpen={isInviteModalOpen}
  onClose={() => setIsInviteModalOpen(false)}
/>
    </div>
  );
};

export default ProblemPage;