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

export default function Create({ auth, employee, date, hour, is_online, success, reservation_key }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        insurance_type: 'legal',
        insurance_policy_number: '',
        employee_uid: employee.uid,
        date: date,
        hour: hour,
        is_online: is_online
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [reservationKey, setReservationKey] = useState('');

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        window.location.href = '/visit/'+reservationKey;
    }
    
    // const handleShow = () => setShow(true);

    const submit = (e) => {
        e.preventDefault();
        post(route('reservation.store'));
        // axios.post('/reservation/store', data).then((response) => {
        //     console.log(response);
        //     setSuccessMessage(response.data.success);
        //     setShow(true);
        // }).catch((error) => {
        //     console.log(error);
        // });
    }

    useEffect(() => {
        if(success) {
            setSuccessMessage('Reservierung wurde erfolgreich erstellt.');
            setReservationKey(reservation_key);
            setShow(true);
        }
    });
    return (

        <>
            <Navbar user={auth.user} />
            <div className="min-h-screen bg-gray-100">
                <Head title="Dashboard" />
                <div className={styles.visitContainer}>

                    <div className={styles.container}>
                    <div className={`${styles.appointmentInfo} flex md:flex-row flex-col justify-between gap-2 `}>
                    <div className={`${styles.doctorInfo} flex md:flex-row flex-col gap-3 justify-center items-start  md:items-center   `}>
                            <img src={employee.profile_image ? '/images/'+employee.profile_image : profilePhoto} alt="" className={styles.profilePhoto} />
                            <div className={styles.info}>
                                {is_online ?
                                <h4 className={styles.appointmentType}>
                                    <img src={videoIcon} alt="" />
                                    Videosprechstunde Termin
                                </h4>
                                : ''}
                                <h5 className={styles.doctorName}>{employee.name}</h5>
                                { employee.profession ? <h6 className={styles.profession}>{employee.profession}</h6> : '' }
                            </div>
                            </div>
                            <div className={`${styles.dateInfo} flex flex-col gap-1 md:justify-center justify-start   `}>
                            <div className={styles.date}>{date}</div>
                            <div className={styles.time}>{hour}</div>
                            </div>
                        </div>
                    </div>
                </div>
                    {/* <div>
                        <label htmlFor="insurance_type">Insurance Type</label>
                        <select name="insurance_type" id="insurance_type" onChange={(e) => setData('insurance_type', e.target.value)}>
                            <option value="legal">Legal Insurance</option>
                            <option value="private">Private Insurance</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="insurance_policy_number">Insurance Policy Number</label>

                        <FormGroup
                            id={"insurance_policy_number"}
                            name={"insurance_policy_number"}
                            label={"Insurance Policy Number"}
                            placeholder={"123456789"}
                            onChange={(e) => setData('insurance_policy_number', e.target.value)}
                            type="text"
                        />
                    </div> */}

                    {/* <div className={styles.btnGroup}>
                        <button className={styles.saveBtn}>Speichern</button>
                    </div> */}
                    <div className={styles.container}>
                        <div className={styles.titleContainer}>
                            <h4 className={styles.title}>Versicherungsinformationen</h4>
                            <p className={styles.info}>
                            Versicherungsnummer eingeben
                            </p>
                        </div>
                        <div className={styles.formContainer}>
                            <form>
                                {/* select input for input type */}

                                <div className={styles.formGroup}>
                                    <label htmlFor="insurance_type" className={styles.label}>
                                    Versicherungstyp
                                    </label>
                                    <select name="insurance_type" id="insurance_type" onChange={(e) => setData('insurance_type', e.target.value)} className={styles.selectInput}>
                                        <option value="legal">Gesetzliche Versicherung</option>
                                        <option value="private">Private Versicherung</option>
                                    </select>
                                    <InputError error={errors.insurance_type} />
                                </div>
                                {/*<FormGroup
                                    id={"insurance_policy_number"}
                                    name={"insurance_policy_number"}
                                    label={"Insurance Policy Number"}
                                    placeholder={"123456789"}
                                    onChange={(e) => setData('insurance_policy_number', e.target.value)}
                                    type="text"
                                /> */}
                                <div className={styles.formGroup}>
                                    <label htmlFor="insurance_policy_number" className={styles.label}>
                                    Versicherungspolicenummer
                                    </label>
                                    <input type="text" id="insurance_policy_number" name="insurance_policy_number" onChange={(e) => setData('insurance_policy_number', e.target.value)} className={styles.input} />
                                </div>
                                <InputError error={errors.insurance_policy_number} />
                            </form>
                            <div className={styles.btnGroup}>
                                {/* <button className={styles.cancelBtn}>ABBRECHEN</button> */}
                                <button className={styles.saveBtn} onClick={(e) => submit(e) }>Speichern</button>
                            </div>
                        </div>
                        </div>
            </div>
            {successMessage &&
            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>
            Erfolg
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
