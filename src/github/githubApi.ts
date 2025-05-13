import { z } from "zod";

export async function githubRequest(
  url: string,
  options: any = {},
  accessToken?: string
) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
    "User-Agent": "my-mcp-server-github-auth",
    ...options.headers,
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  const response = await fetch(url, {
    method: options.method || "POST",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(JSON.stringify(responseBody));
  }
  return responseBody;
}

export async function createIssue(
  owner: string,
  repo: string,
  options: any,
  accessToken: string
) {
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/issues`,
    { method: "POST", body: options },
    accessToken
  );
}

export async function createOrUpdateFile(
  owner: string,
  repo: string,
  path: string,
  options: any,
  accessToken: string
) {
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
    { method: "PUT", body: options },
    accessToken
  );
}

export async function getFileContents(
  owner: string,
  repo: string,
  path: string,
  branch: string | undefined,
  accessToken: string
) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}` + (branch ? `?ref=${encodeURIComponent(branch)}` : "");
  return githubRequest(url, { method: "GET" }, accessToken);
}

export async function pushFiles(
  owner: string,
  repo: string,
  branch: string,
  files: { path: string; content: string }[],
  message: string,
  accessToken: string
) {
  // 这里只是简单实现，实际应先获取 base tree/sha，再批量提交
  // 这里只支持单文件 push，复杂批量建议用 createOrUpdateFile 多次
  // 这里只做演示
  const results = [];
  for (const file of files) {
    const res = await createOrUpdateFile(owner, repo, file.path, {
      content: file.content,
      message,
      branch,
    }, accessToken);
    results.push(res);
  }
  return results;
}

export async function searchRepositories(
  query: string,
  page: number | undefined,
  perPage: number | undefined,
  accessToken: string
) {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}` +
    (page ? `&page=${page}` : "") +
    (perPage ? `&per_page=${perPage}` : "");
  return githubRequest(url, { method: "GET" }, accessToken);
}

export async function createRepository(
  options: any,
  accessToken: string
) {
  return githubRequest(
    `https://api.github.com/user/repos`,
    { method: "POST", body: options },
    accessToken
  );
}

export async function createPullRequest(
  owner: string,
  repo: string,
  options: any,
  accessToken: string
) {
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls`,
    { method: "POST", body: options },
    accessToken
  );
}

export async function forkRepository(
  owner: string,
  repo: string,
  organization: string | undefined,
  accessToken: string
) {
  const url = organization
    ? `https://api.github.com/repos/${owner}/${repo}/forks?organization=${encodeURIComponent(organization)}`
    : `https://api.github.com/repos/${owner}/${repo}/forks`;
  return githubRequest(url, { method: "POST" }, accessToken);
}

export async function createBranch(
  owner: string,
  repo: string,
  branch: string,
  from_branch: string,
  accessToken: string
) {
  // 1. Get the SHA of from_branch
  const refData = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(from_branch)}`,
    { method: "GET" },
    accessToken
  );
  const sha = refData.object.sha;
  // 2. Create new branch ref
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/git/refs`,
    {
      method: "POST",
      body: {
        ref: `refs/heads/${branch}`,
        sha,
      },
    },
    accessToken
  );
}

export async function listCommits(
  owner: string,
  repo: string,
  page: number | undefined,
  perPage: number | undefined,
  sha: string | undefined,
  accessToken: string
) {
  let url = `https://api.github.com/repos/${owner}/${repo}/commits`;
  const params = [];
  if (page) params.push(`page=${page}`);
  if (perPage) params.push(`per_page=${perPage}`);
  if (sha) params.push(`sha=${encodeURIComponent(sha)}`);
  if (params.length) url += `?${params.join("&")}`;
  return githubRequest(url, { method: "GET" }, accessToken);
}

export async function listIssues(
  owner: string,
  repo: string,
  options: any,
  accessToken: string
) {
  const params = new URLSearchParams();
  if (options.direction) params.append("direction", options.direction);
  if (options.labels) params.append("labels", options.labels.join(","));
  if (options.page) params.append("page", String(options.page));
  if (options.per_page) params.append("per_page", String(options.per_page));
  if (options.since) params.append("since", options.since);
  if (options.sort) params.append("sort", options.sort);
  if (options.state) params.append("state", options.state);
  const url = `https://api.github.com/repos/${owner}/${repo}/issues` + (params.toString() ? `?${params.toString()}` : "");
  return githubRequest(url, { method: "GET" }, accessToken);
}

export async function updateIssue(
  owner: string,
  repo: string,
  issue_number: number,
  options: any,
  accessToken: string
) {
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`,
    { method: "PATCH", body: options },
    accessToken
  );
}

export async function addIssueComment(
  owner: string,
  repo: string,
  issue_number: number,
  body: string,
  accessToken: string
) {
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}/comments`,
    { method: "POST", body: { body } },
    accessToken
  );
}

