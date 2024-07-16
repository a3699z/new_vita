import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/Components/Navbar';
import styles from './style.module.css';

import FormGroup from '@/Components/FormGroup';


import profilePhoto from "@/Assets/Profile/visit/profile.png";

import videoIcon from "@/Assets/Profile/visit/videoIcon.svg";
import editIcon from "@/Assets/Profile/visit/editIcon.svg";
import calendarIcon from "@/Assets/Profile/visit/calendarIcon.svg";
import InputError from '@/Components/InputError';
// import {useState, useEffect} from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Quick({ auth, employee }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        insurance_type: 'legal',
        insurance_policy_number: '',
        employee_uid: employee.uid,
    });
    const [successMessage, setSuccessMessage] = useState('');

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        window.location.href = '/';
    }
    const submit = (e) => {
        e.preventDefault();
        post(route('reservation.quick_store'),
        {
            onSuccess: ( page ) => {
                console.log(page.props.flash.success);
                setSuccessMessage(page.props.flash.success);
                setShow(true);
            }
        });
    }
    return (

        <>
            <Navbar user={auth.user} />
            <div className="min-h-screen bg-gray-100">
                <Head title="Dashboard" />
                <div className={styles.visitContainer}>

                    <div className={styles.container}>
                        <div className={styles.appointmentInfo}>
                            <div className={styles.doctorInfo}>
                            <img src={employee.profile_image ? '/images/'+employee.profile_image : profilePhoto} alt="" className={styles.profilePhoto} />
                            <div className={styles.info}>
                                <h5 className={styles.doctorName}>{employee.name}</h5>
                                { employee.profession ? <h6 className={styles.profession}>{employee.profession}</h6> : '' }
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                    <div className={styles.container}>
                        <div className={styles.titleContainer}>
                            <h4 className={styles.title}>Versicherungsinformationen</h4>
                            <p className={styles.info}>
                                Put Insurance Policy Number
                            </p>
                        </div>
                        <div className={styles.formContainer}>
                            <form>
                                {/* select input for input type */}

                                <div className={styles.formGroup}>
                                    <label htmlFor="insurance_type" className={styles.label}>
                                        Insurance Type
                                    </label>
                                    <select name="insurance_type" id="insurance_type" onChange={(e) => setData('insurance_type', e.target.value)} className={styles.selectInput}>
                                        <option value="legal">Legal Insurance</option>
                                        <option value="private">Private Insurance</option>
                                    </select>
                                    <InputError error={errors.insurance_type} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="insurance_policy_number" className={styles.label}>
                                        Insurance Policy Number
                                    </label>
                                    <input type="text" id="insurance_policy_number" name="insurance_policy_number" onChange={(e) => setData('insurance_policy_number', e.target.value)} className={styles.input} />
                                </div>
                                <InputError error={errors.insurance_policy_number} />
                            </form>
                            <div className={styles.btnGroup}>
                                <button className={styles.saveBtn} onClick={(e) => submit(e) }>Speichern</button>
                            </div>
                        </div>
                        </div>
            </div>
            {successMessage &&
            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>
                Success
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>{successMessage}</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Ok
            </Button>
            </Modal.Footer>
        </Modal>}
        </>
        );
}
