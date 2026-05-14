import { supabaseAdmin } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import { APPOINTMENT_STATUS } from '../utils/constants.js';

/**
 * Creates a new invoice and its associated items.
 * Also transitions the appointment status to COMPLETED.
 * 
 * @param {object} data - Invoice data
 * @param {string} actingUserId - ID of the dentist creating the invoice
 * @returns {Promise<object>} Created invoice with items
 */
export const createInvoice = async (data, actingUserId) => {
    const { appointment_id, patient_id, dentist_id, items, notes } = data;

    // 1. Fetch current prices and names for all services to ensure integrity
    const serviceIds = items.map(item => item.service_id);
    const { data: services, error: servicesError } = await supabaseAdmin
        .from('services')
        .select('id, name, price')
        .in('id', serviceIds);

    if (servicesError || !services) {
        throw new AppError('Failed to fetch service details for invoicing', 500);
    }

    // Map DB services for quick lookup
    const serviceMap = services.reduce((acc, s) => {
        acc[s.id] = s;
        return acc;
    }, {});

    // 2. Calculate total and prepare items with DB-accurate prices
    const preparedItems = items.map(item => {
        const dbService = serviceMap[item.service_id];
        if (!dbService) throw new AppError(`Service with ID ${item.service_id} not found`, 404);
        
        return {
            service_id: item.service_id,
            service_name: dbService.name,
            price: dbService.price,
            quantity: item.quantity,
            total_price: dbService.price * item.quantity
        };
    });

    const totalAmount = preparedItems.reduce((sum, item) => sum + item.total_price, 0);

    // 3. Verify appointment status
    const { data: appointment, error: aptError } = await supabaseAdmin
        .from('appointments')
        .select('status')
        .eq('id', appointment_id)
        .single();

    if (aptError || !appointment) {
        throw new AppError('Appointment not found', 404);
    }

    if (appointment.status !== APPOINTMENT_STATUS.IN_PROGRESS) {
        throw new AppError('Only appointments currently IN_PROGRESS can be invoiced', 400);
    }

    // A. Create the Invoice Header
    const { data: invoice, error: invoiceError } = await supabaseAdmin
        .from('invoices')
        .insert({
            appointment_id,
            patient_id,
            dentist_id,
            total_amount: totalAmount,
            notes,
            status: 'pending'
        })
        .select()
        .single();

    if (invoiceError) {
        console.error('[InvoiceService] Create Error:', invoiceError);
        if (invoiceError.code === '23505') {
            throw new AppError('An invoice already exists for this appointment', 409);
        }
        throw new AppError('Failed to create invoice header', 500);
    }

    // B. Create Invoice Items
    const invoiceItems = preparedItems.map(item => ({
        ...item,
        invoice_id: invoice.id
    }));

    const { error: itemsError } = await supabaseAdmin
        .from('invoice_items')
        .insert(invoiceItems);

    if (itemsError) {
        console.error('[InvoiceService] Items Create Error:', itemsError);
        throw new AppError('Failed to create invoice items', 500);
    }

    // C. Transition Appointment to COMPLETED
    const { error: updateAptError } = await supabaseAdmin
        .from('appointments')
        .update({ 
            status: APPOINTMENT_STATUS.COMPLETED,
            updated_at: new Date().toISOString()
        })
        .eq('id', appointment_id);

    if (updateAptError) {
        console.error('[InvoiceService] Appointment Update Error:', updateAptError);
    }

    return {
        ...invoice,
        items: invoiceItems
    };
};


/**
 * Retrieves an invoice by appointment ID.
 * 
 * @param {string} appointmentId 
 * @returns {Promise<object>}
 */
export const getInvoiceByAppointment = async (appointmentId) => {
    const { data: invoice, error } = await supabaseAdmin
        .from('invoices')
        .select(`
            *,
            items:invoice_items(*),
            patient:profiles!patient_id(full_name, first_name, last_name),
            dentist:dentists(profile:profiles(full_name, first_name, last_name))
        `)
        .eq('appointment_id', appointmentId)
        .single();

    if (error && error.code !== 'PGRST116') {
        throw new AppError('Failed to retrieve invoice', 500);
    }

    return invoice || null;
};

/**
 * Lists invoices for a specific patient.
 * 
 * @param {string} patientId 
 * @returns {Promise<Array>}
 */
export const getPatientInvoices = async (patientId) => {
    const { data, error } = await supabaseAdmin
        .from('invoices')
        .select(`
            *,
            items:invoice_items(*),
            appointment:appointments(appointment_date, start_time)
        `)
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

    if (error) throw new AppError('Failed to retrieve patient invoices', 500);
    return data;
};
