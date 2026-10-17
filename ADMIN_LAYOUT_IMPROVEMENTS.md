# Admin workspace layout improvements

This update reorganizes the existing admin navigation without changing the database schema or product/image persistence logic.

- Added a grouped desktop sidebar for Products & Inventory, Orders, Customers, Dispatch & Transport, Walk-in Billing, Sales Analytics, Factory Profile & QR, Categories, Banners & Media, Company Details, and Theme & Appearance.
- Added a collapsible mobile navigation menu with clear labels and descriptions.
- Added active-section indication and keyboard-semantic buttons/links.
- Replaced the horizontal seller operations tab strip with a responsive grid that keeps all seven operational sections visible without sideways scrolling.
- Preserved company profile branding, the red theme palette, product update fixes, and image upload behavior from the previous archive.

## Validation

The modified TypeScript/JSX files passed TypeScript transpilation/syntax checks. A full type-check/production build could not be completed because package installation was unavailable in this environment. Please run `npm ci` and `npm run build` in an environment with package-registry access before deploying.
