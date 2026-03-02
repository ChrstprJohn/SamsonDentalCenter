import PageHeader from '../../components/common/PageHeader';
import ServicesList from '../../components/services/ServicesList';
import Portfolio from '../../components/home/Portfolio';
import Testimonials from '../../components/home/Testimonials';
import useServices from '../../hooks/useServices';
import WhyChooseUs from '../../components/services/WhyChooseUs';

const ServicesPage = () => {
    const { services, loading, error } = useServices();

    return (
        <>
            <PageHeader
                title='Services'
                subtitle='Explore our complete range of precision-driven dental treatments and aesthetic procedures designed for your comfort.'
            />
            <WhyChooseUs />
            <ServicesList
                services={services}
                loading={loading}
                error={error}
            />
            <Portfolio variant='light' />
            <Testimonials variant='light' />
        </>
    );
};

export default ServicesPage;
