import 'isomorphic-unfetch';

export default async function sendRequestAndGetResponse(path: string, opts: any = {}) {
  const headers = Object.assign(
    {},
    opts.headers || {},
    opts.externalServer
      ? {}
      : {
          'Content-type': 'application/json; charset=UTF-8',
        },
  );

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

  const response = await fetch(
    opts.externalServer ? `${path}${qs}` : `${process.env.URL_API}${path}${qs}`,
    config,
  );

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
