import { Octokit } from '@octokit/rest'
import useSWR from 'swr'

export const octokit = new Octokit({
  baseUrl: 'https://api.github.com',
})

/**
 * 获取仓库数据
 * @param owner 
 * @param repo 
 */
export const useRepoData = (owner: string, repo: string) => useSWR(
  ['GET /repos/{owner}/{repo}', owner, repo],
  (url, owner, repo) => octokit.request(url, {
    owner,
    repo,
  })
)
