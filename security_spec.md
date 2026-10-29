# Nolok Marketplace Security Specification (Phase 0)

## 1. Data Invariants
- An unauthenticated user cannot modify products, approve boutiques, or alter platform settings.
- A user cannot spoof `ownerUid` or `customerUid` on creation.
- A boutique owner cannot edit or approve another vendor's boutique or change `isApproved` to true.
- A seller can only manage products belonging to their own boutique (`boutiqueId`).
- An order's ID and order number cannot be altered once created.
- Platform settings, coupons, and seller applications approvals are restricted strictly to administrators.
- PII fields in user accounts (`/users/{userId}`) are accessible strictly to the owner (`request.auth.uid == userId`) and administrators.

## 2. The "Dirty Dozen" Malicious Payloads
1. **User Profile Ghost Field Injection:** User attempts to write `{ id: "uid1", email: "user@test.com", role: "admin" }` to escalate privilege.
2. **User Identity Spoof:** User with UID `uid1` attempts to write document to `/users/uid2`.
3. **Boutique Self-Approval Attack:** Seller submits `{ isApproved: true, status: "active" }` directly to `/boutiques/shop1`.
4. **Product Boutique Impersonation:** Seller creates product referencing `boutiqueId: "other-shop"` that they do not own.
5. **Denial of Wallet Long String Attack:** Attacker attempts to create a product title with 50,000 characters.
6. **Negative Price Injection:** Malicious payload with `price: -500` or non-numeric price.
7. **Order Number Tampering:** Attempting to update `orderNumber` on an existing order.
8. **Unauthorized Coupon Generation:** Non-admin attempts to create a 100% off coupon code.
9. **Settings Overwrite:** Non-admin attempts to zero-out delivery fees or change platform commission.
10. **Admin Document Infiltration:** Non-admin writing to `/admins/attacker-uid`.
11. **Review Impersonation:** User writes review with `customerUid` of another customer.
12. **Newsletter Scraping Attack:** Unauthenticated user attempts to list all emails from `/newsletterSubscribers`.

All the above operations MUST return `PERMISSION_DENIED`.
