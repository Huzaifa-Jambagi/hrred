import { NextRequest, NextResponse } from "next/server";
import { SupabaseServerClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
    try {
        const supabase = await SupabaseServerClient();
        const { userId } = await auth();
        console.log("User ID:", userId);
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { job_id, alreadySaved } = body;

        if (alreadySaved) {
            const { error } = await supabase.from("saved_jobs").delete().eq("job_id", job_id).eq("user_id", userId);
            if (error) {
                console.error("Failed to unsave job:", error);
            }
        } else {
            const { error } = await supabase.from("saved_jobs").insert({ job_id, user_id: userId });
            if (error) {
                console.error("Failed to save job:", error);
            }
        }
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error handling saved job:", error);
        return NextResponse.json({ error: "Internal server error while saving job" }, { status: 500 });
    }
}