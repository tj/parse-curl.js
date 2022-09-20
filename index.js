const words = require('shellwords');
var Buffer = require('buffer/').Buffer

// TODO -F, --form
// TODO --data-binary
// TODO --data-urlencode
// TODO -r, --range

const parse = function (s) {
    if (0 !== s.indexOf('curl ')) return
    const args = rewrite(words.split(s));
    const out = {method: 'GET', url: '', header: {}, body: ''};
    let state = '';

    args.forEach(function (arg) {
        switch (true) {
            case isURL(arg):
                out.url = arg
                break;

            case arg === '-A' || arg === '--user-agent':
                state = 'user-agent'
                break;

            case arg === '-H' || arg === '--header':
                state = 'header'
                break;

            case arg === '-d' || arg === '--data' || arg === '--data-ascii' || arg === '--data-raw':
                state = 'data'
                break;

            case arg === '-u' || arg === '--user':
                state = 'user'
                break;

            case arg === '-I' || arg === '--head':
                out.method = 'HEAD'
                break;

            case arg === '-X' || arg === '--request':
                state = 'method'
                break;

            case arg === '-b' || arg === '--cookie':
                state = 'cookie'
                break;

            case arg === '--compressed':
                out.header['Accept-Encoding'] = out.header['Accept-Encoding'] || 'deflate, gzip'
                break;

            case !!arg:
                switch (state) {
                    case 'header':
                        const field = parseField(arg);
                        if (field[1] !== undefined) {
                            out.header[field[0]] = field[1];
                            state = ''
                        }
                        break;
                    case 'user-agent':
                        out.header['User-Agent'] = arg
                        state = ''
                        break;
                    case 'data':
                        if (out.method === 'GET' || out.method === 'HEAD') out.method = 'POST'
                        out.body = out.body
                            ? out.body + '&' + arg
                            : arg
                        state = ''
                        break;
                    case 'user':
                        out.header['Authorization'] = 'Basic ' + btoa(arg)
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
};


const safeParse = function (curlStr) {
    let curl = parse(curlStr)
    //header的key转小写
    allHeaderToLowercase(curl.header);
    //转换header
    handleHeader(curl)
    return curl
};


/**
 * Rewrite args for special cases such as -XPUT.
 */

function rewrite(args) {
    return args.reduce(function (args, a) {
        if (0 === a.indexOf('-X')) {
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

function parseField(s) {
    return s.split(/: (.+)/)
}

/**
 * Check if `s` looks like a url.
 */

function isURL(s) {
    // TODO: others at some point
    return /^https?:\/\//.test(s)
}

function handleHeader(curl) {
    //content-type
    if (curl.header['content-type'] === undefined && curl.method === "POST") {
        curl.header['content-type'] = 'application/x-www-form-urlencoded';
    }
    //content-length
    if (curl.header['content-length'] === undefined && curl.body) {
        curl.header['content-length'] = Buffer.byteLength(curl.body)
    }
}

function allHeaderToLowercase(headers) {
    for (const key in headers) {
        headers[key.toLowerCase()] = headers[key]
        if (key !== key.toLowerCase()) {
            delete headers[key];
        }
    }
}


module.exports = {
    parse,
    safeParse
}
