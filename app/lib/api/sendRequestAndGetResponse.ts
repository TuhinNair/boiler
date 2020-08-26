import 'isomorphic-unfetch';

export default async function sendRequestAndGetResponse(path: string, opts: any = {}) {
  const headers = {
    ...(opts.headers || {}),
    ...{ 'Content-Type': 'application/json; charset=UTF-8' },
  };

  const { request } = opts;
  if (request && request.headers && request.headers.cookie) {
    headers.cookie = request.headers.cookie;
  }

  const qs = opts.qs || '';

  const response = await fetch(`${path}${qs}`, {
    ...{ method: 'POST', credentials: 'include' },
    ...opts,
    ...{ headers },
  });

  const text = await response.text();

  if (response.status >= 400) {
    throw new Error(response.statusText);
  }

  try {
    const data = JSON.parse(text);

    return data;
  } catch (err) {
    if (err instanceof SyntaxError) {
      return text;
    }

    throw err;
  }
}
