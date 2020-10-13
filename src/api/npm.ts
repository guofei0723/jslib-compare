import axios from 'axios'
import useSWR from 'swr'

const request = axios.create({
  baseURL: 'https://api.npmjs.org/',
})

type Period = string | 'last-week' | 'last-month'

/**
 * 通过基础fetcher
 * @param url 
 */
const baseFetcher = (url: string) => request.get(url)

/**
 * 获取一段时间内每天的下载量
 * @param period 
 * @param packages 
 */
export const useNpmRangeData = (period: Period, ...packages: string[]) => useSWR(
  `/downloads/range/${period}/${packages.join(',')}`,
  baseFetcher,
)

export const useNpmMetaData = (packageName: string) => useSWR(
  `/${packageName}`,
  baseFetcher,
)
