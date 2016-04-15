
# parse-curl.js

Parse curl commands, returning an object representing the request.

## Example

Input:

```
curl 'http://google.com/'
  -H 'Accept-Encoding: gzip, deflate, sdch'
  -H 'Accept-Language: en-US,en;q=0.8,da;q=0.6'
  -H 'Upgrade-Insecure-Requests: 1'
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36'
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
  -H 'Connection: keep-alive'
  --compressed
```

Output:

```json
{
  "method": "GET",
  "header": {
    "Accept-Encoding": "gzip, deflate, sdch",
    "Accept-Language": "en-US,en;q=0.8,da;q=0.6",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Connection": "keep-alive"
  },
  "url": "http://google.com/"
}
```

## Badges

[![GoDoc](https://godoc.org/github.com/tj/parse-curl.js?status.svg)](https://godoc.org/github.com/tj/parse-curl.js)
![](https://img.shields.io/badge/license-MIT-blue.svg)
![](https://img.shields.io/badge/status-stable-green.svg)

---

> [tjholowaychuk.com](http://tjholowaychuk.com) &nbsp;&middot;&nbsp;
> GitHub [@tj](https://github.com/tj) &nbsp;&middot;&nbsp;
> Twitter [@tjholowaychuk](https://twitter.com/tjholowaychuk)
