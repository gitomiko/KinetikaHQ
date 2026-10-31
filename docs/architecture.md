# KinetikaHQ architecture

KinetikaHQ separates source control from runtime deployment.

- The canonical monorepo contains the HQ portal, public website, and design source.
- HQ runtime hosts receive only `apps/hq` plus a local, untracked `.env`.
- Public website runtime hosts receive only `apps/web` plus a local, untracked `.env`.
- Reverse-proxy and edge-access policies remain private operational state.
- The public GitHub mirror contains no private network addresses, credentials,
  local overrides, or deployment-specific service catalogs.

The HQ portal is the administration and orchestration surface. The public
website is the static experience layer. They share design assets and source
history but remain independently deployable applications.
