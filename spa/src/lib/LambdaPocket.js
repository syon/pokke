import Debug from 'debug';
import URLSearchParams from 'url-search-params';

const debug = Debug('chase:lambda-pocket');
const LAMBDA_ENDPOINT = 'https://ua5uhzf79d.execute-api.us-east-1.amazonaws.com/dev';

async function getRequestToken() {
  return fetch(`${LAMBDA_ENDPOINT}/pocket/oauth/request`, {
    method: 'POST',
  })
    /* eslint-disable arrow-body-style */
    .then(res => res.json()).then((json) => {
      return {
        request_token: json.request_token,
        auth_uri: json.auth_uri,
      };
    })
    .catch(err => debug(err));
}

async function getAccessToken(requestToken) {
  return fetch(`${LAMBDA_ENDPOINT}/pocket/oauth/authorize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code: requestToken,
    }),
  })
    .then(res => res.json())
    .catch(err => debug(err));
}

async function get(accessToken) {
  debug('[get]>>>>', accessToken);
  if (!accessToken) return { list: {} };
  const result = await fetch(`${LAMBDA_ENDPOINT}/pocket/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: accessToken,
      count: 100,
      detailType: 'complete',
    }),
  })
    .then(res => res.json())
    .catch(err => debug(err));
  debug('[get]<<<<', result);
  return result;
}

async function getFavorites(accessToken) {
  return fetch(`${LAMBDA_ENDPOINT}/pocket/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: accessToken,
      favorite: 1,
      count: 20,
      detailType: 'complete',
    }),
  })
    .then(res => res.json())
    .catch(err => debug(err));
}

async function getByTag(accessToken, tag) {
  debug('[getByTag]>>>>', accessToken, tag);
  const result = await fetch(`${LAMBDA_ENDPOINT}/pocket/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_token: accessToken,
      tag,
      count: 100,
      detailType: 'complete',
    }),
  })
    .then(res => res.json())
    .catch(err => debug(err));
  debug('[getByTag]<<<<', result);
  return result;
}

async function archive(accessToken, itemId) {
  debug('[archive]>>>>', accessToken, itemId);
  const q = new URLSearchParams();
  q.append('access_token', accessToken);
  q.append('item_id', itemId);
  const url = `${LAMBDA_ENDPOINT}/pocket/send/archive?${q.toString()}`;
  const result = await fetch(url, {
    method: 'GET',
  })
    .then(res => res.json())
    .catch(err => debug(err));
  debug('[archive]<<<<', result);
  return result;
}

export default {
  getRequestToken,
  getAccessToken,
  get,
  getFavorites,
  getByTag,
  archive,
};
