import React, { useState } from 'react';
import type { Flashcard } from '../../data/chapterMedia';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Shuffle,
  ListChecks,
} from 'lucide-react';

interface FlashcardDeckProps {
  cards: Flashcard[];
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ cards: initialCards }) => {
  const [cards, setCards] = useState<Flashcard[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  if (!cards || cards.length === 0) {
    return <div className="p-4 text-xs text-muted-foreground">No flashcards available.</div>;
  }

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleToggleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMasterCard = (cardId: string) => {
    if (!masteredIds.includes(cardId)) {
      setMasteredIds([...masteredIds, cardId]);
    }
    handleNext();
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const isMastered = masteredIds.includes(currentCard.id);

  return (
    <div className="flex flex-col gap-4 p-6 bg-card rounded-2xl border border-border shadow-xl">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-foreground tracking-wide">
            Interactive 3D Flashcard Deck
          </h3>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted border border-border transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" /> Shuffle
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
          style={{ width: `${(masteredIds.length / cards.length) * 100}%` }}
        />
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={handleToggleFlip}
        className="relative w-full min-h-[300px] cursor-pointer rounded-2xl perspective-1000 select-none group"
      >
        <div
          className={`relative w-full h-full min-h-[300px] duration-500 transition-transform transform-style-3d p-6 rounded-2xl border flex flex-col justify-between shadow-2xl ${
            isFlipped
              ? 'bg-gradient-to-br from-purple-950/80 via-card to-blue-950/60 border-primary/50 [transform:rotateY(180deg)]'
              : 'bg-gradient-to-br from-card via-muted/30 to-card border-border hover:border-primary/40'
          }`}
        >
          {/* FRONT SIDE */}
          {!isFlipped ? (
            <div className="flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                  Question / Term
                </span>
                {isMastered && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                    <CheckCircle className="w-4 h-4" /> Mastered
                  </span>
                )}
              </div>

              <div className="text-center py-6">
                <h4 className="text-xl font-bold text-foreground leading-snug">
                  {currentCard.front}
                </h4>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-primary" /> {currentCard.tip || 'Click card to reveal answer'}
                </span>
                <span className="text-primary font-semibold group-hover:underline">Click to Flip 🔄</span>
              </div>
            </div>
          ) : (
            /* BACK SIDE (Flipped 180 deg) */
            <div className="flex flex-col justify-between h-full space-y-4 [transform:rotateY(180deg)]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Answer & Key Takeaways
                </span>
                <span className="text-xs text-primary font-semibold">Click to Flip 🔄</span>
              </div>

              <div className="space-y-3 py-1">
                <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                  {currentCard.back}
                </p>

                {currentCard.formula && (
                  <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-xs font-mono text-purple-300">
                    📐 {currentCard.formula}
                  </div>
                )}

                {/* Key Important Points Bullet List */}
                {currentCard.keyPoints && currentCard.keyPoints.length > 0 && (
                  <div className="space-y-1.5 bg-muted/40 p-3 rounded-xl border border-border/50 text-xs">
                    <div className="font-bold text-primary mb-1 flex items-center gap-1.5">
                      <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
                      Important Takeaway Points:
                    </div>
                    {currentCard.keyPoints.map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-foreground/80 leading-normal">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end text-xs text-muted-foreground pt-1 border-t border-border/40">
                <span>Card ID: {currentCard.id}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation & Confidence Rating Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-secondary hover:bg-muted text-secondary-foreground rounded-xl border border-border transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleNext()}
            className="px-3 py-2 text-xs font-semibold bg-secondary hover:bg-muted text-secondary-foreground rounded-xl border border-border transition-colors"
          >
            Need Practice
          </button>
          <button
            onClick={() => handleMasterCard(currentCard.id)}
            className="flex items-center gap-1 px-4 py-2 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-600/20"
          >
            <CheckCircle className="w-4 h-4" /> Mastered (+20 XP)
          </button>
        </div>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-secondary hover:bg-muted text-secondary-foreground rounded-xl border border-border transition-colors"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
