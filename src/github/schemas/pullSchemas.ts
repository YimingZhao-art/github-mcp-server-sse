import { z } from "zod";

export const createPullRequestSchema = {
  owner: z.string(),
  repo: z.string(),
  title: z.string(),
  head: z.string(),
  base: z.string(),
  body: z.string().optional(),
  draft: z.boolean().optional(),
};

export const getPullRequestSchema = {
  owner: z.string(),
  repo: z.string(),
  pull_number: z.number(),
};

export const listPullRequestsSchema = {
  owner: z.string(),
  repo: z.string(),
  state: z.string().optional(),
  head: z.string().optional(),
  base: z.string().optional(),
  sort: z.string().optional(),
  direction: z.string().optional(),
  per_page: z.number().optional(),
  page: z.number().optional(),
};

export const createPullRequestReviewSchema = {
  owner: z.string(),
  repo: z.string(),
  pull_number: z.number(),
  body: z.string().optional(),
  event: z.string().optional(),
  comments: z.array(z.object({
    path: z.string(),
    position: z.number(),
    body: z.string(),
  })).optional(),
};

export const mergePullRequestSchema = {
  owner: z.string(),
  repo: z.string(),
  pull_number: z.number(),
  commit_title: z.string().optional(),
  commit_message: z.string().optional(),
  sha: z.string().optional(),
  merge_method: z.string().optional(),
};

export const getPullRequestFilesSchema = {
  owner: z.string(),
  repo: z.string(),
  pull_number: z.number(),
};

export const getPullRequestStatusSchema = {
  owner: z.string(),
  repo: z.string(),
  pull_number: z.number(),
};

export const updatePullRequestBranchSchema = {
  owner: z.string(),
  repo: z.string(),
  pull_number: z.number(),
  expected_head_sha: z.string().optional(),
};

export const getPullRequestCommentsSchema = {
  owner: z.string(),
  repo: z.string(),
  pull_number: z.number(),
};

export const getPullRequestReviewsSchema = {
  owner: z.string(),
  repo: z.string(),
  pull_number: z.number(),
}; 