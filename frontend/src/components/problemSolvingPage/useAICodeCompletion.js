import { useState } from 'react';

export const useAICodeCompletion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCodeCompletion = async (prompt, context, language) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8080/api/v1/ai/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt, 
          context, 
          language,
          maxTokens: 100 // Adjust as needed
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to get completion');
      }
      
      return data;
    } catch (err) {
      console.error('AI completion error:', err);
      setError(err.message);
      return { 
        success: false, 
        error: err.message 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    getCodeCompletion,
  };
};