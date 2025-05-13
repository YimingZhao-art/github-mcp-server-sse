import { createIssue } from "../githubApi";
import { createIssueSchema } from "../schemas/issueSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerCreateIssueTool(server: McpServer, props: Props) {
  server.tool(
    "createIssue",
    "Create a new issue in a GitHub repository",
    createIssueSchema,
    async (args) => {
      const { owner, repo, ...options } = args;
      const accessToken = props.accessToken;
      const result = await createIssue(owner, repo, options, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 