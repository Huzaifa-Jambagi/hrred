import React from 'react'
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPinIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';

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
                 <div className="">
            <MapPinIcon size={15}/>{job.location}
                 </div>
            </div>
            <hr />
            {job.description.substring(0, job.description.indexOf("."))}
        </CardContent>
    </Card>)

}
