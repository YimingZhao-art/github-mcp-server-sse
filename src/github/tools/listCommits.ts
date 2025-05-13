import { listCommits } from "../githubApi";
import { listCommitsSchema } from "../schemas/commitSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerListCommitsTool(server: McpServer, props: Props) {
  server.tool(
    "list_commits",
    "Get list of commits of a branch in a GitHub repository",
    listCommitsSchema,
    async (args) => {
      const { owner, repo, page, perPage, sha } = args;
      const accessToken = props.accessToken;
      const result = await listCommits(owner, repo, page, perPage, sha, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 