'use client'
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const OnboardingPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  console.log(user);

  const handleRoleSelection = async (role: string) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      await user.update({
        unsafeMetadata: {
          role: role
        }
      });

      // Reload user to refresh session claims
      await user.reload();
      
      // Redirect based on role
      router.push(role === "candidate" ? "/jobs" : "/post-job");
    } catch (err) {
      console.error("Error updating user metadata:", err);
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='animate-spin h-12 w-12' />
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center px-4 mt-10'>
      <h2 className='gradient-title text-5xl font-extrabold sm:text-8xl tracking-tighter'>
        I am a...
      </h2>
      <div className="mt-16 gap-4 w-full md:px-40 flex flex-col sm:grid grid-cols-2">
        <Button 
          variant="blue" 
          className='h-20 sm:h-36 text-2xl' 
          onClick={() => handleRoleSelection("candidate")}
          disabled={loading}
        >
          {loading ? <Loader2 className='animate-spin' /> : 'Job Seeker'}
        </Button>
        <Button 
          variant="destructive" 
          className='h-20 sm:h-36 text-2xl' 
          onClick={() => handleRoleSelection("recruiter")}
          disabled={loading}
        >
          {loading ? <Loader2 className='animate-spin' /> : 'Employer'}
        </Button>
      </div>
    </div>
  )
}

export default OnboardingPage