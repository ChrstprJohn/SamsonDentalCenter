import { z } from 'zod';

const stringRequired = z.string().min(1);
const stringOptional = z.string().nullish();
const numberOptional = z.number().int().nonnegative().nullish();
const booleanOptional = z.boolean().nullish();
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/;
const timeSchema = z.string().regex(timeRegex, "Invalid time format (HH:mm)").nullish();

export const updateSettingsSchema = z.object({
    body: z.object({
        clinic_name: stringOptional,
        address: stringOptional,
        phone: stringOptional,
        email: stringOptional,
        phone_primary: stringOptional,
        email_official: stringOptional,
        physical_address: stringOptional,
        opening_hour: z.number().int().min(0).max(23).nullish(),
        closing_hour: z.number().int().min(0).max(23).nullish(),
        about_text: stringOptional,
        announcement: stringOptional,
        logo_url: stringOptional,
        hero_banner_text: stringOptional,
        hero_banner_enabled: booleanOptional,
        sms_notifications_enabled: booleanOptional,
        email_notifications_enabled: booleanOptional,
        privacy_policy_text: stringOptional,
        terms_of_service_text: stringOptional,
        booking_lead_time_hours: numberOptional,
        booking_max_horizon_days: numberOptional,
        slot_duration_minutes: z.number().int().min(5).max(120).nullish(),
        waitlist_enabled: booleanOptional,
    }).passthrough(),
    params: z.any(),
    query: z.any(),
}).passthrough();

export const updateScheduleSchema = z.object({
    body: z.array(z.object({
        day_of_week: z.number().int().min(0).max(6),
        open_time: timeSchema,
        close_time: timeSchema,
        lunch_start_time: timeSchema,
        lunch_end_time: timeSchema,
        is_open: booleanOptional,
    })),
    params: z.any(),
    query: z.any(),
}).passthrough();

export const holidaySchema = z.object({
    body: z.object({
        date: stringRequired, // ISO Date string YYYY-MM-DD
        name: stringRequired,
        is_closed: booleanOptional.default(true),
        open_time: timeSchema,
        close_time: timeSchema,
    }).passthrough(),
    params: z.any(),
    query: z.any(),
}).passthrough();
