import { RootState } from "@/store/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface AuthGuardProps {
	children: ReactNode;
	redirectUrl?: string;
}

export function AdminAuthGuard({ children, redirectUrl = "/admin/dashboard" }: AuthGuardProps) {
	const isAuthenticated = useSelector((state: RootState) => state.adminAuth.isAuthenticated);
	const location = useLocation();
	if (isAuthenticated) {
		return <Navigate to={redirectUrl} state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
