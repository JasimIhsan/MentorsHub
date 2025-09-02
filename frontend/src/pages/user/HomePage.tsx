import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, Calendar, GraduationCap, ArrowRight, Clock, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import LandingPhoto from "@/assets/main-image.png";
import { UserProfileNavLinks } from "@/components/user/navbar/UserProfileNavLinks";
import { UserMainNavbar } from "@/components/user/navbar/UserMainNavbar";
import { MobileNav } from "@/components/user/navbar/MobileNavbar";
import { UserInterface } from "@/interfaces/interfaces";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";

const mentors = [
	{
		name: "John Doe",
		title: "Software Engineer",
		avatar: "https://randomuser.me/api/portraits/men/75.jpg",
		skills: ["JavaScript", "React", "Node.js"],
		bio: "Experienced software engineer with a passion for building scalable web applications.",
		rate: "₹150/hour",
	},
	{
		name: "Jane Smith",
		title: "Data Scientist",
		avatar: "https://randomuser.me/api/portraits/men/15.jpg",
		skills: ["Python", "Machine Learning", "Data Analysis"],
		bio: "Data scientist with expertise in developing machine learning models and data-driven insights.",
		rate: "₹160/hour",
	},
	{
		name: "Peter Jones",
		title: "Product Manager",
		avatar: "https://randomuser.me/api/portraits/men/20.jpg",
		skills: ["Product Strategy", "Agile", "User Research"],
		bio: "Product manager with a proven track record of launching successful products and features.",
		rate: "₹170/hour",
	},
];

const testimonials = [
	{
		name: "Alice Brown",
		avatar: "https://randomuser.me/api/portraits/women/75.jpg",
		text: "I had a great experience learning from John. He helped me understand React concepts and build my first web app.",
	},
	{
		name: "Bob Green",
		avatar: "https://randomuser.me/api/portraits/men/65.jpg",
		text: "Jane is an excellent data scientist. She taught me how to use Python for data analysis and machine learning.",
	},
	{
		name: "Charlie White",
		avatar: "https://randomuser.me/api/portraits/men/10.jpg",
		text: "Peter is a fantastic product manager. He guided me through the product development process and helped me launch my startup.",
	},
];

