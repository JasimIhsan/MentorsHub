import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CustomCardHeader } from "@/components/custom/CustomCardHeader";

const QuickLinks: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CustomCardHeader head="Quick Links" description="Frequently used actions" />
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <Button variant="outline" className="h-auto py-4 justify-start text-left min-w-[200px]" asChild>
          <Link to="/browse" className="flex flex-col items-start">
            <span className="font-medium">Browse Mentors</span>
            <span className="text-xs text-muted-foreground">Find experts in any field</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 justify-start text-left min-w-[200px]" asChild>
          <Link to="/ready-now" className="flex flex-col items-start">
            <span className="font-medium">Mentors Ready Now</span>
            <span className="text-xs text-muted-foreground">Connect with available mentors</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 justify-start text-left min-w-[200px]" asChild>
          <Link to="/gamification" className="flex flex-col items-start">
            <span className="font-medium">Your Progress</span>
            <span className="text-xs text-muted-foreground">View achievements and rewards</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-auto py-4 justify-start text-left min-w-[200px]" asChild>
          <Link to="/profile" className="flex flex-col items-start">
            <span className="font-medium">Update Profile</span>
            <span className="text-xs text-muted-foreground">Manage your preferences</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickLinks;