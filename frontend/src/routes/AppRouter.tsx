import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout/AdminLayout";
import { MainLayout } from "../layouts/MainLayout";
import { AboutPage } from "../pages/About/AboutPage";
import { AdminAdminsPage } from "../pages/Admin/Admins/AdminAdminsPage";
import { AdminDashboardPage } from "../pages/Admin/Dashboard/AdminDashboardPage";
import { AdminCreateEventPage } from "../pages/Admin/Events/AdminCreateEventPage";
import { AdminEditEventPage } from "../pages/Admin/Events/AdminEditEventPage";
import { AdminEventsPage } from "../pages/Admin/Events/AdminEventsPage";
import { AdminGalleryPage } from "../pages/Admin/Gallery/AdminGalleryPage";
import { AdminHomeContentPage } from "../pages/Admin/HomeContent/AdminHomeContentPage";
import { AdminLoginPage } from "../pages/Admin/Login/AdminLoginPage";
import { AdminMessagesPage } from "../pages/Admin/Messages/AdminMessagesPage";
import { AdminSettingsPage } from "../pages/Admin/Settings/AdminSettingsPage";
import { AdminTeamPage } from "../pages/Admin/Team/AdminTeamPage";
import { AdminVideosPage } from "../pages/Admin/Videos/AdminVideosPage";
import { ContactPage } from "../pages/Contact/ContactPage";
import { EventDetailsPage } from "../pages/EventDetails/EventDetailsPage";
import { EventsPage } from "../pages/Events/EventsPage";
import { GalleryPage } from "../pages/Gallery/GalleryPage";
import { HomePage } from "../pages/Home/HomePage";
import { VideosPage } from "../pages/Videos/VideosPage";
import { AdminPermissionRoute } from "./components/AdminPermissionRoute";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";

const router = createBrowserRouter([
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    element: <ProtectedAdminRoute />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboardPage />,
          },
          {
            element: (
              <AdminPermissionRoute moduleName="home-content" action="read" />
            ),
            children: [
              {
                path: "home-content",
                element: <AdminHomeContentPage />,
              },
            ],
          },
          {
            element: (
              <AdminPermissionRoute moduleName="settings" action="read" />
            ),
            children: [
              {
                path: "settings",
                element: <AdminSettingsPage />,
              },
            ],
          },
          {
            element: (
              <AdminPermissionRoute moduleName="contact" action="read" />
            ),
            children: [
              {
                path: "messages",
                element: <AdminMessagesPage />,
              },
            ],
          },
          {
            element: <AdminPermissionRoute moduleName="events" action="read" />,
            children: [
              {
                path: "events",
                element: <AdminEventsPage />,
              },
            ],
          },
          {
            element: (
              <AdminPermissionRoute moduleName="events" action="create" />
            ),
            children: [
              {
                path: "events/create",
                element: <AdminCreateEventPage />,
              },
            ],
          },
          {
            element: (
              <AdminPermissionRoute moduleName="events" action="update" />
            ),
            children: [
              {
                path: "events/:eventId/edit",
                element: <AdminEditEventPage />,
              },
            ],
          },
          {
            element: (
              <AdminPermissionRoute moduleName="gallery" action="read" />
            ),
            children: [
              {
                path: "gallery",
                element: <AdminGalleryPage />,
              },
            ],
          },
          {
            element: <AdminPermissionRoute moduleName="videos" action="read" />,
            children: [
              {
                path: "videos",
                element: <AdminVideosPage />,
              },
            ],
          },
          {
            element: <AdminPermissionRoute moduleName="team" action="read" />,
            children: [
              {
                path: "team",
                element: <AdminTeamPage />,
              },
            ],
          },
          {
            element: (
              <AdminPermissionRoute
                moduleName="admins"
                action="read"
                superAdminOnly
              />
            ),
            children: [
              {
                path: "admins",
                element: <AdminAdminsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/events",
        element: <EventsPage />,
      },
      {
        path: "/events/:slug",
        element: <EventDetailsPage />,
      },
      {
        path: "/gallery",
        element: <GalleryPage />,
      },
      {
        path: "/videos",
        element: <VideosPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
