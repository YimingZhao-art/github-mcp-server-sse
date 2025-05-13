import { getPullRequestFiles } from "../githubApi";
import { getPullRequestFilesSchema } from "../schemas/pullSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerGetPullRequestFilesTool(server: McpServer, props: Props) {
  server.tool(
    "get_pull_request_files",
    "Get the list of files changed in a pull request",
    getPullRequestFilesSchema,
    async (args) => {
      const { owner, repo, pull_number } = args;
      const accessToken = props.accessToken;
      const result = await getPullRequestFiles(owner, repo, pull_number, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 