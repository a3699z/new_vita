import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/Components/Navbar";
import styles from "./style.module.css";

import FormGroup from "@/Components/FormGroup";

import profilePhoto from "@/Assets/Profile/visit/profile.png";

import videoIcon from "@/Assets/Profile/visit/videoIcon.svg";
import editIcon from "@/Assets/Profile/visit/editIcon.svg";
import calendarIcon from "@/Assets/Profile/visit/calendarIcon.svg";
import InputError from "@/Components/InputError";
// import {useState, useEffect} from 'react';

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

import { FaRegCalendarAlt } from "react-icons/fa";

export default function CreateNew({success}) {

    const { data, setData, post, processing, errors, reset } = useForm({
        insurance_type: "legal",
        insurance_policy_number: "",
        employee_uid: "",
        date: "",
        hour: "",
        is_online: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [reservationKey, setReservationKey] = useState("");

    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        window.location.href = "/visit/" + reservationKey;
    };


    const submit = (e) => {

        e.preventDefault();

        post(route("reservation.store"));
    };

    useEffect(() => {
        if(success) {
            setSuccessMessage('Reservierung wurde erfolgreich erstellt.');
            setReservationKey(reservation_key);
            setShow(true);
        }
    });

    return (
        <>
            <Navbar />
            <div className="bg-gray-100 h-full md:h-screen ">
                <div className=" flex md:flex-row flex-col  max-w-[1280px] p-6 mx-auto gap-6">
                    <Head title="Dashboard" />

                    <div className="bg-[#ffffff] w-full md:w-[600px] h-full md:h-[200px]">
                        <div
                            className={`${styles.appointmentInfo} flex flex-col gap-2 p-3  `}
                        >
                            <div
                                className={`${styles.doctorInfo} flex flex-col md:flex-row items-center gap-3 `}
                            >
                                <img
                                    src={profilePhoto}
                                    alt=""
                                    className={styles.profilePhoto}
                                />
                                <div className="flex flex-col gap-2 ">
                                    <h4 className={styles.appointmentType}>
                                        <img src={videoIcon} alt="" />
                                        Videosprechstunde Termin
                                    </h4>

                                    <h5 className={styles.doctorName}>
                                        İlknur Ertürk
                                    </h5>
                                    {/* { employee.profession ? <h6 className={styles.profession}>{employee.profession}</h6> : '' } */}
                                    {
                                        <h6 className={styles.profession}>
                                           
                                        </h6>
                                    }
                                </div>
                            </div>
                            <div
                                className={`${styles.dateInfo} flex md:flex-row sm:flex-col gap-2 items-center mt-3 justify-center md:justify-start  `}
                            >
                                <FaRegCalendarAlt className="text-[#c7982e] w-5 h-5" />
                                <div>
                                    <div className="font-medium flex  items-center text-lg">
                                        2024-07-09 - 10:05
                                    </div>
                                    {/* <div>timee</div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.container}>
                        <div className={styles.titleContainer}>
                            <h4 className={`${styles.title} text-base md:text-lg`}>
                                Versicherungsinformationen
                            </h4>
                            <p className={styles.info}>
                            Versicherungsnummer eingeben
                            </p>
                        </div>
                        <div className={styles.formContainer}>
                            <form>
                                {/* select input for input type */}

                                <div className={styles.formGroup}>
                                    <label
                                        htmlFor="insurance_type"
                                        className={styles.label}
                                    >
                                        Versicherungstyp
                                    </label>
                                    <select
                                        name="insurance_type"
                                        id="insurance_type"
                                        onChange={(e) =>
                                            setData(
                                                "insurance_type",
                                                e.target.value
                                            )
                                        }
                                        className={styles.selectInput}
                                    >
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
                                    <label
                                        htmlFor="insurance_policy_number"
                                        className={styles.label}
                                    >
                                        Versicherungspolicenummer
                                    </label>
                                    <input
                                        type="text"
                                        id="insurance_policy_number"
                                        name="insurance_policy_number"
                                        onChange={(e) =>
                                            setData(
                                                "insurance_policy_number",
                                                e.target.value
                                            )
                                        }
                                        className={styles.input}
                                    />
                                </div>
                                <InputError
                                    error={errors.insurance_policy_number}
                                />
                            </form>
                            <div className={styles.btnGroup}>
                                {/* <button className={styles.cancelBtn}>ABBRECHEN</button> */}
                                <button
                                    className={styles.saveBtn}
                                    onClick={(e) => submit(e)}
                                >
                                    Speichern
                                </button>
                            </div>
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
