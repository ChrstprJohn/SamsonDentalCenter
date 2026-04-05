import { supabaseAdmin } from '../config/supabase.js';

/**
 * Get dashboard overview for a specific date range.
 *
 * @param {string} startDate - 'YYYY-MM-DD'
 * @param {string} endDate - 'YYYY-MM-DD'
 */
export const getDashboardStats = async (startDate, endDate) => {
    // ── 1. Total appointments in range ──
    const { count: totalAppointments } = await supabaseAdmin
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate);

    // ── 2. Count by status ──
    const { data: statusCounts } = await supabaseAdmin
        .from('appointments')
        .select('status')
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate);

    const statusBreakdown = {
        CONFIRMED: 0,
        IN_PROGRESS: 0,
        COMPLETED: 0,
        CANCELLED: 0,
        LATE_CANCEL: 0,
        NO_SHOW: 0,
        PENDING: 0,
    };

    (statusCounts || []).forEach((a) => {
        if (statusBreakdown[a.status] !== undefined) {
            statusBreakdown[a.status]++;
        }
    });

    // ── 3. No-show rate & late cancel rate ──
    const completedAndNoShow = statusBreakdown.COMPLETED + statusBreakdown.NO_SHOW;
    const noShowRate =
        completedAndNoShow > 0
            ? ((statusBreakdown.NO_SHOW / completedAndNoShow) * 100).toFixed(1)
            : 0;

    const lateCancelRate =
        totalAppointments > 0
            ? ((statusBreakdown.LATE_CANCEL / totalAppointments) * 100).toFixed(1)
            : 0;

    // ── 4. Slot utilization (what % of available slots were booked?) ──
    // Rough calculation: count booked vs. theoretical max
    // Theoretical max = number of dentists × slots per day × working days
    const { count: dentistCount } = await supabaseAdmin
        .from('dentists')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

    const slotsPerDentistPerDay = 18; // Roughly 9 hours × 2 slots/hour (30 min each)
    const daysDiff =
        Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    const workingDays = Math.ceil((daysDiff * 5) / 7); // Rough estimate of weekdays
    const theoreticalMax = (dentistCount || 1) * slotsPerDentistPerDay * workingDays;
    const bookedSlots = statusBreakdown.CONFIRMED + statusBreakdown.COMPLETED;
    const utilization = theoreticalMax > 0 ? ((bookedSlots / theoreticalMax) * 100).toFixed(1) : 0;

    // ── 5. Walk-in count ──
    const { count: walkInCount } = await supabaseAdmin
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('is_walk_in', true)
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate);

    // ── 6. Waitlist stats ──
    const { count: waitlistTotal } = await supabaseAdmin
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .gte('preferred_date', startDate)
        .lte('preferred_date', endDate);

    const { count: waitlistConverted } = await supabaseAdmin
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'CONFIRMED')
        .gte('preferred_date', startDate)
        .lte('preferred_date', endDate);

    // ── 7. Restricted patients count ──
    const { count: restrictedPatients } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_booking_restricted', true);

    // ── 8. Dentist blocks in range ──
    const { count: dentistBlocks } = await supabaseAdmin
        .from('dentist_availability_blocks')
        .select('*', { count: 'exact', head: true })
        .gte('block_date', startDate)
        .lte('block_date', endDate);

    return {
        period: { start: startDate, end: endDate },
        overview: {
            total_appointments: totalAppointments,
            by_status: statusBreakdown,
            no_show_rate: `${noShowRate}%`,
            late_cancel_rate: `${lateCancelRate}%`,
            slot_utilization: `${utilization}%`,
            walk_ins: walkInCount,
            active_dentists: dentistCount,
            restricted_patients: restrictedPatients,
            dentist_blocks_in_period: dentistBlocks,
        },
        waitlist: {
            total_requests: waitlistTotal,
            converted_to_booking: waitlistConverted,
            conversion_rate:
                waitlistTotal > 0
                    ? `${((waitlistConverted / waitlistTotal) * 100).toFixed(1)}%`
                    : '0%',
        },
    };
};

/**
 * Get per-dentist performance stats.
 */
export const getDentistPerformance = async (startDate, endDate) => {
    // Get all appointments with dentist info
    const { data: appointments } = await supabaseAdmin
        .from('appointments')
        .select(
            `
      dentist_id,
      status,
      dentist:dentists(profile:profiles(full_name))
    `,
        )
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate)
        .not('status', 'eq', 'CANCELLED');

    // Group by dentist
    const dentistMap = {};
    (appointments || []).forEach((appt) => {
        const id = appt.dentist_id;
        if (!id) return;

        if (!dentistMap[id]) {
            dentistMap[id] = {
                dentist_id: id,
                name: appt.dentist?.profile?.full_name || 'Unknown',
                total: 0,
                completed: 0,
                no_shows: 0,
                late_cancels: 0,
            };
        }

        dentistMap[id].total++;
        if (appt.status === 'COMPLETED') dentistMap[id].completed++;
        if (appt.status === 'NO_SHOW') dentistMap[id].no_shows++;
        if (appt.status === 'LATE_CANCEL') dentistMap[id].late_cancels++;
    });

    return Object.values(dentistMap).map((d) => ({
        ...d,
        completion_rate: d.total > 0 ? `${((d.completed / d.total) * 100).toFixed(1)}%` : '0%',
    }));
};

/**
 * Get popular services ranking.
 */
export const getPopularServices = async (startDate, endDate) => {
    const { data } = await supabaseAdmin
        .from('appointments')
        .select('service:services(name)')
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate)
        .not('status', 'eq', 'CANCELLED');

    // Count occurrences of each service
    const counts = {};
    (data || []).forEach((appt) => {
        const name = appt.service?.name || 'Unknown';
        counts[name] = (counts[name] || 0) + 1;
    });

    return Object.entries(counts)
        .map(([name, count]) => ({ service: name, bookings: count }))
        .sort((a, b) => b.bookings - a.bookings);
};

/**
 * Get peak hours (which times of day are busiest).
 */
export const getPeakHours = async (startDate, endDate) => {
    const { data } = await supabaseAdmin
        .from('appointments')
        .select('start_time')
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate)
        .not('status', 'eq', 'CANCELLED');

    // Group by hour
    const hourCounts = {};
    (data || []).forEach((appt) => {
        const hour = appt.start_time?.split(':')[0] + ':00';
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    return Object.entries(hourCounts)
        .map(([hour, count]) => ({ hour, bookings: count }))
        .sort((a, b) => b.bookings - a.bookings);
};
