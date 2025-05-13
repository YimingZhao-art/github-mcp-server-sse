import { createBranch } from "../githubApi";
import { createBranchSchema } from "../schemas/repoSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerCreateBranchTool(server: McpServer, props: Props) {
  server.tool(
    "create_branch",
    "Create a new branch in a GitHub repository",
    createBranchSchema,
    async (args) => {
      const { owner, repo, branch, from_branch } = args;
      const accessToken = props.accessToken;
      const result = await createBranch(owner, repo, branch, from_branch, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 