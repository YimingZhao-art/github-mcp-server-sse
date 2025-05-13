import { z } from "zod";

export const listCommitsSchema = {
  owner: z.string(),
  repo: z.string(),
  page: z.number().optional(),
  perPage: z.number().optional(),
  sha: z.string().optional(),
}; 