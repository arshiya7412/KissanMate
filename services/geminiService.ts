import { UserProfile, ChatMessage, SoilType, MoistureLevel } from "../types";

const getSystemInstruction = (profile: UserProfile): string => {
  return `
You are KisaanMate, an empathetic, practical farming assistant for a FIRST-TIME farmer in India.
User Context:
- Name: ${profile.name}
- Location: ${profile.location}
- Goal: ${profile.goal}
- Water: ${profile.waterSource}
- Involvement: ${profile.involvement}
- Budget: ${profile.budget}
- Language: ${profile.language} (CRITICAL: You MUST reply in ${profile.language}).

Your Core Rules:
1. **Language:** Reply ONLY in ${profile.language}. Use simple terms suitable for a beginner.
2. **Safety First:** Prioritize organic, eco-friendly methods. Avoid chemical pesticides unless absolutely necessary.
3. **Beginner Focus:** No jargon. Explain "Why".
4. **Risk Management:** Never promise profits.
5. **Tone:** Calm, supportive, non-judgmental.

If the user uploads an image of soil, say "Based on visual cues..."
`;
};

const proxyGenerateContent = async (model: string, contents: any, config?: any): Promise<string> => {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, contents, config }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch from backend AI service");
  }

  const data = await response.json();
  return data.text;
};

export const sendMessageToGemini = async (
  message: string,
  history: ChatMessage[],
  userProfile: UserProfile,
  image?: string
): Promise<string> => {
  try {
    const systemInstruction = getSystemInstruction(userProfile);
    const modelName = image ? 'gemini-2.5-flash-image' : 'gemini-3-flash-preview';

    let contents: any = {};

    if (image) {
      const base64Data = image.split(',')[1] || image;
      contents = {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: message || "Analyze this image in the context of farming." }
        ]
      };
    } else {
      contents = { parts: [{ text: message }] };
    }

    return await proxyGenerateContent(modelName, contents, {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    }) || "Connection error. Please try again.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Service temporarily unavailable. Please check internet.";
  }
};

export const generatePlanAnalysis = async (userProfile: UserProfile): Promise<string> => {
  try {
    const prompt = `Create a brief summary for my farming plan. Suggest 2 best beginner crops and 1 major risk. Reply in ${userProfile.language}.`;
    
    return await proxyGenerateContent('gemini-3-flash-preview', { parts: [{ text: prompt }] }, {
      systemInstruction: getSystemInstruction(userProfile)
    }) || "Could not generate plan.";
  } catch (e) {
    return "Plan generation unavailable.";
  }
}

export const getCropRecommendations = async (
  userProfile: UserProfile,
  soilType: SoilType,
  moisture: MoistureLevel,
  soilImage?: string
): Promise<string> => {
  const prompt = `
  Context: User is a beginner farmer in ${userProfile.location}.
  Soil: ${soilType}, Moisture: ${moisture}.
  Task: Suggest 3 suitable crops for beginners.
  Reply in ${userProfile.language}.
  `;

  return sendMessageToGemini(prompt, [], userProfile, soilImage);
};

export const getDashboardInsights = async (userProfile: UserProfile): Promise<string> => {
  const prompt = `Give me 1 short, actionable farming tip based on ${userProfile.location} weather. Max 20 words. Reply in ${userProfile.language}.`;
  try {
    return await proxyGenerateContent('gemini-3-flash-preview', { parts: [{ text: prompt }] }, {
      systemInstruction: getSystemInstruction(userProfile)
    }) || "Check soil moisture daily.";
  } catch (e) {
    return "Keep your farm clean.";
  }
};

export const getRiskAssessment = async (userProfile: UserProfile): Promise<string> => {
  const prompt = `Analyze farming risk for ${userProfile.location}. Reply in ${userProfile.language}. Format: Overall Risk (Low/Med/High) and 3 bullet points.`;
  return sendMessageToGemini(prompt, [], userProfile);
};

export const getCostAnalysis = async (userProfile: UserProfile): Promise<string> => {
  const prompt = `Compare farming costs vs budget ${userProfile.budget} for 1 acre. Reply in ${userProfile.language}. Keep it brief.`;
  return sendMessageToGemini(prompt, [], userProfile);
};
