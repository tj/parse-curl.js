
const words = require('shellwords')
const url = require('url')

// TODO -F, --form
// TODO --data-binary
// TODO --data-urlencode
// TODO -r, --range

/**
 * Attempt to parse the given curl string.
 */

module.exports = exports.default = function(s) {
  if (0 != s.indexOf('curl ')) return
  const args = rewrite(words.split(s))
  const out = { method: 'GET', header: {}, cookie: {}}
  var state = ''

  args.forEach(arg => {
    switch (true) {
      case isURL(arg):
        out.url = arg
        break;

      case arg == '-A' || arg == '--user-agent':
        state = 'user-agent'
        break;

      case arg == '-H' || arg == '--header':
        state = 'header'
        break;

      case arg == '-d' || arg == '--data' || arg == '--data-ascii':
        state = 'data'
        break;

      case arg == '-u' || arg == '--user':
        state = 'user'
        break;

      case arg == '-I' || arg == '--head':
        out.method = 'HEAD'
        break;

      case arg == '-X' || arg == '--request':
        state = 'method'
        break;

      case arg == '-b' || arg =='--cookie':
        state = 'cookie'
        break;

      case arg == '--compressed':
        out.header['Accept-Encoding'] = out.header['Accept-Encoding'] || 'deflate, gzip'
        break;

      case !!arg:
        switch (state) {
          case 'header':
            var field = parseField(arg)
            out.header[field[0]] = field[1]
            state = ''
            break;
          case 'user-agent':
            out.header['User-Agent'] = arg
            state = ''
            break;
          case 'data':
            out.header['Content-Type'] = out.header['Content-Type'] || 'application/x-www-form-urlencoded'
            out.body = out.body
              ? `${out.body}&${arg}`
              : arg
            state = ''
            break;
          case 'user':
            out.header['Authorization'] = `Basic ${btoa(arg)}`
            state = ''
            break;
          case 'method':
            out.method = arg
            state = ''
            break;
          case 'cookie':
            out.cookie = parseCookieField(arg)
            state = ''
            break;
        }
        break;
    }
  })

  return out
}

/**
 * Rewrite args for special cases such as -XPUT.
 */

function rewrite(args) {
  return args.reduce((args, a) => {
    if (0 == a.indexOf('-X')) {
      args.push('-X')
      args.push(a.slice(2))
    } else {
      args.push(a)
    }

    return args
  }, [])
}

/**
 * Parse cookie field.
 */

function parseCookieField(s) {
  return s
    .split(';')
    .reduce(function(cookies, cookie) {
      var field = cookie.split('=')
      cookies[field[0]] = field[1]

      return cookies
    }, {})
}

/**
 * Parse header field.
 */

function parseField(s) {
  return s.split(/: */)
}

/**
 * Check if `s` looks like a url.
 */

function isURL(s) {
  // TODO: others at some point
  return /^https?:\/\//.test(s)
}
