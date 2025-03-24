-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  persona TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  question_id UUID REFERENCES quiz_questions(id),
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_sessions table
CREATE TABLE IF NOT EXISTS quiz_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  persona TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for quiz tables
ALTER PUBLICATION supabase_realtime ADD TABLE quiz_questions;
ALTER PUBLICATION supabase_realtime ADD TABLE quiz_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE quiz_sessions;

-- Add some sample quiz questions for each persona
INSERT INTO quiz_questions (persona, question, options, correct_answer, explanation)
VALUES
-- GreenBot questions
('GreenBot', 'Which of the following is a renewable energy source?', '{"A":"Coal","B":"Natural Gas","C":"Solar","D":"Petroleum"}', 'C', 'Solar energy is renewable as it comes from the sun, which is a virtually inexhaustible source.'),
('GreenBot', 'What percentage of the Earth''s surface is covered by water?', '{"A":"50%","B":"60%","C":"70%","D":"80%"}', 'C', 'Approximately 71% of the Earth''s surface is covered by water, with oceans holding about 96.5% of all Earth''s water.'),

-- EcoLife Guide questions
('EcoLife Guide', 'Which of these actions reduces your carbon footprint the most?', '{"A":"Using paper bags instead of plastic","B":"Eating less meat","C":"Buying local produce","D":"Recycling paper"}', 'B', 'Reducing meat consumption significantly lowers carbon footprint as livestock production is responsible for about 14.5% of global greenhouse gas emissions.'),
('EcoLife Guide', 'What is "greenwashing"?', '{"A":"Cleaning with eco-friendly products","B":"Washing clothes in cold water","C":"Companies falsely claiming environmental benefits","D":"Planting trees to offset carbon"}', 'C', 'Greenwashing is when companies make misleading or false claims about the environmental benefits of their products or practices.'),

-- Waste Wizard questions
('Waste Wizard', 'Which of these items cannot typically be recycled in standard programs?', '{"A":"Aluminum cans","B":"Plastic bottles","C":"Styrofoam","D":"Cardboard"}', 'C', 'Styrofoam (expanded polystyrene) is difficult to recycle and is not accepted in most curbside recycling programs due to its low density and contamination issues.'),
('Waste Wizard', 'What is composting?', '{"A":"Burning waste to generate energy","B":"Biological process that converts organic waste into nutrient-rich soil","C":"Separating recyclables from trash","D":"Reducing consumption of single-use items"}', 'B', 'Composting is a natural biological process where microorganisms break down organic materials into a nutrient-rich soil amendment.'),

-- Nature Navigator questions
('Nature Navigator', 'What is biodiversity?', '{"A":"The variety of life on Earth","B":"A type of sustainable farming","C":"The study of birds","D":"A conservation technique"}', 'A', 'Biodiversity refers to the variety of living species on Earth, including plants, animals, bacteria, and fungi, as well as the natural processes that support them.'),
('Nature Navigator', 'Which ecosystem has the highest biodiversity?', '{"A":"Tundra","B":"Desert","C":"Tropical rainforest","D":"Temperate forest"}', 'C', 'Tropical rainforests contain the highest biodiversity of any ecosystem on Earth, housing approximately 50% of all plant and animal species despite covering less than 7% of the Earth''s surface.'),

-- Power Sage questions
('Power Sage', 'Which renewable energy source currently provides the most electricity globally?', '{"A":"Solar","B":"Wind","C":"Hydropower","D":"Geothermal"}', 'C', 'Hydropower is currently the largest renewable electricity source globally, accounting for about 16% of total electricity generation worldwide.'),
('Power Sage', 'What is the main advantage of LED light bulbs over incandescent bulbs?', '{"A":"They are cheaper to purchase","B":"They produce less heat and use less energy","C":"They are brighter","D":"They don''t contain any harmful materials"}', 'B', 'LED bulbs are significantly more energy-efficient than incandescent bulbs, using up to 90% less energy and producing much less heat, which results in lower electricity bills and a longer lifespan.'),

-- Climate Guardian questions
('Climate Guardian', 'What is the primary greenhouse gas contributing to climate change?', '{"A":"Oxygen","B":"Nitrogen","C":"Carbon dioxide","D":"Hydrogen"}', 'C', 'Carbon dioxide (CO2) is the primary greenhouse gas contributing to climate change, primarily released through human activities like burning fossil fuels and deforestation.'),
('Climate Guardian', 'What is the Paris Agreement?', '{"A":"A trade deal between European countries","B":"An international treaty on climate change mitigation","C":"A conservation plan for the Amazon rainforest","D":"A ban on single-use plastics"}', 'B', 'The Paris Agreement is an international treaty adopted in 2015 that aims to limit global warming to well below 2°C, preferably to 1.5°C, compared to pre-industrial levels.');
