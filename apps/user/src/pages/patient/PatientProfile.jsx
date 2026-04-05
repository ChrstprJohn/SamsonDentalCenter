import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import UserMetaCard from '../../components/patient/profile/UserMetaCard';
import UserInfoCard from '../../components/patient/profile/UserInfoCard';
import UserAddressCard from '../../components/patient/profile/UserAddressCard';

export default function PatientProfile() {
    return (
        <>
            <PageBreadcrumb pageTitle='Profile' />
            <div className='rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 shadow-theme-sm'>
                <h3 className='mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7 font-outfit'>
                    Profile
                </h3>
                <div className='space-y-6'>
                    <UserMetaCard />
                    <UserInfoCard />
                    <UserAddressCard />
                </div>
            </div>
        </>
    );
}
