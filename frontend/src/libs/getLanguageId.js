export const getJudge0LangaugeId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
    C: 50,
    CPP: 54,
    TYPESCRIPT: 74,
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
    74: "TYPESCRIPT",
    51: "CSHARP",
    60: "GO",
    73: "RUST",
    68: "PHP",
  };

  return languageMap[language_id] || "Unknown Language";
};