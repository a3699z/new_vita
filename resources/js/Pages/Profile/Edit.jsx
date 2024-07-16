import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateAvailableDatesForm from './Partials/UpdateAvailableDatesForm';
import ContactsInsuranceForm from './Partials/ContactsInsuranceForm';
import ProfessionalDateForm from './Partials/ProfessionalDateForm';
import OtherPatientInfo from './Partials/OtherPatientInfo';
// import PositionCommitmentForm from './Partials/PositionCommitmentForm';
import { Head } from '@inertiajs/react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    console.log(auth.user);
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>}
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>


                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <ContactsInsuranceForm className="max-w-xl" />
                        </div>

                    {/* update available dates if user_type is employee */}
                    {auth.user.user_type === 'employee' && (
                    <div>
                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <UpdateAvailableDatesForm className="max-w-xl" />
                        </div>


                         <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <ProfessionalDateForm className="max-w-xl" />
                    </div>

                    {/*<div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                    <WorkingHoursForm className="max-w-xl" />
                </div>

                <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                <PositionCommitmentForm className="max-w-xl" />
            </div> */}
            </div>
                    )}

                    {auth.user.user_type === 'patient' && (
                    <div>
                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <OtherPatientInfo className="max-w-xl" />
                        </div>
                    </div>
                    )}

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>



                </div>
            </div>
        </AuthenticatedLayout>
    );
}
