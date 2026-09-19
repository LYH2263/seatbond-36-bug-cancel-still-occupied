export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    let message = text || res.statusText;
    try {
      const parsed: unknown = JSON.parse(text);
      if (parsed && typeof parsed === "object" && "detail" in parsed) {
        const detail = (parsed as { detail: unknown }).detail;
        if (typeof detail === "string" && detail) message = detail;
      }
    } catch {
      // 非 JSON 错误体时保留原文
    }
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}
