import { NextRequest, NextResponse } from "next/server";
import { SupabaseServerClient } from "@/lib/supabase/server";
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = await SupabaseServerClient();
        const { id } = await params;
        const { status } = await request.json();

        const { data, error } = await supabase
            .from("applications")
            .update({ status })
            .eq("id", id)
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });

        return NextResponse.json(data);
        
    } catch (error) {
        return NextResponse.json({ error: `${error} while updating the application status` }, { status: 500 });
    }

}