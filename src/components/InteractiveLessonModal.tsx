import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LESSON_UNITS } from '../data/curriculum';
import { SnakelingMascot, MascotMood } from './SnakelingMascot';
import confetti from 'canvas-confetti';
import { X, Heart, CheckCircle2, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export const InteractiveLessonModal: React.FC = () => {
  const {
    selectedLessonId,
    setIsLessonActive,
    stats,
    loseHeart,
    finishLesson,
    refillHearts,
    playSound,
    showToast
  } = useApp();

  const lesson = LESSON_UNITS.find((u) => u.id === selectedLessonId) || LESSON_UNITS[0];
  const questions = lesson.questions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mascotMood, setMascotMood] = useState<MascotMood>('thinking');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    setSelectedOption(null);
    setSelectedTokens([]);
    setIsAnswerChecked(false);
    setIsCorrect(null);
    setMascotMood('thinking');
  }, [currentIndex]);

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
    if (currentQ.type === 'code_order') {
      const expected = (currentQ.correctAnswer as string[]).join(' ');
      const actual = selectedTokens.join(' ');
      correct = expected === actual;
    } else {
      correct = selectedOption === currentQ.correctAnswer;
    }

    setIsAnswerChecked(true);
    setIsCorrect(correct);

    if (correct) {
      playSound('correct');
      setMascotMood('excited');
    } else {
      playSound('wrong');
      setMascotMood('sad');
      loseHeart();
    }
  };

  // Keyboard shortcut: Enter to check/continue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (!isAnswerChecked) {
          const hasInput = currentQ.type === 'code_order' ? selectedTokens.length > 0 : selectedOption !== null;
          if (hasInput) handleCheckAnswer();
        } else {
          handleCheckAnswer();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswerChecked, selectedOption, selectedTokens, currentQ]);

  // If user runs out of hearts
  if (stats.hearts <= 0 && !isCompleted) {
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
              className="tactile-btn-primary w-full py-3.5 rounded-xl font-brand font-bold text-sm uppercase tracking-wider"
            >
              Isi Ulang 5 Nyawa (100 Gems)
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

  // Completion Screen
  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-50 bg-[#121212] flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-lg bg-[#171717] border-2 border-[#3ecf8e]/40 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#3ecf8e] to-[#38bdf8]" />
          
          <SnakelingMascot mood="celebrate" size="xl" className="mx-auto mascot-float" />

          <div className="space-y-2">
            <span className="text-xs font-brand font-bold uppercase tracking-widest text-[#3ecf8e]">
              UNIT 1 • PELAJARAN SELESAI
            </span>
            <h2 className="text-3xl font-brand font-extrabold text-white tracking-tight">
              Luar Biasa, Kamu Hebat!
            </h2>
            <p className="text-sm text-[#b4b4b4] max-w-sm mx-auto">
              Kamu telah menyelesaikan sesi pemrograman Python kali ini dan mendapatkan hadiah.
            </p>
          </div>

          {/* Reward cards */}
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#2e2e2e] flex flex-col items-center">
              <span className="text-xs font-brand font-bold uppercase text-[#3ecf8e]">TOTAL XP</span>
              <span className="text-2xl font-brand font-black text-white mt-1">+{lesson.xpReward}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#1c1b1b] border border-[#2e2e2e] flex flex-col items-center">
              <span className="text-xs font-brand font-bold uppercase text-[#38bdf8]">GEMS DIDAPAT</span>
              <span className="text-2xl font-brand font-black text-white mt-1">+{lesson.gemReward}</span>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click');
              setIsLessonActive(false);
              showToast(`+${lesson.xpReward} XP dan +${lesson.gemReward} Gems telah ditambahkan!`);
            }}
            className="tactile-btn-primary w-full py-4 rounded-2xl font-brand font-black text-base uppercase tracking-wider text-[#0e0e0e]"
          >
            SELESAI &amp; KEMBALI
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const canCheck = currentQ.type === 'code_order' ? selectedTokens.length > 0 : selectedOption !== null;

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] flex flex-col justify-between select-none">
      {/* Top Header Bar */}
      <header className="w-full max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="text-[#898989] hover:text-white transition-colors p-1"
          aria-label="Tutup Pelajaran"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 h-3.5 bg-[#242424] rounded-full overflow-hidden p-0.5 border border-[#2e2e2e]">
          <div
            className="h-full bg-gradient-to-r from-[#3ecf8e] to-[#34b27b] rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(62,207,142,0.4)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Hearts Indicator */}
        <div className="flex items-center gap-1.5 font-brand font-bold text-sm text-[#ef4444]">
          <Heart className="w-5 h-5 fill-current" />
          <span className="text-base text-white font-extrabold">{stats.hearts}</span>
        </div>
      </header>

      {/* Main Question Arena */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-2xl w-full mx-auto px-6 py-4 overflow-y-auto">
        <div className="w-full space-y-6">
          {/* Mascot with Question Prompt */}
          <div className="flex items-start gap-4">
            <SnakelingMascot mood={mascotMood} size="md" className="shrink-0 -mt-2" />
            <div className="flex-1 bg-[#171717] border border-[#2e2e2e] rounded-2xl p-4 relative shadow-lg">
              {/* Chat bubble tail */}
              <div className="absolute top-6 -left-2 w-0 h-0 border-y-6 border-y-transparent border-r-8 border-r-[#171717]" />
              <h2 className="text-base sm:text-lg font-brand font-bold text-white leading-snug">
                {currentQ.prompt}
              </h2>
            </div>
          </div>

          {/* Optional Code Snippet block */}
          {currentQ.codeSnippet && (
            <div className="bg-[#0e0e0e] border border-[#2e2e2e] rounded-xl p-4 font-mono text-sm text-[#fafafa] shadow-inner">
              <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-[#242424] text-[11px] text-[#898989]">
                <span className="w-2 h-2 rounded-full bg-[#3ecf8e]" />
                <span>python.py</span>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Multiple Choice / Prediction Options */}
          {(currentQ.type === 'multiple_choice' || currentQ.type === 'code_predict' || currentQ.type === 'fill_blank') && currentQ.options && (
            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswerChecked}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-medium text-sm transition-all flex items-center justify-between cursor-pointer ${
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

          {/* Code Order arrangement */}
          {currentQ.type === 'code_order' && currentQ.options && (
            <div className="space-y-4 pt-2">
              {/* Construction slot */}
              <div className="min-h-16 p-3 rounded-2xl border-2 border-dashed border-[#393939] bg-[#141414] flex flex-wrap gap-2 items-center">
                {selectedTokens.length === 0 ? (
                  <span className="text-xs text-[#898989] font-medium italic">
                    Ketuk kata di bawah untuk menyusun kode...
                  </span>
                ) : (
                  selectedTokens.map((token, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleToggleToken(token)}
                      disabled={isAnswerChecked}
                      className="px-4 py-2 rounded-xl bg-[#3ecf8e] text-[#0e0e0e] font-mono font-bold text-sm shadow-[0_3px_0_#1b6343] cursor-pointer"
                    >
                      {token}
                    </button>
                  ))
                )}
              </div>

              {/* Available word bank */}
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                {currentQ.options.map((token, idx) => {
                  const isUsed = selectedTokens.includes(token);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleToggleToken(token)}
                      disabled={isUsed || isAnswerChecked}
                      className={`px-4 py-2.5 rounded-xl font-mono text-sm transition-all ${
                        isUsed
                          ? 'opacity-20 cursor-not-allowed bg-[#242424] text-[#898989]'
                          : 'tactile-btn-secondary text-white font-medium cursor-pointer'
                      }`}
                    >
                      {token}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Verification Drawer */}
      <footer
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
      </footer>

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
