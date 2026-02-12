import { SupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";    
export async function GET(request: NextRequest,{params}:{params:Promise<{id:string}>}) {

    try { 
        const supabase = await SupabaseServerClient();
        const { id } = await params;
        const { data, error } = await supabase.from("jobs").select("*,company:companies(logo_url)").eq("id",id).single();
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.log(data);
        return NextResponse.json(data);
        }
        catch (error: any) {
           return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
        }
    }