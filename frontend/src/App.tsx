import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
	return (
		<>
			<div className="">
				<h1 className=" bg-primary text-primary-foreground rounded-md ">Welcome to Mentors Hub</h1>
				<p>Find mentors and connect with fellow developers, share your knowledge, and learn from each other.</p>
				<Button variant="secondary">Click me</Button>
        {/* <button className="p-20 border-gray-400 border">hi</button> */}
			</div>
		</>
	);
}

export default App;
