import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import UpcomingEvents from './pages/UpcomingEvents.jsx'
import Clubs from './pages/Clubs.jsx'
import CoordinatorLogin from './pages/CoordinatorLogin.jsx'
import Notifications from './pages/Notifications.jsx'
import CoordinatorDashboard from './pages/CoordinatorDashboard.jsx'
import NotifyStudents from './pages/NotifyStudents.jsx'
import BudgetDocumentation from './pages/BudgetDocumentation.jsx'
import StudentAnalytics from './pages/StudentAnalytics.jsx'
import CreatePoster from './pages/CreatePoster.jsx'
import CreateEvents from './pages/CreateEvents.jsx'
import EventDetails from './pages/EventDetails.jsx'
import ManageEvents from './pages/ManageEvents.jsx'
import Settings from './pages/Settings.jsx'
import EventRegistration from './pages/EventRegistration.jsx'
import EventFeedback from './pages/EventFeedback.jsx'
import CompletedEvents from './pages/CompletedEvents.jsx'
import RegisteredStudents from './pages/RegisteredStudents.jsx'
import StudentFeedback from './pages/StudentFeedback.jsx'
import MyEvent from './pages/MyEvent.jsx'
import MarkAttendance from './pages/MarkAttendence.jsx'

const router = createBrowserRouter([
 // ── STUDENT ──
  { path: "/", element: <App/>},
  { path: "/login", element: <Login /> },
  { path: "/profile", element: <Profile /> },
  { path: "/upcomingevents", element: <UpcomingEvents /> },
  { path: "/eventdetails/:id", element: <EventDetails /> },
  { path: "/eventregistration/:id", element: <EventRegistration /> },
  { path: "/eventfeedback/:id", element: <EventFeedback /> },
  { path: "/completedEvents", element: <CompletedEvents /> },
  { path: "/myevents", element: <MyEvent /> },
  { path: "/registeredevents", element: <MyEvent /> },
  { path: "/notifications", element: <Notifications /> },
  { path: "/settings", element: <Settings /> },
  { path: "/clubs", element: <Clubs /> },

  // ── COORDINATOR ──
  { path: "/coordinatorlogin", element: <CoordinatorLogin /> },
  { path: "/coordinatordashboard", element: <CoordinatorDashboard /> },
  { path: "/manageevents", element: <ManageEvents /> },
  { path: "/createevents", element: <CreateEvents /> },
  { path: "/createposter", element: <CreatePoster /> },
  { path: "/budgetdocumentation", element: <BudgetDocumentation /> },
  { path: "/notifystudent", element: <NotifyStudents /> },
  { path: "/registeredstudents/:eventId", element: <RegisteredStudents /> },
  { path: "/registerdstudents", element: <RegisteredStudents /> },
  { path: "/studentfeedback/:eventId", element: <StudentFeedback /> },
  { path: "/studentfeedback", element: <StudentFeedback /> },
  { path: "/studentanalytics", element: <StudentAnalytics /> },
  { path: "/markattendance/:eventId", element: <MarkAttendance/>}
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
