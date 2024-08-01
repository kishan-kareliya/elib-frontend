import { Navigate, Outlet } from "react-router-dom";

const AuthLayout = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to={"/dashboard/home"} replace={true} />;
  }
  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthLayout;
