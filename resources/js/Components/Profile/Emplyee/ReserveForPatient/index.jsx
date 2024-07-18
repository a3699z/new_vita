import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import axios from "axios";
import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';

import rightArrowIcon from "@/Assets/NewAppointment/rightArrowIcon.svg";
import leftArrowIcon from "@/Assets/NewAppointment/leftArrowIcon.svg";

import QuickAppointmentRequest from "@/Components/NewAppointment/QuickAppointmentRequest";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';



const ReserveForPatient = ({auth}) => {
    const [patients, setPatients] = useState([]);
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(false);

    const [hours, setHours] = useState([]);
    const [activeTab, setActiveTab] = useState("online");


    const { data, setData, post, get, processing, errors, reset } = useForm({
        date: null,
        hour: null,
        patientUID: auth.user.uid,
        insurance_type: 'legal',
        insurance_policy_number: '',
        online: 1,
    });


    const selectDate = (date) => {
        console.log(date);
        axios.get('/reservation/get_hours?date='+date+'&employeeUID='+auth.user.uid, {
            date: date,
            // employeeUID: employeeUID,
            employeeUID: auth.user.uid,
        }).then((response) => {
            setData("date", date);
            console.log(data);
            setHours(response.data.hours);
            const dateBoxes = document.querySelectorAll(`.${styles.dateBox}`);
            dateBoxes.forEach((dateBox) => {
                dateBox.classList.remove(styles.selectedDateBox);
            });
            const selectedDate = document.querySelector(`.${styles.dateBox}[data-date="${date}"]`);
            selectedDate.classList.add(styles.selectedDateBox);
        });
    }

    const setSelectedHour = (event) => {
        const hour = event.target.getAttribute("data-hour");
        console.log(hour);
        setData("hour", hour);
        const timeBoxes = document.querySelectorAll(`.${styles.timeBox}`);
        timeBoxes.forEach((timeBox) => {
            timeBox.classList.remove(styles.timeBoxSelected);
        });
        event.target.classList.add(styles.timeBoxSelected);
    }


    useEffect(() => {
        setLoading(true);
        axios.get("/get_patients")
            .then((res) => {
                console.log(res.data);
                setPatients(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });

        axios.get("/available_dates/" + auth.user.uid)
            .then((res) => {
                selectDate(res.data[0].date);
                setDates(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            }
        );
    }, []);


    const scroll = (direction) => {
        const container = document.querySelector(`.${styles.dateBoxContainer}`);
        const scrollAmount = 200;
        const scrollDirection = direction === "left" ? -scrollAmount : scrollAmount;
        container.scrollBy({
            top: 0,
            left: scrollDirection,
            behavior: "smooth",
        });
        const scrollBtn = document.querySelector(`.${styles.scrollBtn}`);
        scrollBtn.classList.remove(styles.inactive);
        container.addEventListener("scroll", () => {
            if (container.scrollLeft === 0) {
                document.querySelector(`.${styles.scrollBtn}.left`).classList.add(styles.inactive);
            }
            if (container.scrollLeft === container.scrollWidth - container.clientWidth) {
                document.querySelector(`.${styles.scrollBtn}.right`).classList.add(styles.inactive);
            }
            if (container.scrollLeft !== container.scrollWidth - container.clientWidth) {
                document.querySelector(`.${styles.scrollBtn}.right`).classList.remove(styles.inactive);
            }
        });
    };


    const handleClose = () => {
        setShow(false);
    }

    const [successRes, setSuccessRes] = useState(false);
    const [show, setShow] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/reserveforpatient",
            {
                onSuccess: () => {
                    console.log("success");
                    setSuccessRes(true);
                    setShow(true);
                    reset();
                }
            }
        );
    }


    return (
        <div className={styles.container}>
            {/* onSuccess make a modal */}
            {successRes &&
                <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>
                Erfolg
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>Reservation wurde erfolgreich erstellt.</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>}


            <h1 className={styles.title}>Reservierungen</h1>
            <div className={styles.patients}>
                {/* {patients.map((patient) => (
                    <div className={styles.patient} key={patient.id}>
                        <div className={styles.patientInfo}>
                            <div className={styles.patientName}>{patient.name}</div>
                            <div className={styles.patientPhone}>{patient.phone}</div>
                        </div>
                        <div className={styles.patientActions}>
                            <button className={styles.patientAction}>Reservierung</button>
                        </div>
                    </div>
                ))} */}
                {/* use key and value in patients */}
                <form className={styles.form} onSubmit={handleSubmit}>

                <div className={styles.formGroup}>
                    <label htmlFor="insurance_type" className={styles.label}>
                    Versicherungstyp
                    </label>
                    <select name="patient" id="patient" className={styles.selectPatient} onChange={(e) => setData("patientUID", e.target.value)}>
                        {/* <option value="">Patient auswählen</option> */}

                        {Object.entries(patients).map(([key, value]) => (
                            <option key={key} value={key}>{value.name}</option>
                        ))}
                    </select>
                    <InputError error={errors.patientUID} />
                </div>

                {/*  */}



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


                <div className={styles.formGroup}>
                    <label htmlFor="insurance_policy_number" className={styles.label}>
                    Versicherungspolicenummer
                    </label>
                    <input type="text" id="insurance_policy_number" name="insurance_policy_number" onChange={(e) => setData('insurance_policy_number', e.target.value)} className={styles.input} />
                </div>
                <InputError error={errors.insurance_policy_number} />


          {/* dates */}
        <div className={styles.dateSelectContainer}>
            <h5 className={styles.dateTitle}>Datum wählen</h5>
            <div className={styles.dateSelect}>
                <button className={[styles.scrollBtn, styles.inactive].join(" ")} onClick={() => scroll("left")}>
                <img src={leftArrowIcon} alt="" />
                </button>
                <div className={styles.dateBoxContainer}>
                    {dates.map((date, index) => {
                        return (
                            <div className={styles.dateBox} key={index} onClick={() => selectDate(date.date)} data-date={date.date}>
                                <h6 className={   styles.dateBoxTitle   }>{date.day}</h6>
                                <p className={styles.dateBoxDayInfo}>{date.weekday}</p>
                            </div>
                        );
                    })}
                </div>
                <button className={styles.scrollBtn} onClick={() => scroll("right")}>
                <img src={rightArrowIcon} alt="" />
                </button>
            </div>
            <InputError message={errors.date} />
        </div>



        <div className={styles.divider}></div>

        {/* hours */}

        <div className={styles.timeSelectContainer}>
            <h5 className={styles.dateTitle}>Verfügbare Stunden</h5>
            <div className={`${styles.timeSelect} grid md:grid-cols-3 grid-cols-2 gap-2  `}>
                {/* <div className={[styles.timeBox, styles.timeBoxSelected].join(" ")}>
                9:00
                </div>
                <div className={[styles.timeBox].join(" ")}>9:00</div>
                <div className={[styles.timeBox, styles.timeBoxDisabled].join(" ")}>
                9:00
                </div>
                <div className={[styles.timeBox].join(" ")}>9:00</div>
                <div className={[styles.timeBox].join(" ")}>9:00</div>
                <div className={[styles.timeBox].join(" ")}>9:00</div> */}
                {hours.map((hour, index) => {
                    return (
                        <div className={[styles.timeBox].join(" ")} key={index} onClick={() => setSelectedHour(event)} data-hour={hour}>
                            {hour}
                        </div>
                    );
                })}
            </div>
            <InputError message={errors.hour} />
        </div>

        {/* select for online or offline */}
        <div className={styles.divider}></div>
        <div className={styles.formGroup}>
            <label htmlFor="appointmentType" className={styles.label}>
            Art der Reservierung
            </label>
            <select name="appointmentType" id="appointmentType" className={styles.selectInput} onChange={(e) => setData("online", e.target.value)}>
                <option value="1">Online</option>
                <option value="0">Offline</option>
            </select>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.formGroup}>
            <button type="submit" className={styles.submitButton}>
            Reservierung erstellen
            </button>
        </div>


        </form>



            </div>
        </div>
    );
}

export default ReserveForPatient;
