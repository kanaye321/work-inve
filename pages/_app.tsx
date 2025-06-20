import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [setupCompleted, setSetupCompleted] = useState(true);
  
  useEffect(() => {
    // Check if setup has been completed
    const checkSetupStatus = async () => {
      try {
        const response = await fetch('/api/setup/check-setup-status');
        const data = await response.json();
        
        setSetupCompleted(data.setupCompleted);
        
        // If setup is not completed and we're not on the setup page, redirect to setup
        if (!data.setupCompleted && router.pathname !== '/setup') {
          router.push('/setup');
        }
      } catch (error) {
        console.error('Error checking setup status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSetupStatus();
  }, [router]);
  
  // Show loading state while checking setup status
  if (isLoading && router.pathname !== '/setup') {
    return <div>Loading...</div>;
  }
  
  return <Component {...pageProps} />;
}