# NACS Events Ticketing App

A ticketing application for the Nigerian Association of Computing Students (NACS) events.

## Features

- Event information display
- Ticket purchase with form validation
- Payment integration (simulated with Mono API)
- QR code generation for tickets
- Admin dashboard for ticket validation
- QR code scanning functionality

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- HTML5-QR-Code scanner
- QRCode.react for QR code generation
- Mono API (simulated) for payment verification

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone [repository-url]
cd cscevents
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Run the development server

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Application Structure

- `/events` - Main landing page with event information
- `/tickets` - Event details and ticket purchase link
- `/tickets/purchase` - Ticket purchase form
- `/tickets/confirmation` - Confirmation page with QR code
- `/admin` - Admin dashboard for ticket scanning and validation

## Payment Integration

The application is configured to work with Mono API. In the development environment, payments are simulated to always succeed.

For a production environment, you would need to:

1. Register for a Mono API account
2. Set up your secret key in environment variables
3. Update the payment verification logic in `lib/mono.ts`

## Deployment

The application can be deployed using Vercel:

```bash
npm run build
# then deploy using Vercel or other platforms
```
