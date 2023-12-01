const PORT = process.env.PORT || 9876
const HOST = process.env.HOST || '::'

const _ = require('lodash')
const Koa = require('koa')
const doh = require('dohjs')
const app = new Koa()

app.use(async ctx => {
  try {
    let { domain, dns, timeout = 2 * 1000, type = ['A', 'AAAA'], ttl = 600 } = ctx.query
    if (!_.isArray(type)) {
      type = _.chain(type)
        .split(/,|\||;/)
        .map(_.trim)
        .value()
    }
    const result = { addresses: [], ttl: _.toInteger(ttl) }

    const resolver = new doh.DohResolver(dns)

    const aLookup = resolver.query(domain, 'A', undefined, undefined, timeout)
    const aaaaLookup = resolver.query(domain, 'AAAA', undefined, undefined, timeout)

    const lookups = {
      A: {
        lookup: aLookup,
        resolve: response => {
          response.answers.forEach(ans => {
            if (ans.type === 'A' && type.includes(ans.type) && ans.data) {
              if (ans.ttl > 0 && ans.ttl < result.ttl) {
                result.ttl = ans.ttl
              }
              result.addresses.push(ans.data)
            }
          })
        },
      },
      AAAA: {
        lookup: aaaaLookup,
        resolve: response => {
          response.answers.forEach(ans => {
            if (ans.type === 'AAAA' && type.includes(ans.type) && ans.data) {
              if (ans.ttl > 0 && ans.ttl < result.ttl) {
                result.ttl = ans.ttl
              }
              result.addresses.push(ans.data)
            }
          })
        },
      },
    }
    const results = await Promise.all(
      _.chain(type)
        .map(i => lookups[i].lookup)
        .value()
    )
    _.chain(type)
      .map((i, index) => lookups[i].resolve(results[index]))
      .value()

    ctx.body = result
  } catch (e) {
    ctx.throw(500, e)
  }
})
const listener = app.listen(PORT, HOST, async ctx => {
  const { address, port } = listener.address()
  console.log(`listening on port ${address}:${port}`)
})
