# Cloud Access Portal
A React-based access management portal for requesting and reviewing temporary access to enterprise applications.
Cloud Access Portal is a frontend application designed to demonstrate an enterprise-style access request workflow. Employees can discover available applications, request time-limited access, and provide business justifications. Managers can view submitted requests through a dedicated inbox.
The project focuses on reusable React components, responsive UI design, form validation, and state management.
## Tech Stack
- Frontend: React.js, JavaScript
- Build Tool: Vite
- Styling: Tailwind CSS
- Routing: React Router
- State Management: React Hooks (useState)
- Development Tools: Git, GitHub, VS Code
## Features
### 1. Application Catalog
- Browse available enterprise applications
- Search applications by name
- Filter applications by category
- View application descriptions and risk classifications
- Identify recommended applications
- Responsive application cards
### 2. Access Request Workflow
- Open an access request drawer
- Select access duration:
  - 4 Hours
  - 8 Hours (1 Day)
  - 7 Days
  - 30 Days
- Provide a business justification
- Validate justification with a minimum of 20 characters
- Display a live character counter
- Submit access requests
- Display a success notification
### 3. Manager Inbox
- View existing and newly submitted access requests
- View requester information and roles
- View requested applications and durations
- View request justifications
- Display request status and risk classification
## Application Workflow
Application Catalog
        |
        v
Select Application
        |
        v
Request Access
        |
        v
Select Access Duration
        |
        v
Provide Business Justification
        |
        v
Validate and Submit
        |
        v
Manager Inbox

## Project Structure
cloud-access-portal/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── AppCard.jsx
│   │   ├── RequestDrawer.jsx
│   │   └── Toast.jsx
│   ├── data/
│   │   └── mockData.js
│   ├── hooks/
│   ├── pages/
│   │   ├── Catalog.jsx
│   │   └── Inbox.jsx
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md

## Getting Started
### Prerequisites
- Node.js
- npm
- Git
### Installation
1. Clone the repository
git clone https://github.com/ris-habhk/cloud-access-portal.git

2. Navigate to the project directory
cd cloud-access-portal

3. Install dependencies
npm install

4. Start the development server
npm run dev

5. Open the application
Open the local development URL provided by Vite, usually:
http://localhost:5173

### Author
Rishabh Kumar
- GitHub: https://github.com/ris-habhk
- LinkedIn: https://www.linkedin.com/in/rishabh-kumar-48031328a