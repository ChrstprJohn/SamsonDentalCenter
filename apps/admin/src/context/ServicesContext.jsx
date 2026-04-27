import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const ServicesContext = createContext();

const MOCK_SERVICES = [
  {
    id: "eb899bd9-77af-4e65-97a0-58b680072748",
    name: "Consultation",
    tier: "general",
    cost: "0",
    duration: "30m",
    description: "A quick checkup to talk about your dental health and plan any needed treatments.",
    image_url: null
  },
  {
    id: "57d22edb-87b4-4fd5-8e67-9401128e1aa3",
    name: "Oral Prophylaxis (Cleaning)",
    tier: "general",
    cost: "0",
    duration: "45m",
    description: "A professional cleaning to remove stains and plaque, keeping your teeth and gums healthy.",
    image_url: null
  },
  {
    id: "f003ef13-2b87-4016-a231-842a4d40959d",
    name: "Restorative Dentistry",
    tier: "general",
    cost: "0",
    duration: "60m",
    description: "Repairing damaged or decayed teeth using fillings or caps to bring back their strength.",
    image_url: null
  },
  {
    id: "8fe64570-07da-447c-8cf2-89f13b74410c",
    name: "Oral Surgery (Tooth Extraction)",
    tier: "general",
    cost: "0",
    duration: "45m",
    description: "Gently removing a tooth that can no longer be saved or is causing pain.",
    image_url: null
  },
  {
    id: "65746f4d-91f7-4210-923f-2e19880c50e0",
    name: "Prosthodontics",
    tier: "general",
    cost: "0",
    duration: "60m",
    description: "Replacing missing teeth with comfortable, natural-looking dentures or bridges.",
    image_url: null
  },
  {
    id: "cc5c001b-d707-4cc0-a5ca-94f74f441aac",
    name: "Pediatric Dentistry",
    tier: "general",
    cost: "0",
    duration: "45m",
    description: "Friendly and gentle dental care specifically designed for kids and teens.",
    image_url: null
  },
  {
    id: "f333ea3e-0fd0-46a3-8730-0d4d35b9f427",
    name: "Endodontic Treatment (Root Canal)",
    tier: "general",
    cost: "0",
    duration: "90m",
    description: "A procedure to save a deeply infected tooth and stop the pain without removing it.",
    image_url: null
  },
  {
    id: "4bc3a310-8e30-474b-b90a-141af33d2a97",
    name: "Orthodontic Treatment",
    tier: "specialized",
    cost: "0",
    duration: "60m",
    description: "Straightening crooked teeth and fixing your bite using braces or clear aligners.",
    image_url: null
  },
  {
    id: "5acd5314-8513-4840-8a97-1594497d3bef",
    name: "TMJ Disorder",
    tier: "specialized",
    cost: "0",
    duration: "60m",
    description: "Relieving jaw pain and discomfort caused by grinding or joint issues.",
    image_url: null
  },
  {
    id: "a7970304-cee8-443d-be7f-1de0ed5ad80c",
    name: "Sleeping Apnea / Sleep Appliance",
    tier: "specialized",
    cost: "0",
    duration: "60m",
    description: "Custom mouthguards to help you breathe better and stop snoring while you sleep.",
    image_url: null
  },
  {
    id: "eb126955-8151-49fe-9dff-c6193bc0b072",
    name: "Dental Implants",
    tier: "specialized",
    cost: "0",
    duration: "120m",
    description: "Inserting a strong foundation to replace a missing tooth with one that looks and feels real.",
    image_url: null
  },
  {
    id: "4af42161-04b5-41bd-a068-e1c8f7f9b925",
    name: "Odontectomy / Impacted Tooth Removal",
    tier: "specialized",
    cost: "0",
    duration: "90m",
    description: "Minor surgery to remove wisdom teeth that are stuck or growing the wrong way.",
    image_url: null
  },
  {
    id: "e91eb1ad-6dde-42cd-b4cf-731676e6d941",
    name: "Periodontal Laser Therapy",
    tier: "specialized",
    cost: "0",
    duration: "60m",
    description: "Using advanced lasers to treat gum disease and clean deep under the gumline.",
    image_url: null
  },
  {
    id: "9acadcb0-7537-4fee-b429-5dc6e0c53920",
    name: "Cosmetic Dentistry",
    tier: "specialized",
    cost: "0",
    duration: "60m",
    description: "Improving the look of your smile with whitening, veneers, and other beauty treatments.",
    image_url: null
  }
];

export const ServicesProvider = ({ children }) => {
    const [services, setServices] = useState(MOCK_SERVICES);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCached, setIsCached] = useState(true);

    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.get('/services');
            if (data.services && data.services.length > 0) {
                setServices(data.services);
            } else {
                setServices(MOCK_SERVICES);
            }
            setIsCached(true);
        } catch (err) {
            console.warn('Backend not available, using mock services.');
            setServices(MOCK_SERVICES);
            setIsCached(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const value = {
        services,
        loading,
        error,
        refetch: fetchServices,
    };

    return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
};

export const useServicesContext = () => {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new Error('useServicesContext must be used within ServicesProvider');
    }
    return context;
};




