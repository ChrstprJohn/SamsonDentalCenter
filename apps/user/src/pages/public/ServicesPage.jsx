import PageHeader from "../../components/common/PageHeader";
import ServicesList from "../../components/services/ServicesList";
import Portfolio from "../../components/home/Portfolio";
import Gallery from "../../components/services/Gallery";
import Testimonials from "../../components/home/Testimonials";
import useServices from "../../hooks/useServices";
import WhyChooseUs from "../../components/services/WhyChooseUs";
import GalleryV2 from "../../components/services/GalleryV2";
const ServicesPage = () => {
  const { services, loading, error } = useServices();

  return (
    <>
      <PageHeader
        title="Services"
        subtitle="Explore our complete range of precision-driven dental treatments and aesthetic procedures designed for your comfort."
      />
      {/*<WhyChooseUs />*/}
      {/*<Gallery variant='light' />*/}
      <GalleryV2 />

      <ServicesList services={services} loading={loading} error={error} />
      <Testimonials variant="dark" />
    </>
  );
};

export default ServicesPage;
