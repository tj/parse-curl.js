
var words = require('shellwords')

// TODO -F, --form
// TODO --data-binary
// TODO --data-urlencode
// TODO -r, --range

/**
 * Attempt to parse the given curl string.
 */

module.exports = exports.default = function(s) {
  if (0 != s.indexOf('curl ')) return
  var args = rewrite(words.split(s))
  var out = { method: 'GET', header: {} }
  var state = ''

  args.forEach(function(arg){
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

      case arg == '-d' || arg == '--data' || arg == '--data-ascii' || arg == '--data-raw':
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
      
      case arg == '-F' || arg == '--form':
        state = 'form'
        break

      case !!arg:
        switch (state) {
          case 'form':
            if (!out.method || ['GET', 'HEAD'].includes(out.method) ) out.method = 'POST'

            out.header['Content-Type'] = 'multipart/form-data'

            const field = parseField(arg.replace(/\"/g, ''), '=')
            
            if (typeof out.body !== 'object' || Object.keys(out.body) === 0) {
              out.body = {
                [field[0]]: field[1]
              }
            } else out.body[field[0]] = field[1]
            state = ''
            break;
          case 'header':
            field = parseField(arg, ': ')
            out.header[field[0]] = field[1]
            state = ''
            break;
          case 'user-agent':
            out.header['User-Agent'] = arg
            state = ''
            break;
          case 'data':
            if (out.method == 'GET' || out.method == 'HEAD') out.method = 'POST'
            if(!out.header['Content-Type'] && !out.header['content-type']) {
              out.header['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            out.body = out.body
              ? out.body + '&' + arg
              : arg
            state = ''
            break;
          case 'user':
            out.header['Authorization'] = 'Basic ' + (typeof window !== 'undefined' ? btoa(arg) : Buffer.from(arg).toString('base64'))
            state = ''
            break;
          case 'method':
            out.method = arg
            state = ''
            break;
          case 'cookie':
            out.header['Set-Cookie'] = arg
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
  return args.reduce(function(args, a){
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
 * Parse header field.
 */

function parseField(s, separator) {
  return s.split(new RegExp(`${separator}(.+)`))
}

/**
 * Check if `s` looks like a url.
 */

function isURL(s) {
  // TODO: others at some point
  return /^https?:\/\//.test(s)
}
