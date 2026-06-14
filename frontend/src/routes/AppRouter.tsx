import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { AboutPage } from "../pages/About/AboutPage";
import { EventDetailsPage } from "../pages/EventDetails/EventDetailsPage";
import { EventsPage } from "../pages/Events/EventsPage";
import { GalleryPage } from "../pages/Gallery/GalleryPage";
import { HomePage } from "../pages/Home/HomePage";
import { VideosPage } from "../pages/Videos/VideosPage";

const router = createBrowserRouter([
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
