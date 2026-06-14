import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { EventDetailsPage } from "../pages/EventDetails/EventDetailsPage";
import { EventsPage } from "../pages/Events/EventsPage";
import { HomePage } from "../pages/Home/HomePage";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/events",
        element: <EventsPage />,
      },
      {
        path: "/events/:slug",
        element: <EventDetailsPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
