const BASE_URL = "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";

async function request(path, options) {
  const res = await fetch(`${BASE_URL}${path}`, options);
  const text = await res.text();

  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.message || data.error)) ||
      (typeof data === "string" ? data : `HTTP ${res.status}`);
    throw new Error(message);
  }

  return data;
}

export async function getCandidateByEmail(email) {
  const qs = new URLSearchParams({ email });
  return request(`/api/candidate/get-by-email?${qs.toString()}`);
}
