import PageHeader from '../../components/common/PageHeader';
import ContactInfo from '../../components/contact/ContactInfo';
import ContactMap from '../../components/contact/ContactMap';

const ContactPage = () => {
    return (
        <>
            <PageHeader
                title='Contact'
                subtitle='Visit us in Tandang Sora or reach out to schedule your professional dental consultation.'
            />
            <main className='bg-white'>
                <ContactInfo />
                <ContactMap />
            </main>
        </>
    );
};

export default ContactPage;
