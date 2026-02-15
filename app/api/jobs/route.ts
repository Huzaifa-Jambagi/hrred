import { NextRequest, NextResponse } from "next/server";
import { SupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    try { 
        const supabase = await SupabaseServerClient();
        const {searchParams} = new URL(request.url);

        const location = searchParams.get("location") || undefined;
        const searchQuery = searchParams.get("searchQuery") || undefined;

        let query = supabase.from("jobs").select("*,company:companies(name,logo_url),saved:saved_jobs(job_id)"); 

        if(searchQuery)query=query.ilike("title", `%${searchQuery}%`);

        if(location)query=query.ilike("location", `%${location}%`);       
         
        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}