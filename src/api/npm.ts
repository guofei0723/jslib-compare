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

interface DownloadDataItem {
  /**
   * 下载量
   */
  downloads: number
  /**
   * 日期
   */
  day: string
}

interface DownloadData {
  downloads: DownloadDataItem[]
}

/**
 * rang下载量数据格式
 */
interface RangeData {
  [libName: string]: DownloadData | null
}

const rangeFetcher = (url: string, libsStr: string, scopeLibsStr: string) => {
  const libsUrl = `${url}/${libsStr}`
  const scopeLibs = scopeLibsStr ? scopeLibsStr.split(',') : []

  // 获取普通js包的下载量
  const libsPromise = new Promise<AxiosResponse<RangeData>>((resolve, reject) => {
    baseFetcher<RangeData>(libsUrl)
      .then((res) => resolve(res))
      .catch((e) => reject(e))
  })
  // 每个scope形式的包单独请求
  const scopePromiseList = scopeLibs.map(lib => new Promise<AxiosResponse<DownloadData> | null>((resolve, reject) => {
    request.get<any, AxiosResponse<DownloadData>>(`${url}/${lib}`)
      .then((res) => {
        resolve(res)
      })
      .catch((e) => {
        if (e.response.status === 404) {
          resolve(null)
        } else {
          console.error(e)
          reject(e)
        }
      })
  }))

  return new Promise<RangeData>((resolve, reject) => {
    Promise.all<AxiosResponse<RangeData> | AxiosResponse<DownloadData> | null>([libsPromise, ...scopePromiseList])
      .then(([libsData, ...scopeDataList]) => {
        const result = libsData as AxiosResponse<RangeData>
        for(let i = 0; i < scopeLibs.length; i++) {
          const scopeData = scopeDataList[i] as AxiosResponse<DownloadData> | null
          result.data[scopeLibs[i]] = scopeData?.data || null
        }

        resolve(result.data)
      })
      .catch((e) => {
        console.error(e)
        reject(e)
      })
  })
}

/**
 * 获取一段时间内每天的下载量
 * @param period 
 * @param packages 
 */
export const useNpmRangeData = (period: Period, ...packages: string[]) => {
  // npm不支持批量查询scope形式的js包，如"@babel/core"，所以需要单独处理
  const scopeLibs = packages.filter(p => p.startsWith('@')).sort()
  // 普通包名
  const libs = packages.filter(p => !p.startsWith('@')).sort()
  if (libs.length === 1) {
    libs.push('_placeholder_')
  }

  return useSWR(
    packages.length > 0 ? [`/downloads/range/${period}`, libs.join(','), scopeLibs.join(',')] : null,
    rangeFetcher,
  )
}

export const useNpmMetaData = (packageName: string) => useSWR(
  `/${packageName}`,
  baseFetcher,
)
