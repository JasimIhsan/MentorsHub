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
		<div className="flex items-center gap-6 md:gap-10 pl-10 md:pl-20 xl:pl-25 justify-center ">
			<div onClick={handleLogoClick} className="flex items-center gap-2 cursor-pointer">
				{/* <GraduationCap className="h-6 w-6" /> */}
				<div className="w-8">
					<img src={Logo} alt="" className="w-full" />
				</div>
				<span className="hidden font-bold sm:inline-block">MentorsHub</span>
			</div>
			<nav className="hidden md:flex items-center gap-6">
				<Link to="/dashboard" className={cn("text-sm font-medium transition-colors hover:text-primary", pathname === "/dashboard" ? "text-primary" : "text-muted-foreground")}>
					Dashboard
				</Link>
				<Link to="/browse" className={cn("text-sm font-medium transition-colors hover:text-primary", pathname === "/browse" || pathname.startsWith("/browse/") ? "text-primary" : "text-muted-foreground")}>
					Browse Mentors
				</Link>
				<Link to="/sessions" className={cn("text-sm font-medium transition-colors hover:text-primary", pathname === "/sessions" || pathname.startsWith("/sessions/") ? "text-primary" : "text-muted-foreground")}>
					Sessions
				</Link>
				<Link to="/messages" className={cn("text-sm font-medium transition-colors hover:text-primary", pathname === "/messages" ? "text-primary" : "text-muted-foreground")}>
					Messages
				</Link>
			</nav>
		</div>
	);
}
