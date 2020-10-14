import axios, { AxiosResponse } from 'axios'
import useSWR from 'swr'

const request = axios.create({
  baseURL: 'https://api.npmjs.org/',
})

type Period = string | 'last-week' | 'last-month'

/**
 * 通过基础fetcher
 * @param url 
 */
const baseFetcher = <T=any>(url: string) => request.get<any, AxiosResponse<T>>(url)

/**
 * rang下载量数据格式
 */
interface RangeData {
  [libName: string]: {
    downloads: {
      /**
       * 下载量
       */
      downloads: number
      /**
       * 日期
       */
      day: string
    }[]
  } | null
}

const rangeFetcher = (url: string) => baseFetcher<RangeData>(url)

/**
 * 获取一段时间内每天的下载量
 * @param period 
 * @param packages 
 */
export const useNpmRangeData = (period: Period, ...packages: string[]) => {
  const libs = packages.sort()
  if (libs.length === 1) {
    libs.push('_placeholder_')
  }

  return useSWR(
    libs.length > 0 ? `/downloads/range/${period}/${libs.join(',')}` : null,
    rangeFetcher,
  )
}

export const useNpmMetaData = (packageName: string) => useSWR(
  `/${packageName}`,
  baseFetcher,
)
