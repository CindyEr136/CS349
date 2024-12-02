import { computed, signal } from "@preact/signals";
import { Command, UndoManager } from "./undo";

export type QuestionCard = {
  id: number;
  question: string;
  answer: string;
  other1: string;
  other2: string;
  done: boolean;
  options: string[];
};

export const mode = signal<"Start" | "List" | "Quiz" | "QuizDone" | "Edit">(
  "Start"
);

export const correct = signal<number>(0);

export const edit = signal<boolean>(false);

export const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const current = signal<number>(1);

export const initialQuestions = () => {
  for (let i = 0; i < 4; i++) {
    const q =
      sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
    const id = uniqueId++;
    const newQuestion = {
      id,
      question: q.question,
      answer: q.answer,
      other1: q.other1,
      other2: q.other2,
      done: false,
      options: shuffleArray([q.answer, q.other1, q.other2]),
    };
    questions.value = [...questions.value, newQuestion];
  }
};

export const cheat = signal<boolean>(false);

export const quizStarted = signal<Boolean>(false);

//#region state

// the array of all Questions
export const questions = signal<QuestionCard[]>([]);

export const num = computed(() => questions.value.length);

export const numDone = computed(
  () => questions.value.filter((q) => q.done).length
);

export const selected = signal<QuestionCard[]>([]);

// selected ID (for editing)
export const selectedID = signal<number | null>(null);

const undoManager = new UndoManager();

export function undo() {
  undoManager.undo();
}

export function redo() {
  undoManager.redo();
}

export const canUndo = undoManager.canUndo;

export const canRedo = undoManager.canRedo;

//#end region

//#region convenience functions

// Read
export const getQuestion = (id: number): QuestionCard | undefined => {
  return questions.value.find((q) => q.id === id);
};

//#endregion

//#region mutations

// very simple unique id generator
let uniqueId = 1;

// model "business logic" (CRUD)

// Create
export const addQuestion = () => {
  const q = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
  const id = uniqueId++;
  const newQuestion = {
    id,
    question: q.question,
    answer: q.answer,
    other1: q.other1,
    other2: q.other2,
    done: false,
    options: shuffleArray([q.answer, q.other1, q.other2]),
  };

  undoManager.execute({
    do: () => {
      questions.value = [...questions.value, newQuestion];
    },
    undo: () => {
      questions.value = questions.value.filter(
        (question) => question.id !== id
      );
    },
  } as Command);

  questions.value = [...questions.value, newQuestion];
  selectedID.value = null;
};

// Update
/*export const updateQuestion = (
  id: number,
  updates: {
    q?: string;
    a?: string;
    o1?: string;
    o2?: string;
    done?: boolean;
  }
) => {
  const original = questions.value.find((q) => q.id === id);
  if (!original) return;
  const selected = getQuestion(id);
  if (!selected) return;

  undoManager.execute({
    do: () => {
      selected.question =
        updates.q !== undefined ? updates.q : selected.question;
      selected.answer = updates.a !== undefined ? updates.a : selected.answer;
      selected.other1 =
        updates.o1 !== undefined ? updates.o1 : selected.other1;
      selected.other2 =
        updates.o2 !== undefined ? updates.o2 : selected.other2;
      selected.done =
        updates.done !== undefined ? updates.done : selected.done;
    },
    undo: () => {
      questions.value = questions.value.map((q) =>
        q.id === id ? original : q
      );
    },
  } as Command);

  selected.question = updates.q !== undefined ? updates.q : selected.question;
  selected.answer = updates.a !== undefined ? updates.a : selected.answer;
  selected.other1 = updates.o1 !== undefined ? updates.o1 : selected.other1;
  selected.other2 = updates.o2 !== undefined ? updates.o2 : selected.other2;
  selected.done = updates.done !== undefined ? updates.done : selected.done;

  questions.value = [...questions.value];
  selectedID.value = null;
};*/
export const updateQuestion = (
  id: number,
  updates: {
    q?: string;
    a?: string;
    o1?: string;
    o2?: string;
    done?: boolean;
  }
) => {
  const original = questions.value.find((q) => q.id === id);
  if (!original) return;
  const copy = { ...original };
  const selected = getQuestion(id);
  if (!selected) return;

  undoManager.execute({
    do: () => {
      if (updates.q !== undefined) selected.question = updates.q;
      if (updates.a !== undefined) selected.answer = updates.a;
      if (updates.o1 !== undefined) selected.other1 = updates.o1;
      if (updates.o2 !== undefined) selected.other2 = updates.o2;
      if (updates.done !== undefined) selected.done = updates.done;
      questions.value = [...questions.value];
    },
    undo: () => {
      questions.value = questions.value.map((q) => (q.id === id ? copy : q));
      questions.value = [...questions.value];
    },
  } as Command);

  if (updates.q !== undefined) selected.question = updates.q;
  if (updates.a !== undefined) selected.answer = updates.a;
  if (updates.o1 !== undefined) selected.other1 = updates.o1;
  if (updates.o2 !== undefined) selected.other2 = updates.o2;
  if (updates.done !== undefined) selected.done = updates.done;

  questions.value = [...questions.value];
  selectedID.value = null;
};

