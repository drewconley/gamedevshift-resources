import { Probot, ProbotOctokit, createProbot } from "probot";
import { createPullRequest as createPullRequestPlugin } from "octokit-plugin-create-pull-request";
import prettier from "prettier";

const probot = createProbot({
  defaults: {
    Octokit: ProbotOctokit.plugin(createPullRequestPlugin),
  },
});

async function getClient() {
  if (!process.env.INSTALL_ID) {
    throw new Error("INSTALL_ID env missing");
  }

  return probot.auth(parseInt(process.env.INSTALL_ID));
}

export const createPR = async (args: {
  title: string;
  url: string;
  blurb: string;
  tags: string[];
  username?: string;
}) => {
  const client = await getClient();

  // forgive me
  const createPullRequest = (client as any).createPullRequest as ReturnType<
    typeof createPullRequestPlugin
  >["createPullRequest"];

  const pr = await createPullRequest({
    owner: process.env.REPO_OWNER!,
    repo: process.env.REPO!,
    title: `[Resource] ${args.title}`,
    body: `### [${args.title}](${args.url})
**Blurb**
${args.blurb}

**Tags**
${args.tags.join(", ")}

**Submitted by**
${args.username ? `@${args.username}` : "anonymous"}`,
    base: process.env.REPO_BRANCH ?? "main",
    head: `pr-bot-${Date.now()}`,
    changes: [
      {
        files: {
          "src/data.json": ({ exists, encoding, content }) => {
            // do not create the file if it does not exist
            if (!exists) return null;

            const data = JSON.parse(
              Buffer.from(content, encoding).toString("utf-8")
            );

            const updated = [
              ...data,
              {
                title: args.title,
                url: args.url,
                blurb: args.blurb,
                tags: args.tags,
              },
            ];

            return prettier.format(JSON.stringify(updated), { parser: "json" });
          },
        },
        commit: `adds "${args.title}" to resources`,
      },
    ],
  });

  return pr?.data.html_url;
};
