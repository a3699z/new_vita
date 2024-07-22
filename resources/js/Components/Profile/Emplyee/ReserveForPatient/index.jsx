import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import InputError from '@/Components/InputError';
import { Head, useForm } from '@inertiajs/react';

import rightArrowIcon from "@/Assets/NewAppointment/rightArrowIcon.svg";
import leftArrowIcon from "@/Assets/NewAppointment/leftArrowIcon.svg";

import QuickAppointmentRequest from "@/Components/NewAppointment/QuickAppointmentRequest";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "@/Assets/Logo.png";

import {
    FiChevronRight,
    FiChevronLeft,
    FiChevronDown,
    FiChevronUp,
} from "react-icons/fi";

import { IoIosStarOutline, IoIosVideocam } from "react-icons/io";
import { HiMapPin } from "react-icons/hi2";

import axios from "axios";
import { useRef } from "react";




const ReserveForPatient = ({auth}) => {
    const [patients, setPatients] = useState([]);
    const [dates, setDates] = useState([]);
    const [loading, setLoading] = useState(false);

    // const [hours, setHours] = useState([]);
    const [activeTab, setActiveTab] = useState("online");
    const [showMore, setShowMore] = useState(false);
    const hours = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
    ];

    const hours2 = [
        "08:00",
        "08:15",
        "08:30",
        "08:45",
        "09:00",
        "09:15",
        "09:30",
        "09:45",
        "10:00",
        "10:15",
        "10:30",
        "10:45",
        "11:00",
        "11:15",
        "11:30",
        "11:45",
        "12:00",
        "12:15",
        "12:30",
        "12:45",
        "13:00",
        "13:15",
        "13:30",
        "13:45",
        "14:00",
        "14:15",
        "14:30",
        "14:45",
        "15:00",
    ];





    const { data, setData, post, get, processing, errors, reset } = useForm({
        date: null,
        hour: null,
        patientUID: auth.user.uid,
        insurance_type: 'legal',
        insurance_policy_number: '',
        online: 1,
        time: null,
    });


    // const selectDate = (date) => {
    //     console.log(date);
    //     axios.get('/reservation/get_hours?date='+date+'&employeeUID='+auth.user.uid, {
    //         date: date,
    //         // employeeUID: employeeUID,
    //         employeeUID: auth.user.uid,
    //     }).then((response) => {
    //         setData("date", date);
    //         console.log(data);
    //         setHours(response.data.hours);
    //         const dateBoxes = document.querySelectorAll(`.${styles.dateBox}`);
    //         dateBoxes.forEach((dateBox) => {
    //             dateBox.classList.remove(styles.selectedDateBox);
    //         });
    //         const selectedDate = document.querySelector(`.${styles.dateBox}[data-date="${date}"]`);
    //         selectedDate.classList.add(styles.selectedDateBox);
    //     });
    // }

    const selectHour = (event) => {
        const hour = event.target.getAttribute("data-hour");
        const date = event.target.getAttribute("data-date");
        const time = date + " " + hour;
        setData("time", time);
        // const timeBoxes = document.querySelectorAll(`.${styles.timeBox}`);
        // timeBoxes.forEach((timeBox) => {
        //     timeBox.classList.remove(styles.timeBoxSelected);
        // });
        // event.target.classList.add(styles.timeBoxSelected);


        const timeBoxes = document.querySelectorAll(`.timeBox`);
        timeBoxes.forEach((timeBox) => {
            timeBox.classList.remove("bg-[#c99b31]");
            timeBox.classList.remove("text-white");
        });
        event.target.classList.add("bg-[#c99b31]");
        event.target.classList.add("text-white");
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
                // selectDate(res.data[0].date);
                setDates(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            }
        );
    }, []);




    const [blockedHours, setBlockedHours] = useState(null);

    const getBlockedHours = () => {
        axios.get('/employee/get_blocked_hours/'+auth.user.uid).then((response) => {
            setBlockedHours(response.data);
        });
    }

    useEffect(() => {
        // getDays();
        // handleActivaTab("online");
        getBlockedHours();
    }, []);


    const handleActivaTab = (tab) => {
        setActiveTab(tab);
        console.log(activeTab);
        setData("online", tab === "online" ? 1 : 0);
    }



    const handleClose = () => {
        setShow(false);
    }

    const [successRes, setSuccessRes] = useState(false);
    const [show, setShow] = useState(false);

    const handleSubmit = (e) => {
        console.log(data);
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

    const scrollRefs = useRef({});


    const scroll = (direction, uid) => {
        const container = scrollRefs.current[uid];
        const scrollAmount = 200;
        const scrollDirection =
            direction === "left" ? -scrollAmount : scrollAmount;
        container.scrollBy({
            top: 0,
            left: scrollDirection,
            behavior: "smooth",
        });
        const leftScrollBtn = container.previousElementSibling;
        const rightScrollBtn = container.nextElementSibling;
        container.addEventListener("scroll", () => {
            if (container.scrollLeft === 0) {
                leftScrollBtn.classList.add(styles.inactive);
            } else {
                leftScrollBtn.classList.remove(styles.inactive);
            }
            if (
                container.scrollLeft >=
                container.scrollWidth - container.clientWidth
            ) {
                rightScrollBtn.classList.add(styles.inactive);
            } else {
                rightScrollBtn.classList.remove(styles.inactive);
            }
        });
    };




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
                <div className={styles.form}>

                <div className={styles.formGroup}>
                    <label htmlFor="insurance_type" className={styles.label}>
                    Versicherungstyp
                    </label>
                    <select name="patient" id="patient" className={styles.selectPatient} onChange={(e) => setData("patientUID", e.target.value)}>
                        {/* <option value="">Patient auswählen</option> */}

                        {Object.entries(patients).map(([key, value]) => (
                            <option key={key} value={key}>{value.username} {value.name}</option>
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



        {/* select for online or offline */}
        <div className={styles.divider}></div>
        {/* <div className={styles.formGroup}>
            <label htmlFor="appointmentType" className={styles.label}>
            Art der Reservierung
            </label>
            <select name="appointmentType" id="appointmentType" className={styles.selectInput} onChange={(e) => handleActivaTab(e.target.value)}>
                <option value="online" {...activeTab === "online" ? "selected" : ""}>Online</option>
                <option value="onsite" {...activeTab === "onsite" ? "selected" : ""}>Vor Ort</option>
            </select>
            <InputError error={errors.online} />
        </div> */}

        <ul className="flex border-b-[1px] gap-6">
                                    <li
                                        onClick={() => handleActivaTab('onsite')}
                                        // onClick={() => setActiveTab('onsite')}
                                        className={`tab-item relative pb-3 cursor-pointer
                                        ${
                                            activeTab ===
                                            "onsite"
                                                ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#627282]"
                                                : "text-[#627282]"
                                        }`}
                                    >
                                        <div href="#tab1" className=" ">
                                            Vor-Ort-Termin{" "}
                                        </div>
                                    </li>

                                    <li
                                        onClick={() => handleActivaTab('online')}
                                        // onClick={() => setActiveTab('online')}
                                        className={`tab-item relative pb-3 cursor-pointer
                                        ${
                                            activeTab ===
                                            "online"
                                                ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#627282]"
                                                : "text-[#627282]"
                                        }`}
                                    >
                                        <div
                                            href="#tab2"
                                            className="flex gap-1 items-center   "
                                        >
                                            <IoIosVideocam />
                                            Videosprechstunde{" "}
                                        </div>
                                    </li>
                                </ul>


        <div className="flex-1  w-full bg-white shadow-md ">
                                {activeTab === "onsite" ? (
                                    <>
                                        <div>
                                            {/* dates */}
                                            <div
                                                className={`${styles.dateSelectContainer} `}
                                            >
                                                <div
                                                    className={`${styles.dateSelect}  `}
                                                >
                                                    <button
                                                        className={`${styles.scrollBtn} left ${styles.inactive}`}
                                                        onClick={() =>
                                                            scroll(
                                                                "left",
                                                                auth.user.uid
                                                            )
                                                        }
                                                    >
                                                        <FiChevronLeft className="text-white" />
                                                    </button>
                                                    <div
                                                        className={`${styles.dateBoxContainer} border-b-[1px] pb-3 `}
                                                        ref={(el) =>
                                                            (scrollRefs.current[
                                                                auth.user.uid
                                                            ] = el)
                                                        }
                                                    >
                                                        {
                                                            blockedHours  && (
                                                        showMore
                                                            ? dates.map(
                                                                  (
                                                                      date
                                                                  ) => {
                                                                    console.log(blockedHours[date.date]);
                                                                      return (
                                                                          <div
                                                                              className="flex flex-col gap-8"
                                                                          >
                                                                              <div
                                                                                  className={
                                                                                      styles.dateBox
                                                                                  }
                                                                              >
                                                                                  <h6
                                                                                      className={
                                                                                          styles.dateBoxTitle
                                                                                      }
                                                                                  >
                                                                                      {
                                                                                          date.day
                                                                                      }
                                                                                  </h6>

                                                                                  <p
                                                                                      className={
                                                                                          styles.dateBoxDayInfo
                                                                                      }
                                                                                  >
                                                                                      {date.weekday}
                                                                                  </p>
                                                                              </div>

                                                                              <div className="flex flex-col items-center justify-center gap-2 min-w-[100px]">
                                                                                  {hours.map(
                                                                                      (
                                                                                          hour
                                                                                      ) => (

                                                                                                <button
                                                                                                className={blockedHours[date.date] && blockedHours[date.date].includes(hour) ? "border-2 border-transparent text-[#c7982e] bg-[#c99b314d] text-base font-semibold px-3 py-1 rounded-md disabled bg-gray-300 cursor-not-allowed timeBox" :
                                                                                                "border-2 border-transparent text-[#c7982e] bg-[#c99b314d] hover:border-[#c7982e] text-base font-semibold px-3 py-1 rounded-md timeBox"
                                                                                                }
                                                                                                data-date={date.date}
                                                                                                data-hour={hour}
                                                                                                onClick={(e) => {selectHour(e)}}
                                                                                                disabled={blockedHours[date.date] && blockedHours[date.date].includes(hour)}
                                                                                            >
                                                                                                {
                                                                                                    hour
                                                                                                }
                                                                                            </button>

                                                                                      )
                                                                                  )}
                                                                              </div>
                                                                          </div>
                                                                      );
                                                                  }
                                                              )
                                                            : dates.map(
                                                                  (
                                                                      date
                                                                  ) => {
                                                                      return (
                                                                          <div
                                                                              className="flex flex-col gap-8"
                                                                          >
                                                                              <div
                                                                                  className={
                                                                                      styles.dateBox
                                                                                  }
                                                                              >
                                                                                  <h6
                                                                                      className={
                                                                                          styles.dateBoxTitle
                                                                                      }
                                                                                  >
                                                                                      {
                                                                                          date.day
                                                                                      }
                                                                                  </h6>

                                                                                  <p
                                                                                      className={
                                                                                          styles.dateBoxDayInfo
                                                                                      }
                                                                                  >
                                                                                      {date.weekday}
                                                                                  </p>
                                                                              </div>

                                                                              <div className="flex flex-col items-center justify-center gap-2 min-w-[100px]">
                                                                                  {hours
                                                                                      .slice(
                                                                                          0,
                                                                                          5
                                                                                      )
                                                                                      .map(
                                                                                          (
                                                                                              hour
                                                                                          ) => (

                                                                                                    <button

                                                                                                    className={blockedHours[date.date] && blockedHours[date.date].includes(hour) ? "border-2 border-transparent text-[#c7982e] bg-[#c99b314d] text-base font-semibold px-3 py-1 rounded-md disabled bg-gray-300 cursor-not-allowed timeBox" :
                                                                                                    "border-2 border-transparent text-[#c7982e] bg-[#c99b314d] hover:border-[#c7982e] text-base font-semibold px-3 py-1 rounded-md timeBox"
                                                                                                    }                                                                                                    data-date={date.date}
                                                                                                data-hour={hour}
                                                                                                onClick={(e) => {selectHour(e)}}
                                                                                                disabled={blockedHours[date.date] && blockedHours[date.date].includes(hour)}
                                                                                                >
                                                                                                    {
                                                                                                        hour
                                                                                                    }
                                                                                                </button>
                                                                                          )
                                                                                      )}
                                                                              </div>
                                                                          </div>
                                                                      );
                                                                  }
                                                              ) )
                                                        }
                                                    </div>
                                                    <button
                                                        className={`${styles.scrollBtn} right`}
                                                        onClick={() =>
                                                            scroll(
                                                                "right",
                                                                auth.user.uid
                                                            )
                                                        }
                                                    >
                                                        <FiChevronRight className="text-white" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => setShowMore(!showMore)}
                                                    className=" text-[#c7982e] mb-6 flex gap-2 items-center justify-center "
                                                >
                                                    {showMore ? (
                                                        <>
                                                            {" "}
                                                            <span>
                                                                Weniger anzeigen{" "}
                                                            </span>{" "}
                                                            <FiChevronUp className="h-5 w-5" />{" "}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {" "}
                                                            <span>
                                                                Mehr
                                                                Sprechzeiten
                                                                anzeigen
                                                            </span>{" "}
                                                            <FiChevronDown className="h-5 w-5" />{" "}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="px-12 pb-6">
                                            <button
                                                className={
                                                    styles.submitBtnQuick
                                                }
                                                onClick={handleSubmit}
                                            >
                                                Termin vereinbaren
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        {/* dates */}


                                        <div
                                            className={`${styles.dateSelectContainer} `}
                                        >
                                            <div
                                                className={`${styles.dateSelect}  `}
                                            >
                                                <button
                                                    className={`${styles.scrollBtn} left ${styles.inactive}`}
                                                    onClick={() =>
                                                        scroll(
                                                            "left",
                                                            auth.user.uid
                                                        )
                                                    }
                                                >
                                                    <FiChevronLeft className="text-white" />
                                                </button>
                                                <div
                                                    className={`${styles.dateBoxContainer} border-b-[1px] pb-3 `}
                                                    ref={(el) =>
                                                        (scrollRefs.current[
                                                            auth.user.uid
                                                        ] = el)
                                                    }
                                                >
                                                    {
                                                    blockedHours &&  (
                                                    showMore
                                                        ? dates.map(
                                                              (date) => {
                                                                  return (
                                                                      <div
                                                                          className="flex flex-col gap-8"
                                                                      >
                                                                          <div
                                                                              className={
                                                                                  styles.dateBox
                                                                              }
                                                                          >
                                                                              <h6
                                                                                  className={
                                                                                      styles.dateBoxTitle
                                                                                  }
                                                                              >
                                                                                  {
                                                                                      date.day
                                                                                  }
                                                                              </h6>

                                                                              <p
                                                                                  className={
                                                                                      styles.dateBoxDayInfo
                                                                                  }
                                                                              >
                                                                                  {date.weekday}
                                                                              </p>
                                                                          </div>

                                                                          <div className="flex flex-col items-center justify-center gap-2 min-w-[100px]">
                                                                            hello
                                                                              {hours2.map(
                                                                                  (
                                                                                      hour
                                                                                  ) => (

                                                                                                <button

                                                                                                className={blockedHours[date.date] && blockedHours[date.date].includes(hour) ? "border-2 border-transparent text-[#c7982e] bg-[#c99b314d] text-base font-semibold px-3 py-1 rounded-md disabled bg-gray-300 cursor-not-allowed timeBox" :
                                                                                                "border-2 border-transparent text-[#c7982e] bg-[#c99b314d] hover:border-[#c7982e] text-base font-semibold px-3 py-1 rounded-md timeBox"
                                                                                                }                                                                                                data-date={date.date}
                                                                                                data-hour={hour}
                                                                                                onClick={(e) => {selectHour(e)}}
                                                                                                disabled={blockedHours[date.date] && blockedHours[date.date].includes(hour)}
                                                                                            >
                                                                                                {
                                                                                                    hour
                                                                                                }
                                                                                            </button>
                                                                                  )
                                                                              )}
                                                                          </div>
                                                                      </div>
                                                                  );
                                                              }
                                                          )
                                                        : dates.map(
                                                              (date) => {
                                                                  return (
                                                                      <div
                                                                          className="flex flex-col gap-8"
                                                                      >
                                                                          <div
                                                                              className={
                                                                                  styles.dateBox
                                                                              }
                                                                          >
                                                                              <h6
                                                                                  className={
                                                                                      styles.dateBoxTitle
                                                                                  }
                                                                              >
                                                                                  {
                                                                                      date.day
                                                                                  }
                                                                              </h6>

                                                                              <p
                                                                                  className={
                                                                                      styles.dateBoxDayInfo
                                                                                  }
                                                                              >
                                                                                {date.weekday}
                                                                              </p>
                                                                          </div>

                                                                          <div className="flex flex-col items-center justify-center gap-2 min-w-[100px]">
                                                                              {hours2
                                                                                  .slice(
                                                                                      0,
                                                                                      5
                                                                                  )
                                                                                  .map(
                                                                                      (
                                                                                          hour
                                                                                      ) => (

                                                                                                    <button

                                                                                                    className={blockedHours[date.date] && blockedHours[date.date].includes(hour) ? "border-2 border-transparent text-[#c7982e] bg-[#c99b314d] text-base font-semibold px-3 py-1 rounded-md disabled bg-gray-300 cursor-not-allowed timeBox" :
                                                                                                    "border-2 border-transparent text-[#c7982e] bg-[#c99b314d] hover:border-[#c7982e] text-base font-semibold px-3 py-1 rounded-md timeBox"
                                                                                                    }                                                                                                    data-date={date.date}
                                                                                                data-hour={hour}
                                                                                                onClick={(e) => {selectHour(e)}}
                                                                                                disabled={blockedHours[date.date] && blockedHours[date.date].includes(hour)}
                                                                                                >
                                                                                                    {
                                                                                                        hour
                                                                                                    }
                                                                                                </button>
                                                                                      )
                                                                                  )}
                                                                          </div>
                                                                      </div>
                                                                  );
                                                              }
                                                          ) )
                                                    }
                                                </div>
                                                <button
                                                    className={`${styles.scrollBtn} right`}
                                                    onClick={() =>
                                                        scroll(
                                                            "right",
                                                            auth.user.uid
                                                        )
                                                    }
                                                >
                                                    <FiChevronRight className="text-white" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => setShowMore(!showMore)}
                                                className=" text-[#c7982e] mb-6 flex gap-2 items-center justify-center "
                                            >
                                                {showMore ? (
                                                    <>
                                                        {" "}
                                                        <span>
                                                            Weniger anzeigen{" "}
                                                        </span>{" "}
                                                        <FiChevronUp className="h-5 w-5" />{" "}
                                                    </>
                                                ) : (
                                                    <>
                                                        {" "}
                                                        <span>
                                                            Mehr Sprechzeiten
                                                            anzeigen
                                                        </span>{" "}
                                                        <FiChevronDown className="h-5 w-5" />{" "}
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        <div className=" px-12 pb-6">
                                            <button
                                                className={
                                                    styles.submitBtnQuick
                                                }
                                                onClick={handleSubmit}

                                            >
                                                Termin vereinbaren
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>


        <div className={styles.divider}></div>

        <div className={styles.formGroup}>
            <button type="submit" className={styles.submitButton}>
            Reservierung erstellen
            </button>
        </div>


        </div>



            </div>
        </div>
    );
}

export default ReserveForPatient;
