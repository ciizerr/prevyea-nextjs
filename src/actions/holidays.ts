"use server";

import { db } from "@/db";
import { holidays } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getHolidays(year: number) {
    return await db.query.holidays.findMany({
        where: eq(holidays.year, year),
        orderBy: holidays.date,
    });
}

export async function addHolidays(dates: string[], name: string, year: number) {
    if (dates.length === 0) return { success: false, error: "No dates provided" };

    try {
        await db.transaction(async (tx) => {
            for (const date of dates) {
                await tx.insert(holidays).values({
                    date,
                    name,
                    year
                }).onConflictDoUpdate({
                    target: holidays.date,
                    set: { name, year }
                });
            }
        });
        revalidatePath("/management");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "An unknown error occurred";
        return { success: false, error: message };
    }
}

export async function deleteHoliday(date: string) {
    if (!date) return { success: false, error: "No date provided" };

    try {
        await db.delete(holidays).where(eq(holidays.date, date));
        revalidatePath("/management");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "An unknown error occurred";
        return { success: false, error: message };
    }
}
