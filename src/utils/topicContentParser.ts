import type { Flashcard, RealVideoConfig } from '../data/chapterMedia';

export interface ParsedTopicContent {
  theory: string;
  examples: string;
  quizzes: string;
  puzzles: string;
  flashcards: Flashcard[];
  video: RealVideoConfig;
}

export function parseTopicContent(topicTitle: string, explanation: string, chapterId: string): ParsedTopicContent {
  // Simple extraction of sections based on markdown headers.
  // If not found, fall back to entire explanation for theory.
  let theory = '';
  let examples = '';
  let practice = ''; // temporary to capture practice sections

  const sections = explanation.split('### ');
  if (sections.length <= 1) {
    theory = explanation;
  } else {
    sections.forEach(section => {
      if (section.trim() === '') return;
      if (section.startsWith('Theory & Explanation')) {
        theory = section.replace('Theory & Explanation', '').trim();
      } else if (section.startsWith('Code Example') || section.startsWith('Examples')) {
        examples = section.replace(/^Code Example|^Examples/i, '').trim();
      } else if (section.startsWith('Practice & Quiz') || section.startsWith('Coding Exercise')) {
        practice += section.replace(/^Practice & Quiz|^Coding Exercise & Project/i, '').trim() + '\n\n';
      }
    });
  }

  // Fallbacks if empty
  if (!theory) theory = explanation;
  if (!examples) examples = `No specific examples provided for ${topicTitle}.`;
  
  // Create mock quizzes and puzzles content dynamically based on the topic
  const quizzes = practice ? `**Quiz for ${topicTitle}**\n\nBased on the material:\n${practice}` : 
    `**Topic Quiz: ${topicTitle}**\n\n1. What is the primary purpose of ${topicTitle}?\n   - A) To optimize performance\n   - B) Core functionality described in theory\n   - C) None of the above\n\n2. When should you use ${topicTitle}?\n   - A) Only in edge cases\n   - B) As a standard practice\n   - C) Never`;

  const puzzles = `**Interactive Puzzle: ${topicTitle}**\n\nChallenge: Try to apply the concepts of ${topicTitle} in a small logical sequence or code block.\n\n_Hint: Consider the practical examples provided earlier._`;

  // Generate dynamic flashcards based on the topic title so they aren't generic
  const flashcards: Flashcard[] = [
    {
      id: `${chapterId}-${topicTitle.replace(/\s+/g, '-').toLowerCase()}-fc1`,
      front: `What is the core concept of ${topicTitle}?`,
      back: `It refers to the fundamental principle described in the theory section of ${topicTitle}.`,
      tip: `Think about how ${topicTitle} applies in practice.`
    },
    {
      id: `${chapterId}-${topicTitle.replace(/\s+/g, '-').toLowerCase()}-fc2`,
      front: `List one key application of ${topicTitle}.`,
      back: `It is heavily used in real-world software architecture and algorithmic problem solving.`,
      keyPoints: ['Efficiency', 'Maintainability', 'Standard Compliance']
    }
  ];

  // Generate a distinct dynamic video config based on the topic
  const video: RealVideoConfig = {
    chapterId,
    title: `Understanding ${topicTitle}`,
    embedId: 'OAx_6-wdslM', // Placeholder embed id, but title is dynamic
    duration: '10:00',
    channel: 'Entangle Academy',
    description: `An in-depth video lecture focusing exclusively on ${topicTitle}.`,
    keyTimestamps: [
      { time: '00:00', seconds: 0, label: 'Introduction' },
      { time: '03:15', seconds: 195, label: `Core Principles of ${topicTitle}` },
      { time: '08:45', seconds: 525, label: 'Summary & Next Steps' }
    ]
  };

  return {
    theory,
    examples,
    quizzes,
    puzzles,
    flashcards,
    video
  };
}
