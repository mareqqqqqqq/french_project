// Обёртка над fetch с автоматическим обновлением access_token при истечении срока действия
const API_ROOT = "http://127.0.0.1:8000";

async function apiFetch(url, options = {}) {
  let res = await fetch(url, { ...options, credentials: "include" });

  if (res.status === 401) {
    const refreshRes = await fetch(`${API_ROOT}/api/v1/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      // токен обновился — повторяем исходный запрос
      res = await fetch(url, { ...options, credentials: "include" });
    } else {
      // refresh_token тоже истёк или невалиден — пользователь реально разлогинен
      localStorage.removeItem("username");
      window.location.reload();
    }
  }

  return res;
}

window.apiFetch = apiFetch;