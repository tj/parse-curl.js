
const assert = require('assert')
const parse = require('./index')

btoa = s => new Buffer(s).toString('base64')

const cases = []

cases.push({
  input: 'curl http://api.sloths.com',
  output: {
    method: 'GET',
    url: 'http://api.sloths.com',
    header: {},
    cookie: {}
  }
})

cases.push({
  input: 'curl -I http://api.sloths.com',
  output: {
    method: 'HEAD',
    url: 'http://api.sloths.com',
    header: {},
    cookie: {}
  }
})

cases.push({
  input: 'curl -I http://api.sloths.com -vvv --foo --whatever bar',
  output: {
    method: 'HEAD',
    url: 'http://api.sloths.com',
    header: {},
    cookie: {}
  }
})

cases.push({
  input: 'curl --compressed http://api.sloths.com',
  output: {
    method: 'GET',
    url: 'http://api.sloths.com',
    header: {
      'Accept-Encoding': 'deflate, gzip'
    },
    cookie: {}
  }
})

cases.push({
  input: 'curl -H "Accept-Encoding: gzip" --compressed http://api.sloths.com',
  output: {
    method: 'GET',
    url: 'http://api.sloths.com',
    header: {
      'Accept-Encoding': 'gzip'
    },
    cookie: {}
  }
})

cases.push({
  input: 'curl -X DELETE http://api.sloths.com/sloth/4',
  output: {
    method: 'DELETE',
    url: 'http://api.sloths.com/sloth/4',
    header: {},
    cookie: {}
  }
})

cases.push({
  input: 'curl -XPUT http://api.sloths.com/sloth/4',
  output: {
    method: 'PUT',
    url: 'http://api.sloths.com/sloth/4',
    header: {},
    cookie: {}
  }
})

cases.push({
  input: 'curl https://api.sloths.com',
  output: {
    method: 'GET',
    url: 'https://api.sloths.com',
    header: {},
    cookie: {}
  }
})

cases.push({
  input: 'curl -u tobi:ferret https://api.sloths.com',
  output: {
    method: 'GET',
    url: 'https://api.sloths.com',
    header: {
      Authorization: 'Basic dG9iaTpmZXJyZXQ='
    },
    cookie: {}
  }
})

cases.push({
  input: 'curl -d "foo=bar" https://api.sloths.com',
  output: {
    method: 'GET',
    url: 'https://api.sloths.com',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'foo=bar',
    cookie: {}
  }
})

cases.push({
  input: 'curl -d "foo=bar" -d bar=baz https://api.sloths.com',
  output: {
    method: 'GET',
    url: 'https://api.sloths.com',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'foo=bar&bar=baz',
    cookie: {}
  }
})

cases.push({
  input: 'curl -H "Accept: text/plain" --header "User-Agent: slothy" https://api.sloths.com',
  output: {
    method: 'GET',
    url: 'https://api.sloths.com',
    header: {
      'Accept': 'text/plain',
      'User-Agent': 'slothy'
    },
    cookie: {}
  }
})

cases.push({
  input: "curl -H 'Accept: text/*' --header 'User-Agent: slothy' https://api.sloths.com",
  output: {
    method: 'GET',
    url: 'https://api.sloths.com',
    header: {
      'Accept': 'text/*',
      'User-Agent': 'slothy'
    },
    cookie: {}
  }
})

cases.push({
  input: "curl -H 'Accept: text/*' -A slothy https://api.sloths.com",
  output: {
    method: 'GET',
    url: 'https://api.sloths.com',
    header: {
      'Accept': 'text/*',
      'User-Agent': 'slothy'
    },
    cookie: {}
  }
})

cases.push({
  input: "curl -b 'martial_art=sloth_fu' slothy https://api.sloths.com",
  output: {
    method: 'GET',
    url: 'https://api.sloths.com',
    header: {},
    cookie: {
      'martial_art': 'sloth_fu'
    }
  }
})

cases.push({
  input: "curl --cookie 'foo=bar' slothy https://api.sloths.com",
  output: {
    method: 'GET',
    url: 'https://api.sloths.com',
    header: {},
    cookie: {
      'foo': 'bar'
    }
  }
})

cases.push({
  input: "curl --cookie 'species=sloth;type=galactic' slothy https://api.sloths.com",
  output: {
    method: 'GET',
    url: 'https://api.sloths.com',
    header: {},
    cookie: {
      'species': 'sloth',
      'type': 'galactic'
    }
  }
})

cases.forEach(function(c){
  const out = parse(c.input)

  const msg = `
       input: ${c.input}
    expected: ${JSON.stringify(c.output)}
    received: ${JSON.stringify(out)}
  `

  assert.deepEqual(out, c.output, msg)
})

console.log('\n  :)\n')
