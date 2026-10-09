
# Cloud Access Portal

A responsive access-management dashboard built with React. Users can browse applications, submit access requests, and review approval decisions through a manager inbox.

## Features

### Application Catalog
- Browse applications across Cloud, Developer Tools, and Business Apps.
- Search applications by name and filter by category.
- View risk levels and recommended applications.
- Submit access requests with a selected duration and business justification.

### Access Request Workflow
- Choose from 4 Hours, 8 Hours (1 Day), 7 Days, or 30 Days.
- Require a minimum of 20 characters in the business justification.
- Display a live character counter and validation feedback.
- Add submitted requests to the Manager Inbox.
- Show success and error notifications.

### Manager Inbox
- View request totals for Pending, Approved, and Rejected.
- Search requests and filter them by status.
- Review requester details, application, duration, and justification.
- Display risk-based compliance warnings and a contextual risk summary.
- Approve requests or reject them with a reason.
- Show an "All caught up" message when no requests are pending.
- Reset the demo data to the original sample requests.

### Persistence
- Store request changes in browser Local Storage.
- Preserve requests after refreshing the page.
- Restore the initial sample requests using Reset demo data.

## Tech Stack

- React
- JavaScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Browser Local Storage

## Getting Started

### Prerequisites
- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/ris-habhk/cloud-access-portal.git
cd cloud-access-portal
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## Validation

Create a production build:

```bash
npm run build
```

Run the linter:

```bash
npm run lint
```

## Project Structure

```text
cloud-access-portal/
├── public/
├── src/
│   ├── components/
│   │   ├── AppCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── RequestDetailsDrawer.jsx
│   │   ├── RequestDrawer.jsx
│   │   ├── RiskBadge.jsx
│   │   ├── StatusBadge.jsx
│   │   └── Toast.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── pages/
│   │   ├── Catalog.jsx
│   │   └── Inbox.jsx
│   ├── index.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

*This tree describes the intended project structure. Keep only entries that actually exist in your repository.*

## Demo Notes

This project uses sample data and browser Local Storage to demonstrate an access-request workflow. Risk and compliance messages are illustrative and are not a real security assessment or authorization decision. It does not grant actual permissions to external applications.

## Repository

[GitHub: Cloud Access Portal](https://github.com/ris-habhk/cloud-access-portal)

## Author

Rishabh Kumar

[LinkedIn](https://www.linkedin.com/in/rishabh-kumar-48031328a)
