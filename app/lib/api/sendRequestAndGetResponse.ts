import 'isomorphic-unfetch';

export default async function sendRequestAndGetResponse(path: string, opts: any = {}) {
  const headers = Object.assign({}, opts.headers || {}, {
    'Content-type': 'application/json; charset=UTF-8',
  });

  const { request } = opts;
  if (request && request.headers && request.headers.cookie) {
    headers.cookie = request.headers.cookie;
  }

  const qs = opts.qs || '';

  const config = {
    ...{ method: 'POST', credentials: 'include' },
    ...opts,
    ...{ headers },
  };

  if (config.method === 'GET') {
    config.body = null;
  }

  const response = await fetch(`${process.env.URL_APP}${path}${qs}`, config);

  const text = await response.text();

  if (response.status >= 400) {
    console.log(`${process.env.URL_APP}${path}${qs}`);
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
