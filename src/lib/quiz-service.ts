import { supabase } from "./supabase";

interface QuizResponse {
  question_id: string;
  selected_answer: string;
  is_correct: boolean;
}

interface QuizSession {
  persona: string;
  score: number;
  total_questions: number;
}

// Save a quiz response to the database
export async function saveQuizResponse(response: QuizResponse) {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("quiz_responses")
    .insert({
      user_id: user.user.id,
      question_id: response.question_id,
      selected_answer: response.selected_answer,
      is_correct: response.is_correct,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving quiz response:", error);
    throw error;
  }

  return data;
}

// Save a quiz session to the database
export async function saveQuizSession(session: QuizSession) {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("quiz_sessions")
    .insert({
      user_id: user.user.id,
      persona: session.persona,
      score: session.score,
      total_questions: session.total_questions,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving quiz session:", error);
    throw error;
  }

  return data;
}

// Get quiz history for the current user
export async function getQuizHistory() {
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("*")
    .eq("user_id", user.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching quiz history:", error);
    throw error;
  }

  return data;
}

// Get quiz questions for a specific persona
export async function getQuizQuestions(persona: string) {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("persona", persona);

  if (error) {
    console.error("Error fetching quiz questions:", error);
    throw error;
  }

  return data;
}
