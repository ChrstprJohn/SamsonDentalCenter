import { useRef } from 'react';
import Hero from '../../components/home/Hero';
import Promotions from '../../components/home/Promotions';
import HomeServices from '../../components/home/HomeServices';
import Portfolio from '../../components/home/Portfolio';
import AIChatbotPromo from '../../components/home/AIChatbotPromo';
import Gallery from '../../components/home/Gallery';
import Testimonials from '../../components/home/Testimonials';
import LocationHours from '../../components/home/LocationHours';

const HomePage = () => {
    const promotionsRef = useRef(null);

    return (
        <>
            <Hero />
            {/* <Promotions ref={promotionsRef} variant='light' /> */}
            <HomeServices variant='dark' />
            <Gallery variant='dark' />
            <Portfolio variant='light' />
            <Testimonials variant='light' />
            <AIChatbotPromo variant='light' />
            <LocationHours variant='light' />
        </>
    );
};

export default HomePage;
