import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ServicesProvider } from './context/ServicesContext.jsx';
import { SidebarProvider } from './context/SidebarContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider>
            <ToastProvider>
                <AuthProvider>
  <NotificationProvider>
                    <ServicesProvider>
                        <SidebarProvider>
                            <App />
                        </SidebarProvider>
                    </ServicesProvider>
    </NotificationProvider>
                </AuthProvider>
            </ToastProvider>
        </ThemeProvider>
    </StrictMode>
);
