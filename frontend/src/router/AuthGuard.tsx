import { RootState } from "@/store/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
	children: ReactNode;
	redirectUrl?: string;
}

export function AuthGuard({ children, redirectUrl = "/dashboard" }: AuthGuardProps) {
	const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
	const location = useLocation();
	console.log("isAuthenticated : ", isAuthenticated);
	if (isAuthenticated) {
		return <Navigate to={redirectUrl} state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