export default function Home() {
	const { isAuthenticated, user } = useSelector((state: RootState) => state.userAuth);
	const navigate = useNavigate();

	const handleBecomeMentor = () => {
		if (isAuthenticated) {
			navigate("/become-mentor");
		} else {
			toast.error("Please login to become a mentor");
		}
	};

	const handleFindMentors = () => {
		if (isAuthenticated) {
			navigate("/browse");
		} else {
			toast.error("Please login to find mentors");
		}
	};
	return (
		// Remove overflow-y-hidden to allow scrolling
		<div className="flex min-h-screen flex-col">
			<header className="sticky top-0 z-50 w-full h-16 border-b backdrop-blur-3xl bg-transparent">
				<div className=" flex h-16 justify-between items-center w-full">
					<UserMainNavbar isAuthenticated={isAuthenticated} />
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
						<div className="flex items-center gap-4 px-10 md:px-20 xl:px-25 justify-center">
							{/* Desktop buttons */}
							<div className="hidden md:flex items-center gap-4">
								<Button variant="outline" onClick={() => navigate("/authenticate")}>
									Login
								</Button>
								<Button onClick={() => navigate("/authenticate")}>Register</Button>
							</div>
							{/* Mobile buttons */}
							<div className="md:hidden flex items-center gap-2">
								<Button variant="outline" size="sm" onClick={() => navigate("/authenticate")}>
									Login
								</Button>
								<Button size="sm" onClick={() => navigate("/authenticate")}>
									Register
								</Button>
							</div>
						</div>
					)}
				</div>
			</header>
			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative overflow-hidden mt-10 px-10 md:px-20 xl:px-25 flex justify-center h-[80vh]">
					<div className="container relative z-10 grid gap-8 md:grid-cols-2 md:items-center items-center">
						{/* Image Section - Use responsive height instead of fixed */}
						<div className="relative min-h-[300px] w-full flex justify-center items-center order-first md:order-last">
							<div className="md:w-3/4 relative">
								<div className="absolute -z-1 hidden md:block md:-top-6 md:-left-8 md:w-20 md:h-20 bg-primary rounded-lg -rotate-20"></div>
								<div className="absolute -z-1 hidden md:block rotate-20 md:-bottom-6 md:-right-8 md:w-20 md:h-20 bg-blue-200 rounded-lg"></div>
								<div className="rounded-lg w-full h-full bg-red-300">
									<img src={LandingPhoto} alt="Mentor and mentee working together" className="rounded-lg shadow-lg object-cover w-full h-full" />
								</div>
							</div>
						</div>

						{/* Text Section */}
						<div className="flex flex-col gap-6 order-last md:order-first">
							<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
								Unlock Knowledge, <span className="text-primary">One Hour at a Time</span>
							</h1>
							<p className="text-xl text-muted-foreground">Connect with mentors, learn new skills, and grow your potential through personalized guidance.</p>
							<div className="flex flex-col gap-4 sm:flex-row">
								<Button size="lg" className="gap-2" onClick={handleFindMentors}>
									Find a Mentor
									<ArrowRight className="h-4 w-4" />
								</Button>
								<Button size="lg" variant="outline" className="gap-2" onClick={handleBecomeMentor}>
									Become a Mentor
								</Button>
							</div>
						</div>
					</div>
					<div className="absolute inset-0 -z-10 bg-gradient-to-b from-background to-background/80" />
				</section>

				{/* How It Works Section */}
				<section id="how-it-works" className="mt-10 py-20 bg-muted/50 px-10 md:px-20 xl:px-25 flex justify-center">
					<div className="container">
						<div className="flex flex-col items-center gap-4 text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
							<p className="text-xl text-muted-foreground max-w-2xl">Our platform makes it easy to connect with experts and accelerate your learning journey</p>
						</div>
						<div className="grid gap-8 md:grid-cols-3">
							<div className="flex flex-col items-center gap-4 text-center">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
									<Search className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-bold">Find a Mentor</h3>
								<p className="text-muted-foreground">Browse our curated list of expert mentors across various fields and specialties</p>
							</div>
							<div className="flex flex-col items-center gap-4 text-center">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
									<Calendar className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-bold">Book Time</h3>
								<p className="text-muted-foreground">Schedule a session at a time that works for both you and your chosen mentor</p>
							</div>
							<div className="flex flex-col items-center gap-4 text-center">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
									<GraduationCap className="h-8 w-8 text-primary" />
								</div>
								<h3 className="text-xl font-bold">Learn and Grow</h3>
								<p className="text-muted-foreground">Connect virtually, get personalized guidance, and accelerate your skill development</p>
							</div>
						</div>
					</div>
				</section>

				{/* Featured Mentors Section */}
				<section id="mentors" className="px-10 md:px-20 xl:px-25 mt-10 flex justify-center">
					<div className="container">
						<div className="flex flex-col items-center gap-4 text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Mentors</h2>
							<p className="text-xl text-muted-foreground max-w-2xl">Learn from industry experts who are passionate about sharing their knowledge</p>
						</div>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ">
							{mentors.map((mentor) => (
								<Card key={mentor.name} className="overflow-hidden pb-0 flex flex-col justify-between">
									<div className="p-6">
										<div className="flex items-start gap-4">
											<Avatar className="h-12 w-12 border">
												<img src={mentor.avatar || "/placeholder.svg"} alt={mentor.name} width={48} height={48} className="aspect-square" />
											</Avatar>
											<div>
												<h3 className="font-bold">{mentor.name}</h3>
												<p className="text-sm text-muted-foreground">{mentor.title}</p>
											</div>
										</div>
										<div className="mt-4 flex flex-wrap gap-2">
											{mentor.skills.map((skill) => (
												<Badge key={skill} variant="secondary">
													{skill}
												</Badge>
											))}
										</div>
										<p className="mt-4 text-sm">{mentor.bio}</p>
										<div className="mt-4 flex items-center gap-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">{mentor.rate}</span>
										</div>
									</div>
									{/* <div className="bg-muted ">
										<Button variant="ghost" className="w-full py-7 rounded-t-none ">
											View Profile
										</Button>
									</div> */}
								</Card>
							))}
						</div>
						<div className="mt-12 flex justify-center">
							<Button size="lg" variant="outline" className="gap-2" onClick={handleFindMentors}>
								Explore More Mentors
								<ArrowRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</section>

				{/* Testimonials Section */}
				<section id="testimonials" className="py-20 bg-muted/50 px-10 md:px-20 xl:px-25 mt-10 flex justify-center">
					<div className="container">
						<div className="flex flex-col items-center gap-4 text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Users Say</h2>
							<p className="text-xl text-muted-foreground max-w-2xl">Hear from mentors and learners who have experienced the power of our platform</p>
						</div>
						<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
							{testimonials.map((testimonial, index) => (
								<Card key={index} className="relative overflow-hidden p-6">
									<div className="absolute right-6 top-6 text-primary/20">
										<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="currentColor" stroke="none">
											<path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
										</svg>
									</div>
									<div className="mt-6">
										<p className="text-muted-foreground">{testimonial.text}</p>
										<div className="mt-6 flex items-center">
											<Avatar className="h-10 w-10 border">
												<AvatarImage src={testimonial.avatar} alt={testimonial.name} />
												<AvatarFallback>
													{testimonial.name
														.split(" ")
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
											<div className="ml-4">
												<p className="font-medium">{testimonial.name}</p>
												<p className="text-sm text-muted-foreground">Mentee</p>
											</div>
										</div>
									</div>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* Pricing Section */}
				<section id="pricing" className="py-20 px-10 md:px-20 xl:px-25 mt-10 flex justify-center">
					<div className="container">
						<div className="flex flex-col items-center gap-4 text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, Transparent Pricing</h2>
							<p className="text-xl text-muted-foreground max-w-2xl">Choose the plan that works best for your learning journey</p>
						</div>
						<div className="grid gap-8 md:grid-cols-3">
							{/* Basic Plan */}
							<Card className="flex flex-col overflow-hidden border-2 border-muted pt-0">
								<CardHeader className="bg-muted/50 py-5">
									<CardTitle className="text-2xl">Basic</CardTitle>
									<CardDescription>Perfect for getting started</CardDescription>
								</CardHeader>
								<CardContent className="flex flex-1 flex-col p-6">
									<div className="flex items-baseline gap-2">
										<span className="text-4xl font-bold">₹129</span>
										<span className="text-muted-foreground">/month</span>
									</div>
									<ul className="mt-6 space-y-4 flex-1">
										<li className="flex items-center gap-2">
											<Check className="h-5 w-5 text-primary" />
											<span>2 sessions per month</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-5 w-5 text-primary" />
											<span>Access to community forums</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-5 w-5 text-primary" />
											<span>Basic learning resources</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-5 w-5 text-primary" />
											<span>Email support</span>
										</li>
									</ul>
									<Button className="mt-6 w-full">Get Started</Button>
								</CardContent>
							</Card>

							{/* Pro Plan */}
							<Card className="flex flex-col overflow-hidden border-2 border-primary relative pt-0">
								<div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">Most Popular</div>
								<CardHeader className="bg-primary/10 py-5">
									<CardTitle className="text-2xl">Pro</CardTitle>
									<CardDescription>For dedicated learners</CardDescription>
								</CardHeader>
								<CardContent className="flex flex-1 flex-col p-6">
									<div className="flex items-baseline gap-2">
										<span className="text-4xl font-bold">₹179</span>
										<span className="text-muted-foreground">/month</span>
									</div>
									<ul className="mt-6 space-y-4 flex-1">
										<li className="flex items-center gap-2">
											<Check className="h-5 w-5 text-primary" />
											<span>5 sessions per month</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-5 w-5 text-primary" />
											<span>Priority mentor matching</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-5 w-5 text-primary" />
											<span>Advanced learning resources</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-5 w-5 text-primary" />
											<span>Priority support</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-5 w-5 text-primary" />
											<span>Session recordings</span>
										</li>
									</ul>
									<Button className="mt-6 w-full">Get Started</Button>
								</CardContent>
							</Card>

							{/* Premium Plan */}
							<Card className="flex flex-col overflow-hidden border-2 border-muted pt-0">
								<CardHeader className="bg-muted/50 py-5">
									<CardTitle className="text-2xl">Premium</CardTitle>
									<CardDescription>For serious career growth</CardDescription>
								</CardHeader>
								<CardContent className="flex flex-1 flex-col p-6">
									<div className="flex items-baseline gap-2">
										<span className="text-4xl font-bold">₹1149</span>
										<span className="text-muted-foreground">/month</span>
									</div>
									<ul className="mt-6 space-y-4 flex-1">
										<li className="flex items-center gap-2">
											<Check className="h-5 w-5 text-primary" />
											<span>10 sessions per month</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-5 w-5 text-primary" />
											<span>VIP mentor matching</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-5 w-5 text-primary" />
											<span>All learning resources</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-5 w-5 text-primary" />
											<span>24/7 dedicated support</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-5 w-5 text-primary" />
											<span>Career planning sessions</span>
										</li>
										<li className="flex items-center gap-2">
											<Check className="h-5 w-5 text-primary" />
											<span>Resume & portfolio review</span>
										</li>
									</ul>
									<Button className="mt-6 w-full">Get Started</Button>
								</CardContent>
							</Card>
						</div>
						<div className="mt-12 text-center">
							<p className="text-muted-foreground">
								Need a custom plan for your team or organization?{" "}
								<Link to="/enterprise" className="text-primary hover:underline">
									Contact us for enterprise pricing
								</Link>
							</p>
						</div>
					</div>
				</section>

				{/* FAQ Section */}
				<section id="faq" className="py-20 bg-muted/30 px-10 md:px-20 xl:px-25 mt-10 flex justify-center">
					<div className="container">
						<div className="flex flex-col items-center gap-4 text-center mb-16">
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
							<p className="text-xl text-muted-foreground max-w-2xl">Find answers to common questions about our mentorship platform</p>
						</div>
						<div className="mx-auto max-w-3xl">
							<Accordion type="single" collapsible className="w-full">
								<AccordionItem value="item-1">
									<AccordionTrigger>How do I find the right mentor?</AccordionTrigger>
									<AccordionContent>
										Our platform uses a sophisticated matching algorithm to connect you with mentors who match your goals, interests, and learning style. You can also browse our mentor directory and filter by expertise, industry, and
										availability to find the perfect match for your needs.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-2">
									<AccordionTrigger>How much does mentorship cost?</AccordionTrigger>
									<AccordionContent>
										Mentorship costs vary depending on the mentor's experience and expertise. We offer plans starting at ₹129/month for basic mentorship, with premium options available for more intensive guidance. Many mentors also offer a
										free introductory session to ensure it's a good fit.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-3">
									<AccordionTrigger>How do sessions work?</AccordionTrigger>
									<AccordionContent>
										Sessions are typically conducted via video call through our integrated platform. Once you book a session, you'll receive a confirmation email with the details and a calendar invitation. You can prepare for your session
										by setting goals and sharing relevant materials with your mentor beforehand.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-4">
									<AccordionTrigger>Can I become a mentor?</AccordionTrigger>
									<AccordionContent>
										Yes! We're always looking for experienced professionals to join our mentor community. You'll need to apply through our "Become a Mentor" page, where we'll ask about your expertise, experience, and mentorship style. Our
										team reviews applications to ensure high-quality mentorship for our users.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-5">
									<AccordionTrigger>What if I'm not satisfied with my mentor?</AccordionTrigger>
									<AccordionContent>
										We want to ensure you have a positive mentorship experience. If you're not satisfied with your mentor, you can request a match with a different mentor at any time. For paid sessions, we offer a satisfaction guarantee –
										if you're not happy with your first session, we'll refund your payment or match you with a new mentor at no additional cost.
									</AccordionContent>
								</AccordionItem>
								<AccordionItem value="item-6">
									<AccordionTrigger>How do I track my progress?</AccordionTrigger>
									<AccordionContent>
										Our platform includes a progress tracking system where you can set goals, track milestones, and receive feedback from your mentor. You'll also earn badges and achievements as you progress, helping you visualize your
										growth and stay motivated throughout your learning journey.
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-20 bg-primary text-primary-foreground px-10 md:px-20 xl:px-25 mt-10 flex justify-center">
					<div className="container">
						<div className="mx-auto max-w-3xl text-center">
							<h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Ready to Accelerate Your Growth?</h2>
							<p className="text-xl mb-8 opacity-90">Join thousands of professionals who are achieving their goals faster with personalized mentorship.</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" variant="secondary" className="text-primary">
									Find a Mentor
								</Button>
								<Button size="lg" variant="outline" className="border-primary-foreground text-primary hover:bg-secondary">
									Become a Mentor
								</Button>
							</div>
							<div className="mt-12 flex items-center justify-center gap-8 bg-yellow-800">
								<div className="flex flex-col items-center">
									<span className="text-3xl font-bold">10,000+</span>
									<span className="text-sm opacity-90">Active Mentors</span>
								</div>
								<div className="h-12 w-px bg-primary-foreground/20" />
								<div className="flex flex-col items-center">
									<span className="text-3xl font-bold">50,000+</span>
									<span className="text-sm opacity-90">Mentees</span>
								</div>
								<div className="h-12 w-px bg-primary-foreground/20" />
								<div className="flex flex-col items-center">
									<span className="text-3xl font-bold">100,000+</span>
									<span className="text-sm opacity-90">Sessions Completed</span>
								</div>
							</div>
						</div>
					</div>
				</section>
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
		</div>
	);
}
