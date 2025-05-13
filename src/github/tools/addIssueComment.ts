import { addIssueComment } from "../githubApi";
import { issueCommentSchema } from "../schemas/issueSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerAddIssueCommentTool(server: McpServer, props: Props) {
  server.tool(
    "add_issue_comment",
    "Add a comment to an existing issue",
    issueCommentSchema,
    async (args) => {
      const { owner, repo, issue_number, body } = args;
      const accessToken = props.accessToken;
      const result = await addIssueComment(owner, repo, issue_number, body, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 