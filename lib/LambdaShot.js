import Debug from 'debug'

const debug = Debug('@:lambda-shot')
const ENDPOINT = process.env.LAMBDA_ENDPOINT

async function shot(arg) {
  if (!arg || !arg.eid) return null
  debug('[shot]>>>>', arg)
  const { eid, url } = arg
  const result = await fetch(`${ENDPOINT}/libra/thumb`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      pocket_id: eid,
      url,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw response
    })
    .catch((e) => {
      debug(eid, url, e)
      throw e
    })
  debug('[shot]<<<<', result)
  return result
}

export default {
  shot,
}
