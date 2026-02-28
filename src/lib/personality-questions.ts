import { PersonalityQuestion } from "@/types";

export const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  {
    id: "q1",
    question: "You're given a free month — what do you do?",
    options: [
      { label: "Travel solo and explore new cultures", value: "travel_solo" },
      { label: "Build a side project or startup idea", value: "build_project" },
      { label: "Volunteer for a cause I care about", value: "volunteer" },
      { label: "Take an intensive course or certification", value: "intensive_course" },
    ],
  },
  {
    id: "q2",
    question: "A colleague gets credit for your idea. What do you do?",
    options: [
      { label: "Calmly address it privately with them", value: "address_privately" },
      { label: "Bring it up in the next team meeting", value: "bring_up_meeting" },
      { label: "Let it go — outcomes matter more than credit", value: "let_it_go" },
      { label: "Discuss it with my manager", value: "escalate_manager" },
    ],
  },
  {
    id: "q3",
    question: "You have two job offers: one safe, one risky but exciting. You choose:",
    options: [
      { label: "The safe offer — stability enables long-term growth", value: "safe" },
      { label: "The risky offer — high risk, high reward", value: "risky" },
      { label: "Negotiate to make the safe offer more exciting", value: "negotiate" },
      { label: "Ask for more time to decide", value: "more_time" },
    ],
  },
  {
    id: "q4",
    question: "Your ideal work environment is:",
    options: [
      { label: "Collaborative team with constant interaction", value: "collaborative" },
      { label: "Independent deep work with clear goals", value: "independent" },
      { label: "Small startup with broad responsibilities", value: "startup" },
      { label: "Large organisation with structured career path", value: "large_org" },
    ],
  },
  {
    id: "q5",
    question: "When solving a difficult problem, you typically:",
    options: [
      { label: "Analyse data and map out all possibilities", value: "analytical" },
      { label: "Brainstorm creative solutions quickly", value: "creative" },
      { label: "Talk it through with others to get perspectives", value: "collaborative_problem" },
      { label: "Follow a proven framework or methodology", value: "framework" },
    ],
  },
  {
    id: "q6",
    question: "What drives you most in your career?",
    options: [
      { label: "Financial security and upward mobility", value: "financial" },
      { label: "Making a positive social or environmental impact", value: "social_impact" },
      { label: "Building innovative products or solutions", value: "innovation" },
      { label: "Becoming a recognised expert in my field", value: "expertise" },
    ],
  },
];
