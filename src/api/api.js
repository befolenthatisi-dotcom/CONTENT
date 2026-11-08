const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000/api";

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");
  const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 15000);

let res;
try {
  res = await fetch(`${API_URL}${path}`, {
    ...options,
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
} catch (err) {
  throw new Error(
    err.name === "AbortError"
      ? "The server took too long to respond."
      : "Cannot reach the server. Is the backend running?"
  );
} finally {
  clearTimeout(timer);
}
  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && token && !path.startsWith("/auth/login")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }

  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}


export function getViewerId() {
  let id = localStorage.getItem("viewerId");
  if (!id) {
    id = "v-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("viewerId", id);
  }
  return id;
}