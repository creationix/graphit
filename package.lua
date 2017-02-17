return {
  name = 'graphit',
  version = '0.0.1',
  dependencies = {
    'creationix/weblit-app',
    'creationix/weblit-logger',
    'creationix/weblit-auto-headers',
    'creationix/weblit-etag-cache',
    'creationix/weblit-static',
    'creationix/coro-http',
    'luvit/pretty-print',
    'luvit/secure-socket',
  },
  luvi = {
    flavor = 'regular'
  }
}
