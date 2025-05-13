import { z } from "zod";

export const createIssueSchema = {
  owner: z.string(),
  repo: z.string(),
  title: z.string(),
  body: z.string().optional(),
  assignees: z.array(z.string()).optional(),
  milestone: z.number().optional(),
  labels: z.array(z.string()).optional(),
};

export const listIssuesSchema = {
  owner: z.string(),
  repo: z.string(),
  direction: z.enum(["asc", "desc"]).optional(),
  labels: z.array(z.string()).optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
  since: z.string().optional(),
  sort: z.enum(["created", "updated", "comments"]).optional(),
  state: z.enum(["open", "closed", "all"]).optional(),
};

export const updateIssueSchema = {
  owner: z.string(),
  repo: z.string(),
  issue_number: z.number(),
  title: z.string().optional(),
  body: z.string().optional(),
  assignees: z.array(z.string()).optional(),
  milestone: z.number().optional(),
  labels: z.array(z.string()).optional(),
  state: z.enum(["open", "closed"]).optional(),
};

export const issueCommentSchema = {
  owner: z.string(),
  repo: z.string(),
  issue_number: z.number(),
  body: z.string(),
};

export const getIssueSchema = {
  owner: z.string(),
  repo: z.string(),
  issue_number: z.number(),
}; 