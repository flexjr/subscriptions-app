export const API_URL: string =
  process.env.NODE_ENV === "development" ? "http://localhost:8000" : "https://api.flexjr.one";

export const AUTH0_API_AUDIENCE = "https://api.flexjr.one/"; // Must end with trailing slash

export const AUTH0_DOMAIN = "https://flexjr.us.auth0.com";

export function getData<T>(url: string, accessToken: string): Promise<T> {
  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<T>;
  });
}
