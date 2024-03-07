import { createServer } from 'http'
import crypto from 'crypto'
const PORT = 3500
const WEBSOCKET_STRING_KEY = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'

const server = createServer((request, response) => {
  response.writeHead(200)
  response.end('Hello')
})
.listen(PORT, () => console.log('Server listening ton', PORT))

server.on('upgrade', onSocketUpgrade)

function onSocketUpgrade(req, socket, head) {
  const { 'sec-websocket-key': webClientSocketKey } = req.headers
  console.log({
    webClientSocketKey
  })
  const headers = prepareHandShakeHeaders(webClientSocketKey)
  console.log({
    headers
  })
  socket.write(headers)
}


function prepareHandShakeHeaders(id) {
  const acceptKey = createSocketAccept(id)
  const headers = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${acceptKey}`,
    ''
  ].map(line => line.concat('\r\n')).join('')

  return headers
}

function createSocketAccept(id) {
  const shaum = crypto.createHash('sha1')
  shaum.update(id + WEBSOCKET_STRING_KEY)
  return shaum.digest('base64')
}




;
[
  "uncaughtException",
  "unhandledRejection"
].forEach(event => process.on(event, (err) => {
    console.error(`Event: ${event}, Message: ${err.stack || err}`)
  }))
