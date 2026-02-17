"use client";

import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPinIcon } from "lucide-react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { use, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUser } from "@clerk/nextjs";

interface Job {
  id: number;
  recruiter_id: string;
  title: string;
  company_id: number;
  description: string;
  isOpen: boolean;
  location: string;
  requirements: string;
  company: {
    logo_url: string;
  };
  applicants: {
    candidate_id: number;
  }[];
}

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
console.log(user);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/jobs/${id}`);
        if (!res.ok) throw new Error(`${res.status}`);
        const job = await res.json();
        setData(job);
      } catch (err) {
        console.error(err);
        setError("Could not load this job. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  if (!data)
    return (
      <div className="flex justify-center items-center h-screen text-muted-foreground">
        Job not found.
      </div>
    );

  const handleStatus = async (value: string) => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: value === "true" ? true : false }),
      });
      window.location.reload();
      if (!res.ok) throw new Error(`${res.status}`);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="p-3 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl">
          {data.title}
        </h1>
        {data.company?.logo_url && (
          <Image
            src={data.company.logo_url}
            alt="Company Logo"
            className="h-12 w-auto object-contain"
            width={100}
            height={100}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPinIcon size={14} />
          {data.location}
        </span>
        <span className="text-border">•</span>
        <span className="flex items-center gap-1">
          <Briefcase size={14} />
          {data.applicants?.length ?? 0} Applicants
        </span>
        <span className="text-border">•</span>
        <Badge
          className="text-xs"
          variant={data.isOpen ? "default" : "destructive"}
        >
          {data.isOpen ? "Hiring" : "Not Hiring"}
        </Badge>
      </div>
      {data?.recruiter_id === user?.id &&
        <Select value={data.isOpen ? "true" : "false"} onValueChange={handleStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="true">Hiring</SelectItem>
              <SelectItem value="false">Not Hiring</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>}

      {/* About */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">About the job</h2>
        <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
          <ReactMarkdown>{data.description}</ReactMarkdown>
        </div>
      </section>

      {/* Requirements */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">Requirements</h2>
        <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
          <ReactMarkdown>{data.requirements}</ReactMarkdown>
        </div>
      </section>
    </div>
  );
}