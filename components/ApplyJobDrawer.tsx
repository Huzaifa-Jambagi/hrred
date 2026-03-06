import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";

type jobProp = {
    job: {
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
            candidate_id: string;
        }[];
    },
    fetchJob: () => Promise<void>,
    applied: boolean
}

const schema = z.object({
    experience: z.number().min(0, { message: "Experience must be at least 0" }).int(),
    skills: z.string().min(1, { message: "Skills are required" }),
    education: z.enum(["Intermediate", "Graduate", "Post Graduate"], { message: "Education is required" }),
    resume: z.any().refine((file) => file?.length > 0, { message: "Resume is required" }),
})

type FormData = z.infer<typeof schema>;

const ApplyJobDrawer = ({ job, fetchJob, applied = false }: jobProp) => {
    const { user } = useUser();
    const fullName = user?.fullName as string;
    const {
        register,
        formState: { errors },
        control,
        handleSubmit,
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        console.log(data);
        const formData = new FormData()
        if (!user?.id) {
            console.error("User not logged in");
            return;
        }

        formData.append("experience", String(data.experience));
        formData.append("skills", data.skills);
        formData.append("education", data.education);
        formData.append("resume", data.resume[0]);
        formData.append("job_id", String(job.id));
        formData.append("candidate_id", user?.id);
        formData.append("name", fullName);


        const response = await fetch('/api/applications', {
            method: "POST",
            body: formData
        })
        if (!response.ok) {
            const errorData = await response.json();
            console.error("Submission failed", errorData);
            return;
        }
        fetchJob();
        reset();
    };

    return (
        <Drawer open={applied ? false : undefined}>
            <DrawerTrigger asChild>
                <Button
                    variant={job.isOpen && !applied ? "blue" : "destructive"}
                    disabled={applied || !job.isOpen}
                >
                    {job.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Apply for {job.title}</DrawerTitle>
                    <DrawerDescription>Please fill the form below</DrawerDescription>
                </DrawerHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
                    <Input
                        type="number"
                        placeholder="Years of experience"
                        className="flex-1"
                        {...register("experience", { valueAsNumber: true })}
                    />
                    {errors.experience && <p className="text-red-500">{errors.experience.message}</p>}

                    <Input
                        type="text"
                        placeholder="Skills.."
                        className="flex-1"
                        {...register("skills")}
                    />
                    {errors.skills && <p className="text-red-500">{errors.skills.message}</p>}

                    <Controller
                        name="education"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup onValueChange={field.onChange} value={field.value}>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="Intermediate" id="intermediate" />
                                    <Label htmlFor="intermediate">Intermediate</Label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="Graduate" id="graduate" />
                                    <Label htmlFor="graduate">Graduate</Label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="Post Graduate" id="post-graduate" />
                                    <Label htmlFor="post-graduate">Post Graduate</Label>
                                </div>
                            </RadioGroup>
                        )}
                    />
                    {errors.education && <p className="text-red-500">{errors.education.message}</p>}

                    <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="flex-1 file:text-gray-500"
                        {...register("resume")}
                    />
                    {errors.resume && <p className="text-red-500">{errors.resume.message?.toString()}</p>}

                    <Button type="submit" variant="blue">Submit</Button>
                </form>

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="destructive">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default ApplyJobDrawer;