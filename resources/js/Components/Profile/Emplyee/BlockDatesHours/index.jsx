import React, { useState, useEffect } from 'react';

import { useForm} from '@inertiajs/react';
import styles from './style.module.css';

import rightArrowIcon from "@/Assets/NewAppointment/rightArrowIcon.svg";
import leftArrowIcon from "@/Assets/NewAppointment/leftArrowIcon.svg";


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

import { Link } from "@inertiajs/react";




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


const BlockDatesHours = ({auth}) => {

    const [loading, setLoading] = useState(false);


    const [showMore, setShowMore] = useState(false);



    const selectHour = (event) => {
        const hour = event.target.getAttribute("data-hour");
        const date = event.target.getAttribute("data-date");

        if (data.times[date] && data.times[date].includes(hour)) {
            // remove the time from the array
            setData("times", data.times[date].filter((h) => h !== hour));
            if (data.times[date].length === 0) {
                delete data.times[date];
            }
        } else {
            // add the time to the array
            if (data.times[date]) {
                setData("times", {...data.times, [date]: [...data.times[date], hour]});
            } else {
                setData("times", {...data.times, [date]: [hour]});
            }
        }




    }

    const [successRes, setSuccessRes] = useState(false);
    const [show, setShow] = useState(false);


    const handleClose = () => {
        setShow(false);
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

    const [dates, setDates] = useState([]);

    useEffect(() => {
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


    // const [hours, setHours] = useState([]);
    const { data, setData, post, processing, errors, reset } = useForm({
        times: [],
    });


    const [blockedHours, setBlockedHours] = useState([]);

    const getBlockedHours = () => {
        axios.get('/getblockhours').then((response) => {
            setData("times", response.data);
        });
    }


    useEffect(() => {
        // getDays();
        getBlockedHours();
    }, []);


    const submit = () => {
        console.log(data);
        post(route('blockhours'),
        {
            onSuccess: () => {
                console.log("success");
                setSuccessRes(true);
                setShow(true);
                reset();
            }
        });
    }



    return (

        <div>

            {/* onSuccess make a modal */}
            {successRes &&
                <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>
                Erfolg
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>This clock has been blocked successfully.</Modal.Body>
                <Modal.Footer>
                <Link href="/profile">
                Schließen
                </Link>
                </Modal.Footer>
            </Modal>}

            <h3 className={styles.title}>Blockierte Termine</h3>
            <p className={styles.subtitle}>Wählen Sie die Termine und Stunden aus, die Sie blockieren möchten</p>
            {/* <form> */}

            <div className={styles.form}>
            <div className="flex-1  w-full bg-white shadow-md ">
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
                                                        showMore
                                                            ? dates.map(
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
                                                                                  {hours.map(
                                                                                      (
                                                                                          hour
                                                                                      ) => (

                                                                                                <button
                                                                                                className={data.times[date.date] && data.times[date.date].includes(hour) ? "border-2 hover:border-[#c7982e] border-transparent text-[#c7982e] bg-[#c99b314d] text-base font-semibold px-3 py-1 rounded-md timeBox text-white bg-[#c99b31]" :
                                                                                                "border-2 border-transparent text-[#c7982e] bg-[#c99b314d] hover:border-[#c7982e] text-base font-semibold px-3 py-1 rounded-md timeBox"
                                                                                                }
                                                                                                data-date={date.date}
                                                                                                data-hour={hour}
                                                                                                onClick={(e) => {selectHour(e)}}
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


                                                                                                    className={data.times[date.date] && data.times[date.date].includes(hour) ? "border-2 hover:border-[#c7982e] border-transparent text-[#c7982e] bg-[#c99b314d] text-base font-semibold px-3 py-1 rounded-md timeBox text-white bg-[#c99b31]" :
                                                                                                    "border-2 border-transparent text-[#c7982e] bg-[#c99b314d] hover:border-[#c7982e] text-base font-semibold px-3 py-1 rounded-md timeBox"
                                                                                                    }                                                                                                         data-date={date.date}
                                                                                                data-hour={hour}
                                                                                                onClick={(e) => {selectHour(e)}}
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
                                    </>

                            </div>
            <button className={styles.submitBtn} type="submit" onClick={() => submit()}>Blockieren</button>

            </div>
        {/* </form> */}
    </div>

    );
};






export default BlockDatesHours;