// Delete
export const deleteQuestions = (ids: number[]) => {
  const deletedQuestions = ids
    .map((id) => {
      const index = questions.value.findIndex((q) => q.id === id);
      if (index !== -1) {
        return { question: questions.value[index], index };
      }
      return null;
    })
    .filter(Boolean) as { question: QuestionCard; index: number }[];

  deletedQuestions.sort((a, b) => a.index - b.index);

  undoManager.execute({
    do: () => {
      questions.value = questions.value.filter((q) => !ids.includes(q.id));
    },
    undo: () => {
      const updatedQuestions = [...questions.value];
      deletedQuestions.forEach(({ question, index }) => {
        updatedQuestions.splice(index, 0, question);
      });
      questions.value = updatedQuestions;
    },
  } as Command);

  questions.value = questions.value.filter((q) => !ids.includes(q.id));

  if (selectedID.value && ids.includes(selectedID.value)) {
    selectedID.value = null;
  }
};

//#endregion

const sampleQuestions = [
  {
    question: "What is the capital of Canada?",
    answer: "Ottawa",
    other1: "Toronto",
    other2: "Vancouver",
  },
  {
    question: "Which planet is closest to the Sun?",
    answer: "Mercury",
    other1: "Venus",
    other2: "Earth",
  },
  {
    question: "Who wrote the play Romeo and Juliet?",
    answer: "William Shakespeare",
    other1: "Charles Dickens",
    other2: "Jane Austen",
  },
  {
    question: "What is the chemical symbol for water?",
    answer: "H2O",
    other1: "CO2",
    other2: "O2",
  },
  {
    question: "Which element has the atomic number 1?",
    answer: "Hydrogen",
    other1: "Helium",
    other2: "Oxygen",
  },
  {
    question: "What is the tallest mountain in the world?",
    answer: "Mount Everest",
    other1: "K2",
    other2: "Kangchenjunga",
  },
  {
    question: "What is the smallest planet in the solar system?",
    answer: "Mercury",
    other1: "Mars",
    other2: "Venus",
  },
  {
    question: "Who painted the Mona Lisa?",
    answer: "Leonardo da Vinci",
    other1: "Vincent van Gogh",
    other2: "Pablo Picasso",
  },
  {
    question: "What is the chemical symbol for gold?",
    answer: "Au",
    other1: "Ag",
    other2: "Pb",
  },
  {
    question: "Who discovered penicillin?",
    answer: "Alexander Fleming",
    other1: "Marie Curie",
    other2: "Isaac Newton",
  },
  {
    question: "What is the largest ocean on Earth?",
    answer: "Pacific Ocean",
    other1: "Atlantic Ocean",
    other2: "Indian Ocean",
  },
  {
    question: "Which country is home to the kangaroo?",
    answer: "Australia",
    other1: "South Africa",
    other2: "India",
  },
  {
    question: "Who wrote '1984'?",
    answer: "George Orwell",
    other1: "Aldous Huxley",
    other2: "Ray Bradbury",
  },
  {
    question: "What is the hardest natural substance?",
    answer: "Diamond",
    other1: "Gold",
    other2: "Iron",
  },
  {
    question: "What is the largest desert in the world?",
    answer: "Sahara Desert",
    other1: "Gobi Desert",
    other2: "Arctic Desert",
  },
  {
    question: "Who is the author of Harry Potter?",
    answer: "J.K. Rowling",
    other1: "J.R.R. Tolkien",
    other2: "George R.R. Martin",
  },
  {
    question: "What is the most spoken language?",
    answer: "Mandarin",
    other1: "Spanish",
    other2: "English",
  },
  {
    question: "Who invented the telephone?",
    answer: "Alexander Graham Bell",
    other1: "Thomas Edison",
    other2: "Nikola Tesla",
  },
  {
    question: "Which planet is known as the Red Planet?",
    answer: "Mars",
    other1: "Jupiter",
    other2: "Saturn",
  },
  {
    question: "What is the capital city of Japan?",
    answer: "Tokyo",
    other1: "Kyoto",
    other2: "Osaka",
  },
  {
    question: "Which organ pumps blood through the body?",
    answer: "Heart",
    other1: "Liver",
    other2: "Lungs",
  },
  {
    question: "Which planet has the most moons?",
    answer: "Jupiter",
    other1: "Saturn",
    other2: "Neptune",
  },
  {
    question: "What is the largest continent on Earth?",
    answer: "Asia",
    other1: "Africa",
    other2: "North America",
  },
  {
    question: "Who developed the theory of relativity?",
    answer: "Albert Einstein",
    other1: "Isaac Newton",
    other2: "Galileo Galilei",
  },
  {
    question: "Which element is for photosynthesis?",
    answer: "Carbon dioxide",
    other1: "Oxygen",
    other2: "Nitrogen",
  },
  {
    question: "Which famous ship sank in 1912?",
    answer: "Titanic",
    other1: "Lusitania",
    other2: "Bismarck",
  },
  {
    question: "What's the main ingredient in guacamole?",
    answer: "Avocado",
    other1: "Tomato",
    other2: "Onion",
  },
  {
    question: "Which gas do humans need to breathe?",
    answer: "Oxygen",
    other1: "Carbon dioxide",
    other2: "Helium",
  },
  {
    question: "Which planet is known for its rings?",
    answer: "Saturn",
    other1: "Uranus",
    other2: "Neptune",
  },
  {
    question: "Where is the Sahara Desert?",
    answer: "Africa",
    other1: "Asia",
    other2: "Australia",
  },
  {
    question: "Which is the largest mammal?",
    answer: "Blue whale",
    other1: "Elephant",
    other2: "Giraffe",
  },
  {
    question: "What is the hardest rock?",
    answer: "Diamond",
    other1: "Granite",
    other2: "Marble",
  },
  {
    question: "Which country is Paris the capital of?",
    answer: "France",
    other1: "Spain",
    other2: "Germany",
  },
  {
    question: "Which metal is liquid at room temperature?",
    answer: "Mercury",
    other1: "Lead",
    other2: "Copper",
  },
  {
    question: "Which planet is known as the Morning Star?",
    answer: "Venus",
    other1: "Mars",
    other2: "Jupiter",
  },
  {
    question: "What is the square root of 64?",
    answer: "8",
    other1: "6",
    other2: "4",
  },
  {
    question: "What is the largest island in the world?",
    answer: "Greenland",
    other1: "Australia",
    other2: "Madagascar",
  },
  {
    question: "What is the fastest land animal?",
    answer: "Cheetah",
    other1: "Lion",
    other2: "Horse",
  },
  {
    question: "Which city is known as the Big Apple?",
    answer: "New York City",
    other1: "Los Angeles",
    other2: "Chicago",
  },
  {
    question: "Who wrote the play Hamlet?",
    answer: "William Shakespeare",
    other1: "Charles Dickens",
    other2: "Oscar Wilde",
  },
  {
    question: "What is the chemical formula for table salt?",
    answer: "NaCl",
    other1: "H2O",
    other2: "CO2",
  },
  {
    question: "Which country has the largest population?",
    answer: "China",
    other1: "India",
    other2: "United States",
  },
  {
    question: "What is the national flower of Japan?",
    answer: "Cherry blossom",
    other1: "Rose",
    other2: "Lotus",
  },
  {
    question: "Which blood type is a universal donor?",
    answer: "O negative",
    other1: "A positive",
    other2: "AB positive",
  },
  {
    question: "What's the most abundant gas in our atmosphere?",
    answer: "Nitrogen",
    other1: "Oxygen",
    other2: "Carbon dioxide",
  },
  {
    question: "What is the currency of Japan?",
    answer: "Yen",
    other1: "Won",
    other2: "Baht",
  },
  {
    question: "Who was the first man to step on the Moon?",
    answer: "Neil Armstrong",
    other1: "Buzz Aldrin",
    other2: "Michael Collins",
  },
  {
    question: "What is the chemical symbol for iron?",
    answer: "Fe",
    other1: "Ir",
    other2: "I",
  },
  {
    question: "Which is the smallest bone in the human body?",
    answer: "Stapes",
    other1: "Femur",
    other2: "Fibula",
  },
  {
    question: "What is the capital city of Canada?",
    answer: "Ottawa",
    other1: "Toronto",
    other2: "Montreal",
  },
  {
    question: "Which organ in our body is for detoxification?",
    answer: "Liver",
    other1: "Kidneys",
    other2: "Pancreas",
  },
];
