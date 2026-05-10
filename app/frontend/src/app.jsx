function App() {
  const [active, setActive] = React.useState("lessons");
  const [step, setStep] = React.useState(0); // 0 vocab, 1 match, 2 fill, 3 result
  const [authOpen, setAuthOpen] = React.useState(false);
  const [score, setScore] = React.useState(120);
  const [streak] = React.useState(5);
  const [username, setUsername] = React.useState(localStorage.getItem("username") || "");

  const [answers, setAnswers] = React.useState([]);
  const recordAnswer = (correct) => setAnswers((a) => [...a, !!correct]);

  const totalSteps = 4; // includes result
  const data = window.LESSON_DATA;

  React.useEffect(() => {
    if (!authOpen) {
      setUsername(localStorage.getItem("username") || "");
    }
  }, [authOpen]);

  function next() {
    setStep((s) => Math.min(s + 1, 3));
    if (step + 1 === 3) {
      const correct = answers.filter(Boolean).length;
      setScore((sc) => sc + correct * 10 + 30);
    }
  }

  function restart() {
    setStep(0);
    setAnswers([]);
  }

  const correct = answers.filter(Boolean).length;
  const total = answers.length || 1;

  const transition = { type: "spring", stiffness: 130, damping: 22 };

  return (
    <div className="min-h-screen flex bg-[#F4F7FB] text-slate-900 antialiased">
      <window.Sidebar active={active} setActive={setActive} score={score} streak={streak} username={username} />

      <div className="flex-1 min-w-0 flex flex-col">
        <window.Header
          score={score}
          step={step}
          totalSteps={totalSteps - 1}
          onAuthClick={() => setAuthOpen(true)}
          username={username}
        />

        {/* Breadcrumb шагов */}
        <div className="px-10 pt-8">
          <Chapters step={step} />
        </div>

        {/* Основная панель */}
        <main className="px-10 pb-16 pt-6 flex-1">
          <div className="relative max-w-[1080px] mx-auto">
            <window.AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={transition}
              >
                {step === 0 && <window.StepVocab vocab={data.vocab} onComplete={next} />}
                {step === 1 && (
                  <window.StepMatch pairs={data.match} onComplete={next} recordAnswer={recordAnswer} />
                )}
                {step === 2 && (
                  <window.StepFill sentences={data.sentences} onComplete={next} recordAnswer={recordAnswer} />
                )}
                {step === 3 && (
                  <window.StepResult
                    correct={correct}
                    total={total}
                    xp={correct * 10 + 30}
                    onRestart={restart}
                  />
                )}
              </motion.div>
            </window.AnimatePresence>
          </div>
        </main>
      </div>

      <window.AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

function Chapters({ step }) {
  const items = [
    { label: "Словарный запас", icon: "BookOpen" },
    { label: "Сопоставление",   icon: "Link2" },
    { label: "Фразы",           icon: "PencilLine" },
    { label: "Результат",       icon: "Trophy" },
  ];
  return (
    <div className="max-w-[1080px] mx-auto flex items-center gap-2">
      {items.map((it, i) => {
        const Icon = window.LucideIcons[it.icon];
        const state = i < step ? "done" : i === step ? "current" : "todo";
        return (
          <React.Fragment key={i}>
            <div
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold transition ${
                state === "current"
                  ? "bg-white border border-[#0055A4]/20 text-[#0055A4] shadow-[0_8px_18px_-12px_rgba(0,85,164,0.45)]"
                  : state === "done"
                    ? "bg-emerald-50/70 text-emerald-700 border border-emerald-100"
                    : "bg-transparent text-slate-400 border border-slate-200/70"
              }`}
            >
              <Icon size={14} />
              {it.label}
              {state === "done" && <window.LucideIcons.Check size={13} />}
            </div>
            {i < items.length - 1 && (
              <div className={`flex-1 h-px ${i < step ? "bg-emerald-200" : "bg-slate-200"}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
