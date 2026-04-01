Release the SDK to npm. Argument: ClickUp ticket ID (e.g. PV-123).

Follow these steps exactly:

1. Fetch the ClickUp ticket $ARGUMENTS to get the ticket title and description for context.
2. Run `yarn test` — abort if tests fail.
3. Run `yarn build` — abort if build fails.
4. Ask the user what to put in the changelog entry and what version bump type to use (patch, minor, or major — default: patch).
5. Run `npm version <bump_type> --no-git-tag-version` to bump the version in package.json.
6. Read the new version from package.json.
7. Update CHANGELOG.md: insert a new `## [VERSION] - YYYY-MM-DD` section after `## [Unreleased]`, using today's date, with the changelog entry from step 4.
8. Create a branch named `$ARGUMENTS/release/vVERSION` (e.g. `PV-123/release/v2.1.0`).
9. Commit package.json and CHANGELOG.md with `$ARGUMENTS VERSION` as the commit message (e.g. `PV-123 2.1.0`).
10. Push the branch with `-u origin`.
11. Create a PR titled "Release vVERSION" with a summary of the changelog entry. Include the ClickUp ticket reference.
12. Once the PR is created, wait for the user to confirm the PR has been merged.
13. Run `git checkout master && git pull`.
14. Run `git tag vVERSION` and `git push --tags`.
15. Run `npm publish`.
16. Confirm the release was published successfully.
