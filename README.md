# RentRig — Equipment Rental Platform (Client)

RentRig is an equipment rental marketplace. Owners list equipment for rent, customers browse, book for specific dates and pay online, and admins approve listings and manage the platform.

- **Live site:** https://rentrig-app.vercel.app
- **Live API:** https://rentrig-api.vercel.app
- **Server repository:** https://github.com/lamia96588-source/equipment-rental-server

## Purpose

Buying equipment for a single job is expensive, and renting it informally is risky. RentRig gives owners and customers one place to list, find, book and pay for equipment, with clear prices, admin-reviewed listings and a record of every booking and payment.

## Key features

**Public site**
- Home page with an animated banner, featured equipment, categories, how it works, why choose us, recently added equipment and customer reviews
- All Equipment page with server-side search (name, location), filters (category, rental type, price range, availability), sorting and pagination
- Light and dark theme, saved in local storage
- Responsive on mobile, tablet and desktop

**Accounts and access**
- Email and password registration with password rules (uppercase, lowercase, at least 6 characters), and Google login
- Three roles: Customer, Owner and Admin. Google sign-ups become Customers
- A JWT access token is issued after login and sent to the API on every private request
- Private pages are checked on the server, so reloading never sends a logged-in user to the login page

**Customers**
- Equipment details page with owner information and rental terms
- Add to and remove from favorites
- Booking modal with dates, quantity, contact number and delivery address; the total is calculated before payment
- Stripe Checkout payment, a payment success page with the transaction ID, and a My Rentals table with payment and booking status
- Unpaid bookings can be paid later or cancelled

**Owners**
- Add equipment with an image upload (imgbb); new listings start as pending
- Update, delete and view their own equipment
- See rentals of their equipment and mark them completed or cancelled
- Analytics: listed equipment, completed rentals, total earnings and monthly earnings

**Admins**
- All Users: change roles and delete users
- All Equipment: approve, reject, update and delete listings
- All Rentals: monitor and manage every booking
- Analytics: total users, equipment, bookings, pending approvals, completed rentals, revenue and monthly booking statistics

Every role also has a profile page where they can update their name, photo, phone number and address.

## Tech stack

- Next.js (App Router), React
- Tailwind CSS and DaisyUI
- Better Auth with the MongoDB adapter
- Express and MongoDB API (separate repository)
- Stripe Checkout

## npm packages used

| Package | Used for |
| --- | --- |
| `next`, `react`, `react-dom` | Framework |
| `tailwindcss`, `daisyui` | Styling and UI components |
| `better-auth` | Email/password and Google authentication |
| `mongodb` | Database connection for Better Auth |
| `jsonwebtoken` | Signing the JWT access token |
| `framer-motion` | Animations |
| `recharts` | Dashboard charts |
| `react-hot-toast` | Toast messages |
| `sweetalert2` | Confirmation dialogs |
| `react-icons` | Icons |

## Run locally

1. Clone the repository and install packages:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in the values:

   | Variable | What it is |
   | --- | --- |
   | `NEXT_PUBLIC_API_URL` | URL of the Express API |
   | `NEXT_PUBLIC_IMGBB_API_KEY` | imgbb API key for image uploads |
   | `MONGODB_URI`, `DB_NAME` | MongoDB connection (same database as the server) |
   | `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | Better Auth secret and this site's URL |
   | `JWT_SECRET` | Must match `JWT_SECRET` on the server |
   | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth client |
   | `ADMIN_EMAIL` | The account that registers with this email becomes the admin |

3. Start the API from the server repository, then start the client:

   ```bash
   npm run dev
   ```

## Admin account

Set `ADMIN_EMAIL`, then register on the site with that email. That account is created with the Admin role. Other roles are changed from the admin's All Users page.
