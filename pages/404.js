import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

export default function Custom404() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold mb-6">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
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
