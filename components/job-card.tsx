import React from 'react'
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Bookmark, HeartIcon, MapPinIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';

export const JobCard = ({ job, isMyJob, savedInit, onJobSave = () => { } }: any) => {
    const { user } = useUser();
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
            <MapPinIcon size={15}/>{job.location}
                 </div>
            </div>
            <hr />
            {job.description.substring(0, job.description.indexOf("."))}
        </CardContent>
        <CardFooter className=''>
            <Link href={`/jobs/${job.id}`} className='flex-1'>
            <Button variant="secondary" className='w-full'>View Details</Button>
            </Link>

            <Bookmark className='ml-1 cursor-pointer' fill='white'/>
        </CardFooter>
    </Card>)

}
