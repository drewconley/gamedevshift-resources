import resources from "../data.json";

/**
 * Gets all unique tags from data.json
 */
export function getTags(): string[] {
  return [
    ...resources.reduce((tags, resource) => {
      resource.tags.forEach((tag) => {
        tags.add(tag);
      });
      return tags;
    }, new Set<string>()),
  ];
}
