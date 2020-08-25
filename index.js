import redirector from 'lilredirector'
import ϟ from 'ggf'

addEventListener('fetch', ev => {
  ev.passThroughOnException()
  ev.respondWith(handler(ev))
})

const deferScriptWhitelist = [
  'assets/js/app.min.js',
  'assets/vendor.min',
  'assets/ghost.min',
]

const embedJson = data => ({
  element: element => {
    element.setInnerContent(JSON.stringify(data))
  },
})

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
    if (url.pathname.startsWith('/ghost')) {
      return resp
    } else if (url.pathname.startsWith('/members')) {
      const membersResp = await fetch(
        'https://mailinglisthackers-members.signalnerve.workers.dev',
      )
      const data = await membersResp.json()
      return new HTMLRewriter()
        .on('script#members_data', embedJson(data))
        .transform(resp)
    } else {
      return ϟ(resp, {
        deferScripts: {
          enabled: true,
          options: { except: deferScriptWhitelist },
        },
      })
    }
  } catch (err) {
    console.log(err.message)
  }
}
