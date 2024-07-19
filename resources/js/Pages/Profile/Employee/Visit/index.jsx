import React from "react";
import { Link } from '@inertiajs/react';

import styles from "./style.module.css";

import profilePhoto from "@/Assets/Profile/visit/profile.png";
import calendarIcon from "@/Assets/Profile/visit/calendarIcon.svg";
import rightArrowIcon from "@/Assets/Profile/visit/rightArrowIcon.svg";

import NavBar from '@/Components/NavBar';


const VisitDetails = ({auth, reservation, success}) => {
    console.log(reservation);
  return (
    <>
        <NavBar user={auth.user} />
        <div className="min-h-screen bg-gray-100">
            <div className={styles.container}>
                <h4 className={styles.title}>Termindetails</h4>

                <div className={styles.visitContainer}>
                    <div className={styles.row}>
                    <div className={styles.doctorInfo}>
                        <img src={reservation.patient.profile_image ? '/images/'+reservation.patient.profile_image : profilePhoto} alt="" className={styles.profilePhoto} />
                        <div className={styles.info}>
                            <h5 className={styles.doctorName}>Patient,{reservation.patient.name}</h5>
                        </div>
                    </div>
                    </div>

                    <div className={styles.row}>
                    <div className={styles.groupContainer}>
                        <div className={styles.iconContainer}>
                        <img src={calendarIcon} alt="" />
                        </div>
                        <div className={styles.group}>
                            <h5 className={styles.groupTitle}>

                            {/* April 29-2024 12:00, Montag */}
                                {/* {reservation.date} {reservation.hour}, {new Date(reservation.date).toLocaleDateString('de-DE', { weekday: 'long' })} */}
                                {/* monthof date anad date 29-2024 format */}
                                {new Date(reservation.date).toLocaleDateString('de-DE', { month: 'long', day: '2-digit' })}-{new Date(reservation.date).getFullYear()} {reservation.hour}, {new Date(reservation.date).toLocaleDateString('de-DE', { weekday: 'long' })}

                            </h5>
                        </div>
                    </div>
                    </div>

                    <div className={styles.row}>
                    <div className={styles.groupContainer}>
                        <div className={styles.iconContainer}>
                        <img src={calendarIcon} alt="" />
                        </div>
                            {reservation.is_online && (
                                                        <div className={styles.group}>

                                                        <h5 className={styles.groupTitle}>

                                                        Videosprechstunde Termin
                            </h5>
                        <p className={styles.groupDesc}>15 min</p>
                            </div>
                            )}
                            {!reservation.is_online && (
                                                        <div className={styles.group}>

                                <h5 className={styles.groupTitle}>
                                Präsenztermin
                                </h5>
                                <p className={styles.groupDesc}>60 min</p>
                            </div>
                            )}
                    </div>
                    </div>

                    {/* inssurance data */}

                    <div className={styles.row}>
                        <div className={styles.groupContainer}>
                            <div className={styles.iconContainer}>
                                <img src={calendarIcon} alt="" />
                            </div>
                            <div className={styles.group}>
                                <h5 className={styles.groupTitle}>Insurance Type</h5>
                                <p className={styles.groupDesc}>{reservation.insurance_type}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.groupContainer}>

                            <div className={styles.iconContainer}>
                                <img src={calendarIcon} alt="" />
                            </div>
                            <div className={styles.group}>

                                <h5 className={styles.groupTitle}>Insurance Policy Number</h5>
                                <p className={styles.groupDesc}>{reservation.insurance_policy_number}</p>
                            </div>
                        </div>
                    </div>




                    {/* patient data */}
                    <div className={styles.row}>
                        <div className={styles.groupContainer}>
                            <div className={styles.iconContainer}>
                            <img src={calendarIcon} alt="" />
                            </div>
                            <div className={styles.group}>
                            <h5 className={styles.groupTitle}>Patientendaten</h5>
                            <p className={styles.groupDesc}>{reservation.patient.username} {reservation.patient.name}</p>
                            <p className={styles.groupDesc}>{reservation.patient.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.groupContainer}>
                            <div className={styles.iconContainer}>
                            <img src={calendarIcon} alt="" />
                            </div>
                            <div className={styles.group}>
                            <h5 className={styles.groupTitle}>
                                Wie bereitet man sich auf ein Online-Interview vor?
                            </h5>
                            </div>
                            <Link className={styles.link}>
                            <img src={rightArrowIcon} className={styles.linkIcon} alt="" />
                            </Link>
                        </div>
                    </div>

                    {/* actions */}
                    {/* if status is accepted start the video if not decline or accept */}

                    {reservation.status === 'accepted' && reservation.call ?
                    <div className={styles.row}>
                        <div className={styles.groupContainer}>
                            <div className={styles.iconContainer}>
                            <img src={calendarIcon} alt="" />
                            </div>
                            <div className={styles.group}>
                                <h5 className={styles.groupTitle}>Starten Sie die Videosprechstunde</h5>
                            </div>
                        </div>
                        <div className={styles.btnGroup}>
                                <Link href={route('call', reservation.call.key)} className={styles.btn}>Starten</Link>
                        </div>
                    </div>
                    :
                    <div className={styles.row}>
                        <div className={styles.groupContainer}>
                            <div className={styles.iconContainer}>
                            <img src={calendarIcon} alt="" />
                            </div>
                            <div className={styles.group}>
                            <h5 className={styles.groupTitle}>Aktionen</h5>
                            </div>
                        </div>
                        <div className={styles.btnGroup}>
                            <Link href={route('reservation.accept', reservation.key)} className={styles.btn}>Akzeptieren</Link>
                            <Link href={route('reservation.decline', reservation.key)} className={styles.btn}>Ablehnen</Link>
                        </div>
                    </div>
                    }

                </div>
            </div>
        </div>
    </>
  );
};

export default VisitDetails;
