import NavBar from "@/Components/Navbar";
import styles from "./style.module.css";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Employee from "@/Components/DoctorList/Employee";


export default function DoctorList({auth, employees, type, dates }) {
    return (
        <>
            <NavBar user={auth.user} />
            <Head title="Welcome" />

            <div className={`   ${styles.container}`}>
                {employees.map((employee, index) => (
                    <Employee dates={dates} type={type} employee={employee} />
                ))}
            </div>
        </>
    );
}
