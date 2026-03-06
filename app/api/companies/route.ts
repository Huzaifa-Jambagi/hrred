import { NextRequest, NextResponse } from "next/server";
import { SupabaseServiceClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await SupabaseServiceClient();

        const { data, error } = await supabase
            .from("companies")
            .select("id, name, logo_url")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("DB error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await SupabaseServiceClient();

        const formData = await req.formData();
        const name = formData.get("name") as string;
        const logo = formData.get("logo") as File;

        if (!name || !logo) {
            return NextResponse.json({ error: "Name and logo are required" }, { status: 400 });
        }

        // Upload logo to Supabase storage
        const { data: storageData, error: storageError } = await supabase.storage
            .from("company-logo")
            .upload(`${name}-${Date.now()}-logo`, logo);

        if (storageError || !storageData) {
            console.error("Storage error:", storageError);
            return NextResponse.json({ error: storageError?.message ?? "Logo upload failed" }, { status: 500 });
        }

        const logo_url = supabase.storage
            .from("company-logo")
            .getPublicUrl(storageData.path).data.publicUrl;

        // Insert company into DB
        const { data, error } = await supabase
            .from("companies")
            .insert({ name, logo_url })
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