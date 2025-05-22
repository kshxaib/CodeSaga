import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  Loader,
  Shuffle,
  ThumbsDown,
  Star
} from "lucide-react";
import { useProblemStore } from "../store/useProblemStore";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import { getJudge0LangaugeId } from "../libs/getLanguageId";
import SubmissionResults from "./Submission";
import SubmissionsList from "./SubmissionList";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isLoading, isReactingToProblem, reactToProblem } = useProblemStore();
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestcases] = useState([]);
  const {submission: submissions, isLoading: isSubmissionLoading, getSubmissionForProblem, getSubmissionCountForProblem, submissionCount} = useSubmissionStore();

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
    if(activeTab === "submissions") {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

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
    await reactToProblem(problemId, true)
  }
  const handleDislikeClick = async (problemId) => {
    await reactToProblem(problemId, false)
  }

 const successRate =
  submissionCount === 0 || !problem?.solvedBy
    ? 0
    : Math.round((problem.solvedBy.length / submissionCount) * 100);


  if (isLoading || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  

 const renderTabContent = () => {
  switch (activeTab) {
    case "description": {
      const examples = problem.examples?.[selectedLanguage] || problem.examples?.javascript;
      return (
        <div className="prose max-w-none ">
          <p className="text-lg mb-6">{problem.description}</p>

          {examples && (
            <>
              <h3 className="text-xl font-bold mb-4">Examples:</h3>
              <div className="bg-base-200 p-6 rounded-xl mb-6 font-mono">
                <div className="mb-4">
                  <div className="text-indigo-300 mb-2 text-base font-semibold">
                    Input:
                  </div>
                  <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                    {examples.input}
                  </span>
                </div>
                <div className="mb-4">
                  <div className="text-indigo-300 mb-2 text-base font-semibold">
                    Output:
                  </div>
                  <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                    {examples.output}
                  </span>
                </div>
                {examples.explanation && (
                  <div>
                    <div className="text-emerald-300 mb-2 text-base font-semibold">
                      Explanation:
                    </div>
                    <p className="text-base-content/70 text-lg">
                      {examples.explanation}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {problem.constraints && (
            <>
              <h3 className="text-xl font-bold mb-4">Constraints:</h3>
              <div className="bg-base-200 p-6 rounded-xl mb-6">
                <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
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
        <SubmissionsList  submissions={submissions} isLoading={isSubmissionLoading}/>
      );
    }
    case "discussion": {
      return (
        <div className="p-4 text-center text-base-content/70">
          No discussions yet
        </div>
      );
    }
    case "hints": {
      return (
        <div className="p-4">
          {problem?.hints ? (
            <div className="bg-base-200 p-6 rounded-xl">
              <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                {problem.hints}
              </span>
            </div>
          ) : (
            <div className="text-center text-base-content/70">
              No hints available
            </div>
          )}
        </div>
      );
    }
    default: {
      return null;
    }
  }
};
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 min-w-screen mx-auto">
      <nav className="navbar bg-base-100 shadow-lg px-4">
        <div className="flex-1 gap-2">
          <Link to={"/problems"} className="flex items-center gap-2 text-primary">
            <Home className="w-6 h-6" />
            <ChevronRight className="w-4 h-4" />
          </Link>
          <div className="mt-2">
  <h1 className="text-xl font-bold">{problem.title}</h1>

  <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/70 mt-5">
    <div className="flex items-center gap-1">
      <Clock className="w-4 h-4" />
      <span>
        Updated{" "}
        {new Date(problem.createdAt).toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </span>
    </div>

    <span className="text-base-content/30">•</span>

    <div className="flex items-center gap-1">
      <Users className="w-4 h-4" />
      <span>{submissionCount} Submissions</span>
    </div>

    <span className="text-base-content/30">•</span>

    <div className="flex items-center gap-1">
      <Star className="w-4 h-4" />
      <span>{successRate}% Success Rate</span>
    </div>

    <span className="text-base-content/30">•</span>

    <div className="flex items-center gap-3">
      <button
        onClick={() => handleLikeClick(problem.id)}
        className="flex items-center gap-1 text-green-600 hover:text-green-700"
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{problem.likes}</span>
      </button>

      <button
        onClick={() => handleDislikeClick(problem.id)}
        className="flex items-center gap-1 text-red-600 hover:text-red-700"
      >
        <ThumbsDown className="w-4 h-4" />
        <span>{problem.dislikes}</span>
      </button>
    </div>
  </div>
</div>

        </div>
        <div className="flex-none gap-4">
          <button
            className={`btn btn-ghost btn-circle ${
              isBookmarked ? "text-primary" : ""
            }`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button className="btn btn-ghost btn-circle">
            <Share2 className="w-5 h-5" />
          </button>
          <select
            className="select select-bordered select-primary w-52 px-4 py-2 text-base font-medium shadow-md transition duration-200 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-xl"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang} className="capitalize text-base text-gray-700">
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </nav>

      <div className="container mx-auto py-3 min-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered">
                <button
                  className={`tab gap-2 ${
                    activeTab === "description" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("description")}
                >
                  <FileText className="w-4 h-4" />
                  Description
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "submissions" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("submissions")}
                >
                  <Code2 className="w-4 h-4" />
                  Submissions
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "discussion" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("discussion")}
                >
                  <MessageSquare className="w-4 h-4" />
                  Discussion
                </button>
                <button
                  className={`tab gap-2 ${
                    activeTab === "hints" ? "tab-active" : ""
                  }`}
                  onClick={() => setActiveTab("hints")}
                >
                  <Lightbulb className="w-4 h-4" />
                  Hints
                </button>
              </div>

              <div className="p-6">{renderTabContent()}</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered">
                <button className="tab tab-active gap-2">
                  <Terminal className="w-4 h-4" />
                  Code Editor
                </button>
              </div>

              <div className="h-[600px] w-full">
                <Editor
                  height={"100%"}
                  language={selectedLanguage.toLowerCase()}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    lineNumbers: "on",
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                  }}
                />
              </div>
              <div className="p-4 border-t border-base-300 bg-base-200">
                <div className="flex justify-between items-center">
                  <button
                    className={`btn btn-primary gap-2 ${
                      isExecuting ? "loading" : ""
                    }`}
                    onClick={(e) => handleRunCode(e)}
                    disabled={isExecuting}
                  >
                    {!isExecuting && <Play className="w-4 h-4" />}
                    Run Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            {submission ? (
              <SubmissionResults submission={submission} />
            ) : (              
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Test Cases</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th>Input</th>
                        <th>Expected Output</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testcases.map((testcase, index) => (
                        <tr key={index}>
                          <td className="font-mono">{testcase.input}</td>
                          <td className="font-mono">{testcase.output}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;