import { NextRequest, NextResponse } from "next/server";
import { SupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    try { 
        const supabase = await SupabaseServerClient();
        const {searchParams} = new URL(request.url);

        const location = searchParams.get("location") || undefined;
        const company_id = searchParams.get("company_id") || undefined;
        const searchQuery = searchParams.get("searchQuery") || undefined;

        let query = supabase.from("jobs").select("*,company:companies(name,logo_url),saved:saved_jobs(job_id)"); 

        if(location) query = query.eq("location", location);
        if(company_id) query = query.eq("company_id", Number(company_id));
        if(searchQuery) query = query.ilike("title", `%${searchQuery}%`);
        
        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}