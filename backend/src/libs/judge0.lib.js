import axios from "axios";
export const getJudge0LangaugeId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
    C: 50,
    CPP: 54,
    CSHARP: 51,
    GO: 60,
    RUST: 73,
    PHP: 68,
  };

  return languageMap[language.toUpperCase()] || 63;
};

export const getLanguageName = (language_id) => {
  const languageMap = {
    71: "PYTHON",
    62: "JAVA",
    63: "JAVASCRIPT",
    50: "C",
    54: "CPP",
    51: "CSHARP",
    60: "GO",
    73: "RUST",
    68: "PHP",
  };

  return languageMap[language_id] || "Unknown Language";
};


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


export const submitBatch = async (submissions) => {
  const base64Submissions = submissions.map(sub => ({
    ...sub,
    source_code: Buffer.from(sub.source_code.trim()).toString('base64'),
    stdin: Buffer.from(sub.stdin.trim()).toString('base64'),
    expected_output: Buffer.from(sub.expected_output.trim()).toString('base64'),
  }));

  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=true`,
    { submissions: base64Submissions }
  );

  return data;
};

export const pollBatchResults = async (tokens) => {
  while (true) {
    try {
      const { data } = await axios.get(
        `${process.env.JUDGE0_API_URL}/submissions/batch`,
        {
          params: {
            tokens: tokens.join(","),
            base64_encoded: true,
            fields: 'stdout,stderr,status,status_id,language_id,time,memory',
          },
        }
      );

      const results = data.submissions;

      // Decode base64 outputs
      const decodedResults = results.map(result => ({
        ...result,
        stdout: result.stdout ? Buffer.from(result.stdout, 'base64').toString('utf8') : null,
        stderr: result.stderr ? Buffer.from(result.stderr, 'base64').toString('utf8') : null,
      }));

      const isAllDone = decodedResults.every(
        (r) => r.status_id !== 1 && r.status_id !== 2
      );

      if (isAllDone) return decodedResults;

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error polling batch results:", error);
      throw error;
    }
  }
};


export function cleanNullBytes(obj) {
  if (typeof obj === 'string') {
    return obj.replace(/\u0000/g, '');
  } else if (Array.isArray(obj)) {
    return obj.map(item => cleanNullBytes(item));
  } else if (obj && typeof obj === 'object') {
    const cleaned = {};
    for (const key in obj) {
      cleaned[key] = cleanNullBytes(obj[key]);
    }
    return cleaned;
  }
  return obj;
}