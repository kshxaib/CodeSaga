import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
} from "lucide-react";

const SubmissionsList = ({ submissions, isLoading }) => {
  const safeParse = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing data:", error);
      return [];
    }
  };

  const calculateAverageMemory = (memoryData) => {
    const memoryArray = safeParse(memoryData).map((m) =>
      parseFloat(m.split(" ")[0])
    );
    if (memoryArray.length === 0) return 0;
    return (
      memoryArray.reduce((acc, curr) => acc + curr, 0) / memoryArray.length
    );
  };

  const calculateAverageTime = (timeData) => {
    const timeArray = safeParse(timeData).map((t) =>
      parseFloat(t.split(" ")[0])
    );
    if (timeArray.length === 0) return 0;
    return timeArray.reduce((acc, curr) => acc + curr, 0) / timeArray.length;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg text-purple-500"></span>
      </div>
    );
  }

  if (!submissions?.length) {
    return (
      <div className="text-center p-8">
        <div className="text-gray-500">No submissions yet</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => {
        const avgMemory = calculateAverageMemory(submission.memory);
        const avgTime = calculateAverageTime(submission.time);

        return (
          <div
            key={submission.id}
            className="card bg-gray-800 shadow-lg hover:shadow-xl transition-shadow rounded-lg border border-purple-500/30"
          >
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {submission.status === "Accepted" ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="font-semibold">Accepted</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400">
                      <XCircle className="w-6 h-6" />
                      <span className="font-semibold">{submission.status}</span>
                    </div>
                  )}
                  <div className="badge bg-gray-700 text-purple-400 border border-purple-500/30">
                    {submission.language}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>{avgTime.toFixed(3)} s</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Memory className="w-4 h-4 text-purple-400" />
                    <span>{avgMemory.toFixed(0)} KB</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>
                      {new Date(submission.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionsList;