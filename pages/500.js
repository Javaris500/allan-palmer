import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

export default function Custom500() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold mb-6">500 - Server Error</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Something went wrong on our server. We're working to fix the issue.
      </p>
      <Button 
        onClick={() => router.push('/')}
        className="px-6 py-3"
      >
        Go back home
      </Button>
    </div>
  );
}
