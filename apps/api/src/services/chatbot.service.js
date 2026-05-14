import * as chrono from 'chrono-node';
import { supabaseAdmin } from '../config/supabase.js';
import { getAvailableSlots } from './slot.service.js';
import { getSettings, getSchedule } from './settings.service.js';
import { APPOINTMENT_STATUS } from '../utils/constants.js';

/**
 * Process a user message and return a natural language response with suggested actions.
 * @param {string} message - The user's input message.
 * @returns {Promise<{response: string, suggestedActions: string[]}>}
 */
export const processQuery = async (message) => {
    const msg = message.toLowerCase().trim();

    // 1. Intent Detection with Typo Tolerance
    if (isGreeting(msg)) {
        return {
            response: "Hello! I'm the Samson AI Assistant. I can help you check for available appointments, explain our dental services, or provide clinic details. What's on your mind?",
            suggestedActions: ["Check Availability", "Our Services", "Emergency Help"]
        };
    }

    if (matchPattern(msg, ['emergency', 'pain', 'hurts', 'ache', 'bleeding', 'broken', 'accident', 'swelling'])) {
        return handleEmergencyIntent();
    }
    
    if (matchPattern(msg, ['availab', 'slot', 'open', 'book', 'when', 'date', 'time', 'appointment', 'schedule', 'tomorrow', 'today'])) {
        return await handleAvailabilityIntent(msg);
    }

    if (matchPattern(msg, ['price', 'cost', 'expensive', 'cheap', 'how much', 'payment', 'installment', 'promo', 'discount'])) {
        return handlePricingIntent();
    }

    if (matchPattern(msg, ['service', 'treatment', 'offer', 'about', 'what is', 'procedure', 'cleaning', 'scan', 'extraction', 'whitening', 'filling', 'braces', 'implant'])) {
        return await handleServiceIntent(msg);
    }

    if (matchPattern(msg, ['doctor', 'dentist', 'specialist', 'who works', 'staff', 'team', 'dentists'])) {
        return await handleDoctorIntent(msg);
    }

    if (matchPattern(msg, ['parking', 'wifi', 'comfort', 'coffee', 'water', 'amenity', 'facility', 'waiting', 'lounge'])) {
        return handleAmenitiesIntent();
    }

    if (matchPattern(msg, ['location', 'address', 'where', 'hours', 'contact', 'phone', 'email', 'website', 'days'])) {
        return await handleClinicInfoIntent(msg);
    }

    if (matchPattern(msg, ['safety', 'steril', 'clean', 'hygiene', 'tech', 'ai', 'scanner', 'modern'])) {
        return handleTechSafetyIntent();
    }

    // Fallback
    return {
        response: "I'm sorry, I didn't quite catch that. You can ask about our available slots, dental services, clinic hours, or what to do in an emergency. How can I help you today?",
        suggestedActions: ["Our Services", "Check Availability", "Emergency Help"]
    };
};

// ── Fuzzy Matching Helpers ──

const matchPattern = (msg, patterns) => {
    if (patterns.some(p => msg.includes(p.toLowerCase()))) return true;
    const words = msg.split(/\s+/);
    return words.some(word => {
        if (word.length < 3) return false;
        return patterns.some(p => {
            if (p.length < 3) return false;
            // 80% prefix match or 80% suffix match or contains
            const threshold = Math.floor(p.length * 0.8);
            return word.startsWith(p.substring(0, threshold)) || 
                   word.endsWith(p.substring(p.length - threshold)) ||
                   word.includes(p);
        });
    });
};

const isGreeting = (msg) => {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'yo', 'sup'];
    return greetings.some(g => msg.startsWith(g)) || msg === 'hi' || msg === 'hello';
};

// ── Intent Handlers ──

const handleEmergencyIntent = () => {
    return {
        response: "If you are experiencing severe pain, swelling, or a broken tooth, this is considered a dental emergency. We prioritize emergency cases! Please call our clinic directly at our emergency line so we can squeeze you in immediately.",
        suggestedActions: ["Call Now", "Check Availability", "Our Location"]
    };
};

const handlePricingIntent = () => {
    return {
        response: "To provide an accurate quote, we first need a clinical examination as every case is unique. However, we offer various payment options and competitive rates for our premium services. Would you like to see our list of services or book a consultation?",
        suggestedActions: ["Our Services", "Book Consultation", "Clinic Hours"]
    };
};

const handleAmenitiesIntent = () => {
    return {
        response: "We want your visit to be as comfortable as possible! Our clinic features a premium patient lounge, free high-speed WiFi, complimentary refreshments, and dedicated parking for patients. We also use noise-canceling technology to ensure a peaceful environment.",
        suggestedActions: ["Our Location", "See Doctors", "Book Now"]
    };
};

const handleTechSafetyIntent = () => {
    return {
        response: "Safety is our top priority. We use hospital-grade sterilization protocols and the latest digital technology, including AI-driven diagnostics and 3D intraoral scanners, to ensure the highest precision and safety for every patient.",
        suggestedActions: ["Our Services", "Our Doctors", "Check Availability"]
    };
};

