import http from 'http'
import { sum } from 'mathjs'

export class BandwidthUsageCalculator {
  private message: http.IncomingMessage

  constructor(message: http.IncomingMessage) {
    this.message = message
  }

  private calculateHeaderSize() {
    return this.message.rawHeaders.reduce((previous, current) => {
      return sum(previous, Buffer.byteLength(current))
    }, 0)
  }

  private calculateBodySize(): Promise<number> {
    return new Promise((resolve, reject) => {
      let responseBandwidthUsage = 0

      this.message.on('data', (chunks) => {
        const bandwidth = Buffer.byteLength(chunks)

        responseBandwidthUsage = sum(responseBandwidthUsage, bandwidth)
      })

      this.message.on('end', () => {
        resolve(responseBandwidthUsage)
      })

      this.message.on('error', reject)
    })
  }

  public async calculate() {
    const headerSize = this.calculateHeaderSize()
    const bodySize = await this.calculateBodySize()

    return sum(headerSize, bodySize)
  }
}
