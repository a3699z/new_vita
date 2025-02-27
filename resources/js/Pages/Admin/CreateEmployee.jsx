// use adminlayout
import AdminLayout from '../../Layouts/AdminLayout';
import { useEffect, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function CreateEmployee({ auth, teams }) {
    console.log(teams);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        team_key: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        console.log('hello');
        console.log(data);
        e.preventDefault();

        post(route('admin.employee.store'));
    }
    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Employe</h2>}
        >
            <Head title="Create Employee" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">Create Employee</div>
                    </div>
                    {/* create a form for employee */}
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={submit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                Name
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="name"
                                type="text"
                                placeholder="Name"
                                onChange={(e) => {setData('name', e.target.value)}}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                id="email"
                                type="email"
                                placeholder="Email"
                                onChange={(e) => {setData('email', e.target.value)}}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                placeholder="Password"
                                onChange={(e) => {setData('password', e.target.value)}}
                            />
                        </div>
                        {/* select for teams */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="team">
                                Team
                            </label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="team"
                                onChange={(e) => {setData('team_key', e.target.value)}}
                            >
                                <option value="">Select Team</option>
                                {teams.map((team) => (
                                    <option key={team.key} value={team.key}>
                                        {team.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
