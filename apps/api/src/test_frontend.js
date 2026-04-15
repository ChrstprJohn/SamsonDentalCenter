const allAppointments = [
  {
    id: '50c776fb-b0c6-4b87-8df2-ed62be04add5',
    appointment_date: '2026-04-16',
    status: 'PENDING',
    approval_status: 'approved',
    service_tier: 'general'
  }
];

const today = new Date().toISOString().split('T')[0];

console.log("today is", today);

const filtered = allAppointments.filter(a => {
    const statusStr = (a.status || '').toUpperCase();
    const appStatusStr = (a.approval_status || '').toLowerCase();
    const isApproved = appStatusStr === 'approved' || statusStr === 'CONFIRMED';
    
    return isApproved && 
           statusStr !== 'CANCELLED' && 
           statusStr !== 'LATE_CANCEL' && 
           statusStr !== 'NO_SHOW' &&
           a.appointment_date >= today;
});

console.log("Filtered length:", filtered.length);
