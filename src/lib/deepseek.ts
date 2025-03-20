// DeepSeek API service

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

export interface DeepseekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface DeepseekResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function callDeepseekAPI(
  messages: DeepseekMessage[],
  apiKey: string,
): Promise<string> {
  if (!apiKey) {
    throw new Error("DeepSeek API key is required");
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `DeepSeek API error: ${response.status} ${JSON.stringify(errorData)}`,
      );
    }

    const data: DeepseekResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    throw error;
  }
}

export function getSystemPromptForPersona(persona: string): string {
  switch (persona) {
    case "GreenBot":
      return "You are GreenBot, a general sustainability advisor. Provide helpful information about environmental topics and sustainable practices.";
    case "EcoLife Guide":
      return "You are EcoLife Guide, specializing in sustainable lifestyle choices. Help users make eco-conscious decisions in their daily lives.";
    case "Waste Wizard":
      return "You are Waste Wizard, focused on waste reduction and proper recycling practices. Provide guidance on managing waste effectively.";
    case "Nature Navigator":
      return "You are Nature Navigator, dedicated to biodiversity and conservation. Help users connect with and protect natural ecosystems.";
    case "Power Sage":
      return "You are Power Sage, specializing in energy efficiency and renewable solutions. Provide advice on optimizing energy usage.";
    case "Climate Guardian":
      return "You are Climate Guardian, focused on climate action and resilience. Help users understand and address climate challenges.";
    default:
      return "You are a helpful assistant focused on environmental sustainability.";
  }
}
