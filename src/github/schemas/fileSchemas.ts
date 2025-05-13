import { z } from "zod";

export const createOrUpdateFileSchema = {
  owner: z.string(),
  repo: z.string(),
  path: z.string(),
  content: z.string(),
  message: z.string(),
  branch: z.string().optional(),
  sha: z.string().optional(),
};

export const getFileContentsSchema = {
  owner: z.string(),
  repo: z.string(),
  path: z.string(),
  branch: z.string().optional(),
};

export const pushFilesSchema = {
  owner: z.string(),
  repo: z.string(),
  branch: z.string(),
  files: z.array(z.object({
    path: z.string(),
    content: z.string(),
  })),
  message: z.string(),
}; 