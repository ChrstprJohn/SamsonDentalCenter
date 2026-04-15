import { useRef } from "react";
import Hero from "../../components/home/Hero";
import Promotions from "../../components/home/Promotions";
import HomeServices from "../../components/home/HomeServices";
import Portfolio from "../../components/home/Portfolio";
import AIChatbotPromo from "../../components/home/AIChatbotPromo";
import Gallery from "../../components/services/Gallery";
import Testimonials from "../../components/home/Testimonials";
import LocationHours from "../../components/home/LocationHours";
import ContactMap from "../../components/contact/ContactMap";
import ServicesList from "../../components/services/ServicesList";
import AboutShortcut from "../../components/home/AboutShortcut";
import GalleryV2 from "../../components/services/GalleryV2";
const HomePage = () => {
  const promotionsRef = useRef(null);

  return (
    <>
      <Hero />
      {/* <Promotions ref={promotionsRef} variant='light' /> */}
      {/*<HomeServices variant='dark' />*/}
      <AboutShortcut />
      <GalleryV2 showExploreButton={true} />
      {/*<ServicesList />*/}
      {/*<Gallery variant="light" />*/}
      {/*<Portfolio variant='light' />*/}
      {/*<Testimonials variant="light" />*/}
      <AIChatbotPromo variant="dark" />
      {/* <LocationHours variant='light' /> */}
      <ContactMap />
    </>
  );
};

export default HomePage;
