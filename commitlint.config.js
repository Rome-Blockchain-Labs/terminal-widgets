module.exports = {
  extends: ["@commitlint/config-conventional"],
  // update rules if you want to add more commit types
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "build",
        "chore",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "revert",
        "style",
        "test",
        //tool - when adding and configuring dev dependencies
        "tool",
        //minor - when adding minor changes to an existing feat
        "minor",
      ],
    ],
  },
};
