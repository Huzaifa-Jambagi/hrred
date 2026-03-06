"use client"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      { message: "Only PNG or JPEG images are allowed" }
    ),
});

type FormData = z.infer<typeof schema>;

interface AddCompanyDrawerProps {
  fetchCompanies: () => Promise<void>;
}

const AddCompanyDrawer = ({ fetchCompanies }: AddCompanyDrawerProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("logo", data.logo[0]);

      const res = await fetch("/api/companies", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error ?? "Failed to add company");
      }

      await fetchCompanies();
      reset();
      setOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button type="button" size="sm" variant="secondary">
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a New Company</DrawerTitle>
        </DrawerHeader>

        <form className="flex gap-2 p-4 pb-0">
          <Input placeholder="Company name" {...register("name")} />
          <Input
            type="file"
            accept="image/png, image/jpeg"
            className="file:text-gray-500"
            {...register("logo")}
          />
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            variant="destructive"
            className="w-40"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </form>

        <DrawerFooter>
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          {errors.logo && <p className="text-red-500 text-sm">{errors.logo.message as string}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {loading && (
            <div className="w-full h-1 bg-gray-200 rounded overflow-hidden">
              <div className="h-full bg-teal-400 animate-pulse w-full" />
            </div>
          )}
          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;