-- Run this folder with luvi

local bundle = require('luvi').bundle
loadstring(bundle.readfile('luvit-loader.lua'), 'bundle:luvit-loader.lua')()

local env = require('env')
local username = assert(env.get 'RAX_USERNAME', 'Missing RAX_USERNAME environment variable')
local apiKey = assert(env.get 'RAX_API_KEY', 'Missing RAX_API_KEY environment variable')
local p = require('pretty-print').prettyPrint
local request = require('coro-http').request
require('weblit-app')

.bind({
  host = "0.0.0.0",
  port = 8080
})

.use(require('weblit-logger'))
.use(require('weblit-auto-headers'))
.use(require('weblit-etag-cache'))

-- quick and dirty route to send the environment variables to the client app.
.route({
  method = "GET",
  path = "/config.json"
}, function (req, res, go)
  res.code = 200
  res.headers["Content-Type"] = "application/json"
  res.body = '{"username":"' .. username .. '","apiKey":"' .. apiKey .. '"}\n'
end)

-- proxy for identity and metrics calls
.route({
  path = "/proxy/:url:"
}, function (req, res, go)
  local rres, body = request(req.method, req.path:match("/proxy/(.*)"), req.headers, req.body)
  res.code = rres.code
  for i = 1, #rres do
    local pair = rres[i]
    res.headers[pair[1]] = pair[2]
  end
  if body then
    res.body = body
  end
end)

.use(require('weblit-static')('bundle:www'))

.start()


require('uv').run()
