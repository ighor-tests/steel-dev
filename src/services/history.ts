import { sum } from 'mathjs'
import { MetricsResponse } from '../types'

export class History {
  private data: HistoryList

  constructor() {
    this.data = []
  }

  public add(entry: Pick<HistoryEntry, 'bandwidthUsage' | 'url'>) {
    this.data.push({
      ...entry,
      createdAt: new Date()
    })
  }

  public list() {
    return this.data
  }
}

export class HistoryFormatter {
  private history: History

  constructor(history: History) {
    this.history = history
  }

  format(): MetricsResponse {
    const historyList = this.history.list()

    const summed = historyList.reduce<SummedMetrics>(
      (previous, current) => {
        return {
          bandwidthUsage: sum(previous.bandwidthUsage, current.bandwidthUsage),
          topSites: {
            ...previous.topSites,
            [current.url]: sum(previous.topSites[current.url] || 0, 1)
          }
        }
      },
      {
        bandwidthUsage: 0,
        topSites: {}
      }
    )

    const result: MetricsResponse = {
      bandwidth_usage: this.formatBytes(summed.bandwidthUsage),
      top_sites: Object.entries(summed.topSites).map(([url, visits]) => ({
        url,
        visits
      }))
    }

    result.top_sites.sort((a, b) => b.visits - a.visits)

    return result
  }

  private formatBytes(bytes: number): string {
    const FORMATS = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
    let i = 0

    while (1023 < bytes) {
      bytes /= 1024
      ++i
    }

    return (i ? bytes.toFixed(2) : bytes) + ' ' + FORMATS[i]
  }
}

interface SummedMetrics {
  bandwidthUsage: number
  topSites: {
    [key: string]: number
  }
}

interface HistoryEntry {
  url: string
  bandwidthUsage: number
  createdAt: Date
}

type HistoryList = Array<HistoryEntry>
