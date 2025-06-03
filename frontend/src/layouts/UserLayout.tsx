import { Outlet, useNavigate } from "react-router-dom";
// import { ThemeProvider } from "@/components/user/common";
import { UserMainNavbar } from "@/components/user/navbar/UserMainNavbar";
import { UserProfileNavLinks } from "@/components/user/navbar/UserProfileNavLinks";
import { MobileNav } from "@/components/user/navbar/MobileNavbar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { UserInterface } from "@/interfaces/interfaces";

// import "@/styles/globals.css";

export default function MainLayout() {
	const { isAuthenticated, user } = useSelector((state: RootState) => state.userAuth);
	const navigate = useNavigate();
	
	return (
		<div className="flex min-h-screen flex-col items-stretch ">
			{/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange> */}

			<header className="sticky top-0 z-50 w-full h-16 border-b backdrop-blur-3xl bg-transparent">
				<div className=" flex h-16 justify-between items-center w-full">
					<UserMainNavbar />
					{isAuthenticated ? (
						<div>
							<div className="hidden md:flex items-center gap-4">
								<UserProfileNavLinks user={user as UserInterface} />
							</div>
							<div className="md:hidden px-10 md:px-20 xl:px-25 flex justify-center">
								<MobileNav />
							</div>
						</div>
					) : (
						<div className="hidden md:flex items-center gap-4 px-10 md:px-20 xl:px-25 justify-center">
							<Button variant="outline" onClick={() => navigate("/authenticate")}>
								Login
							</Button>
							<Button onClick={() => navigate("/authenticate")}>Register</Button>
						</div>
					)}
				</div>
			</header>
			{/* sm:px-6 lg:px-8 */}
			<main className="flex ">
				<Outlet />
			</main>

			<footer className="border-t px-10 md:px-20 xl:px-25 flex justify-center">
				<div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
					<p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MentorMatch. All rights reserved.</p>
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<a href="#" className="hover:underline">
							Terms
						</a>
						<a href="#" className="hover:underline">
							Privacy
						</a>
						<a href="#" className="hover:underline">
							Contact
						</a>
					</div>
				</div>
			</footer>
			{/* </ThemeProvider> */}
		</div>
	);
}
