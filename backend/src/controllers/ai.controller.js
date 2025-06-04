import axios from "axios";

const AI_API_KEY = process.env.AI_API_KEY;

export const getCodeCompletion = async (req, res) => {
    const userRole = req.user.role;
    try {
        if (userRole !== "PRO") {
            return res.status(403).json({
                success: false,
                message: "Only pro users can use this feature"
            })
        }

        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "Code and language are required"
            })
        }
        const prompt = `You are an AI assistant. Continue the following ${language} code naturally. Only return a single relevant line , not the full solution. Do not repeat any line from the input.
        Code:${code}
        Next line:`;
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 100,
                temperature: 0.2
            },
            {
                headers: {
                    'Authorization': `Bearer ${AI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const completion = response.data.choices[0].message.content.trim();

        res.json({
            success: true,
            completion
        });
    } catch (error) {
        console.error('AI completion error:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting AI completion'
        });
    }
}