import { PersonaType } from "../components/PersonaSelector";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

type QuizData = {
  [key in PersonaType]: {
    title: string;
    description: string;
    questions: QuizQuestion[];
  };
};

export const quizData: QuizData = {
  greenbot: {
    title: "General Sustainability Quiz",
    description: "Test your knowledge about general sustainability concepts and practices.",
    questions: [
      {
        id: "gs-1",
        question: "What does the term 'carbon footprint' refer to?",
        options: [
          "The mark left by carbon paper",
          "The total amount of greenhouse gases produced by human activities",
          "A measurement of carbon in soil",
          "A footprint fossil containing carbon"
        ],
        correctAnswerIndex: 2,
        explanation: "In climate science, tipping points are thresholds where a small change can push a system into a completely new state, potentially causing rapid, dramatic, and irreversible changes to the climate system."
      }
    ]
  }
};1,
        explanation: "A carbon footprint is the total amount of greenhouse gases (including carbon dioxide and methane) that are generated by our actions."
      },
      {
        id: "gs-2",
        question: "Which of the following is a renewable energy source?",
        options: [
          "Natural gas",
          "Coal",
          "Solar power",
          "Petroleum"
        ],
        correctAnswerIndex: 2,
        explanation: "Solar power is renewable because it comes from the sun, which is a virtually inexhaustible source of energy."
      },
      {
        id: "gs-3",
        question: "What is greenwashing?",
        options: [
          "Cleaning with environmentally friendly products",
          "Marketing that falsely portrays a company's products as environmentally friendly",
          "A technique for washing vegetables",
          "Using green dye to color products"
        ],
        correctAnswerIndex: 1,
        explanation: "Greenwashing is when companies make misleading claims about the environmental benefits of their products or practices."
      },
      {
        id: "gs-4",
        question: "Which of these activities has the highest carbon footprint per person?",
        options: [
          "Taking a long-haul flight",
          "Using plastic bags",
          "Leaving lights on",
          "Using paper towels"
        ],
        correctAnswerIndex: 0,
        explanation: "Long-haul flights emit significant amounts of CO2 per passenger, making them one of the most carbon-intensive activities an individual can do."
      },
      {
        id: "gs-5",
        question: "What is the most recycled material in the world?",
        options: [
          "Plastic",
          "Paper",
          "Aluminum",
          "Steel"
        ],
        correctAnswerIndex: 3,
        explanation: "Steel is the most recycled material globally by volume, with over 650 million tons recycled annually."
      },
      {
        id: "gs-6",
        question: "What percentage of the Earth's water is freshwater available for human use?",
        options: [
          "About 50%",
          "About 20%",
          "Less than 1%",
          "About 10%"
        ],
        correctAnswerIndex: 2,
        explanation: "Less than 1% of Earth's water is freshwater accessible for human use. The rest is saltwater or locked in ice caps and glaciers."
      },
      {
        id: "gs-7",
        question: "What is the primary cause of global warming?",
        options: [
          "Solar flares",
          "Increased greenhouse gas emissions",
          "Earth's natural warming cycle",
          "Volcanic eruptions"
        ],
        correctAnswerIndex: 1,
        explanation: "The primary driver of current global warming is human-caused greenhouse gas emissions, particularly carbon dioxide and methane."
      },
      {
        id: "gs-8",
        question: "What is biodiversity?",
        options: [
          "A type of sustainable building material",
          "The variety of life in a particular habitat or ecosystem",
          "A measurement of organic content in soil",
          "An environmentally friendly cleaning product"
        ],
        correctAnswerIndex: 1,
        explanation: "Biodiversity refers to the variety of plants, animals, and microorganisms in an ecosystem, including their genetic variations and the ecosystems they form."
      },
      {
        id: "gs-9",
        question: "Which of the following is NOT a benefit of sustainable practices?",
        options: [
          "Reduced pollution",
          "Conservation of natural resources",
          "Immediate increased profits for all businesses",
          "Improved public health"
        ],
        correctAnswerIndex: 2,
        explanation: "While sustainable practices often lead to long-term economic benefits, they don't necessarily result in immediate increased profits for all businesses."
      },
      {
        id: "gs-10",
        question: "What is the circular economy?",
        options: [
          "An economy based on circular reasoning",
          "A system where resources are continually reused and recycled",
          "An economic model focused on circular trade routes",
          "A financial system based on circular debt"
        ],
        correctAnswerIndex: 1,
        explanation: "The circular economy is an economic system aimed at eliminating waste and the continual use of resources through reusing, sharing, repairing, refurbishing, remanufacturing, and recycling."
      }
    ]
  },
  lifestyle: {
    title: "Eco-Lifestyle Quiz",
    description: "Test your knowledge about sustainable living and eco-friendly lifestyle choices.",
    questions: [
      {
        id: "el-1",
        question: "Which of these has the lowest environmental impact for daily commuting?",
        options: [
          "Driving alone in an SUV",
          "Carpooling",
          "Cycling or walking",
          "Taking a taxi"
        ],
        correctAnswerIndex: 2,
        explanation: "Cycling and walking have virtually zero emissions and are the most environmentally friendly transportation methods."
      },
      {
        id: "el-2",
        question: "What is a 'zero waste' lifestyle?",
        options: [
          "Living without producing any trash that goes to landfill",
          "Only producing waste that can be recycled",
          "Offsetting your waste by planting trees",
          "Living without food waste"
        ],
        correctAnswerIndex: 0,
        explanation: "Zero waste means adopting lifestyle practices that avoid sending any trash to landfills, incinerators, or the ocean."
      },
      {
        id: "el-3",
        question: "Which of these foods typically has the highest carbon footprint?",
        options: [
          "Locally grown vegetables",
          "Beef",
          "Chicken",
          "Legumes (beans, lentils)"
        ],
        correctAnswerIndex: 1,
        explanation: "Beef production typically has the highest carbon footprint due to methane emissions from cattle and deforestation for grazing land."
      },
      {
        id: "el-4",
        question: "What is greenwashing in consumer products?",
        options: [
          "Using green-colored packaging",
          "Washing products with eco-friendly detergents",
          "Marketing products as more environmentally friendly than they actually are",
          "Adding plant extracts to products"
        ],
        correctAnswerIndex: 2,
        explanation: "Greenwashing is when companies mislead consumers about the environmental benefits of their products through marketing."
      },
      {
        id: "el-5",
        question: "Which household action saves the most water?",
        options: [
          "Taking shorter showers",
          "Turning off the tap while brushing teeth",
          "Fixing a leaky toilet",
          "Using a dishwasher instead of hand washing"
        ],
        correctAnswerIndex: 2,
        explanation: "A leaky toilet can waste up to 200 gallons of water per day, making fixing it one of the most significant water-saving actions."
      },
      {
        id: "el-6",
        question: "What does 'fast fashion' refer to?",
        options: [
          "Clothing that allows for fast movement",
          "Inexpensive clothing produced rapidly in response to trends",
          "High-end designer clothing",
          "Clothing made from quick-drying fabrics"
        ],
        correctAnswerIndex: 1,
        explanation: "Fast fashion refers to inexpensive clothing produced rapidly by mass-market retailers in response to the latest trends, often leading to environmental and social issues."
      },
      {
        id: "el-7",
        question: "Which of these is the most energy-efficient lighting option?",
        options: [
          "Incandescent bulbs",
          "Halogen bulbs",
          "Compact fluorescent lamps (CFLs)",
          "LED bulbs"
        ],
        correctAnswerIndex: 3,
        explanation: "LED bulbs are the most energy-efficient option, using up to 90% less energy than incandescent bulbs while lasting much longer."
      },
      {
        id: "el-8",
        question: "What is a 'locavore'?",
        options: [
          "Someone who eats only plants",
          "Someone who prefers to eat locally produced food",
          "Someone who eats a low-carbon diet",
          "Someone who forages for wild food"
        ],
        correctAnswerIndex: 1,
        explanation: "A locavore is someone who prefers to eat food that is grown or produced locally, typically within 100 miles of home."
      },
      {
        id: "el-9",
        question: "Which of these home improvements would save the most energy in most climates?",
        options: [
          "Installing solar panels",
          "Improving insulation",
          "Replacing windows",
          "Upgrading to a smart thermostat"
        ],
        correctAnswerIndex: 1,
        explanation: "Proper insulation typically offers the most energy savings by preventing heat loss in winter and heat gain in summer, reducing the need for heating and cooling."
      },
      {
        id: "el-10",
        question: "What is 'upcycling'?",
        options: [
          "Sending products back to manufacturers for recycling",
          "Transforming by-products or waste into new materials of higher quality or value",
          "Upgrading to more eco-friendly products",
          "Buying secondhand items"
        ],
        correctAnswerIndex: 1,
        explanation: "Upcycling is the process of transforming by-products, waste materials, or unwanted products into new materials or products of better quality or environmental value."
      }
    ]
  },
  waste: {
    title: "Waste Management Quiz",
    description: "Test your knowledge about waste reduction and proper recycling practices.",
    questions: [
      {
        id: "wm-1",
        question: "Which of these items should NOT go in the recycling bin?",
        options: [
          "Paper",
          "Aluminum cans",
          "Greasy pizza boxes",
          "Plastic water bottles"
        ],
        correctAnswerIndex: 2,
        explanation: "Greasy pizza boxes are contaminated with food waste, which can contaminate entire batches of recyclables. They should be composted or thrown away."
      },
      {
        id: "wm-2",
        question: "What does the waste hierarchy prioritize first?",
        options: [
          "Recycling",
          "Prevention/Reduction",
          "Energy recovery",
          "Composting"
        ],
        correctAnswerIndex: 1,
        explanation: "The waste hierarchy prioritizes prevention and reduction first, followed by reuse, recycling, energy recovery, and disposal as a last resort."
      },
      {
        id: "wm-3",
        question: "What is 'wishcycling'?",
        options: [
          "Hoping your recycling gets recycled",
          "Putting items in recycling bins that aren't actually recyclable",
          "Wishing for better recycling systems",
          "Recycling birthday wishes"
        ],
        correctAnswerIndex: 1,
        explanation: "Wishcycling is the practice of putting items in recycling bins hoping they'll be recycled, even when they're not actually recyclable locally."
      },
      {
        id: "wm-4",
        question: "Which of these is an example of hazardous household waste?",
        options: [
          "Cardboard",
          "Old batteries",
          "Food scraps",
          "Paper towels"
        ],
        correctAnswerIndex: 1,
        explanation: "Old batteries contain toxic chemicals and heavy metals, making them hazardous waste that requires special disposal."
      },
      {
        id: "wm-5",
        question: "What is composting?",
        options: [
          "Burning waste materials",
          "Sending waste to landfills",
          "Converting organic waste into nutrient-rich soil amendment",
          "Shredding plastics for recycling"
        ],
        correctAnswerIndex: 2,
        explanation: "Composting is the natural process of recycling organic matter, such as leaves and food scraps, into a valuable fertilizer that can enrich soil and plants."
      },
      {
        id: "wm-6",
        question: "About how long does it take for a plastic water bottle to decompose in a landfill?",
        options: [
          "1-5 years",
          "20-50 years",
          "450-500 years",
          "It never fully decomposes"
        ],
        correctAnswerIndex: 2,
        explanation: "Plastic water bottles take approximately 450-500 years to decompose in a landfill environment."
      },
      {
        id: "wm-7",
        question: "What should you do with electronic waste (e-waste)?",
        options: [
          "Put it in the regular trash",
          "Take it to specialized e-waste recycling facilities",
          "Bury it in your backyard",
          "Burn it"
        ],
        correctAnswerIndex: 1,
        explanation: "E-waste contains hazardous materials and should be taken to specialized e-waste recycling facilities where it can be safely processed."
      },
      {
        id: "wm-8",
        question: "Which of these best represents the concept of a 'circular economy' for waste?",
        options: [
          "Burying waste in circular patterns",
          "Moving waste in circles between countries",
          "Designing products to be reused and recycled indefinitely",
          "Rotating which days you put out trash"
        ],
        correctAnswerIndex: 2,
        explanation: "A circular economy aims to eliminate waste by designing products and systems where materials are reused and recycled indefinitely, rather than disposed of after use."
      },
      {
        id: "wm-9",
        question: "What is 'zero waste'?",
        options: [
          "Producing exactly zero trash",
          "A philosophy aiming to reduce waste sent to landfills and incinerators to as close to zero as possible",
          "Weighing your trash to ensure it's exactly zero pounds",
          "Only producing waste that weighs nothing"
        ],
        correctAnswerIndex: 1,
        explanation: "Zero waste is a philosophy that encourages redesigning resource life cycles so that all products are reused and no trash is sent to landfills, incinerators, or the ocean."
      },
      {
        id: "wm-10",
        question: "Which of these materials is generally the most efficiently recycled?",
        options: [
          "Plastic bags",
          "Styrofoam",
          "Aluminum cans",
          "Mixed paper"
        ],
        correctAnswerIndex: 2,
        explanation: "Aluminum cans are among the most efficiently recycled materials, with the ability to be recycled indefinitely without loss of quality and requiring only 5% of the energy to produce recycled aluminum versus new aluminum."
      }
    ]
  },
  nature: {
    title: "Biodiversity Quiz",
    description: "Test your knowledge about biodiversity and conservation efforts.",
    questions: [
      {
        id: "bd-1",
        question: "What is biodiversity?",
        options: [
          "The study of human life",
          "The variety of living organisms in a specific habitat or ecosystem",
          "The diversity of biological research methods",
          "A type of sustainable farming"
        ],
        correctAnswerIndex: 1,
        explanation: "Biodiversity refers to the variety of living species within a given area, including plants, animals, fungi, and microorganisms, as well as the ecosystems they form."
      },
      {
        id: "bd-2",
        question: "Which of the following is considered a biodiversity hotspot?",
        options: [
          "Antarctica",
          "Urban areas",
          "The Amazon Rainforest",
          "The open ocean"
        ],
        correctAnswerIndex: 2,
        explanation: "The Amazon Rainforest is one of the world's biodiversity hotspots, harboring the largest collection of living plant and animal species on Earth."
      },
      {
        id: "bd-3",
        question: "What is the primary cause of biodiversity loss globally?",
        options: [
          "Natural disasters",
          "Habitat destruction and fragmentation",
          "Old age of species",
          "Solar flares"
        ],
        correctAnswerIndex: 1,
        explanation: "Habitat destruction and fragmentation, primarily due to human activities like deforestation and urban development, is the leading cause of biodiversity loss worldwide."
      },
      {
        id: "bd-4",
        question: "What is an 'invasive species'?",
        options: [
          "A species that is endangered",
          "A non-native species that causes harm to the environment, economy, or human health",
          "A species that invades human homes",
          "A species that migrates seasonally"
        ],
        correctAnswerIndex: 1,
        explanation: "An invasive species is a non-native organism that, when introduced to a new environment, can spread and cause harm to native species, ecosystems, economic activities, or human health."
      },
      {
        id: "bd-5",
        question: "What is a 'keystone species'?",
        options: [
          "The most abundant species in an ecosystem",
          "A species that has gone extinct",
          "A species that has a disproportionately large effect on its environment relative to its abundance",
          "The species that was first discovered in an ecosystem"
        ],
        correctAnswerIndex: 2,
        explanation: "A keystone species has a disproportionately large effect on its environment compared to its abundance. Their removal can cause significant changes to their ecosystem."
      },
      {
        id: "bd-6",
        question: "Why are pollinators important for biodiversity?",
        options: [
          "They control pest populations",
          "They clean waterways",
          "They enable plant reproduction and food production",
          "They prevent soil erosion"
        ],
        correctAnswerIndex: 2,
        explanation: "Pollinators like bees, butterflies, and birds are crucial for the reproduction of about 90% of flowering plants and 75% of food crops, making them essential for biodiversity and food security."
      },
      {
        id: "bd-7",
        question: "What is conservation biology?",
        options: [
          "The study of how to conserve energy in biological systems",
          "The scientific study of nature with the aim of protecting species and their habitats",
          "The practice of preserving historical biological specimens",
          "The study of how to increase biological production"
        ],
        correctAnswerIndex: 1,
        explanation: "Conservation biology is the scientific study of the conservation and protection of nature, habitats, and biodiversity, with the aim of managing natural resources sustainably."
      },
      {
        id: "bd-8",
        question: "What is an 'ecological niche'?",
        options: [
          "A small habitat within a larger ecosystem",
          "The role and position a species has in its environment, including its habitat and interactions",
          "A decorative element in landscape design",
          "A specialized type of ecosystem"
        ],
        correctAnswerIndex: 1,
        explanation: "An ecological niche is the role and position a species has in its environment, including how it meets its needs for food and shelter, how it survives, and how it reproduces."
      },
      {
        id: "bd-9",
        question: "What is the purpose of wildlife corridors?",
        options: [
          "To display wildlife in zoos",
          "To connect fragmented habitats, allowing species to migrate and maintain genetic diversity",
          "To keep wildlife away from human settlements",
          "To provide walking paths through nature for humans"
        ],
        correctAnswerIndex: 1,
        explanation: "Wildlife corridors are areas of habitat connecting populations separated by human activities or structures. They allow an exchange of individuals between populations, helping maintain genetic diversity."
      },
      {
        id: "bd-10",
        question: "Why is biodiversity important for human well-being?",
        options: [
          "It's not important for humans, only for wildlife",
          "It provides ecosystem services like clean air, water, food, and medicine",
          "It only provides recreational benefits",
          "It only affects indigenous communities"
        ],
        correctAnswerIndex: 1,
        explanation: "Biodiversity provides essential ecosystem services that humans depend on, including clean air and water, food security, medicine sources, natural resource materials, and climate regulation."
      }
    ]
  },
  energy: {
    title: "Energy Efficiency Quiz",
    description: "Test your knowledge about energy conservation and renewable energy sources.",
    questions: [
      {
        id: "ee-1",
        question: "Which of these is a renewable energy source?",
        options: [
          "Natural gas",
          "Coal",
          "Wind power",
          "Petroleum"
        ],
        correctAnswerIndex: 2,
        explanation: "Wind power is a renewable energy source because it harnesses naturally replenishing wind energy and doesn't deplete finite resources."
      },
      {
        id: "ee-2",
        question: "What does 'energy efficiency' mean?",
        options: [
          "Using more energy to accomplish tasks",
          "Using less energy to provide the same service or output",
          "Turning off all electronic devices",
          "The total amount of energy produced"
        ],
        correctAnswerIndex: 1,
        explanation: "Energy efficiency means using less energy to perform the same task or provide the same service, thereby reducing energy waste."
      },
      {
        id: "ee-3",
        question: "Which household appliance typically uses the most energy?",
        options: [
          "Refrigerator",
          "Toaster",
          "LED light bulb",
          "Smartphone charger"
        ],
        correctAnswerIndex: 0,
        explanation: "Refrigerators typically use the most energy among common household appliances because they run continuously, though newer models are much more efficient than older ones."
      },
      {
        id: "ee-4",
        question: "What is a 'passive house'?",
        options: [
          "A house that doesn't require maintenance",
          "A house with extremely low energy use due to super-insulation and airtight construction",
          "A house without active security systems",
          "A house made from biodegradable materials"
        ],
        correctAnswerIndex: 1,
        explanation: "A passive house is an ultra-energy-efficient building that requires little energy for heating or cooling, achieved through superinsulation, airtightness, and passive solar strategies."
      },
      {
        id: "ee-5",
        question: "What is the main benefit of LED light bulbs compared to incandescent bulbs?",
        options: [
          "They contain fewer harmful materials",
          "They produce less heat",
          "They use significantly less energy for the same light output",
          "They are easier to recycle"
        ],
        correctAnswerIndex: 2,
        explanation: "LED bulbs use up to 90% less energy than incandescent bulbs while producing the same amount of light, making energy efficiency their most significant benefit."
      },
      {
        id: "ee-6",
        question: "What is the 'energy payback time' for solar panels?",
        options: [
          "The time it takes to install them",
          "The time it takes for them to generate as much energy as was used to make them",
          "The warranty period",
          "The time until they reach peak efficiency"
        ],
        correctAnswerIndex: 1,
        explanation: "Energy payback time is the time it takes for a solar panel to generate as much energy as was used in its production, typically 1-4 years depending on the technology and location."
      },
      {
        id: "ee-7",
        question: "What is 'phantom power' or 'vampire energy'?",
        options: [
          "Energy lost in power lines",
          "Power used by devices when they are turned off but still plugged in",
          "Energy used during thunderstorms",
          "A new type of renewable energy"
        ],
        correctAnswerIndex: 1,
        explanation: "Phantom power or vampire energy refers to the electricity consumed by electronic devices and appliances when they are switched off but still plugged into a power outlet."
      },
      {
        id: "ee-8",
        question: "Which transportation method typically has the lowest energy use per passenger-mile?",
        options: [
          "Private car with single occupant",
          "Commercial airplane",
          "Public bus or train",
          "SUV with single occupant"
        ],
        correctAnswerIndex: 2,
        explanation: "Public transportation like buses and trains generally have the lowest energy use per passenger-mile because they distribute the energy use across many passengers."
      },
      {
        id: "ee-9",
        question: "What is a 'smart grid'?",
        options: [
          "A grid-like pattern used in sustainable architecture",
          "An electricity supply network that uses digital technology to monitor and react to changes in usage",
          "A graph used to track energy consumption",
          "A grid of solar panels"
        ],
        correctAnswerIndex: 1,
        explanation: "A smart grid is an electricity network that uses digital technology to monitor and respond to local changes in electrical usage, improving efficiency and reliability."
      },
      {
        id: "ee-10",
        question: "What is the primary benefit of energy storage systems like batteries for renewable energy?",
        options: [
          "They make renewable energy cheaper",
          "They help address the intermittency of sources like wind and solar",
          "They generate additional energy",
          "They reduce the size of solar panels needed"
        ],
        correctAnswerIndex: 1,
        explanation: "Energy storage systems help address the intermittent nature of renewable sources like wind and solar by storing excess energy when production is high and releasing it when production is low."
      }
    ]
  },
  climate: {
    title: "Climate Action Quiz",
    description: "Test your knowledge about climate change and climate action strategies.",
    questions: [
      {
        id: "ca-1",
        question: "What is the primary greenhouse gas responsible for human-caused climate change?",
        options: [
          "Oxygen",
          "Nitrogen",
          "Carbon dioxide",
          "Hydrogen"
        ],
        correctAnswerIndex: 2,
        explanation: "Carbon dioxide (CO2) is the primary greenhouse gas contributing to human-caused climate change, largely due to fossil fuel burning and deforestation."
      },
      {
        id: "ca-2",
        question: "What is meant by the term 'carbon neutral'?",
        options: [
          "Having no carbon in a substance",
          "Achieving net-zero carbon emissions by balancing emissions with removal or offsets",
          "Only using carbon-free materials",
          "Having a neutral opinion about carbon policy"
        ],
        correctAnswerIndex: 1,
        explanation: "Carbon neutral means achieving net-zero carbon emissions by balancing the amount of carbon released with an equivalent amount sequestered, offset, or eliminated."
      },
      {
        id: "ca-3",
        question: "Which of these sectors typically produces the most greenhouse gas emissions globally?",
        options: [
          "Energy production and use",
          "Agriculture",
          "Waste management",
          "Tourism"
        ],
        correctAnswerIndex: 0,
        explanation: "Energy production and use (including electricity, heating, and transportation) typically accounts for about two-thirds of global greenhouse gas emissions."
      },
      {
        id: "ca-4",
        question: "What is the Paris Agreement?",
        options: [
          "A trade agreement between Paris and other cities",
          "An international treaty on climate change aiming to limit global warming",
          "A European transportation policy",
          "A French environmental protection law"
        ],
        correctAnswerIndex: 1,
        explanation: "The Paris Agreement is an international treaty adopted in 2015 aiming to limit global warming to well below 2°C (preferably 1.5°C) compared to pre-industrial levels."
      },
      {
        id: "ca-5",
        question: "What is 'climate adaptation'?",
        options: [
          "Changing the climate to suit human needs",
          "Adjusting to the current or expected future climate to reduce harm or exploit opportunities",
          "Moving people away from climate-affected areas",
          "Adapting climate science to be easier to understand"
        ],
        correctAnswerIndex: 1,
        explanation: "Climate adaptation refers to the process of adjusting to actual or expected climate change and its effects, seeking to moderate harm or exploit beneficial opportunities."
      },
      {
        id: "ca-6",
        question: "What is the difference between weather and climate?",
        options: [
          "They are different words for the same thing",
          "Weather is what you experience, climate is what you expect",
          "Weather affects the planet, climate affects just local areas",
          "Weather is always accurate, climate is a prediction"
        ],
        correctAnswerIndex: 1,
        explanation: "Weather refers to short-term atmospheric conditions in a specific place (what you experience day-to-day), while climate refers to the average weather patterns in a region over a longer period (what you expect based on history)."
      },
      {
        id: "ca-7",
        question: "What is a 'carbon sink'?",
        options: [
          "A sink made of carbon materials",
          "A natural environment that absorbs and stores carbon dioxide from the atmosphere",
          "A location where carbon is mined",
          "A tax on carbon emissions"
        ],
        correctAnswerIndex: 1,
        explanation: "A carbon sink is a natural reservoir, such as forests, oceans, or soil, that absorbs and stores carbon dioxide from the atmosphere, helping to reduce greenhouse gas concentrations."
      },
      {
        id: "ca-8",
        question: "What is meant by 'climate justice'?",
        options: [
          "Legal actions against climate deniers",
          "The fair treatment of all people with respect to climate change burdens, benefits, and policies",
          "Ensuring all climates get equal attention",
          "The scientific verification of climate data"
        ],
        correctAnswerIndex: 1,
        explanation: "Climate justice focuses on the fair treatment of all people regarding development, implementation, and enforcement of climate policies, recognizing that climate impacts affect vulnerable populations disproportionately."
      },
      {
        id: "ca-9",
        question: "What is 'carbon sequestration'?",
        options: [
          "Burning carbon-based fuels",
          "The process of capturing and storing atmospheric carbon dioxide",
          "Creating carbon-based products",
          "Measuring carbon in the atmosphere"
        ],
        correctAnswerIndex: 1,
        explanation: "Carbon sequestration is the process of capturing and storing atmospheric carbon dioxide, either through natural processes like forest growth or technological methods like direct air capture."
      },
      {
        id: "ca-10",
        question: "Which of the following best describes the concept of 'tipping points' in climate science?",
        options: [
          "Points where climate action becomes too expensive",
          "The amount to tip service workers in hot climates",
          "Thresholds that, when crossed, lead to large, often irreversible changes in the climate system",
          "Points where climate data becomes statistically significant"
        ],
        correctAnswerIndex:2,
        explanation: "In climate science, tipping points are thresholds where a small change can push a system into a completely new state, potentially causing rapid, dramatic, and irreversible changes to the climate system."
      }
    ]
  }