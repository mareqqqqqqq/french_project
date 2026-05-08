function StepFill({ sentences, onComplete, recordAnswer }) {
  const [picks, setPicks] = React.useState({}); // index -> option
  const allDone = sentences.every((_, i) => picks[i]);

  function pick(i, opt) {
    setPicks((p) => ({ ...p, [i]: opt }));
  }

  function finish() {
    sentences.forEach((s, i) => {
      recordAnswer && recordAnswer(picks[i] === s.answer);
    });
    onComplete();
  }

  return (
    <div>
      <StepHeader
        eyebrow="Étape 3 sur 3"
        title="Complète la phrase"
        subtitle="Choisis le bon mot pour compléter chaque phrase. Les résultats apparaissent à la fin."
      />

      <div className="mt-8 space-y-5">
        {sentences.map((s, i) => (
          <SentenceCard key={i} sentence={s} index={i} picked={picks[i]} onPick={(opt) => pick(i, opt)} />
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] text-slate-500">
          <window.LucideIcons.PencilLine size={15} />
          {Object.keys(picks).length} / {sentences.length} complétées
        </div>
        <NextButton disabled={!allDone} onClick={finish} label={allDone ? "Voir le résultat" : "Réponds à toutes les phrases"} />
      </div>
    </div>
  );
}

function SentenceCard({ sentence, index, picked, onPick }) {
  const parts = sentence.prompt.split("___");
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-[0_2px_0_rgba(15,23,42,0.03),0_20px_30px_-24px_rgba(15,23,42,0.18)]"
    >
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#0055A4]/10 text-[#0055A4] grid place-items-center text-[12px] font-bold shrink-0 mt-0.5">
          {index + 1}
        </div>
        <div className="flex-1">
          <div className="text-[17px] text-slate-900 leading-relaxed flex flex-wrap items-center gap-x-1.5 gap-y-2">
            <span>{parts[0]}</span>
            <span
              className={`inline-flex items-center justify-center min-w-[110px] px-3 py-1.5 rounded-xl text-[15px] font-semibold transition-all ${
                picked
                  ? "bg-[#0055A4] text-white"
                  : "bg-slate-100 text-slate-400 border border-dashed border-slate-300"
              }`}
            >
              {picked || "________"}
            </span>
            <span>{parts[1]}</span>
          </div>
          <div className="mt-2 text-[13px] text-slate-400 italic">{sentence.translation}</div>

          <div className="mt-4 flex flex-wrap gap-2">
            {sentence.options.map((opt) => {
              const isPicked = picked === opt;
              return (
                <motion.button
                  key={opt}
                  onClick={() => onPick(opt)}
                  whileTap={{ scale: 0.96 }}
                  className={`px-4 py-2 rounded-xl text-[13.5px] font-medium border transition-all ${
                    isPicked
                      ? "bg-[#0055A4] text-white border-[#0055A4] shadow-[0_10px_22px_-14px_rgba(0,85,164,0.7)]"
                      : "bg-white text-slate-700 border-slate-200 hover:border-[#0055A4]/40 hover:bg-[#0055A4]/[0.03]"
                  }`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

window.StepFill = StepFill;
