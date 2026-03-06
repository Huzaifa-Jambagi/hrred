"use client"
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { State } from 'country-state-city';
import MDEditor from '@uiw/react-md-editor';
import AddCompanyDrawer from '@/components/AddCompanyDrawer';
const schema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  description: z.string().min(10, { message: "Description is required" }),
  location: z.string().min(2, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or add a company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});

type FormData = z.infer<typeof schema>;

interface Company {
  id: number;
  name: string;
}

const Page = () => {
  const { user } = useUser();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const fetchCompanies = async () => {
    try {
      const res = await fetch('/api/companies');
      if (!res.ok) throw new Error('Failed to fetch companies');
      const data = await res.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!user?.id) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/postJob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, recruiter_id: user.id }),
      });
      if (!res.ok) throw new Error('Failed to post job');
      reset();
    } catch (err) {
      setSubmitError('Failed to post job. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="gradient-title text-4xl sm:text-7xl text-center font-extrabold pb-8">
        Post a Job
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        <Input placeholder="Job Title" {...register("title")} />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}

        <Textarea placeholder="Job Description" rows={4} {...register("description")} />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

        <div className="flex gap-4 items-start">
          
          <div className="flex-1">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Job Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {State.getStatesOfCountry("IN").map(({ name }) => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
          </div>

          
          <div className="flex-1">
            <Controller
              name="company_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Company">
                      {field.value
                        ? companies?.find((c) => c.id === Number(field.value))?.name
                        : "Company"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies?.map(({ name, id }) => (
                        <SelectItem key={id} value={String(id)}>{name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.company_id && <p className="text-red-500 text-sm mt-1">{errors.company_id.message}</p>}
          </div>

          <AddCompanyDrawer fetchCompanies={fetchCompanies} />
        </div>

        {/* Requirements - MDEditor */}
      <div data-color-mode="auto">
  <Controller
    name="requirements"
    control={control}
    render={({ field }) => (
      <MDEditor
        value={field.value}
        onChange={(val) => field.onChange(val ?? "")}
        preview="edit"
        height={200}
      />
    )}
  />
</div>
        {errors.requirements && <p className="text-red-500 text-sm">{errors.requirements.message}</p>}

        {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

        <Button type="submit" variant="blue" size="lg" className="mt-2" disabled={submitting}>
          {submitting ? "Posting..." : "Submit"}
        </Button>
      </form>
    </div>
  )
}

export default Page