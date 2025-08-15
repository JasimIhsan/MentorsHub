import { RootState } from "@/store/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
	children: ReactNode;
	redirectTo?: string;
}

export function AdminProtectedRoute({ children, redirectTo = "/admin/login" }: ProtectedRouteProps) {
	const isAuthenticated = useSelector((state: RootState) => state.adminAuth.isAuthenticated);
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to={redirectTo} state={{ from: location }} replace />;
	}
	return <>{children}</>;
}
