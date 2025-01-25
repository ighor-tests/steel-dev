import express, { Response } from 'express'
import morgan from 'morgan'
import { config } from 'dotenv'
import { authentication } from './middlewares'
import { BandwidthUsageCalculator, History, HistoryFormatter } from './services'
import { MetricsResponse } from './types'
import { createProxyMiddleware } from 'http-proxy-middleware'

config()

const PORT = process.env['PROXY_PORT'] || 8080

const app = express()

app.use(morgan('common'))

app.get('/metrics', (_, res): Response<MetricsResponse> => {
  const historyFormatter = new HistoryFormatter(history)

  return res.json(historyFormatter.format())
})

const history = new History()

app.use('/', authentication, (req, res, next) => {
  const dynamicProxy = createProxyMiddleware({
    logger: console,
    target: req.url,
    changeOrigin: true,
    followRedirects: true,
    on: {
      proxyRes: async (proxyRes) => {
        const bandwidthCalculator = new BandwidthUsageCalculator(proxyRes)

        const total = await bandwidthCalculator.calculate()

        history.add({
          bandwidthUsage: total,
          url: req.hostname
        })
      }
    }
  })

  return dynamicProxy(req, res, next)
})

const server = app.listen(PORT, () => {
  console.log(`Proxy Server Running http://localhost:${PORT}`)
})

const closeServer = () => {
  server.close(() => {
    const historyFormatter = new HistoryFormatter(history)

    console.log(JSON.stringify(historyFormatter.format()))
  })
}

let IS_SHUTTING_DOWN = false

const gracefullyShutdown = () => {
  if (IS_SHUTTING_DOWN) {
    return console.log('SERVER IS ALREADY SHUTTING DOWN')
  }

  console.log('STARTING SHUTDOWN')

  IS_SHUTTING_DOWN = true

  closeServer()
}

process.on('SIGTERM', gracefullyShutdown)
process.on('SIGINT', gracefullyShutdown)
