
let memoryToken = null;

export async function issueJWT(email) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/jwt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  memoryToken = data.token;
  sessionStorage.setItem("token", data.token); 
  return data.token;
}

export function getToken() {
  if (!memoryToken) {
    memoryToken = sessionStorage.getItem("token");
  }
  return memoryToken;
}


export function clearToken() {
  memoryToken = null;
  sessionStorage.removeItem("token");
}

export async function clearJWT() {
  clearToken();
}


export async function authFetch(url, options = {}) {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