export async function searchCode(
  q: string,
  sort: string | undefined,
  order: string | undefined,
  per_page: number | undefined,
  page: number | undefined,
  accessToken: string
) {
  let url = `https://api.github.com/search/code?q=${encodeURIComponent(q)}`;
  if (sort) url += `&sort=${encodeURIComponent(sort)}`;
  if (order) url += `&order=${encodeURIComponent(order)}`;
  if (per_page) url += `&per_page=${per_page}`;
  if (page) url += `&page=${page}`;
  return githubRequest(url, { method: "GET" }, accessToken);
}

export async function searchIssues(
  q: string,
  sort: string | undefined,
  order: string | undefined,
  per_page: number | undefined,
  page: number | undefined,
  accessToken: string
) {
  let url = `https://api.github.com/search/issues?q=${encodeURIComponent(q)}`;
  if (sort) url += `&sort=${encodeURIComponent(sort)}`;
  if (order) url += `&order=${encodeURIComponent(order)}`;
  if (per_page) url += `&per_page=${per_page}`;
  if (page) url += `&page=${page}`;
  return githubRequest(url, { method: "GET" }, accessToken);
}

export async function searchUsers(
  q: string,
  sort: string | undefined,
  order: string | undefined,
  per_page: number | undefined,
  page: number | undefined,
  accessToken: string
) {
  let url = `https://api.github.com/search/users?q=${encodeURIComponent(q)}`;
  if (sort) url += `&sort=${encodeURIComponent(sort)}`;
  if (order) url += `&order=${encodeURIComponent(order)}`;
  if (per_page) url += `&per_page=${per_page}`;
  if (page) url += `&page=${page}`;
  return githubRequest(url, { method: "GET" }, accessToken);
}

export async function getIssue(
  owner: string,
  repo: string,
  issue_number: number,
  accessToken: string
) {
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`,
    { method: "GET" },
    accessToken
  );
}

export async function getPullRequest(
  owner: string,
  repo: string,
  pull_number: number,
  accessToken: string
) {
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`,
    { method: "GET" },
    accessToken
  );
}

export async function listPullRequests(
  owner: string,
  repo: string,
  options: any,
  accessToken: string
) {
  const params = new URLSearchParams();
  if (options.state) params.append("state", options.state);
  if (options.head) params.append("head", options.head);
  if (options.base) params.append("base", options.base);
  if (options.sort) params.append("sort", options.sort);
  if (options.direction) params.append("direction", options.direction);
  if (options.per_page) params.append("per_page", String(options.per_page));
  if (options.page) params.append("page", String(options.page));
  const url = `https://api.github.com/repos/${owner}/${repo}/pulls` + (params.toString() ? `?${params.toString()}` : "");
  return githubRequest(url, { method: "GET" }, accessToken);
}

export async function createPullRequestReview(
  owner: string,
  repo: string,
  pull_number: number,
  options: any,
  accessToken: string
) {
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/reviews`,
    { method: "POST", body: options },
    accessToken
  );
}

export async function mergePullRequest(
  owner: string,
  repo: string,
  pull_number: number,
  options: any,
  accessToken: string
) {
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/merge`,
    { method: "PUT", body: options },
    accessToken
  );
}

export async function getPullRequestFiles(
  owner: string,
  repo: string,
  pull_number: number,
  accessToken: string
) {
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/files`,
    { method: "GET" },
    accessToken
  );
}

export async function getPullRequestStatus(
  owner: string,
  repo: string,
  pull_number: number,
  accessToken: string
) {
  // 1. 获取 PR 信息，拿到 head sha
  const pr = await githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`,
    { method: "GET" },
    accessToken
  );
  const sha = pr.head.sha;
  // 2. 获取 status checks
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/commits/${sha}/status`,
    { method: "GET" },
    accessToken
  );
}

export async function updatePullRequestBranch(
  owner: string,
  repo: string,
  pull_number: number,
  expected_head_sha: string | undefined,
  accessToken: string
) {
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/update-branch`,
    { method: "PUT", body: expected_head_sha ? { expected_head_sha } : {} },
    accessToken
  );
}

export async function getPullRequestComments(
  owner: string,
  repo: string,
  pull_number: number,
  accessToken: string
) {
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/comments`,
    { method: "GET" },
    accessToken
  );
}

export async function getPullRequestReviews(
  owner: string,
  repo: string,
  pull_number: number,
  accessToken: string
) {
  return githubRequest(
    `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}/reviews`,
    { method: "GET" },
    accessToken
  );
} 