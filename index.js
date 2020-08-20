import redirector from 'lilredirector'

import ϟ from 'ggf'

addEventListener('fetch', ev => ev.respondWith(handler(ev)))

async function handler(event) {
  try {
    const { request } = event
    const { response, error } = await redirector(event)
    if (response) return response
    if (error) return error

    const url = new URL(request.url)

    const req =
      ENVIRONMENT === 'development'
        ? new Request(ORIGIN + url.pathname)
        : request
    const resp = await fetch(req)

    return ϟ(resp, {
      deferScripts: {
        enabled: true,
        options: { except: ['/assets/js/app.min.js'] },
      },
    })
  } catch (err) {
    console.log(err.message)
    return new Response(err.toString())
  }
}
