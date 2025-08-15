import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";

// Card for creating a new wallet
export function WalletCreationCard({ onCreateWallet, isLoading }: { onCreateWallet: () => void; isLoading: boolean }) {
	return (
		<Card className="shadow-xl border border-gray-200 max-w-md mx-auto transition-transform hover:scale-[1.02]">
			<CardHeader className="text-center">
				<div className="mb-4 flex justify-center">
					<div className="bg-blue-100 p-3 rounded-full">
						<Wallet className="h-8 w-8 text-primary" />
					</div>
				</div>
				<CardTitle className="text-2xl font-bold text-gray-900">Get Started with Your Wallet</CardTitle>
				<CardDescription className="text-gray-600">Create your wallet to manage your money seamlessly.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6 text-center">
				<p className="text-gray-500">You don't have a wallet yet. Submit a request to create one and unlock all wallet features.</p>
				<Button onClick={onCreateWallet} className="w-full  text-white text-lg font-semibold py-3 transition-all duration-200 hover:shadow-lg" disabled={isLoading}>
					<Wallet className="h-5 w-5 mr-2" />
					Create Wallet Now
				</Button>
			</CardContent>
		</Card>
	);
}
