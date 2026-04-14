import PageBreadcrumb from '../../components/common/PageBreadcrumb';
import UserMetaCard from '../../components/patient/profile/UserMetaCard';
import UserInfoCard from '../../components/patient/profile/UserInfoCard';
import UserAddressCard from '../../components/patient/profile/UserAddressCard';

export default function PatientProfile() {
    return (
        <>
            <PageBreadcrumb pageTitle='Profile' />
            <div className='flex flex-col grow'>
                <div className="sm:hidden px-4 mt-2">
                    <h1 className="text-sm font-black text-gray-700 dark:text-white uppercase tracking-tight mb-4">
                        Profile
                    </h1>
                </div>
                
                <div className='sm:mx-0 mx-4 mb-10 space-y-6'>
                    <UserMetaCard />
                    <UserInfoCard />
                </div>
            </div>
        </>
    );
}
