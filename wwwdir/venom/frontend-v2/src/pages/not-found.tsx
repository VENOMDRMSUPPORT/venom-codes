import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="text-[150px] font-black text-primary/10 leading-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🔍</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="outline" className="rounded-xl gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
          <Button onClick={() => window.history.back()} className="rounded-xl gap-2">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
