import redirector from 'lilredirector'

addEventListener('fetch', ev => ev.respondWith(handler(ev)))

async function handler(event) {
  try {
    const { response, error } = await redirector(event)
    if (response) return response
    if (error) return error

    return fetch(event.request)
  } catch (err) {
    console.log(err.message)
    return new Response(err.toString())
  }
}
