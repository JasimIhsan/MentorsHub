import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import Logo from "@/assets/logo.png.png";

export function UserMainNavbar() {
	const location = useLocation();
	const pathname = location.pathname;
	const navigate = useNavigate();

	const handleLogoClick = () => {
		navigate("/");
	};

	return (
		<div className="flex items-center gap-6 md:gap-10 pl-10 md:pl-20 xl:pl-25 justify-center">
			<div onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
				<div className="w-8">
					<img src={Logo} alt="" className="w-full" />
				</div>
				<span className="hidden font-bold sm:inline-block">MentorsHub</span>
			</div>
			<nav className="hidden md:flex items-center gap-6">
				<Link to="/dashboard" className={cn("text-sm font-medium transition-all duration-200 ease-in-out", pathname === "/dashboard" ? "text-primary scale-105 font-bold" : "text-muted-foreground hover:text-primary hover:scale-105")}>
					Dashboard
				</Link>
				<Link
					to="/browse"
					className={cn("text-sm font-medium transition-all duration-200 ease-in-out", pathname === "/browse" || pathname.startsWith("/browse/") ? "text-primary scale-105 font-bold" : "text-muted-foreground hover:text-primary hover:scale-105")}>
					Browse Mentors
				</Link>
				<Link
					to="/sessions"
					className={cn(
						"text-sm font-medium transition-all duration-200 ease-in-out",
						pathname === "/sessions" || pathname.startsWith("/sessions/") ? "text-primary scale-105 font-bold" : "text-muted-foreground hover:text-primary hover:scale-105"
					)}>
					Sessions
				</Link>
				<Link to="/messages" className={cn("text-sm font-medium transition-all duration-200 ease-in-out", pathname === "/messages" ? "text-primary scale-105 font-bold" : "text-muted-foreground hover:text-primary hover:scale-105")}>
					Messages
				</Link>
			</nav>
		</div>
	);
}
