import axios from "axios";

export const getTrendingRepos = async () => {
  const lastWeek = new Date(Date.now() - 7 * 86400000)
    .toISOString()
    .split("T")[0];

  const { data } = await axios.get(
    "https://api.github.com/search/repositories",
    {
      params: {
        q: `created:>${lastWeek}`,
        sort: "stars",
        order: "desc",
        per_page: 10,
      },
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
    },
  );

  return data.items.map((r: any) => ({
    name: r.full_name,
    url: r.html_url,
    stars: r.stargazers_count,
    description: r.description,
    publishedAt: r.created_at,
  }));
};
