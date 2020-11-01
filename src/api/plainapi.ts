import axios, { AxiosResponse } from 'axios'
import useSWR from 'swr'

const baseURL = `${process.env.REACT_APP_PLAINAPI_BASE_URL}jslib-compare`
const request = axios.create({
  baseURL,
})

/**
 * 版本信息
 */
export interface Version {
  /**
   * 版本号
   */
  number: string
  /**
   * 发版日期
   */
  published_at: string
}

/**
 * js lib info
 */
export interface LibInfo {
  /**
   * package名称
   */
  name: string
  /**
   * 源码仓库地址
   */
  repository_url: string
  /**
   * 网站地址
   */
  homepage: string
  /**
   * 版本发布历史数据
   */
  versions: Version[]
  /**
   * 
   */
  dependent_repos_count: number
  /**
   * 
   */
  dependents_count: number
  /**
   * forks
   */
  forks: number
  licenses: string
  rank: number
  stars: number
  /**
   * npm url
   */
  package_manager_url: string
}

const fetchLibInfos = async (libs: string) => {
  const res = await request.get<any, AxiosResponse<{ [lib: string]: LibInfo | null }>>(`/release`, { params: { libs } })
  return res.data
}

/**
 * js libraries info data
 * @param packages package names on npm
 */
export const useLibInfos = (packages: string[]) => {
  const libs = packages.join(',')

  return useSWR(
    packages.length > 0 ? [libs, baseURL] : null,
    fetchLibInfos,
  )
}
