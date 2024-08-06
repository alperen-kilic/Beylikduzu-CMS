import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import NewsDashboard from "../features/news/dashboard/NewsDashboard";
import Dashboard from "../features/homepage/Dashboard";
import NewsEdit from "../features/news/edit/NewsEdit";
import GalleryList from "../features/news/gallery/GalleryList";
import CategoriesDashboard from "../features/articles/categories/CategoriesDashboard";
import CategoriesEdit from "../features/articles/categories/CategoriesEdit";
import ArticlesDashboard from "../features/articles/dashboard/ArticlesDashboard";
import ArticleEdit from "../features/articles/edit/ArticleEdit";
import ToplanmaAlaniEdit from "../features/toplanma-alanlari/ToplanmaAlaniEdit";
import ToplanmaAlanlariDashboard from "../features/toplanma-alanlari/ToplanmaAlanlariDashboard";
import MainGallery from "../features/main-gallery/MainGallery";
import Login from "../features/login/Login";
import RequireAuth from "./RequireAuth";
import NotFound from "../layout/NotFound";
import ServerError from "../layout/ServerError";
import MainContent from "../layout/MainContent";
import KislaMucadeleGaleri from "../features/main-gallery/KislaMucadeleGaleri";
import PandemiGaleri from "../features/main-gallery/PandemiGaleri";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          {
            path: "",
            element: <MainContent />,
            children: [
              { path: "", element: <Dashboard /> },
              { path: "haberler", element: <NewsDashboard /> },
              { path: "haberler/duzenle", element: <NewsEdit /> },
              { path: "haberler/yeni-ekle", element: <NewsEdit /> },
              { path: "haberler/galeri", element: <GalleryList /> },
              { path: "makaleler", element: <ArticlesDashboard /> },
              { path: "makaleler/duzenle", element: <ArticleEdit /> },
              { path: "makaleler/yeni-ekle", element: <ArticleEdit /> },
              {
                path: "makaleler/kategoriler",
                element: <CategoriesDashboard />,
              },
              { path: "makaleler/kategoriler/duzenle", element: <CategoriesEdit /> },
              { path: "makaleler/kategoriler/yeni-ekle", element: <CategoriesEdit /> },
              { path: "toplanma-alanlari", element: <ToplanmaAlanlariDashboard /> },
              { path: "toplanma-alanlari/yeni-ekle", element: <ToplanmaAlaniEdit /> },
              { path: "toplanma-alanlari/duzenle", element: <ToplanmaAlaniEdit /> },
              { path: "deprem-galeri", element: <MainGallery /> },
              { path: "kisla-mucadele-galeri", element: <KislaMucadeleGaleri /> },
              { path: "pandemi-galeri", element: <PandemiGaleri /> },
            ],
          },
        ],
      },
      { path: "not-found", element: <NotFound /> },
      { path: "server-error", element: <ServerError /> },
      { path: "/giris", element: <Login /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
