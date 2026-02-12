import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Bookmark, HeartIcon, MapPinIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import { log } from 'console';


interface JobCardProps {
    job: any;
    isMyJob?: boolean;
    savedInit?: boolean;
    onJobAction?: () => void;
}

export const JobCard = ({ job, isMyJob, savedInit, onJobAction = () => { } }: JobCardProps) => {
    const { user } = useUser();
    const [saved, setSaved] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {

        if (job.saved && job.saved.length > 0) {
            setSaved(true);
        } else {
            setSaved(false);
        }
    }, [job.saved])

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/jobs/saved", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ job_id: job.id, alreadySaved: saved }),
            });
            if (response.ok) {
                setSaved(!saved);
                onJobAction();
            }
        } catch (error) {
            console.error("Error saving job:", error);
        } finally {
            setLoading(false);
        }
    }
    return (<Card>
        <CardHeader>
            <CardTitle className='flex justify-between'>{job.title}</CardTitle>
            {isMyJob && (
                <Trash2Icon
                    fill="red"
                    size={18}
                    className='cursor-pointer text-red-500'
                />
            )
            }
        </CardHeader>
        <CardContent className='flex flex-col gap-4 flex-1'>
            <div className="flex justify-between">
                {job.company &&
                    <Image
                        src={job.company.logo_url}
                        alt={job.company.name}
                        width={50} height={50}
                        className='h-6 w-14' />}
                <div className="flex gap-2 items-center">
                    <MapPinIcon size={15} />{job.location}
                </div>
            </div>
            <hr />
            {job.description.substring(0, job.description.indexOf("."))}
        </CardContent>
        <CardFooter className=''>
            <Link href={`/jobs/${job.id}`} className='flex-1'>
                <Button variant="secondary" className='w-full'>View Details</Button>
            </Link>

            <Button variant="outline" className='ml-2' onClick={handleSave} disabled={loading}>
                <Bookmark className='ml-1 cursor-pointer' fill={saved ? 'white' : 'none'} />
            </Button>
        </CardFooter>
    </Card>)

}
