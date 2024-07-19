import NavBar from "@/Components/Navbar";
import styles from "./style.module.css";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Employee from "@/Components/DoctorList/Employee";
import { useState } from "react";


export default function DoctorList({auth, employees, type, dates }) {

    const [showMore, setShowMore] = useState({});

    return (
        <>
            <NavBar user={auth.user} />
            <Head title="Welcome" />

            <div className={`   ${styles.container}`}>
                {employees.map((employee, index) => (
                    <Employee dates={dates} type={type} employee={employee} showMore={showMore} setShowMore={setShowMore} />
                ))}
            </div>
        </>
    );
}
