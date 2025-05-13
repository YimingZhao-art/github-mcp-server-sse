import { z } from "zod";

export const searchCodeSchema = {
  q: z.string(),
  sort: z.string().optional(),
  order: z.string().optional(),
  per_page: z.number().optional(),
  page: z.number().optional(),
};

export const searchIssuesSchema = {
  q: z.string(),
  sort: z.string().optional(),
  order: z.string().optional(),
  per_page: z.number().optional(),
  page: z.number().optional(),
};

export const searchUsersSchema = {
  q: z.string(),
  sort: z.string().optional(),
  order: z.string().optional(),
  per_page: z.number().optional(),
  page: z.number().optional(),
}; 