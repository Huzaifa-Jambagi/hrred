"use client"
import { useEffect, useState } from "react";
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Application {

      id:string,
      candidate_id:string,
      job_id:string,
      status:string,
      resume:string,
      skills:string,
      experience:number,
      education:string,
      name:string,
      created_at: string
 
}

interface ApplicationCardProps {
  application: Application;
  isCandidate?: boolean;
  title?: string;
}

const ApplicationCard = ({ application, isCandidate = false,title }: ApplicationCardProps) => {
  const [status, setStatus] = useState(application.status);
  const [loading, setLoading] = useState(false);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const res=await fetch(`/api/applications/${application.id}`);
      if(!res.ok) throw new Error("Failed to fetch application");
      const data=await res.json();
      setStatus(data.status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{

  },[])

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setStatus(newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full flex-1">
  {loading && (
    <div className="w-full h-1 bg-gray-200 rounded overflow-hidden">
      <div className="h-full bg-teal-400 animate-pulse w-full" />
    </div>
  )}
  <CardHeader>
    <CardTitle className="flex justify-between items-center font-bold gap-2">
      <span className="text-sm sm:text-base truncate">
        {isCandidate
          ? `${title} - ${status}`
          : application?.name || "Candidate Name Unavailable"}
      </span>
      <Download
        size={18}
        className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer shrink-0"
        onClick={handleDownload}
      />
    </CardTitle>
  </CardHeader>

  <CardContent className="flex flex-col gap-4 flex-1">
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
      <div className="flex gap-2 items-center text-sm">
        <BriefcaseBusiness size={15} className="shrink-0" />
        <span>{application?.experience} years of experience</span>
      </div>
      <div className="flex gap-2 items-center text-sm">
        <School size={15} className="shrink-0" />
        <span>{application?.education}</span>
      </div>
      <div className="flex gap-2 items-center text-sm">
        <Boxes size={15} className="shrink-0" />
        <span>Skills: {application?.skills}</span>
      </div>
    </div>
    <hr />
  </CardContent>

  <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
    <span className="text-xs sm:text-sm text-muted-foreground">
      {new Date(application?.created_at).toLocaleString()}
    </span>
    {isCandidate ? (
      <span className="capitalize font-bold text-sm">
        Status: {status}
      </span>
    ) : (
      <Select onValueChange={handleStatusChange} defaultValue={status}>
        <SelectTrigger className="w-full sm:w-52">
          <SelectValue placeholder="Application Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="applied">Applied</SelectItem>
          <SelectItem value="interviewing">Interviewing</SelectItem>
          <SelectItem value="hired">Hired</SelectItem>
          <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
      </Select>
    )}
  </CardFooter>
</Card>
  );
};

export default ApplicationCard;