const handleAvailabilityIntent = async (msg) => {
    const results = chrono.parse(msg);
    let targetDate;

    if (results.length > 0) {
        targetDate = results[0].start.date();
    } else if (msg.includes('today')) {
        targetDate = new Date();
    } else if (msg.includes('tomorrow')) {
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 1);
    }

    if (!targetDate) {
        return {
            response: "I can check our availability for you! Could you please tell me which date you're interested in? (e.g., 'tomorrow', 'this Friday', or 'June 12')",
            suggestedActions: ["Tomorrow", "This Friday", "Next Monday"]
        };
    }

    const dateStr = targetDate.toISOString().split('T')[0];
    const dayName = targetDate.toLocaleDateString('en-US', { weekday: 'long' });

    try {
        const { data: services } = await supabaseAdmin
            .from('services')
            .select('id, name')
            .eq('is_active', true)
            .ilike('name', '%cleaning%')
            .limit(1);
        
        let serviceId = services?.[0]?.id;
        let serviceName = services?.[0]?.name || 'General Consultation';

        if (!serviceId) {
            const { data: allServices } = await supabaseAdmin
                .from('services')
                .select('id, name')
                .eq('is_active', true)
                .limit(1);
            serviceId = allServices?.[0]?.id;
            serviceName = allServices?.[0]?.name;
        }

        if (!serviceId) {
            return {
                response: "I'm having trouble checking the schedule right now. Please try again later or contact our clinic directly.",
                suggestedActions: ["Call Us", "Our Services"]
            };
        }

        const slots = await getAvailableSlots(dateStr, serviceId);

        if (slots.total_available === 0) {
            let resp = `We don't have any open slots on ${dayName}, ${dateStr}.`;
            let actions = ["Other Dates", "Emergency Help"];
            if (slots.next_available_date) {
                resp += ` Our next available opening is on ${slots.next_available_date}.`;
                actions.unshift(`Check ${slots.next_available_date}`);
            }
            return { response: resp, suggestedActions: actions };
        }

        const availableTimes = slots.all_slots
            .filter(s => s.available > 0)
            .slice(0, 5)
            .map(s => s.time)
            .join(', ');

        return {
            response: `On ${dayName}, ${dateStr}, we have slots for ${serviceName} at: ${availableTimes}${slots.total_available > 5 ? ', and more' : ''}.`,
            suggestedActions: ["Book Now", "Other Dates", "Our Doctors"]
        };
    } catch (err) {
        return {
            response: "I'm sorry, I encountered an error while checking our schedule. Please try again in a moment.",
            suggestedActions: ["Try Again", "Emergency Help"]
        };
    }
};

const handleServiceIntent = async (msg) => {
    const { data: services } = await supabaseAdmin
        .from('services')
        .select('name, description, duration_minutes, tier')
        .eq('is_active', true)
        .order('name');

    if (!services || services.length === 0) {
        return {
            response: "We offer a wide range of dental care, from preventative hygiene to complex oral surgery. Is there a specific treatment you're looking for?",
            suggestedActions: ["Hygiene", "3D Scan", "Consultation"]
        };
    }

    const matchedService = services.find(s => msg.includes(s.name.toLowerCase()));

    if (matchedService) {
        return {
            response: `**${matchedService.name}**\n\n- **Tier:** ${matchedService.tier}\n- **Duration:** ~${matchedService.duration_minutes} minutes\n- **Description:** ${matchedService.description}\n\nWould you like to check availability for this service?`,
            suggestedActions: ["Check Availability", "Other Services", "Who are the doctors?"]
        };
    }

    const serviceList = services.map(s => `• ${s.name}`).join('\n');
    return {
        response: `We provide a comprehensive range of world-class dental treatments:\n\n${serviceList}\n\nYou can ask me for more details about any of these!`,
        suggestedActions: services.slice(0, 3).map(s => s.name)
    };
};

const handleDoctorIntent = async (msg) => {
    const { data: dentists } = await supabaseAdmin
        .from('dentists')
        .select(`
            tier,
            profile:profiles(full_name, first_name, last_name)
        `)
        .eq('is_active', true);

    if (!dentists || dentists.length === 0) {
        return {
            response: "Our clinic is led by highly qualified specialists. We're happy to assist you!",
            suggestedActions: ["Our Services", "Clinic Hours"]
        };
    }

    const doctorNames = dentists.map(d => {
        return d.profile?.first_name ? `Dr. ${d.profile.first_name} ${d.profile.last_name}` : d.profile?.full_name;
    }).join(', ');

    return {
        response: `Our clinical team includes: ${doctorNames}. They are experts in their fields and dedicated to your oral health.`,
        suggestedActions: ["Check Availability", "Our Services"]
    };
};

const handleClinicInfoIntent = async (msg) => {
    const settings = await getSettings().catch(() => ({}));
    const schedule = await getSchedule().catch(() => []);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const formattedSchedule = schedule
        .filter(s => s.is_open)
        .map(s => `• **${days[s.day_of_week]}:** ${s.open_time.substring(0, 5)} - ${s.close_time.substring(0, 5)}`)
        .join('\n');

    let response = `**Samson Dental Center**\n\n📍 **Location:** **[Samson Dental Center in Baguio](https://www.google.com/maps/place/Samson+Dental+Center/@16.4059113,120.5991796,795m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3391a1415b12503d:0x91fc42fcfb4a069f!8m2!3d16.4059113!4d120.6017545!16s%2Fg%2F11c2prstv6?entry=ttu&g_ep=EgoyMDI2MDUxMi4wIKXMDSoASAFQAw%3D%3D)**\n\n📞 **Contacts:**\n- **Phone:** ${settings.phone || '09454921251'}\n- **Email:** ${settings.email || 'samsondental@gmail.com'}\n- **Website:** samsondental.com`;
    
    if (formattedSchedule) {
        response += `\n\n⏰ **Clinical Hours:**\n${formattedSchedule}`;
    }

    return {
        response,
        suggestedActions: ["Check Availability", "Our Services", "Our Amenities"]
    };
};
