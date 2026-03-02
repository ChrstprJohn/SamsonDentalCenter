import PageHeader from '../../components/common/PageHeader';
import ClinicStory from '../../components/about/ClinicStory';
import Mission from '../../components/about/Mission';
import TeamGrid from '../../components/about/TeamGrid';

const AboutPage = () => {
    return (
        <>
            <PageHeader
                title='About Us'
                subtitle="Discover the story, mission, and people behind Samson Dental Center's commitment to excellence."
            />
            <ClinicStory />
            <Mission />
            <TeamGrid />
        </>
    );
};

export default AboutPage;
