import { pushFiles } from "../githubApi";
import { pushFilesSchema } from "../schemas/fileSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerPushFilesTool(server: McpServer, props: Props) {
  server.tool(
    "push_files",
    "Push multiple files to a GitHub repository in a single commit",
    pushFilesSchema,
    async (args) => {
      const { owner, repo, branch, files, message } = args;
      const accessToken = props.accessToken;
      const result = await pushFiles(owner, repo, branch, files, message, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 