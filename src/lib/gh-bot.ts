import { Probot, ProbotOctokit, createProbot } from "probot";
import { createPullRequest as createPullRequestPlugin } from "octokit-plugin-create-pull-request";
import prettier from "prettier";
import slug from "slug";
import { removeUrlProtocol } from "./util";

const probot = createProbot({
  env: {
    NODE_ENV: process.env.NODE_ENV,
    APP_ID: process.env.GITHUB_APP_ID,
    PRIVATE_KEY: process.env.GITHUB_APP_PRIVATE_KEY,
    LOG_LEVEL: process.env.GITHUB_APP_LOG_LEVEL,
  },
  defaults: {
    Octokit: ProbotOctokit.plugin(createPullRequestPlugin),
  },
});

async function getClient() {
  if (!process.env.GITHUB_APP_INSTALL_ID) {
    throw new Error("GITHUB_APP_INSTALL_ID env missing");
  }

  return probot.auth(parseInt(process.env.GITHUB_APP_INSTALL_ID));
}

export const createPR = async (args: {
  title: string;
  url: string;
  image: string;
  blurb: string;
  tags: string[];
  username?: string;
}) => {
  if (!process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER) {
    throw new Error("NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER env missing");
  }

  if (!process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG) {
    throw new Error("NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG env missing");
  }

  if (!process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF) {
    throw new Error("NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF env missing");
  }

  const client = await getClient();

  const pr = await client.createPullRequest({
    owner: process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER,
    repo: process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG,
    title: `[Resource] ${args.title}`,
    body: `### ${args.title}
**URL**
[${args.url}](${args.url})

**Image**
[${args.image}](${args.image})

**Blurb**
${args.blurb}

**Tags**
${args.tags.join(", ")}

**Submitted by**
${args.username ? `@${args.username}` : "anonymous"}

---

_Note to maintainers: if this resource needs to be resubmitted, please close this PR and delete the branch_
`,
    base: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF,
    head: `bot/add-resource-${slug(removeUrlProtocol(args.url), {})}`,
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
                image: args.image,
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

declare module "@octokit/core" {
  interface Octokit {
    createPullRequest: ReturnType<
      typeof createPullRequestPlugin
    >["createPullRequest"];
  }
}
