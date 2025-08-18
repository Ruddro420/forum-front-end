import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import MainLayout from "./Layouts/MainLayout";
import Home from "./Pages/Home";
import ForumPage from "./Pages/ForumPage";
import AskQuestion from "./Pages/AskQuestion";
import ShopPage from "./Pages/ShopPage";
import QuestionDetail from "./Pages/QuestionDetail";
import ChatInterface from "./Pages/ChatInterface";
import StudentProfile from "./Pages/StudentProfile";
import StudentDashboard from "./Pages/StudentDashboard";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import PrivateRoute from "./Auth/PrivateRoute";
import { AuthProvider } from "./Auth/context/AuthContext";
import Categories from "./Pages/Categories";
import ChatBox from "./Pages/ChatBox";
import CvGenerate from "./Pages/CvGenerate";
import AboutPage from "./Pages/AboutPage";
import ContactPage from "./Pages/ContactPage";
import PublicLayout from "./Layouts/PublicLayout";

const router = createBrowserRouter([
  {
    path: "",
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
    ],
  },

  {
    path: "forum",
    element: <MainLayout />,
    children: [
      { path: "/forum/", element: <ForumPage /> },
      { path: "/forum/questions", element: <ForumPage /> },
      { path: "/forum/shop", element: <ShopPage /> },
      { path: "/forum/category/:id", element: <Categories /> },
    ],
  },
  {
    path: "forum",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "/forum/ask-question", element: <AskQuestion /> },
      { path: "/forum/question-detail/:id", element: <QuestionDetail /> },
      { path: "/forum/message", element: <ChatInterface /> },
      { path: "/forum/profile", element: <StudentProfile /> },
      { path: "/forum/cv", element: <CvGenerate /> },
      { path: "/forum/dashboard", element: <StudentDashboard /> },
      { path: "/forum/chatbox", element: <ChatBox /> },
    ],
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
