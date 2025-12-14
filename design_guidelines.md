# Design Guidelines: Temporary Email Web Application

## Design Approach

**Selected Approach:** Design System (Material Design principles)
**Justification:** This is a utility-focused web application where efficiency, clarity, and quick access to functionality are paramount. Users need to generate emails quickly, view messages clearly, and copy addresses seamlessly.

**Key Design Principles:**
- Clarity over decoration: Every element serves a functional purpose
- Scannable hierarchy: Users should instantly understand the interface
- Responsive efficiency: Optimized for both desktop and mobile usage
- Real-time feedback: Clear indicators for live updates and interactions

---

## Core Design Elements

### A. Typography

**Font Family:** Inter or Roboto via Google Fonts CDN

**Hierarchy:**
- **Hero/Primary Heading:** text-4xl md:text-5xl font-bold
- **Section Headers:** text-2xl md:text-3xl font-semibold
- **Email Subject Lines:** text-lg font-medium
- **Email Address Display:** text-xl md:text-2xl font-mono
- **Body Text:** text-base font-normal
- **Metadata (timestamps, sender):** text-sm font-normal
- **Labels/Helpers:** text-xs font-medium uppercase tracking-wide

### B. Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8 (e.g., p-2, gap-4, mb-6, py-8)

**Container Strategy:**
- Main app container: max-w-7xl mx-auto px-4
- Email content: max-w-4xl for optimal reading
- Sidebar/inbox list: fixed width of w-80 on desktop, full-width on mobile

**Grid Structure:**
- Desktop: Two-column layout (sidebar + main content area)
- Mobile: Single-column stack with collapsible inbox drawer

---

## C. Component Library

### Header Component
- Fixed position at top with subtle border-bottom
- Contains: Logo/brand name (left), generated email display (center), action buttons (right)
- Height: h-16 on mobile, h-20 on desktop
- Generated email display: Large, monospace font with copy button
- Timer display: Inline with email showing countdown (e.g., "Expires in 09:45")

### Email Generation Section
- Prominent on first load, minimizes after generation
- "Generate New Email" button: Large, rounded-lg, with icon
- Auto-generation on page load
- Display generated address in copyable format with icon button
- Expiration timer: Circular progress indicator or simple countdown

### Inbox Sidebar (Desktop) / Drawer (Mobile)
- Email list with card-based items
- Each email item contains:
  - Sender name/address (truncated)
  - Subject line (bold if unread)
  - Timestamp (relative: "2 min ago")
  - Preview snippet (first 60 chars)
  - Unread indicator dot
- Spacing: gap-2 between items, p-4 per card
- Hover state: Subtle elevation change
- Active/selected state: Border accent

### Email Viewer (Main Content Area)
- Full email header section:
  - From, To, Subject (each on separate rows)
  - Timestamp (full format)
  - Actions: Delete, Refresh inbox
- Email body container:
  - Renders HTML emails in iframe with max-w-full
  - Plain text fallback with preserved formatting
  - Padding: p-6 md:p-8
- Attachments section (if present): List with download icons

### Empty State
- Center-aligned when no emails received
- Icon (envelope/mail)
- Heading: "No emails yet"
- Subtext: "Your temporary inbox is empty. Send an email to test it."
- Copy address reminder button

### Loading States
- Skeleton screens for email list items
- Spinner for email content loading
- Pulse animation on real-time refresh

### Action Buttons
- Primary: "Generate New Email", "Copy Address"
- Secondary: "Refresh", "Delete"
- All buttons: rounded-lg, consistent height (h-10 or h-12)
- Icons from Heroicons (outline style)

---

## D. Animations

**Minimal approach** - only where they enhance usability:

1. **Copy Feedback:** Toast notification slide-in from top when address copied (duration-200)
2. **New Email Arrival:** Subtle fade-in for new inbox items (duration-300)
3. **List Item Selection:** Smooth transition when switching emails (duration-150)
4. **Timer Updates:** No animation - simple number updates

---

## Layout Specifications

### Desktop Layout (lg and above)
```
┌─────────────────────────────────────────────────┐
│  Header: Email Display | Timer | Actions        │
├──────────┬──────────────────────────────────────┤
│  Inbox   │  Email Viewer                        │
│  List    │  ┌────────────────────────────────┐  │
│  (w-80)  │  │ Email Header                   │  │
│          │  ├────────────────────────────────┤  │
│  Email 1 │  │                                │  │
│  Email 2 │  │ Email Content                  │  │
│  Email 3 │  │ (scrollable)                   │  │
│          │  │                                │  │
│          │  └────────────────────────────────┘  │
└──────────┴──────────────────────────────────────┘
```

### Mobile Layout (base/md)
- Full-width header with email address + copy button
- Hamburger menu toggles inbox drawer from left
- Main content takes full width
- Floating action button for quick actions

---

## Accessibility & UX
- Focus states: ring-2 ring-offset-2 for keyboard navigation
- ARIA labels for icon-only buttons
- Screen reader announcements for new emails
- High contrast text for readability
- Touch targets minimum 44px on mobile
- Copy confirmation with visual and text feedback

---

## Images

**No hero images for this application.** This is a utility tool focused on function over visual marketing. The interface should be clean and immediate, allowing users to start using the service without scrolling or visual distractions.