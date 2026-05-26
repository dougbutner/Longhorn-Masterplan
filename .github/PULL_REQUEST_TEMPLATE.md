<!--
Title MUST start with [<your-vaulta-name>]
  e.g. [annie] add lazy account materialization

`<your-vaulta-name>` must be a key in /CONTRIBUTORS.json.
The pr-vaulta-name workflow will fail the PR otherwise.
-->

## Vaulta identity

- vaulta name: `<your-vaulta-name>`
- on-chain account: `<EOS... or @name>`

## Masterplan nodes touched

<!-- list ids from masterplan/*.md frontmatter, e.g. d3-progress-map, lazy-account-materialization -->
- 

## Change summary

<!-- one paragraph; "why" over "what" -->

## Progress update

<!-- if you bumped progress %, list them: -->
<!-- - d3-progress-map: 45 → 60 -->
-

## Checklist

- [ ] PR title is `[<vaulta-name>] <summary>`
- [ ] Masterplan node `progress` / `status` updated in the corresponding `.md`
- [ ] Touched contracts under `flavors/Annie/contracts/<name>/` declare their `Upstream:` lineage
- [ ] No unrelated edits
