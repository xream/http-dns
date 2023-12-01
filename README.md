# HTTP DNS

## Usage

`pnpm i`

`HOST=127.0.0.1 PORT=9876 pnpm start`

## Query

`curl http://127.0.0.1:9876/?domain=ipv6.baidu.com&ttl=600&type=A,AAAA&dns=https%3A%2F%2F1.0.0.1%2Fdns-query`

| Param    | Desc                                                   | Example                                                         |
| -------- | ------------------------------------------------------ | --------------------------------------------------------------- |
| `domain` | domain                                                 | `ipv6.baidu.com`                                                |
| `ttl`    | default min TTL                                        | `600`                                                           |
| `type`   | the type of record (only `A` and `AAAA` are supported) | `A`, `AAAA`, `A,AAAA`, `AAAA,A`                                 |
| `dns`    | DNS                                                    | `https://1.0.0.1/dns-query`, `http://127.0.0.1:30000/dns-query` |

## Response

```JSON
{
  "addresses": [
    "153.3.238.102",
    "153.3.238.110",
    "2408:873d:22:18ac:0:ff:b021:1393",
    "2408:873d:22:1a01:0:ff:b087:eecc"
  ],
  "ttl": 600
}
```
