# Recovery runbook: stuck v1.0.0 on `patinaproject/bootstrap` [#18](https://github.com/patinaproject/bootstrap/issues/18)

> **Finisher:** paste the "Post-merge manual recovery for v1.0.0" section below (from the `### Post-merge …` heading through the end of step 5) verbatim into the PR body under `Validation`.

## Paste-ready content

### Post-merge manual recovery for v1.0.0

`.release-please-manifest.json` already reads `{".":"1.0.0"}`, so re-running `Release` will **not** re-cut v1.0.0. Recovery is a one-shot manual sequence.

1. **Raise repo workflow permissions.** In the GitHub UI for `patinaproject/bootstrap`: **Settings → Actions → General → Workflow permissions → Read and write permissions** (save). Verify:

   ```bash
   gh api repos/patinaproject/bootstrap/actions/permissions/workflow \
     --jq .default_workflow_permissions
   ```

   Expected output: `write`. If it prints `read`, the toggle did not stick — escalate to an org admin or fall back to the PAT/App token path documented in `RELEASING.md`.

2. **Merge this PR.** Standard squash merge lands the template + root workflow changes on `main`.

3. **Manually create the `v1.0.0` tag and GitHub Release.** The merge commit of PR #9 is `270d51a`. Extract the `## [1.0.0]` section of `CHANGELOG.md` into a release-notes file first, then:

   ```bash
   gh release create v1.0.0 \
     --repo patinaproject/bootstrap \
     --target 270d51a \
     --title "v1.0.0" \
     --notes-file <release-notes-extracted-from-CHANGELOG.md>
   ```

   Then relabel PR #9:

   ```bash
   gh pr edit 9 --repo patinaproject/bootstrap \
     --remove-label "autorelease: pending" \
     --add-label "autorelease: tagged"
   ```

4. **Dispatch the `skills` marketplace bump manually.** Because Step 3 bypassed the workflow, `notify-patinaproject-skills` will not auto-fire for this one-shot recovery:

   ```bash
   gh workflow run bump-plugin-tags.yml \
     --repo patinaproject/skills \
     -f plugin=bootstrap \
     -f tag=v1.0.0
   ```

   Confirm a marketplace bump PR opens on `patinaproject/skills`.

5. **Confirm future releases are self-serving.** For the next release (e.g. 1.0.1), the job-level `permissions:` block lets the workflow path complete end-to-end. No manual step required. This recovery runbook was a one-shot.
