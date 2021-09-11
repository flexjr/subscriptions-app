export const API_URL: string =
  process.env.NODE_ENV === "development" ? "http://localhost:8000" : "https://api.flexjr.one";

export const AUTH0_API_AUDIENCE = "https://api.flexjr.one/"; // Must end with trailing slash

export const AUTH0_DOMAIN = "https://flexjr.us.auth0.com";

export function getData<T>(url: string, accessToken: string, signal: AbortSignal): Promise<T> {
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    signal,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function postData<T>(url: string, accessToken: string, signal: AbortSignal, payload?: any): Promise<T> {
  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal,
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}
