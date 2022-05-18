import { request } from 'https';

export async function fetch(url, options = {}) {
  const u = new URL(url);

  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      hostname: u.hostname,
      port: 443,
      path: u.pathname + u.search,
      method: options.method,
      headers: options.headers
    };

    const req = request(requestOptions, async (res) => {
      try {
        let responseText = '';

        for await (const chunk of res) {
          responseText += chunk;
        }

        resolve({
          responseText,
          headers: res.headers,
          status: res.statusCode,
          url
        });
      } catch (error) {
        reject({
          responseText: error.toString(),
          headers: res.headers,
          status: res.statusCode,
          url
        });
      }
    });

    req.on('error', (error) => reject(error));

    if (options.body) req.write(options.body);

    req.end();
  });
}

export async function binaryFetch(url, options = {}) {
  const u = new URL(url);

  return new Promise(async (resolve, reject) => {
    const requestOptions = {
      hostname: u.hostname,
      port: 443,
      path: u.pathname + u.search,
      method: options.method,
      headers: options.headers
    };

    const req = request(requestOptions, async (res) => {
      try {
        res.setEncoding('binary');

        let chunks = [];

        for await (const chunk of res) {
          chunks.push(Buffer.from(chunk, 'binary'));
        }

        resolve({
          chunks: Buffer.concat(chunks),
          headers: res.headers,
          status: res.statusCode,
          url
        });
      } catch (error) {
        reject({
          chunks: Buffer.from(error.toString()),
          headers: res.headers,
          status: res.statusCode,
          url
        });
      }
    });

    req.on('error', (error) => reject(error));

    if (options.body) req.write(options.body);

    req.end();
  });
}
