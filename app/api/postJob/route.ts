import { NextRequest, NextResponse } from "next/server";
import { SupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await SupabaseServerClient();

        const body = await req.json();
        const { title, description, location, company_id, requirements, recruiter_id } = body;

        if (!title || !description || !location || !company_id || !requirements || !recruiter_id) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("jobs")
            .insert({
                title,
                description,
                location,
                company_id: Number(company_id),
                requirements,
                recruiter_id,
                isOpen: true,
            })
            .select()
            .single();

        if (error) {
            console.error("DB error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const supabase = await SupabaseServerClient();
        const { userId } = await auth();
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data, error } = await supabase
            .from("jobs")
            .select("*, company:companies(id, name, logo_url), applicants:applications(id)")
            .eq("recruiter_id", userId)
            .order("created_at", { ascending: false });

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}