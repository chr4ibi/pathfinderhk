export type Question = {
  id: string;
  title: string;
  options: { value: string; label: string }[];
};

export const onboardingQuestions: Question[] = [
  {
    id: "work_style",
    title: "How do you prefer to work?",
    options: [
      { value: "independent", label: "Independently on focused tasks" },
      { value: "collaborative", label: "Highly collaboratively in a team" },
      { value: "mixed", label: "A mix of independent and collaborative work" },
    ],
  },
  {
    id: "environment",
    title: "What kind of environment do you thrive in?",
    options: [
      { value: "fast_paced", label: "Fast-paced and dynamic" },
      { value: "structured", label: "Structured and predictable" },
      { value: "flexible", label: "Flexible and autonomous" },
    ],
  },
  {
    id: "problem_solving",
    title: "How do you approach problem-solving?",
    options: [
      { value: "analytical", label: "Analyzing data and facts" },
      { value: "creative", label: "Brainstorming creative solutions" },
      { value: "practical", label: "Finding practical, hands-on fixes" },
    ],
  },
  {
    id: "motivation",
    title: "What motivates you the most?",
    options: [
      { value: "impact", label: "Making a tangible impact" },
      { value: "learning", label: "Continuous learning and growth" },
      { value: "recognition", label: "Recognition and career advancement" },
    ],
  },
  {
    id: "communication",
    title: "What is your primary communication style?",
    options: [
      { value: "direct", label: "Direct and to the point" },
      { value: "diplomatic", label: "Diplomatic and empathetic" },
      { value: "detailed", label: "Detailed and thorough" },
    ],
  }
];
