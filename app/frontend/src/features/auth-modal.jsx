function AuthModal({ open, onClose }) {
  const [tab, setTab] = React.useState("login");

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { X, Mail, Lock, User, ArrowRight } = window.LucideIcons;

  const API_URL = "http://127.0.0.1:8000";
  const [error, setError] = React.useState(null)
  const [success, setSuccess] = React.useState(null)

   // асинронная функция async
  const handleSubmit = async () => {
      // бeрeт значения из переменных - listener ов и закидывает их в словарь
    const userData = {
        email: email,
        password: password
    };

    // выбор endpoint-а ссылки в зависимоти от того на какой части модалки мы сотановились регистер или логин
    const endpoint = tab === "login" ? "/login" : "/register";

    // добавил
    if (tab !== "login") {
        userData.username = username
    }

    try {
        const response = await fetch(`${API_URL}/api/v1/auth${endpoint}`, { // await - говорит браузеру отправить http запрос и сидеть ждать, при этом НЕ блокируя выполнение других скриптов не странице
            // fetch - так же даёт свойтсва ok и status и так далее это всё прописано в движке браузера
            method: "POST", // метод пост в rest api передача данных с целью их сохранения
            headers: {
                "Content-Type": "application/json", // говорим что за тип данных придёт на бэк(json)
            },
            body: JSON.stringify(userData),  // переведёт в строку что получили из формы в json формате
        });

        // получает от сервера пакет данных
        const data = await response.json();

        // а вот тут проверка на то что с состоянием всё норм
        if (response.ok) {
            localStorage.setItem("refresh_token", data.refresh_token);
            localStorage.setItem("access_token", data.access_token);
            setSuccess("Вы успешно вошли!");
            onClose();
        }

        else {
            let message = data.detail;

            if (Array.isArray(data.detail)) {
                message = data.detail[0].msg;
            }

            setError(message);
        }

    } catch (error) {
        console.error("Ошибка сети:", error);
        setError("Не удалось связаться с сервером");
    }
    };

  return (
    <window.AnimatePresence>
      {open && (
        <motion.div
          key="bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 grid place-items-center"
        >
          {/* backdrop */}
          <div onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"></div>

          {/* card */}
          <motion.div
            layout //
            key="card"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
            className="relative w-[440px] rounded-[28px] bg-white/70 backdrop-blur-2xl border border-white/60 shadow-2xl overflow-hidden"
          >
            {/* top stripe */}
            <div className="h-1 w-full flex">
              <div className="flex-1 bg-[#0055A4]"></div>
              <div className="flex-1 bg-white/40"></div>
              <div className="flex-1 bg-[#EF4135]"></div>
            </div>

            <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/60 hover:bg-white grid place-items-center text-slate-600 border border-white/80">
              <X size={16} />
            </button>

            <div className="px-8 pt-8 pb-7">
              <h3 className="mt-1 text-[26px] font-bold text-slate-900 tracking-tight">
                {tab === "login" ? "Продолжи обучение" : "Создай аккаунт"}
              </h3>

              {/* tabs */}
              <div className="mt-6 relative grid grid-cols-2 p-1 rounded-2xl bg-slate-100/80 border border-white/80 text-[13px] font-semibold sticky top-0 z-10">
                <motion.div
                  layout
                  className="absolute inset-y-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-sm"
                  animate={{ left: tab === "login" ? 4 : "calc(50% + 0px)" }}
                />
                <button onClick={() => setTab("login")} className={`relative py-2 z-10 ${tab === "login" ? "text-slate-900" : "text-slate-500"}`}>Вход</button>
                <button onClick={() => setTab("signup")} className={`relative py-2 z-10 ${tab === "signup" ? "text-slate-900" : "text-slate-500"}`}>Регистрация</button>
              </div>

              {/* form — МЫ УБРАЛИ h-[105px], теперь контейнер растет сам */}
              <motion.div layout className="mt-6 space-y-3">
                <window.AnimatePresence initial={false}>
                  {tab === "signup" && (
                    <motion.div
                      key="userfield"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <Field icon={<User size={15} />} placeholder="Твоё имя" value={username} onChange={setUsername} />
                    </motion.div>
                  )}
                </window.AnimatePresence>
                <Field icon={<Mail size={15} />} placeholder="Email" type="email" value={email} onChange={setEmail} />
                <Field icon={<Lock size={15} />} placeholder="Пароль" type="password" value={password} onChange={setPassword} />
              </motion.div>

              {error && (
                <div style={{ color: "red", marginTop: "8px" }}>
                    ❌ {error}
                </div>
              )}

              {success && (
                <div style={{ color: "green", marginTop: "8px" }}>
                    ✅ {success}
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0055A4] text-white text-[14px] font-semibold hover:bg-[#004a8f] transition shadow-lg"
              >
                {tab === "login" ? "Войти" : "Создать аккаунт"}
                <ArrowRight size={15} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </window.AnimatePresence>
  );
}

function Field({ icon, placeholder, type = "text", value, onChange }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/70 border border-white/80 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0055A4]/40 focus:bg-white transition"
      />
    </div>
  );
}

function SocialBtn({ label }) {
  return (
    <button className="py-3 rounded-2xl bg-white/70 border border-white/80 text-[13px] font-semibold text-slate-700 hover:bg-white transition">
      {label}
    </button>
  );
}

window.AuthModal = AuthModal;