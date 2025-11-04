import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";

export default function MainLayout() {
  const { isAuthenticated } = useSelector(state => state.user);

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && <Header />}
      <Outlet />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}