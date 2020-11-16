
const assert = require('assert')
const parse = require('./index')

btoa = s => new Buffer(s).toString('base64')

const cases = []

cases.push({
  input: 'curl http://api.sloths.com',
  output: {
    method: 'GET',
    url: 'http://api.sloths.com',
    header: {}
  }
})

cases.push({
  input: 'curl -I http://api.sloths.com',
  output: {
    method: 'HEAD',
    url: 'http://api.sloths.com',
    header: {}
  }
})

cases.push({
  input: 'curl -I http://api.sloths.com -vvv --foo --whatever bar',
  output: {
    method: 'HEAD',
    url: 'http://api.sloths.com',
    header: {}
  }
})

cases.push({
  input: 'curl -H "Origin: https://example.com" https://example.com',
  output: {
    method: 'GET',
    url: 'https://example.com',
    header: {
      Origin: "https://example.com"
    }
  }
})

cases.push({
  input: 'curl --compressed http://api.sloths.com',
  output: {
    method: 'GET',
    url: 'http://api.sloths.com',
    header: {
      'Accept-Encoding': 'deflate, gzip'
    }
  }
})

cases.push({
  input: 'curl -H "Accept-Encoding: gzip" --compressed http://api.sloths.com',
  output: {
    method: 'GET',
    url: 'http://api.sloths.com',
    header: {
      'Accept-Encoding': 'gzip'
    }
  }
})

cases.push({
  input: 'curl -X DELETE http://api.sloths.com/sloth/4',
  output: {
    method: 'DELETE',
    url: 'http://api.sloths.com/sloth/4',
    header: {}
  }
})

cases.push({
  input: 'curl -XPUT http://api.sloths.com/sloth/4',
  output: {
    method: 'PUT',
    url: 'http://api.sloths.com/sloth/4',
    header: {}
  }
})

cases.push({
  input: 'curl https://api.sloths.com',
  output: {
    method: 'GET',
    url: 'https://api.sloths.com',
    header: {}
  }
})

cases.push({
  input: 'curl -u tobi:ferret https://api.sloths.com',
  output: {
    method: 'GET',
    url: 'https://api.sloths.com',
    header: {
      Authorization: 'Basic dG9iaTpmZXJyZXQ='
    }
  }
})

cases.push({
  input: 'curl -d "foo=bar" https://api.sloths.com',
  output: {
    method: 'POST',
    url: 'https://api.sloths.com',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'foo=bar'
  }
})

cases.push({
  input: 'curl -d "foo=bar" -d bar=baz https://api.sloths.com',
  output: {
    method: 'POST',
    url: 'https://api.sloths.com',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'foo=bar&bar=baz'
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
    }
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
    }
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
    }
  }
})

cases.push({
  input: "curl -b 'foo=bar' slothy https://api.sloths.com",
  output: {
    method: 'GET',
    url: 'https://api.sloths.com',
    header: { 'Set-Cookie': 'foo=bar' }
  }
})

cases.push({
  input: "curl --cookie 'foo=bar' slothy https://api.sloths.com",
  output: {
    method: 'GET',
    url: 'https://api.sloths.com',
    header: { 'Set-Cookie': 'foo=bar' }
  }
})

cases.push({
  input: "curl --cookie 'species=sloth;type=galactic' slothy https://api.sloths.com",
  output: {
    method: 'GET',
    url: 'https://api.sloths.com',
    header: { 'Set-Cookie': 'species=sloth;type=galactic' }
  }
})

cases.push({
  input: "curl -H 'content-type: application/json' -d price=1 https://api.sloths.com",
  output: {
    method: 'POST',
    url: 'https://api.sloths.com',
    header: { 'content-type': 'application/json' },
    body: "price=1"
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
