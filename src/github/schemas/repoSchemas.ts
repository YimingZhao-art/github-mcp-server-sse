import { z } from "zod";

export const searchRepositoriesSchema = {
  query: z.string(),
  page: z.number().optional(),
  perPage: z.number().optional(),
};

export const createRepositorySchema = {
  name: z.string(),
  description: z.string().optional(),
  private: z.boolean().optional(),
  org: z.string().optional(),
  auto_init: z.boolean().optional(),
};

export const forkRepositorySchema = {
  owner: z.string(),
  repo: z.string(),
  organization: z.string().optional(),
};

export const createBranchSchema = {
  owner: z.string(),
  repo: z.string(),
  branch: z.string(),
  from_branch: z.string(),
}; 