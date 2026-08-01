// Заглушка для разделов, для которых пока нет данных на бэкенде
function ComingSoonPlaceholder({ title, icon = "Construction" }) {
  const Icon = window.LucideIcons[icon] || window.LucideIcons.Construction;

  return (
    <div className="max-w-[1080px] mx-auto">
      <div className="text-center py-20 bg-white border rounded-3xl border-dashed border-slate-200">
        <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-slate-50 grid place-items-center">
          <Icon className="text-slate-300" size={26} />
        </div>
        <div className="text-slate-800 font-semibold text-[16px]">{title}</div>
        <p className="text-slate-400 text-sm mt-1.5">Этот раздел скоро появится</p>
      </div>
    </div>
  );
}

window.ComingSoonPlaceholder = ComingSoonPlaceholder;
