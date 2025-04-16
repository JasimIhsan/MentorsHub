import { RootState } from "@/store/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
	children: ReactNode;
	redirectTo?: string;
}

export function MentorProtectedRoute({ children, redirectTo = "/" }: ProtectedRouteProps) {
	const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
	const userRole = useSelector((state: RootState) => state.auth.user?.role);
	const location = useLocation();

	if (!isAuthenticated || userRole !== "mentor") {
		return <Navigate to={redirectTo} state={{ from: location }} replace />;
	}
	return <>{children}</>;
}
