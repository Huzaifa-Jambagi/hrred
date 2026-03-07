import { NextRequest, NextResponse } from "next/server";
import { SupabaseServiceClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await SupabaseServiceClient();

        const data = await req.formData();

        const experience = data.get("experience");
        const skills = data.get("skills");
        const education = data.get("education");
        const resume = data.get("resume") as File;
        const job_id = data.get("job_id");
        const candidate_id = data.get("candidate_id");

        const { data: storageData, error: storageError } = await supabase.storage
            .from('resumes')
            .upload(`${candidate_id}-${Date.now()}-resume`, resume)

        if (storageError || !storageData) {
             console.error("Storage error details:", JSON.stringify(storageError))
            return NextResponse.json(
                { error: storageError?.message ?? "Uploading of resume failed" },
                { status: 500 }
            );
        }

        const publicUrl = supabase.storage
            .from("resumes")
            .getPublicUrl(storageData.path)
            .data.publicUrl;

        if (storageError) {
            return NextResponse.json({ success: false, error: storageError }, { status: 500 });
        }

        const { error: appError } = await supabase
            .from('applications')
            .insert({
                experience,
                skills,
                education,
                candidate_id,
                job_id,
                resume: publicUrl,
                status: "applied",
            });

        if (appError) {
            return NextResponse.json({ success: false, error: appError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const supabase = await SupabaseServiceClient();
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data, error } = await supabase
            .from("applications")
            .select("*, jobs(*, company:companies(id, name, logo_url))")
            .eq("candidate_id", userId)
            .order("created_at", { ascending: false });

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}