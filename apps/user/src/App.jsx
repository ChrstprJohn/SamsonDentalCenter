import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import useSmoothScroll from './hooks/useSmoothScroll';
import { ServicesProvider } from './context/ServicesContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';

const App = () => {
    useSmoothScroll();

    return (
        <ThemeProvider>
            <BrowserRouter>
                <ServicesProvider>
                    <NotificationProvider>
                        <AppointmentProvider>
                            <ToastProvider>
                                <AppRoutes />
                            </ToastProvider>
                        </AppointmentProvider>
                    </NotificationProvider>
                </ServicesProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;

// // Test Health
// const health = await api.get('/api/health');
// console.log(health);

// Test
// try {
//     const data = await api.get('/api/services');
//     // console.log(data);

//     data.services.map((service) => console.log(service.name));
// } catch (err) {
//     console.log(err.status); // 401
//     console.log(err.message); // "No token provided" or similar
// }
