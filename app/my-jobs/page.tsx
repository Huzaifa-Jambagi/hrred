"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { JobCard } from "@/components/job-card";
import { Spinner } from "@/components/ui/spinner";
import { Briefcase, FileText } from "lucide-react";
import ApplicationCard from "@/components/ApplicationCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from "@/components/ui/pagination";

interface PostedJob {
  id: number;
  title: string;
  location: string;
  isOpen: boolean;
  description: string;
  created_at: string;
  company: { id: number; name: string; logo_url: string };
  applicants: { id: string }[];
  saved: { job_id: number }[];
}

interface AppliedJob {
  id: string;
  created_at: string;
  status: string;
  job_id: string;
  candidate_id: string;
  resume: string;
  skills: string;
  experience: number;
  education: string;
  name: string;
  jobs: {
    id: number;
    title: string;
  };
}

const itemsPerPlace = 9;

export default function Page() {
  const { user } = useUser();
  const isRecruiter = user?.unsafeMetadata?.role === "recruiter";

  const [postedJobs, setPostedJobs] = useState<PostedJob[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const startIndex = (page - 1) * itemsPerPlace;
  const endIndex = page * itemsPerPlace;
  const items = isRecruiter ? postedJobs : appliedJobs;

  const fetchMyJobs = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      if (isRecruiter) {
        const res = await fetch("/api/postJob");
        const data = await res.json();
        setPostedJobs(Array.isArray(data) ? data : []);
      } else {
        const res = await fetch("/api/applications");
        const data = await res.json();
        setAppliedJobs(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id, isRecruiter]);

  useEffect(() => {
    fetchMyJobs();
  }, [fetchMyJobs]);

  return (
    <div className="min-h-screen px-5 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl lg:text-7xl text-center pb-8">
        {isRecruiter ? "My Posted Jobs" : "My Applications"}
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner className="size-8" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-500 dark:text-slate-400">
          {isRecruiter ? (
            <>
              <Briefcase className="size-12 opacity-30" />
              <p className="text-lg">You haven't posted any jobs yet.</p>
            </>
          ) : (
            <>
              <FileText className="size-12 opacity-30" />
              <p className="text-lg">You haven't applied to any jobs yet.</p>
            </>
          )}
        </div>
      ) : (
        <>
          {isRecruiter ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {postedJobs.slice(startIndex, endIndex).map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isMyJob
                  onJobAction={fetchMyJobs}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {appliedJobs.slice(startIndex, endIndex).map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  isCandidate={true}
                  title={application.jobs?.title}
                />
              ))}
            </div>
          )}

          {items.length > itemsPerPlace && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink isActive>{page}</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(p + 1, Math.ceil(items.length / itemsPerPlace)))}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}