"use client";

import { Spinner } from "@/components/ui/spinner";
import { Briefcase, MapPinIcon } from "lucide-react";
import Image from "next/image";
import { use, useEffect, useState } from "react";

interface Job {
  id: number;
  title: string;
  company_id: number;
  description: string;
  isOpen: boolean;
  location: string;
  requirements: string;
  company: {
    logo_url: string;
  };
}

export default function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Job | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/jobs/${id}`);
        const job = await res.json();

        setData(job);
      } catch (error) {
        console.error("Failed to fetch job:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;

  return (
    <div className="p-6 w-full mx-auto">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-5xl">{data?.title}</h1>
        {data?.company?.logo_url && (
          <Image
            src={data.company.logo_url}
            alt="Company Logo"
            className="h-12 w-auto object-contain"
            width={100}
            height={100}
          />
        )}
      </div>
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <MapPinIcon size={15} />
          {data?.location}
        </div>
        <div className="flex items-center gap-2">
          <Briefcase size={15} />
          {data?.isOpen ? "Open" : "Closed"}
        </div>
      </div>
    </div>
  );
}