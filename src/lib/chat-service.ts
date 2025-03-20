import { supabase } from "./supabase";
import { PersonaType } from "../components/PersonaSelector";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  persona?: string;
}

export interface Conversation {
  id: string;
  title: string;
  persona: string;
  created_at: string;
  updated_at: string;
  messages?: ChatMessage[];
}

// Create a new conversation
export async function createConversation(title: string, persona: PersonaType) {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: user.user.id,
      title,
      persona: getPersonaDisplayName(persona),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }

  return data;
}

// Get all conversations for the current user
export async function getConversations() {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", user.user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }

  return data;
}

// Get a conversation by ID with its messages
export async function getConversationWithMessages(conversationId: string) {
  // Get the conversation
  const { data: conversation, error: conversationError } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (conversationError) {
    console.error("Error fetching conversation:", conversationError);
    throw conversationError;
  }

  // Get the messages for this conversation
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (messagesError) {
    console.error("Error fetching messages:", messagesError);
    throw messagesError;
  }

  return {
    ...conversation,
    messages: messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender,
      timestamp: new Date(msg.created_at),
      persona: msg.persona,
    })),
  };
}

// Save a message to a conversation
export async function saveMessage(
  conversationId: string,
  message: ChatMessage,
) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      content: message.content,
      sender: message.sender,
      persona: message.persona,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving message:", error);
    throw error;
  }

  // Update the conversation's updated_at timestamp
  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return data;
}

// Helper function to get the display name for a persona
function getPersonaDisplayName(persona: PersonaType): string {
  switch (persona) {
    case "greenbot":
      return "GreenBot";
    case "lifestyle":
      return "EcoLife Guide";
    case "waste":
      return "Waste Wizard";
    case "nature":
      return "Nature Navigator";
    case "energy":
      return "Power Sage";
    case "climate":
      return "Climate Guardian";
    default:
      return "GreenBot";
  }
}
