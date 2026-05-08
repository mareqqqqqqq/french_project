function StepVocab({ vocab, onComplete }) {
  const [flipped, setFlipped] = React.useState({});
  const seen = Object.keys(flipped).length;

  return (
    <div>
      <StepHeader
        eyebrow="Étape 1 sur 3"
        title="Vocabulaire"
        subtitle="Touche chaque carte pour découvrir la traduction. Tape sur toutes les cartes pour continuer."
      />

      <div className="grid grid-cols-4 gap-4 mt-8">
        {vocab.map((w, i) => (
          <VocabCard
            key={w.fr}
            word={w}
            index={i}
            flipped={!!flipped[w.fr]}
            onFlip={() => setFlipped((s) => ({ ...s, [w.fr]: true }))}
          />
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[13px] text-slate-500">
          <window.LucideIcons.Eye size={15} />
          {seen} / {vocab.length} cartes découvertes
        </div>
        <NextButton
          disabled={seen < vocab.length}
          onClick={onComplete}
          label={seen < vocab.length ? `Découvre ${vocab.length - seen} cartes` : "Suivant"}
        />
      </div>
    </div>
  );
}

function VocabCard({ word, index, flipped, onFlip }) {
  const Icon = window.LucideIcons[word.icon] || window.LucideIcons.Sun;
  return (
    <motion.button
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 180, damping: 20 }}
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onFlip}
      className="group relative aspect-[4/5] rounded-3xl bg-white border border-slate-200/80 text-left p-5 flex flex-col justify-between overflow-hidden shadow-[0_2px_0_rgba(15,23,42,0.04),0_18px_30px_-22px_rgba(15,23,42,0.25)] hover:shadow-[0_2px_0_rgba(15,23,42,0.04),0_28px_40px_-22px_rgba(0,85,164,0.35)] transition-shadow"
    >
      {/* corner accent */}
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-[80px] transition-colors ${flipped ? "bg-[#0055A4]/8" : "bg-slate-50"}`}></div>

      {/* Icon disc */}
      <div className={`relative w-12 h-12 rounded-2xl grid place-items-center transition-all ${
        flipped ? "bg-[#0055A4] text-white" : "bg-slate-100 text-[#0055A4]"
      }`}>
        <Icon size={22} strokeWidth={2.2} />
      </div>

      <div className="relative">
        <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-slate-400 mb-1">FR</div>
        <div className="text-[18px] font-semibold text-slate-900 leading-tight">{word.fr}</div>

        <div className="mt-3 h-px bg-slate-100"></div>

        <div className="mt-3 min-h-[36px]">
          {flipped ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-[11px] uppercase tracking-[0.12em] font-semibold text-[#EF4135] mb-1">RU</div>
              <div className="text-[15px] text-slate-700">{word.ru}</div>
            </motion.div>
          ) : (
            <div className="flex items-center gap-1.5 text-[12px] text-slate-400">
              <window.LucideIcons.MousePointerClick size={13} />
              Touche pour révéler
            </div>
          )}
        </div>
      </div>

      {/* Pronunciation chip */}
      <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-slate-50 grid place-items-center text-slate-400 group-hover:bg-[#0055A4] group-hover:text-white transition">
        <window.LucideIcons.Volume2 size={14} />
      </div>
    </motion.button>
  );
}

window.StepVocab = StepVocab;
