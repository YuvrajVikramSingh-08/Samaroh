# Samaroh: Next-Gen Event Management Platform

Samaroh is a comprehensive, full-stack event management platform designed specifically for large sporting venues, conventions, and festivals. It features a premium, stadium-themed UI and provides real-time crowd management, queue tracking, and venue visualization.

**Chosen Vertical:** Event Management / Smart Venue Operations

---

## 🧠 Approach and Logic
Our approach focuses on resolving large crowd bottlenecks by digitizing physical infrastructure. By splitting operations into strictly isolated Organiser and Attendee views, we ensure that event staff have full control over data flow, while attendees receive only the actionable insights they need. 
We rely on a **"Context-First"** logic model, meaning all data is fetched centrally and distributed via React Context, ensuring that UI updates are instantaneous and universally synced across the platform without the need for manual page reloads.

---

## 🌟 Key Features & Functionality

### 1. Dual-Role Architecture
- **Organiser Op-Center**: A command center for event staff to monitor live metrics, manage venue maps, resolve attendee complaints, and broadcast announcements.
- **Attendee Dashboard**: A personalized portal where users can view the live event schedule, check parking availability, join virtual queues, and report issues.

### 2. Real-Time Data Synchronization
Powered by Supabase WebSockets, the platform maintains a persistent, live connection. If an organiser advances a queue or updates a schedule, the changes are instantly reflected on all attendees' screens without requiring a page reload.

### 3. Smart Queue & Crowd Management
- **Virtual Queuing**: Attendees can join queues for food stalls or merchandise digitally. Organisers manage the depth of these queues.
- **Live Heatmaps**: The Organiser dashboard features a dynamic grid heatmap that visually represents crowd density, wait times, and unresolved complaints across different physical zones in the venue.

### 4. Venue & Map Visualization
- Organisers can build out virtual representations of the venue using a drag-and-drop Map Editor, dividing the space into "Grid Zones" (e.g., VIP sections, Food Courts).
- Attendees receive a live Google Maps embed scoped precisely to the custom venue address set by the organiser.

### 5. Automated RSVP & Security
- Attendees are granted access via a secure "Generate & Fill" RSVP flow. 
- The system generates a unique, cryptographically random RSVP code tied to a specific user and event, preventing unauthorized access and ensuring data isolation.

### 6. Issue Reporting & Ticketing
- Attendees can submit geo-tagged complaints (e.g., "Spill in Zone B2").
- Organisers receive these tickets in real-time, triaging them by status (New, In Progress, Resolved). Attendees can track the status of their specific reports securely.

---

## 📖 How to Use the Platform

### Using the Login Page
The login portal is tab-based:
1. **Attendee Login**: Requires you to select the specific event from a dropdown, enter your registered email, and input your unique RSVP code.
2. **Generate Code Tab**: If you do not have a code, attendees must select their event, enter their email, and click "Generate". The system securely stores this in the database and automatically switches you back to the login tab to sign in.
3. **Organiser Login**: Requires an authorized email address to access the global Op-Center.

### Using the Organiser Dashboard
- **Test Credentials**: The organiser login is pre-filled with the testing credentials (`tester@samaroh.com` / `Samaroh2024!`). Just click **Access Dashboard** to log in securely!
- **Home View**: When an organiser logs in, they see a list of all events. They can click "Create Event" to duplicate a template event or click the "Edit" pencil icon to rename an event's location (which updates the live Google Maps for attendees).
- **Op-Center Sidebar**: Clicking into an event opens the Op-Center sidebar.
  - **Overview**: View live heatmaps (Crowd, Wait Times, Complaints) and critical live stats (Currently Inside, Open Complaints).
  - **Map Editor**: Drag to create abstract grid zones representing the venue.
  - **Queues & Parking**: Add new virtual queues or parking zones and update their real-time status or depth.
  - **Schedule**: Add performances or sub-events.
  - **Broadcaster**: Send push-notifications directly to all attendee screens.

### Using the Attendee Dashboard
- **Navigation**: Attendees use a bottom navigation bar optimized for mobile devices.
- **Dashboard**: Displays live event stats, personal RSVP codes, and global announcements.
- **Schedule**: Browse the live schedule of sub-events and filter by category (e.g., VIP, Main Stage).
- **Queues**: View live wait times for food or merch. Click "Join Queue" to enter virtually—the system will alert you when you are up next.
- **Report Issue**: Submit a geo-tagged complaint by selecting the specific Zone you are in, and track its resolution status in real-time.

---

## 🚀 How the Solution Works

### The Data Flow
1. **Global State**: The `AppContext` initializes by fetching all required data (Events, Grid Zones, Queues, Parking, etc.) from the Supabase PostgreSQL database.
2. **Subscriptions**: It establishes a `postgres_changes` listener. Any mutation in the database triggers an instant re-fetch, guaranteeing all connected clients display identical state.
3. **Session Persistence**: User sessions are securely stored in the browser's `localStorage`, allowing users to survive page reloads without losing their active event dashboard.

### Event Templates
Creating a new event doesn't start from scratch. The system features a "Deep Copy" template engine. When an organiser creates a new event, Samaroh duplicates all existing Grid Zones, Parking Configurations, and Queues into entirely new database records tied to the new Event ID.

---

## ⚠️ Assumptions Made
- **Device Usage**: Attendees will primarily interact with the platform via mobile browsers, whereas organisers will use tablets or desktop monitors for the Op-Center.
- **Venue Abstraction**: Event venues can be cleanly divided into abstract grid zones for crowd density heatmapping.
- **Queue Authority**: Organisers act as the central authority for managing queue depths and parking spots manually, rather than relying on automated sensor hardware.
- **Prototype Scale**: For the scope of this prototype, data fetching is global rather than paginated, assuming event load stays within reasonable limits for competition evaluation.

---

## 🛠️ Technology Stack
- **Frontend**: React.js, Vite
- **Styling**: Tailwind CSS (with custom stadium-themed dark mode tokens)
- **State Management**: React Context API (`AppContext`, `AuthContext`)
- **Backend/Database**: Supabase (PostgreSQL)
- **Deployment**: Docker, Google Cloud Run

---

## 📦 Deployment Instructions

This project is fully dockerized and ready for production deployment on serverless container platforms.

### Local Development
1. Clone the repository.
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory and add your database keys.
4. Start the development server: `npm run dev`

### Production Deployment (Docker / Cloud Run)
The codebase includes a `Dockerfile` utilizing a multi-stage build process. It compiles the React application using Node.js and serves the optimized static bundle via a lightweight Nginx web server.

1. Ensure your `.env` variables are accessible during the build phase.
2. Build the Docker image natively.
3. Deploy the container to your preferred hosting provider (e.g., Google Cloud Run, AWS App Runner). 
*Note: Because React Router is used, the included `nginx.conf` is configured to correctly fallback to `index.html` on page reloads.*
