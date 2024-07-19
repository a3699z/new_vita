import { Link, Head, useForm } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
// import axios from "axios";
import NavBar from "@/Components/Navbar";

import NavBar2 from "@/Components/NavBar2";
import Hashtag from "@/Components/NewAppointment/Hashtags";
import QuickAppointmentRequest from "@/Components/NewAppointment/QuickAppointmentRequest";
import Footer from "@/Components/Footer";
import Resume from "@/Components/NewAppointment/Resume";
import Education from "@/Components/NewAppointment/Education";
import Certificates from "@/Components/NewAppointment/Certificates";
import Specializations from "@/Components/NewAppointment/Specializations";

import styles from "./style.module.css";
import profileImg from "@/Assets/NewAppointment/profile.png";
import PatientReviews from "@/Components/NewAppointment/PatientReviews";

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
import { useEffect, useState, useRef } from "react";


// const days = [
//     "Montag",
//     "Dienstag",
//     "Mittwoch",
//     "Donnerstag",
//     "Freitag",
//     "Samstag",
//     "Sonntag",
// ];

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

export default function Employee({ auth, dates, employee, type }) {
    // const [days, setDays] = useState([]);

    const [activeTab, setActiveTab] = useState(type === "onsite" ? "onsite" : "online");

    const [showMore, setShowMore] = useState(false);

    const [blockedHours, setBlockedHours] = useState(null);

    const scrollRefs = useRef({});


    const scroll = (direction, employeeUid) => {
        const container = scrollRefs.current[employeeUid];
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



    const handleActivaTab = (tab) => {
        setActiveTab(tab);
        setData("online", tab === "online" ? 1 : 0);
    }


    const getBlockedHours = () => {
        axios.get('/employee/get_blocked_hours/'+employee.uid).then((response) => {
            setBlockedHours(response.data);
            // Object.entries(response.data).map(([date, hours]) => {
            //     hours.map((hour) => {
            //         // disable button with date-date = date and data-hour = hour
            //         document.querySelector(`button[data-date="${date}"][data-hour="${hour}"]`).setAttribute("disabled", "disabled");
            //         console.log(document.querySelector(`button[data-date="${date}"][data-hour="${hour}"]`));
            //     }
            //     )
            // }
            // )
        });
    }

    useEffect(() => {
        handleActivaTab(type);
        getBlockedHours();
    }, []);


    const { data, setData, post, get, processing, errors, reset } = useForm({
        date: null,
        hour: null,
        time: null,
        online: type === "online" ? 1 : 0,
        employeeUID: employee.uid,
    });

    const selectHour = (e) => {
        const date = e.target.getAttribute("data-date");
        const hour = e.target.getAttribute("data-hour");
        // if (setData("hour", hour)) {
        //     setData("date", date)
        // }
        const time = date + " " + hour
        setData("time", time);


        const timeBoxes = document.querySelectorAll(`.timeBox`);
        timeBoxes.forEach((timeBox) => {
            timeBox.classList.remove("bg-[#c99b31]");
            timeBox.classList.remove("text-white");
        });
        e.target.classList.add("bg-[#c99b31]");
        e.target.classList.add("text-white");
    }


    const submit = () => {
        console.log(data)
        post(route('reservation.check'));
    }


    const getFirstAvailable = () => {
        //  from the dom get the first available date and hour
        const timeBoxes = document.querySelectorAll(`.timeBox`);
        let firstAvailable = null;
        timeBoxes.forEach((timeBox) => {
            if (!firstAvailable) {
                if (!timeBox.hasAttribute("disabled")) {
                    firstAvailable = timeBox;
                }
            }
        });
        if (firstAvailable) {
            setData("time", firstAvailable.getAttribute("data-date") + " " + firstAvailable.getAttribute("data-hour"));
            // submit
            submit();
        }
    }




    return (
        <>
            <NavBar user={auth.user} />
            <Head title="Welcome" />

            <div className={`${styles.container} `}>
            <div
                        className="items-center mx-auto max-w-[1000px] p-2    "
                    >
                        <div className="flex md:flex-row flex-col min-h-[380px] ">
                            <div className="flex-1 md:w-1/2 w-full bg-white     border-r-[1px] shadow-md  ">
                                {/* employee details start */}
                                <div className="flex flex-row gap-6 p-4 ">
                                    <img
                                        className="rounded-full w-[100px] h-[100px]"
                                        src={
                                            employee.profile_image
                                                ? "/images/" +
                                                  employee.profile_image
                                                : logo
                                        }
                                        alt=""
                                    />

                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-medium text-xl leading-6 ">
                                            {employee.username} {employee.name}
                                        </h3>

                                        <h4 className="font-normal text-base  ">
                                            Internist, Allgemeinmediziner
                                            (Hausarzt), Hausarzt
                                        </h4>
                                        <div className="flex gap-[1px]">
                                            <IoIosStarOutline className="text-[#c7982e]" />
                                            <IoIosStarOutline className="text-[#c7982e]" />
                                            <IoIosStarOutline className="text-[#c7982e]" />
                                            <IoIosStarOutline className="text-[#c7982e]" />
                                            <IoIosStarOutline className="text-[#c7982e]" />
                                            <span className="text-[#627282] text-sm ml-2 ">
                                                87 Bewertungen
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* employee details end */}
                                <div className="p-6  relative">
                                    {/* tabs start */}

                                    <ul className="flex border-b-[1px] gap-6">
                                        <li
                                            onClick={() => handleActivaTab('onsite')}
                                            className={`tab-item relative pb-3 cursor-pointer
                                            ${
                                                activeTab ===
                                                "onsite"
                                                    ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#627282]"
                                                    : "text-[#627282]"
                                            }`}
                                        >
                                            <div  className=" ">
                                                Vor-Ort-Termin{" "}
                                            </div>
                                        </li>

                                        <li
                                            onClick={() => handleActivaTab('online')}
                                            className={`tab-item relative pb-3 cursor-pointer
                                              ${
                                                activeTab ===
                                                "online"
                                                    ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#627282]"
                                                    : "text-[#627282]"
                                            }`}
                                        >
                                            <div
                                                className="flex gap-1 items-center   "
                                            >
                                                <IoIosVideocam />
                                                Videosprechstunde{" "}
                                            </div>
                                        </li>
                                    </ul>

                                    <div className="tab-content">
                                        {activeTab === "onsite" ? (
                                            <div className="pt-5 flex gap-2">
                                                <HiMapPin className="h-5 w-5 text-[#8c8a9a]" />
                                                <div className="flex flex-col gap-1">
                                                    <span>
                                                        Karl-Marx-Str. 27,
                                                        Berlin
                                                    </span>
                                                    <span className=" text-[#627282] text-sm ">
                                                        Praxis Dr.med. Usan
                                                        Thanabalasingam Facharzt
                                                        für Innere Medizin und
                                                        Kardiologie
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="pt-5"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 md:w-1/2 w-full bg-white shadow-md ">
                                {activeTab === "onsite" ? (
                                    <>
                                        <div className="px-12 pt-6">
                                            <button
                                                className={
                                                    styles.submitBtnQuick
                                                }
                                                onClick={getFirstAvailable}
                                            >
                                                Nächstmöglicher Termin
                                            </button>


                                            {/* <QuickAppointmentRequest employeeUID={employee.uid} quickDate={employee.quick_date} quickHour={employee.quick_hour} /> */}
                                        </div>
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
                                                                employee.uid
                                                            )
                                                        }
                                                    >
                                                        <FiChevronLeft className="text-white" />
                                                    </button>
                                                    <div
                                                        className={`${styles.dateBoxContainer} border-b-[1px] pb-3 `}
                                                        ref={(el) =>
                                                            (scrollRefs.current[
                                                                employee.uid
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
                                                                                        console.log(blockedHours[date.date]),
                                                                                        // check if the hour in blockedHours[date] array
                                                                                        blockedHours[date] && blockedHours[date].includes(hour) ? (

                                                                                            <button>blockec</button>) : (

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
                                                                                  {hours
                                                                                      .slice(
                                                                                          0,
                                                                                          5
                                                                                      )
                                                                                      .map(
                                                                                          (
                                                                                              hour
                                                                                          ) => (
                                                                                            console.log(blockedHours[date.date]),

                                                                                            blockedHours[date] && blockedHours[date].includes(hour) ?  (

                                                                                                <button>blockec</button>) : (

                                                                                                    <button

                                                                                                    className={blockedHours[date.date] && blockedHours[date.date].includes(hour) ? "border-2 border-transparent text-[#c7982e] bg-[#c99b314d]  text-base font-semibold px-3 py-1 rounded-md disabled bg-gray-300 cursor-not-allowed timeBox" :
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
                                                                employee.uid
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
                                                onClick={submit}
                                            >
                                                Termin vereinbaren
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        {/* dates */}

                                        <div className="px-12 pt-6">
                                            {/* <button
                                                className={
                                                    styles.submitBtnQuick
                                                }
                                            >
                                                Nächstmöglicher Termin
                                            </button> */}
                                            <div className="px-12 pt-6">
                                            <button
                                                className={
                                                    styles.submitBtnQuick
                                                }
                                                onClick={getFirstAvailable}
                                            >
                                                Nächstmöglicher Termin
                                            </button>


                                        {/* <QuickAppointmentRequest employeeUID={employee.uid} quickDate={employee.quick_date} quickHour={employee.quick_hour} /> */}
                                        </div>
                                        </div>

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
                                                            employee.uid
                                                        )
                                                    }
                                                >
                                                    <FiChevronLeft className="text-white" />
                                                </button>
                                                <div
                                                    className={`${styles.dateBoxContainer} border-b-[1px] pb-3 `}
                                                    ref={(el) =>
                                                        (scrollRefs.current[
                                                            employee.uid
                                                        ] = el)
                                                    }
                                                >
                                                    {
                                                    blockedHours &&  (
                                                    showMore
                                                        ? dates.map(
                                                              (date) => {
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
                                                                              {hours2.map(
                                                                                  (
                                                                                      hour
                                                                                  ) => (
                                                                                    console.log(blockedHours[date.date]),

                                                                                        blockedHours[date] && blockedHours[date].includes(hour) ?  (

                                                                                            <button>blockec</button>) : (

                                                                                                <button

                                                                                                className={blockedHours[date.date] && blockedHours[date.date].includes(hour) ? "border-2 border-transparent text-[#c7982e] bg-[#c99b314d]  text-base font-semibold px-3 py-1 rounded-md disabled bg-gray-300 cursor-not-allowed timeBox" :
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
                                                                                  )
                                                                              )}
                                                                          </div>
                                                                      </div>
                                                                  );
                                                              }
                                                          )
                                                        : dates.map(
                                                              (date) => {
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
                                                                              {hours2
                                                                                  .slice(
                                                                                      0,
                                                                                      5
                                                                                  )
                                                                                  .map(
                                                                                      (
                                                                                          hour
                                                                                      ) => (

                                                                                            blockedHours[date] && blockedHours[date].includes(hour) ?  (

                                                                                                <button>blockec</button>) : (

                                                                                                    <button

                                                                                                    className={blockedHours[date.date] && blockedHours[date.date].includes(hour) ? "border-2 border-transparent text-[#c7982e] bg-[#c99b314d]  text-base font-semibold px-3 py-1 rounded-md disabled bg-gray-300 cursor-not-allowed timeBox" :
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
                                                            employee.uid
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
                                                onClick={submit}

                                            >
                                                Termin vereinbaren
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                <Footer />
            </div>
        </>
    );
}
