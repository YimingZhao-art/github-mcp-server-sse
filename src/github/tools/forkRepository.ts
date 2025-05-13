import { forkRepository } from "../githubApi";
import { forkRepositorySchema } from "../schemas/repoSchemas";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Props } from "../../utils";

export function registerForkRepositoryTool(server: McpServer, props: Props) {
  server.tool(
    "fork_repository",
    "Fork a GitHub repository to your account or specified organization",
    forkRepositorySchema,
    async (args) => {
      const { owner, repo, organization } = args;
      const accessToken = props.accessToken;
      const result = await forkRepository(owner, repo, organization, accessToken);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }],
      };
    }
  );
} 