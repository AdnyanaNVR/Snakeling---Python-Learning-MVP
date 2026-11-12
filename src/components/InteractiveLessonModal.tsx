import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LESSON_UNITS } from '../data/curriculum';
import { QuizQuestion } from '../types';
import { SnakelingMascot, MascotMood } from './SnakelingMascot';
import confetti from 'canvas-confetti';
import {
  X,
  Heart,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Zap,
  Gem,
  Infinity,
  Flame,
  Bug,
  Award,
  BookOpen,
  Terminal,
  AlertTriangle
} from 'lucide-react';

export const InteractiveLessonModal: React.FC = () => {
  const {
    selectedLessonId,
    setSelectedLessonId,
    setIsLessonActive,
    user,
    stats,
    loseHeart,
    finishLesson,
    refillHearts,
    playSound,
    showToast
  } = useApp();

  const isDemo = user.username.toLowerCase() === 'demo' || user.id === 'usr_demo_account';

  const lesson =
    (selectedLessonId && LESSON_UNITS.find((u) => u.id === selectedLessonId)) ||
    LESSON_UNITS.find((u) => u.id === 'module-01') ||
    LESSON_UNITS[0];
  // Helper function to shuffle an array uniformly (Fisher-Yates)
  const shuffleArray = <T,>(array: readonly T[] | T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Helper to shuffle options and ensure correct answer is not stuck at the first index
  const shuffleOptions = (options: string[], correctVal?: string): string[] => {
    if (!options || options.length <= 1) return options ? [...options] : [];
    const shuffled = shuffleArray(options);

    // If correct answer randomly still lands at index 0 and options > 1,
    // swap with a random non-zero index to ensure it truly randomizes away from the 1st position
    if (correctVal && shuffled.length > 1 && shuffled[0] === correctVal) {
      const swapIdx = 1 + Math.floor(Math.random() * (shuffled.length - 1));
      [shuffled[0], shuffled[swapIdx]] = [shuffled[swapIdx], shuffled[0]];
    }
    return shuffled;
  };

  // Prepare questions with randomized options before questions are loaded
  const prepareLessonQuestions = (rawQuestions: QuizQuestion[]): QuizQuestion[] => {
    return rawQuestions.map((q) => {
      const qCopy: QuizQuestion = { ...q };

      // 1. Resolve string value of correct answer
      let correctVal: string | undefined = undefined;
      if (typeof qCopy.correctAnswer === 'string') {
        correctVal = qCopy.correctAnswer;
      } else if (typeof qCopy.answerIndex === 'number' && qCopy.options && qCopy.options[qCopy.answerIndex]) {
        correctVal = qCopy.options[qCopy.answerIndex];
        qCopy.correctAnswer = correctVal;
      } else if (qCopy.acceptedAnswers && qCopy.acceptedAnswers.length > 0) {
        correctVal = qCopy.acceptedAnswers[0];
        if (!qCopy.correctAnswer) {
          qCopy.correctAnswer = correctVal;
        }
      }

      // 2. Randomly shuffle options for MC, Fill in the Blank, and Code Predict
      if (qCopy.options && qCopy.options.length > 1) {
        const shuffled = shuffleOptions(qCopy.options, correctVal);
        qCopy.options = shuffled;
        if (correctVal) {
          const newIdx = shuffled.indexOf(correctVal);
          if (newIdx !== -1) {
            qCopy.answerIndex = newIdx;
          }
        }
      }

      // 3. Randomly shuffle line bank for reorder questions
      if (qCopy.lines && qCopy.lines.length > 1) {
        const allLines = [...qCopy.lines, ...(qCopy.distractors || [])];
        let shuffledLines = shuffleArray(allLines);
        if (shuffledLines.join('\n') === qCopy.lines.join('\n') && shuffledLines.length > 1) {
          [shuffledLines[0], shuffledLines[1]] = [shuffledLines[1], shuffledLines[0]];
        }
        qCopy.availableLines = shuffledLines;
      }

      return qCopy;
    });
  };

  // Questions state: options are randomized before the questions load
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    prepareLessonQuestions(lesson.questions)
  );

  // Lesson flow states
  const [showTipCard, setShowTipCard] = useState<boolean>(() => Boolean(lesson.tip && !lesson.skipTipCard));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // User input states
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [selectedBuggyLineIndex, setSelectedBuggyLineIndex] = useState<number | null>(null);

  // Validation & status
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mascotMood, setMascotMood] = useState<MascotMood>('thinking');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentQ = questions[currentIndex] || questions[0];

  // Reset input when question changes
  useEffect(() => {
    setSelectedOption(null);
    setSelectedTokens([]);
    setSelectedLines([]);
    setSelectedBuggyLineIndex(null);
    setIsAnswerChecked(false);
    setIsCorrect(null);
    setMascotMood('thinking');
  }, [currentIndex]);

  // Reset whole modal and reshuffle options when selectedLessonId or lesson changes
  useEffect(() => {
    setQuestions(prepareLessonQuestions(lesson.questions));
    setCurrentIndex(0);
    setCorrectCount(0);
    setIsCompleted(false);
    setShowTipCard(Boolean(lesson.tip && !lesson.skipTipCard));
  }, [selectedLessonId, lesson.id]);

  const handleSelectOption = (opt: string) => {
    if (isAnswerChecked) return;
    playSound('click');
    setSelectedOption(opt);
  };

  const handleToggleToken = (token: string) => {
    if (isAnswerChecked) return;
    playSound('click');
    if (selectedTokens.includes(token)) {
      setSelectedTokens((prev) => prev.filter((t) => t !== token));
    } else {
      setSelectedTokens((prev) => [...prev, token]);
    }
  };

  const handleToggleLine = (line: string) => {
    if (isAnswerChecked) return;
    playSound('click');
    if (selectedLines.includes(line)) {
      setSelectedLines((prev) => prev.filter((l) => l !== line));
    } else {
      setSelectedLines((prev) => [...prev, line]);
    }
  };

  const handleSelectBuggyLine = (idx: number) => {
    if (isAnswerChecked) return;
    playSound('click');
    setSelectedBuggyLineIndex(idx);
  };

  const handleCheckAnswer = () => {
    if (isAnswerChecked) {
      // Continue to next question or complete
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Complete the lesson!
        setIsCompleted(true);
        setMascotMood('celebrate');
        finishLesson(lesson.id, lesson.xpReward, lesson.gemReward);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }
      }
      return;
    }

    // Checking logic
    let correct = false;

    if (currentQ.type === 'code_order' || currentQ.type === 'ro') {
      if (currentQ.lines && currentQ.lines.length > 0) {
        const expected = currentQ.lines.join('\n').trim();
        const actual = selectedLines.join('\n').trim();
        correct = expected === actual;
      } else {
        const expected = Array.isArray(currentQ.correctAnswer)
          ? currentQ.correctAnswer.join(' ')
          : String(currentQ.correctAnswer);
        const actual = selectedTokens.join(' ');
        correct = expected === actual;
      }
    } else if (currentQ.type === 'sb') {
      correct = selectedBuggyLineIndex === currentQ.buggyLineIndex;
    } else if (currentQ.type === 'fb') {
      if (currentQ.acceptedAnswers && currentQ.acceptedAnswers.length > 0) {
        correct = currentQ.acceptedAnswers.includes(selectedOption || '');
      } else if (currentQ.correctAnswer !== undefined) {
        correct = String(selectedOption).trim() === String(currentQ.correctAnswer).trim();
      } else if (typeof currentQ.answerIndex === 'number' && currentQ.options) {
        correct = selectedOption === currentQ.options[currentQ.answerIndex];
      }
    } else {
      // mc or multiple_choice or code_predict
      if (currentQ.correctAnswer !== undefined) {
        correct = String(selectedOption).trim() === String(currentQ.correctAnswer).trim();
      } else if (typeof currentQ.answerIndex === 'number' && currentQ.options) {
        correct = selectedOption === currentQ.options[currentQ.answerIndex];
      }
    }

    setIsAnswerChecked(true);
    setIsCorrect(correct);

    if (correct) {
      setCorrectCount((prev) => prev + 1);
      playSound('correct');
      setMascotMood('excited');
    } else {
      playSound('wrong');
      setMascotMood('sad');
      if (!user.isPro) {
        loseHeart();
      }
    }
  };

  // Keyboard shortcut: Enter to check/continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (showTipCard) {
          setShowTipCard(false);
          playSound('click');
          return;
        }

        const canCheckNow =
          currentQ.type === 'code_order' || currentQ.type === 'ro'
            ? currentQ.lines
              ? selectedLines.length > 0
              : selectedTokens.length > 0
            : currentQ.type === 'sb'
            ? selectedBuggyLineIndex !== null
            : selectedOption !== null;

        if (!isAnswerChecked) {
          if (canCheckNow) handleCheckAnswer();
        } else {
          handleCheckAnswer();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isAnswerChecked,
    showTipCard,
    selectedOption,
    selectedTokens,
    selectedLines,
    selectedBuggyLineIndex,
    currentQ
  ]);

  // If user runs out of hearts
  if (stats.hearts <= 0 && !isCompleted && !user.isPro) {
    return (
      <div className="fixed inset-0 z-50 bg-[#121212] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#171717] border-2 border-[#2e2e2e] rounded-3xl p-6 text-center space-y-6 shadow-2xl">
          <SnakelingMascot mood="sad" size="lg" className="mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-brand font-bold text-white">Nyawa Kamu Habis!</h2>
            <p className="text-sm text-[#b4b4b4]">
              Jangan berkecil hati! Pulihkan 5 nyawa dengan 100 Gems untuk lanjut belajar sekarang.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                if (refillHearts()) {
                  // resumed with 5 hearts
                }
              }}
              className="tactile-btn-primary w-full py-3.5 rounded-xl font-brand font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-current text-[#ef4444]" />
              <span>{isDemo ? 'Isi Ulang 5 Nyawa (Gratis Demo)' : 'Isi Ulang 5 Nyawa (100 Gems)'}</span>
            </button>
            <button
              onClick={() => setIsLessonActive(false)}
              className="tactile-btn-secondary w-full py-3 rounded-xl font-brand font-bold text-sm uppercase tracking-wider text-[#b4b4b4]"
            >
              Kembali Ke Peta Belajar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 1. TIP CARD VIEW (Duolingo style pre-quiz primer)
  if (showTipCard && lesson.tip) {
    return (
      <div className="fixed inset-0 z-50 bg-[#121212] flex flex-col justify-between select-none animate-in fade-in duration-200">
        <header className="w-full max-w-2xl mx-auto px-6 py-4 flex items-center justify-between shrink-0">
          <button
            onClick={() => setIsLessonActive(false)}
            className="text-[#898989] hover:text-white transition-colors p-1.5 rounded-xl hover:bg-[#1f1f1f] cursor-pointer"
            aria-label="Tutup Pelajaran"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-6" />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full mx-auto px-4 sm:px-6 py-2 overflow-hidden min-h-0">
          <div className="w-full max-h-[calc(100vh-155px)] bg-[#171717] border-2 border-[#2e2e2e] rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col overflow-hidden">
            {/* Scrollable Content Container */}
            <div className="overflow-y-auto pr-1.5 sm:pr-2 space-y-6 flex-1 scroll-smooth">
              {/* Title Section */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-brand font-black text-white tracking-tight">
                  {lesson.tip.title}
                </h2>
                <div className="h-1 w-12 bg-[#3ecf8e] rounded-full mt-2.5" />
              </div>

              {/* Main Body */}
              <p className="text-sm sm:text-base text-[#d4d4d4] leading-relaxed">
                {lesson.tip.body}
              </p>

              {/* Primary Code Example Box with Simulated Terminal Output */}
              {lesson.tip.codeExample && (
                <div className="bg-[#0e0e0e] border border-[#2e2e2e] rounded-2xl overflow-hidden shadow-inner">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-[#141414] border-b border-[#242424] text-[11px] font-mono text-[#898989]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3ecf8e]/80 inline-block" />
                      <span className="text-[#a3a3a3] ml-1">contoh_kode.py</span>
                    </div>
                    <span className="text-[10px] text-[#3ecf8e] uppercase font-bold tracking-wider">Python 3</span>
                  </div>
                  <div className="p-4 font-mono text-sm">
                    <pre className="whitespace-pre-wrap leading-relaxed text-[#3ecf8e]">
                      <code>{lesson.tip.codeExample}</code>
                    </pre>
                  </div>
                  {lesson.tip.outputExample && (
                    <div className="border-t border-[#222222] bg-[#090909] px-4 py-3 font-mono text-xs">
                      <div className="text-[10px] uppercase font-bold text-[#898989] mb-1.5 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-[#3ecf8e]" />
                        <span>Hasil Output Terminal:</span>
                      </div>
                      <pre className="text-[#e2e8f0] whitespace-pre-wrap leading-relaxed">
                        <code>{lesson.tip.outputExample}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Detailed Explanation Breakdown Sections */}
              {lesson.tip.sections && lesson.tip.sections.length > 0 && (
                <div className="space-y-4 pt-1">
                  {lesson.tip.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-2xl p-4 sm:p-5 space-y-3"
                    >
                      <h3 className="text-sm sm:text-base font-brand font-bold text-[#fafafa] flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-[#3ecf8e]/15 text-[#3ecf8e] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{sec.heading}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-[#b4b4b4] leading-relaxed">
                        {sec.explanation}
                      </p>

                      {sec.codeSnippet && (
                        <div className="bg-[#0e0e0e] border border-[#282828] rounded-xl p-3 font-mono text-xs shadow-inner">
                          <pre className="whitespace-pre-wrap text-[#3ecf8e] leading-relaxed">
                            <code>{sec.codeSnippet}</code>
                          </pre>
                          {sec.outputSnippet && (
                            <div className="mt-2 pt-2 border-t border-[#222] text-[#898989] flex items-start gap-1.5 text-[11px]">
                              <span className="text-[#3ecf8e] font-bold">»</span>
                              <span className="text-[#d4d4d4]">{sec.outputSnippet}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Catatan Penting & Kesalahan Umum (Important Pitfalls) */}
              {lesson.tip.notes && lesson.tip.notes.length > 0 && (
                <div className="bg-[#ef4444]/10 border border-[#ef4444]/25 rounded-2xl p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-sm font-brand font-bold text-[#f87171]">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-[#ef4444]" />
                    <span>Catatan Penting & Kesalahan Umum:</span>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-[#d4d4d4] list-disc list-inside leading-relaxed pl-1">
                    {lesson.tip.notes.map((note, nIdx) => (
                      <li key={nIdx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </main>

        <div className="w-full border-t border-[#2e2e2e] bg-[#121212] py-4 sm:py-5 px-6 shrink-0">
          <div className="max-w-2xl mx-auto flex justify-end">
            <button
              onClick={() => {
                playSound('click');
                setShowTipCard(false);
              }}
              className="tactile-btn-primary w-full sm:w-auto min-w-[200px] py-3.5 px-6 rounded-xl font-brand font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>MULAI LATIHAN</span>
              <ArrowRight className="w-4 h-4 stroke-[2.8]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. COMPLETION SCREEN
  if (isCompleted) {
    const accuracy = Math.round((correctCount / Math.max(1, questions.length)) * 100);

    return (
      <div className="fixed inset-0 z-50 bg-[#121212] flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-lg bg-[#171717] border-2 border-[#3ecf8e]/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#3ecf8e] to-[#38bdf8]" />

          <SnakelingMascot mood="celebrate" size="xl" className="mx-auto mascot-float" />

          <div className="space-y-1">
            <h2 className="text-3xl font-brand font-extrabold text-white tracking-tight">
              Luar Biasa, Kamu Hebat!
            </h2>
            <p className="text-xs text-[#898989]">
              Modul {lesson.lessonOrder}: {lesson.title} selesai
            </p>
          </div>

          {/* Reward cards with XP, Akurasi, Gems, Streak */}
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
            {/* XP */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#3ecf8e]/15 to-transparent border border-[#3ecf8e]/30 flex flex-col items-center">
              <div className="w-7 h-7 rounded-lg bg-[#3ecf8e]/20 text-[#3ecf8e] flex items-center justify-center mb-1">
                <Zap className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-[9px] font-brand font-bold uppercase text-[#3ecf8e]">TOTAL XP</span>
              <span className="text-lg font-brand font-black text-white mt-0.5">+{lesson.xpReward}</span>
            </div>

            {/* AKURASI */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#a855f7]/15 to-transparent border border-[#a855f7]/30 flex flex-col items-center">
              <div className="w-7 h-7 rounded-lg bg-[#a855f7]/20 text-[#a855f7] flex items-center justify-center mb-1">
                <Award className="w-3.5 h-3.5 stroke-[2.2]" />
              </div>
              <span className="text-[9px] font-brand font-bold uppercase text-[#a855f7]">AKURASI</span>
              <span className="text-lg font-brand font-black text-white mt-0.5">{accuracy}%</span>
            </div>

            {/* GEMS */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#38bdf8]/15 to-transparent border border-[#38bdf8]/30 flex flex-col items-center">
              <div className="w-7 h-7 rounded-lg bg-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center mb-1">
                <Gem className="w-3.5 h-3.5 stroke-[2.2] fill-[#38bdf8]/30" />
              </div>
              <span className="text-[9px] font-brand font-bold uppercase text-[#38bdf8]">GEMS</span>
              <span className="text-lg font-brand font-black text-white mt-0.5">+{lesson.gemReward}</span>
            </div>

            {/* STREAK */}
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#ff9600]/15 to-transparent border border-[#ff9600]/30 flex flex-col items-center">
              <div className="w-7 h-7 rounded-lg bg-[#ff9600]/20 text-[#ff9600] flex items-center justify-center mb-1">
                <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
              </div>
              <span className="text-[9px] font-brand font-bold uppercase text-[#ff9600]">STREAK</span>
              <span className="text-lg font-brand font-black text-white mt-0.5">{stats.streak} HARI</span>
            </div>
          </div>

          {/* Action Buttons */}
          {(() => {
            const currentLessonIndex = LESSON_UNITS.findIndex((u) => u.id === lesson.id);
            const nextLesson = LESSON_UNITS[currentLessonIndex + 1];

            const handleNextLesson = () => {
              playSound('click');
              showToast(`+${lesson.xpReward} XP dan +${lesson.gemReward} Gems ditambahkan!`);
              if (nextLesson) {
                setSelectedLessonId(nextLesson.id);
                setIsCompleted(false);
                setCurrentIndex(0);
                setCorrectCount(0);
                setShowTipCard(Boolean(nextLesson.tip && !nextLesson.skipTipCard));
                setSelectedOption(null);
                setSelectedTokens([]);
                setSelectedLines([]);
                setSelectedBuggyLineIndex(null);
                setIsAnswerChecked(false);
                setIsCorrect(null);
                setMascotMood('thinking');
              } else {
                setIsLessonActive(false);
              }
            };

            const handleReturnToMap = () => {
              playSound('click');
              showToast(`+${lesson.xpReward} XP dan +${lesson.gemReward} Gems ditambahkan!`);
              setIsLessonActive(false);
            };

            return (
              <div className="flex flex-col gap-3 pt-2">
                {nextLesson && (
                  <button
                    onClick={handleNextLesson}
                    className="tactile-btn-primary w-full py-3.5 rounded-2xl font-brand font-black text-sm uppercase tracking-wider text-[#0e0e0e] flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>PELAJARAN BERIKUTNYA</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.8]" />
                  </button>
                )}
                <button
                  onClick={handleReturnToMap}
                  className="tactile-btn-secondary w-full py-3 rounded-2xl font-brand font-bold text-xs uppercase tracking-wider text-[#b4b4b4] hover:text-white cursor-pointer"
                >
                  KEMBALI KE PETA BELAJAR
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  // 3. QUIZ SCREEN
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const canCheck =
    currentQ.type === 'code_order' || currentQ.type === 'ro'
      ? currentQ.lines
        ? selectedLines.length > 0
        : selectedTokens.length > 0
      : currentQ.type === 'sb'
      ? selectedBuggyLineIndex !== null
      : selectedOption !== null;

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] flex flex-col justify-between select-none">
      {/* Top Header Bar */}
      <header className="w-full max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="text-[#898989] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#1f1f1f] cursor-pointer"
            aria-label="Tutup Pelajaran"
          >
            <X className="w-6 h-6" />
          </button>
          {lesson.tip && (
            <button
              onClick={() => {
                playSound('click');
                setShowTipCard(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1c1b1b] hover:bg-[#252525] border border-[#2e2e2e] text-[#b4b4b4] hover:text-[#3ecf8e] text-xs font-bold transition-colors cursor-pointer shrink-0"
              title="Buka Penjelasan Materi"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#3ecf8e]" />
              <span className="hidden sm:inline">Materi</span>
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="flex-1 h-3.5 bg-[#242424] rounded-full overflow-hidden p-0.5 border border-[#2e2e2e]">
          <div
            className="h-full bg-gradient-to-r from-[#3ecf8e] to-[#34b27b] rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(62,207,142,0.4)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Hearts Indicator */}
        <div
          className={`flex items-center gap-2 font-brand font-bold text-sm text-[#ef4444] px-3 py-1.5 rounded-xl ${
            user.isPro
              ? 'bg-[#ef4444]/15 border border-[#ef4444]/40 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
              : 'bg-[#ef4444]/10 border border-[#ef4444]/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
          }`}
          title={user.isPro ? 'Nyawa Tak Terbatas (Snakeling Pro)' : `${stats.hearts} Nyawa Tersisa`}
        >
          <Heart className="w-5 h-5 fill-[#ef4444] text-[#ef4444] drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
          {user.isPro ? (
            <div className="flex items-center justify-center" title="Nyawa Tak Terbatas">
              <Infinity
                className="w-5 h-5 text-[#ef4444] stroke-[3] drop-shadow-[0_0_8px_rgba(239,68,68,0.85)]"
                aria-label="Nyawa Tak Terbatas"
              />
            </div>
          ) : (
            <span className="text-base text-white font-extrabold">{stats.hearts}</span>
          )}
        </div>
      </header>

      {/* Main Question Arena */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full mx-auto px-6 py-4 overflow-y-auto">
        <div className="w-full space-y-5">
          {/* Mascot with Question Prompt */}
          <div className="flex items-start gap-4">
            <SnakelingMascot mood={mascotMood} size="md" className="shrink-0 -mt-2" />
            <div className="flex-1 bg-[#171717] border border-[#2e2e2e] rounded-2xl p-4 relative shadow-lg">
              <div className="absolute top-6 -left-2 w-0 h-0 border-y-6 border-y-transparent border-r-8 border-r-[#171717]" />
              <h2 className="text-base sm:text-lg font-brand font-bold text-white leading-snug">
                {currentQ.prompt}
              </h2>
            </div>
          </div>

          {/* Optional Code Snippet block (For MC or Code Predict) */}
          {(currentQ.code || currentQ.codeSnippet) && (
            <div className="bg-[#0e0e0e] border border-[#2e2e2e] rounded-xl p-4 font-mono text-sm text-[#fafafa] shadow-inner">
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-[#242424] text-[11px] text-[#898989]">
                <span className="w-2 h-2 rounded-full bg-[#3ecf8e]" />
                <span>python.py</span>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed">
                <code>{currentQ.code || currentQ.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Fill the Blank preview box */}
          {currentQ.type === 'fb' && currentQ.codeWithBlank && (
            <div className="bg-[#0e0e0e] border border-[#2e2e2e] rounded-xl p-4 font-mono text-sm shadow-inner">
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-[#242424] text-[11px] text-[#898989]">
                <span className="w-2 h-2 rounded-full bg-[#3ecf8e]" />
                <span>lengkapi_kode.py</span>
              </div>
              <div className="text-base leading-loose whitespace-pre-wrap font-mono">
                {currentQ.codeWithBlank.split('___').map((part, pIdx, arr) => (
                  <React.Fragment key={pIdx}>
                    <span className="text-[#fafafa]">{part}</span>
                    {pIdx < arr.length - 1 && (
                      <span
                        className={`inline-block px-3 py-1 mx-1.5 rounded-lg border-2 font-bold font-mono text-sm transition-all ${
                          selectedOption
                            ? 'bg-[#3ecf8e]/20 border-[#3ecf8e] text-[#3ecf8e] shadow-[0_0_10px_rgba(62,207,142,0.3)]'
                            : 'bg-[#202020] border-dashed border-[#555] text-[#888]'
                        }`}
                      >
                        {selectedOption || '...'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Multiple Choice & Fill Blank Option Cards */}
          {(currentQ.type === 'mc' ||
            currentQ.type === 'multiple_choice' ||
            currentQ.type === 'code_predict' ||
            currentQ.type === 'fb' ||
            currentQ.type === 'fill_blank') &&
            currentQ.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {currentQ.options.map((opt) => {
                  const isSelected = selectedOption === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(opt)}
                      disabled={isAnswerChecked}
                      className={`w-full p-3.5 rounded-2xl border-2 text-left font-medium text-sm transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#3ecf8e]/10 border-[#3ecf8e] text-white shadow-[0_0_15px_rgba(62,207,142,0.15)]'
                          : 'bg-[#171717] border-[#2e2e2e] text-[#fafafa] hover:bg-[#202020] hover:border-[#393939]'
                      }`}
                    >
                      <span className="font-mono text-sm">{opt}</span>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#3ecf8e] bg-[#3ecf8e]' : 'border-[#444444]'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-[#0e0e0e]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

          {/* Reorder: Line-Based Reorder */}
          {(currentQ.type === 'ro' || currentQ.type === 'code_order') && currentQ.lines && (
            <div className="space-y-4 pt-1">
              <div className="min-h-24 p-3.5 rounded-2xl border-2 border-dashed border-[#393939] bg-[#141414] flex flex-col gap-2">
                <span className="text-[11px] font-brand font-bold uppercase tracking-wider text-[#898989] mb-1">
                  Urutan Baris Kode (Ketuk untuk menghapus):
                </span>
                {selectedLines.length === 0 ? (
                  <span className="text-xs text-[#666] italic py-3 text-center">
                    Ketuk baris di bawah untuk menyusun urutan kode yang tepat
                  </span>
                ) : (
                  selectedLines.map((line, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleToggleLine(line)}
                      disabled={isAnswerChecked}
                      className="w-full text-left px-4 py-2.5 rounded-xl bg-[#202020] hover:bg-[#262626] border border-[#3ecf8e]/50 text-white font-mono text-sm flex items-center gap-3 cursor-pointer shadow-sm"
                    >
                      <span className="w-5 h-5 rounded-md bg-[#3ecf8e] text-[#0e0e0e] text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="flex-1">{line}</span>
                    </button>
                  ))
                )}
              </div>

              {/* Available lines bank */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-brand font-bold uppercase tracking-wider text-[#898989]">
                  Pilihan Baris Tersedia:
                </span>
                {(currentQ.availableLines || currentQ.lines).map((line, idx) => {
                  const isUsed = selectedLines.includes(line);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleToggleLine(line)}
                      disabled={isUsed || isAnswerChecked}
                      className={`w-full text-left px-4 py-3 rounded-xl font-mono text-sm transition-all border ${
                        isUsed
                          ? 'opacity-20 cursor-not-allowed bg-[#181818] border-[#252525] text-[#666]'
                          : 'tactile-btn-secondary text-white font-medium border-[#333] cursor-pointer'
                      }`}
                    >
                      {line}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spot the Bug (`sb`) Interactive Line Selector */}
          {currentQ.type === 'sb' && currentQ.lines && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2 text-xs font-brand font-bold uppercase tracking-wider text-[#ef4444]">
                <Bug className="w-4 h-4" />
                <span>Klik tepat 1 baris yang mengandung bug/kesalahan:</span>
              </div>
              <div className="bg-[#0e0e0e] border border-[#2e2e2e] rounded-2xl overflow-hidden shadow-inner">
                {currentQ.lines.map((line, idx) => {
                  const isSelected = selectedBuggyLineIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectBuggyLine(idx)}
                      disabled={isAnswerChecked}
                      className={`w-full text-left px-4 py-3 flex items-center gap-4 font-mono text-sm border-b last:border-b-0 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#ef4444]/20 border-[#ef4444]/60 text-white'
                          : 'border-[#1f1f1f] hover:bg-[#1a1a1a] text-[#d4d4d4]'
                      }`}
                    >
                      <span
                        className={`w-6 text-right text-xs select-none ${
                          isSelected ? 'text-[#ef4444] font-bold' : 'text-[#666]'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="flex-1 whitespace-pre">{line}</span>
                      {isSelected && (
                        <div className="px-2 py-0.5 rounded bg-[#ef4444] text-white text-[10px] font-brand font-bold uppercase">
                          Bug
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Verification Drawer */}
      <div
        className={`w-full border-t transition-colors duration-200 py-5 px-6 ${
          !isAnswerChecked
            ? 'bg-[#121212] border-[#2e2e2e]'
            : isCorrect
            ? 'bg-[#13271d] border-[#3ecf8e]/40'
            : 'bg-[#2b1416] border-[#ef4444]/40'
        }`}
      >
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Feedback message when checked */}
          {isAnswerChecked ? (
            <div className="flex items-start gap-3 w-full sm:w-auto">
              {isCorrect ? (
                <div className="w-10 h-10 rounded-full bg-[#3ecf8e]/20 text-[#3ecf8e] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#ef4444]/20 text-[#ef4444] flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
              )}
              <div className="space-y-0.5">
                <h4 className={`text-base font-brand font-bold ${isCorrect ? 'text-[#3ecf8e]' : 'text-[#ef4444]'}`}>
                  {isCorrect ? 'Luar biasa! Benar!' : 'Kurang tepat'}
                </h4>
                <p className="text-xs text-[#b4b4b4] max-w-md">
                  {currentQ.explanation}
                </p>
                {currentQ.type === 'sb' && currentQ.fixedLine && (
                  <p className="text-xs font-mono text-[#3ecf8e] mt-1">
                    Perbaikan: <code className="bg-black/40 px-1.5 py-0.5 rounded">{currentQ.fixedLine}</code>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden sm:block text-xs text-[#898989] font-mono">
              Tekan <kbd className="px-1.5 py-0.5 rounded bg-[#242424] border border-[#393939] text-[#fafafa]">Enter ↵</kbd> untuk periksa
            </div>
          )}

          {/* Action button */}
          <button
            onClick={handleCheckAnswer}
            disabled={!canCheck && !isAnswerChecked}
            className={`w-full sm:w-auto min-w-[160px] py-3.5 px-6 rounded-xl font-brand font-black text-sm uppercase tracking-wider transition-all cursor-pointer ${
              !isAnswerChecked
                ? 'tactile-btn-primary'
                : isCorrect
                ? 'bg-[#3ecf8e] text-[#0e0e0e] shadow-[0_4px_0_#1b6343] hover:bg-[#34b27b]'
                : 'bg-[#ef4444] text-white shadow-[0_4px_0_#991b1b] hover:bg-[#dc2626]'
            }`}
          >
            {isAnswerChecked ? 'LANJUTKAN' : 'PERIKSA'}
          </button>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#171717] border border-[#2e2e2e] rounded-2xl p-6 text-center space-y-4">
            <h3 className="text-lg font-brand font-bold text-white">Yakin Ingin Keluar?</h3>
            <p className="text-xs text-[#b4b4b4]">
              Kemajuan pelajaran ini tidak akan tersimpan jika kamu keluar sekarang.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="tactile-btn-primary flex-1 py-2.5 rounded-xl text-xs font-bold uppercase"
              >
                Tetap Belajar
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  setIsLessonActive(false);
                }}
                className="tactile-btn-secondary flex-1 py-2.5 rounded-xl text-xs font-bold uppercase text-[#898989]"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

