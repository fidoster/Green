// AI API service for multiple providers
import { supabase } from "./supabase";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const GROK_API_URL = "https://api.grok.x.com/v1/chat/completions"; // Placeholder URL, replace with actual Grok API URL

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
  provider: "deepseek" | "openai" | "grok" = "deepseek",
): Promise<string> {
  // Try to get API key from backend if user has enabled it
  const useBackendKeys = localStorage.getItem(`use-backend-${provider}`) !== "false";
  let usingBackendKey = false;
  
  if (useBackendKeys) {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        const { data: apiKeysData, error: apiKeyError } = await supabase
          .from("api_keys")
          .select("*")
          .eq("user_id", userData.user.id)
          .single();

        if (apiKeyError) {
          console.error("Error fetching API keys:", apiKeyError);
        } else if (apiKeysData) {
          let backendKey = null;

          // Extract the correct key based on provider
          if (provider === "deepseek" && apiKeysData.deepseek_key) {
            backendKey = apiKeysData.deepseek_key;
          } else if (provider === "openai" && apiKeysData.openai_key) {
            backendKey = apiKeysData.openai_key;
          } else if (provider === "grok" && apiKeysData.grok_key) {
            backendKey = apiKeysData.grok_key;
          }

          if (backendKey) {
            console.log(`Using backend ${provider} API key`);
            apiKey = backendKey;
            usingBackendKey = true;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching backend API key:", error);
    }
  }
  
  // If we still don't have an API key and none was provided, throw an error
  if (!apiKey) {
    throw new Error(`No ${provider.toUpperCase()} API key found. Please check your settings.`);
  }

  let apiUrl: string;
  let model: string;

  // Set API URL and model based on provider
  switch (provider) {
    case "openai":
      apiUrl = OPENAI_API_URL;
      model = "gpt-4o";
      break;
    case "grok":
      apiUrl = GROK_API_URL;
      model = "grok-1";
      break;
    case "deepseek":
    default:
      apiUrl = DEEPSEEK_API_URL;
      model = "deepseek-chat";
      break;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `${provider.toUpperCase()} API error: ${response.status} ${JSON.stringify(errorData)}`,
      );
    }

    const data: DeepseekResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error(`Error calling ${provider.toUpperCase()} API:`, error);
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
