"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoadingShimmer from '@/components/shared/LoadingShimmer';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="fixed inset-0 bg-surface flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-6">
        <LoadingShimmer variant="detail" />
      </div>
    </div>
  );
}
