"use client"
import { useState, useEffect, useCallback } from 'react'
import { Search } from "lucide-react"
import {JobCard} from '@/components/job-card'
import { Spinner } from '@/components/ui/spinner'

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay])
  return debouncedValue;
}

const Page = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 500)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedSearch) params.append('searchQuery', debouncedSearch)

      const res = await fetch(`/api/jobs?${params.toString()}`)
      const data = await res.json();
      console.log(data);
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs])

  return (
    <div className="p-6 w-full mx-auto">
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-6">
        Jobs
      </h1>

      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3">
          <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <input
            placeholder="Search by job title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-900 dark:text-slate-100 min-w-0"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Spinner className="size-8" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No jobs found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job: any) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Page