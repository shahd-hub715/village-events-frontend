import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import { ADMIN_PATH } from "./config/api";

/** No router dependency: the admin lives on its own path, everything else is public. */
function isAdminPath(pathname: string): boolean {
  return pathname === ADMIN_PATH || pathname.startsWith(`${ADMIN_PATH}/`);
}

export default function App() {
  return isAdminPath(window.location.pathname) ? <AdminPage /> : <HomePage />;
}
