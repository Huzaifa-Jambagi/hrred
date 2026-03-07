"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { JobCard } from '@/components/job-card'
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink } from '@/components/ui/pagination'

const page = () => {
  interface SavedJob {
    id: string,
    created_at: string,
    job_id: number,
    user_id: string,
    jobs: {
      id: number,
      title: string,
      location: string,
      isOpen: boolean,
      company: {
        name: string,
        logo_url: string
      }
    }
  }

  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [page, setPage] = useState(1);
  let startIndex = (page * 10) - 10;
  let endIndex = page * 10;
  const { user } = useUser();

  const fetchSavedJobs = async () => {
    try {
      const res = await fetch('/api/jobs/saved',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        })
      const data = await res.json();
      setSavedJobs(data);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  }

  useEffect(() => {
    fetchSavedJobs();
  }, [user?.id])

  return (
    <div className='w-full h-full p-2'>
      {savedJobs.length > 0 ? (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 ">
            {savedJobs.slice(startIndex, endIndex).map((job) => (
              <JobCard key={job.id} job={job.jobs} savedInit={true} onJobAction={fetchSavedJobs} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex  items-center justify-center h-full w-full text-3xl sm:text-4xl lg:text-5xl ">No saved jobs found.</div>
      )}

    </div>
  )
}

export default page