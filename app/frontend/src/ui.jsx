// Shared UI bits
function StepHeader({ eyebrow, title, subtitle }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#0055A4]">{eyebrow}</div>
      <h2 className="mt-1 text-[32px] font-bold text-slate-900 tracking-tight leading-tight">{title}</h2>
      <p className="mt-2 text-[14.5px] text-slate-500 max-w-[640px]">{subtitle}</p>
    </div>
  );
}

function NextButton({ disabled, onClick, label }) {
  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      whileHover={!disabled ? { y: -1 } : undefined}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[14px] font-semibold transition-all ${
        disabled
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-[#0055A4] text-white shadow-[0_18px_30px_-16px_rgba(0,85,164,0.7)] hover:bg-[#004a8f]"
      }`}
    >
      {label}
      {!disabled && <window.LucideIcons.ChevronRight size={17} />}
    </motion.button>
  );
}

window.StepHeader = StepHeader;
window.NextButton = NextButton;
