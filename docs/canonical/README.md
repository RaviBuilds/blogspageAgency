# Blogspage Canonical Documentation

These documents define the current authoritative guidance for the Blogspage Agency project.

## Document priority

### 1. BLOGSPAGE_AI_HOMEPAGE_MASTER_BLUEPRINT_v2.0.md

Primary authority for homepage strategy, positioning, messaging, information architecture, UX, visual direction, storytelling, motion direction, conversion strategy, scalable homepage architecture, and homepage implementation intent.

For homepage work, this document takes priority over older homepage planning documents.

### 2. BLOGSPAGE_SEARCH_VISIBILITY_AND_ENTITY_BLUEPRINT.md

Primary authority for Google Search visibility strategy, brand/entity consistency, sitelink-supporting site architecture, Google Business Profile relationship, local/entity signals, important-page discoverability, FAQ strategy, and search-oriented internal linking.

### 3. blogspage-architecture-report.md

Primary architecture reference.

Use it to understand:
- application structure
- component relationships
- shared dependencies
- homepage dependencies
- route relationships
- internal-linking contracts
- data dependencies
- protected architecture

Do not treat it as a visual or content redesign brief.

### 4. seo-audit-report.md

Primary SEO reference and protection document.

Use it to understand:
- existing SEO architecture
- canonical requirements
- crawl/indexation requirements
- sitemap relationships
- structured-data constraints
- programmatic solution SEO
- known SEO findings
- SEO-sensitive files

SEO infrastructure must not be changed casually during homepage work.

## Scope rules

For homepage work:
- Read all files in docs/canonical/ before implementation.
- The v2 homepage blueprint is the primary design/strategy authority.
- The architecture report is the dependency/technical authority.
- The SEO audit is the SEO-protection authority.

For dental solution-page work:
- Read docs/dental/ as the relevant project reference set.
- Do not treat dental documents as global homepage instructions.

For archived documents:
- docs/archive/ contains superseded or historical planning documents.
- Archived documents are reference material only.
- They must not override current canonical documents.

For .kiro specifications:
- .kiro/specs/ contains formal implementation/remediation specifications.
- Do not move, rename, delete, or rewrite those files as part of documentation cleanup unless a separate task explicitly authorizes it.

## Conflict rule

When documents conflict:
1. Follow the most recent applicable canonical document.
2. Use the architecture report for technical dependency constraints.
3. Use the SEO audit for SEO protection.
4. Treat archived documents as historical reference only.
5. Never resolve a conflict by silently changing the application.

## Critical principle

Existing URLs, SEO infrastructure, shared architecture, and protected dependencies must be preserved unless a dedicated implementation/SEO plan explicitly authorizes a change.
