export const getJudge0LangaugeId = (language) => {
    const languageMap = {
        "python": 71,
        "javascript": 63,
        "java": 62,
        "c": 50,
    };

    return languageMap[language.toUpperCase()] || null;
}

export const submitBatch = async (submissions) => {
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submissions
    })

    return data // [{token}, {token}, ...]
}

export const pollBatchResults = async (tokens) => {
    while(true){
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
            params: {
                tokens: tokens.join(","),
                base64_encoded: false,
            }
        })

        const results = data.submissions

        const allFinished = results.every(
            (result) => result.status.id !== 1 && result.status.id !== 2
        )

        if(allFinished) return results
        await new Promise((resolve) => setTimeout(resolve, 1000)) 
    }
}