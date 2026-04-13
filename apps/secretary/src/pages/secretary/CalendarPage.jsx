import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import Calendar from '../../components/secretary/calendar/Calendar';

const CalendarPage = () => {
    return (
        <div className="w-full">
            <PageBreadcrumb pageTitle="Schedule Master" />
            <Calendar />
        </div>
    );
};

export default CalendarPage;
