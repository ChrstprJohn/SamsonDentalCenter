import { useParams } from 'react-router-dom';
import ServiceDetail from '../../components/services/ServiceDetail';
import useServiceDetail from '../../hooks/useServiceDetail';

const ServiceDetailPage = () => {
    const { id } = useParams();
    const { service, loading, error } = useServiceDetail(id);

    return (
        <ServiceDetail
            service={service}
            loading={loading}
            error={error}
        />
    );
};

export default ServiceDetailPage;
