import React, { useState, useEffect } from 'react';

import { useForm} from '@inertiajs/react';
import styles from './style.module.css';

import rightArrowIcon from "@/Assets/NewAppointment/rightArrowIcon.svg";
import leftArrowIcon from "@/Assets/NewAppointment/leftArrowIcon.svg";


import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';




const BlockDatesHours = ({auth}) => {

    const [hours, setHours] = useState([]);
    const { data, setData, post, processing, errors, reset } = useForm({
        date: null,
        hours: [],
    });

    const selectDate = (date) => {
        axios.get('/getblockhours?date='+date, {
            date: date,
        }).then((response) => {
            setData("date", date);
            console.log(data.date);
            response.data.forEach((hour) => {
                if (hour.blocked) {
                    setData("hours", [...data.hours, hour.hour]);
                }
            });
            console.log(response.data);
            const dateBoxes = document.querySelectorAll(`.${styles.dateBox}`);
            dateBoxes.forEach((dateBox) => {
                dateBox.classList.remove(styles.selectedDateBox);
            });
            const selectedDate = document.querySelector(`.${styles.dateBox}[data-date="${date}"]`);
            selectedDate.classList.add(styles.selectedDateBox);

            setHours(response.data);
        });

            // setData("date", date);
    }

    const selectHour = (hour) => {
        const hours = data.hours;
        const selectedHour = document.querySelector(`.${styles.timeBox}[data-hour="${hour}"]`);
        if (hours.includes(hour)) {
            const index = hours.indexOf(hour);
            hours.splice(index, 1);
            selectedHour.classList.remove(styles.timeBoxSelected);
        } else {
            hours.push(hour);
            selectedHour.classList.add(styles.timeBoxSelected);
        }
        setData("hours", hours);
    }
    const [successRes, setSuccessRes] = useState(false);
    const [show, setShow] = useState(false);


    const handleClose = () => {
        setShow(false);
    }

    const submit = () => {
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
    // dates are dates from tomorrow to 7 days from tomorrow
    // make the date in form 2024-09-12
    const start_date = new Date();
    start_date.setDate(start_date.getDate() + 1);
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(start_date);
        date.setDate(date.getDate() + i);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const weekday = date.toLocaleString('de-DE', { weekday: 'long' });
        dates.push({
            date: `${year}-${month < 10 ? "0" + month : month}-${day < 10 ? "0" + day : day}`,
            day: day,
            weekday: weekday,
        });
    }

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
                <Button variant="secondary" onClick={handleClose}>
                    Ok
                </Button>
                </Modal.Footer>
            </Modal>}

            <h3 className={styles.title}>Blockierte Termine</h3>
            <p className={styles.subtitle}>Wählen Sie die Termine und Stunden aus, die Sie blockieren möchten</p>
            {/* <form> */}
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
            </div>



            <div className={styles.divider}></div>

            {/* hours */}

            <div className={styles.timeSelectContainer}>
                <h5 className={styles.dateTitle}>Verfügbare Stunden</h5>
                <div className={`${styles.timeSelect} grid md:grid-cols-3 grid-cols-2 gap-2  `}>
                    {hours.map((hour, index) => {
                        return (
                            // on click add to array if hour.blocked is true add class timeBoxSelected
                            <div className={[styles.timeBox , data.hours.includes(hour.hour) ? styles.timeBoxSelected : ''].join(" ")} key={index} onClick={() => selectHour(hour.hour)} data-hour={hour.hour}>
                                {hour.hour}
                            </div>
                        );
                    })}
                </div>
            </div>

            <button className={styles.submitBtn} type="submit" onClick={() => submit()}>Blockieren</button>
        {/* </form> */}
    </div>

    );
};






export default BlockDatesHours;
