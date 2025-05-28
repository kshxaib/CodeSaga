import React from 'react';
import { CheckCircle2, XCircle, Clock, MemoryStick as Memory } from 'lucide-react';

const SubmissionResults = ({ submission }) => {
  const parseArray = (str) => {
    try {
      return JSON.parse(str || '[]');
    } catch {
      return [];
    }
  };

  const memoryArr = parseArray(submission.memory);
  const timeArr = parseArray(submission.time);

  const avgMemory = memoryArr.length > 0 
    ? memoryArr.map(m => parseFloat(m)).reduce((a, b) => a + b, 0) / memoryArr.length 
    : 0;

  const avgTime = timeArr.length > 0 
    ? timeArr.map(t => parseFloat(t)).reduce((a, b) => a + b, 0) / timeArr.length 
    : 0;

  const passedTests = submission.testCases.filter(tc => tc.passed).length;
  const totalTests = submission.testCases.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gray-800 shadow-lg border border-purple-500/30">
          <div className="card-body p-4">
            <h3 className="card-title text-sm text-gray-400">Status</h3>
            <div className={`text-lg font-bold ${
              submission.status === 'Accepted' 
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              {submission.status}
            </div>
          </div>
        </div>

        <div className="card bg-gray-800 shadow-lg border border-purple-500/30">
          <div className="card-body p-4">
            <h3 className="card-title text-sm text-gray-400">Success Rate</h3>
            <div className="text-lg font-bold text-purple-400">
              {successRate.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="card bg-gray-800 shadow-lg border border-purple-500/30">
          <div className="card-body p-4">
            <h3 className="card-title text-sm text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Avg. Runtime
            </h3>
            <div className="text-lg font-bold text-blue-400">
              {avgTime.toFixed(3)} s
            </div>
          </div>
        </div>

        <div className="card bg-gray-800 shadow-lg border border-purple-500/30">
          <div className="card-body p-4">
            <h3 className="card-title text-sm text-gray-400 flex items-center gap-2">
              <Memory className="w-4 h-4 text-purple-400" />
              Avg. Memory
            </h3>
            <div className="text-lg font-bold text-purple-400">
              {avgMemory.toFixed(0)} KB
            </div>
          </div>
        </div>
      </div>

      {/* Test Cases Results */}
      <div className="card bg-gray-800 shadow-xl border border-purple-500/30">
        <div className="card-body">
          <h2 className="card-title mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Test Cases Results
          </h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-purple-500/30">
                  <th className="bg-gray-700 text-gray-300">Status</th>
                  <th className="bg-gray-700 text-gray-300">Expected Output</th>
                  <th className="bg-gray-700 text-gray-300">Your Output</th>
                  <th className="bg-gray-700 text-gray-300">Memory</th>
                  <th className="bg-gray-700 text-gray-300">Time</th>
                </tr>
              </thead>
              <tbody>
                {submission.testCases.map((testCase) => (
                  <tr key={testCase.id} className="border-purple-500/30 hover:bg-gray-700/50">
                    <td>
                      {testCase.passed ? (
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle2 className="w-5 h-5" />
                          Passed
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-400">
                          <XCircle className="w-5 h-5" />
                          Failed
                        </div>
                      )}
                    </td>
                    <td className="font-mono text-gray-300">{testCase.expected}</td>
                    <td className="font-mono text-gray-300">{testCase.stdout || 'null'}</td>
                    <td className="text-purple-400">{testCase.memory}</td>
                    <td className="text-blue-400">{testCase.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResults;