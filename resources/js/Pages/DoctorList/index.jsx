import NavBar from "@/Components/Navbar";
import styles from "./style.module.css";
import { IoIosStarOutline, IoIosVideocam } from "react-icons/io";
import { HiMapPin } from "react-icons/hi2";
import { useState, useEffect, useRef } from "react";
import SpeedAppointment from "@/Components/NewAppointment/SpeedAppointment";

import rightArrowIcon from "@/Assets/NewAppointment/rightArrowIcon.svg";
import leftArrowIcon from "@/Assets/NewAppointment/leftArrowIcon.svg";
import { PiCaretLeftLight } from "react-icons/pi";
import {
    FiChevronRight,
    FiChevronLeft,
    FiChevronDown,
    FiChevronUp,
} from "react-icons/fi";

import { Head, Link, useForm, usePage } from "@inertiajs/react";
import logo from "@/Assets/Logo.png";

const days = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
];

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

export default function DoctorList({ employees }) {
    const [activeTabs, setActiveTabs] = useState({});
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const scrollRefs = useRef({});
    const [showMore, setShowMore] = useState({});

    const { url } = usePage();
    const urlParts = url.split("/");
    const tab = urlParts[urlParts.length - 1];

    const handleTabClick = (event, tabId, employee) => {
        event.preventDefault();
        setActiveTabs((prevState) => ({
            ...prevState,
            [employee.uid]: tabId,
        }));
        setSelectedEmployee(employee);
    };

    const handleShowMoreClick = (employeeUid) => {
        setShowMore((prevState) => ({
            ...prevState,
            [employeeUid]: !prevState[employeeUid],
        }));
    };

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

    useEffect(() => {
        if (employees.length > 0) {
            employees.forEach((employee) => {
                setActiveTabs((prevState) => ({
                    ...prevState,
                    [employee.uid]: tab,
                }));
            });
        }
    }, [employees, tab]);

    return (
        <>
            <NavBar />
            <Head title="Welcome" />

            <div className={`   ${styles.container}`}>
                {employees.map((employee, index) => (
                    <div
                        key={employee.id}
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
                                            onClick={(event) =>
                                                handleTabClick(
                                                    event,
                                                    "tab1",
                                                    employee,
                                                    employee.uid
                                                )
                                            }
                                            className={`tab-item relative pb-3  ${
                                                activeTabs[employee.uid] ===
                                                "tab1"
                                                    ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#627282]"
                                                    : "text-[#627282]"
                                            }`}
                                        >
                                            <a href="#tab1" className=" ">
                                                Vor-Ort-Termin{" "}
                                            </a>
                                        </li>

                                        <li
                                            onClick={(event) =>
                                                handleTabClick(
                                                    event,
                                                    "tab2",
                                                    employee
                                                )
                                            }
                                            className={`tab-item relative pb-3  ${
                                                activeTabs[employee.uid] ===
                                                "tab2"
                                                    ? "after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#627282]"
                                                    : "text-[#627282]"
                                            }`}
                                        >
                                            <a
                                                href="#tab2"
                                                className="flex gap-1 items-center   "
                                            >
                                                <IoIosVideocam />
                                                Videosprechstunde{" "}
                                            </a>
                                        </li>
                                    </ul>

                                    <div className="tab-content">
                                        {activeTabs[employee.uid] === "tab1" ? (
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
                                {activeTabs[employee.uid] === "tab1" ? (
                                    <>
                                        <div className="px-12 pt-6">
                                            <button
                                                className={
                                                    styles.submitBtnQuick
                                                }
                                            >
                                                Nächstmöglicher Termin
                                            </button>
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
                                                        {showMore[employee.uid]
                                                            ? days.map(
                                                                  (
                                                                      date,
                                                                      index
                                                                  ) => {
                                                                      return (
                                                                          <div
                                                                              className="flex flex-col gap-8"
                                                                              key={
                                                                                  index
                                                                              }
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
                                                                                          date
                                                                                      }
                                                                                  </h6>

                                                                                  <p
                                                                                      className={
                                                                                          styles.dateBoxDayInfo
                                                                                      }
                                                                                  >
                                                                                      5
                                                                                      Jul
                                                                                  </p>
                                                                              </div>

                                                                              <div className="flex flex-col items-center justify-center gap-2 min-w-[100px]">
                                                                                  {hours.map(
                                                                                      (
                                                                                          hour,
                                                                                          innerIndex
                                                                                      ) => (
                                                                                          <button
                                                                                              key={
                                                                                                  innerIndex
                                                                                              }
                                                                                              className="border-2 border-transparent text-[#c7982e] bg-[#c99b314d] hover:border-[#c7982e] text-base font-semibold px-3 py-1 rounded-md "
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
                                                            : days.map(
                                                                  (
                                                                      date,
                                                                      index
                                                                  ) => {
                                                                      return (
                                                                          <div
                                                                              className="flex flex-col gap-8"
                                                                              key={
                                                                                  index
                                                                              }
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
                                                                                          date
                                                                                      }
                                                                                  </h6>

                                                                                  <p
                                                                                      className={
                                                                                          styles.dateBoxDayInfo
                                                                                      }
                                                                                  >
                                                                                      5
                                                                                      Jul
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
                                                                                              hour,
                                                                                              innerIndex
                                                                                          ) => (
                                                                                              <button
                                                                                                  key={
                                                                                                      innerIndex
                                                                                                  }
                                                                                                  className="border-2 border-transparent text-[#c7982e] bg-[#c99b314d] hover:border-[#c7982e] text-base font-semibold px-3 py-1 rounded-md "
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
                                                              )}
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
                                                    onClick={() =>
                                                        handleShowMoreClick(
                                                            employee.uid
                                                        )
                                                    }
                                                    className=" text-[#c7982e] mb-6 flex gap-2 items-center justify-center "
                                                >
                                                    {showMore[employee.uid] ? (
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
                                            >
                                                Termin vereinbaren
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        {/* dates */}

                                        <div className="px-12 pt-6">
                                            <button
                                                className={
                                                    styles.submitBtnQuick
                                                }
                                            >
                                                Nächstmöglicher Termin
                                            </button>
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
                                                    {showMore[employee.uid]
                                                        ? days.map(
                                                              (date, index) => {
                                                                  return (
                                                                      <div
                                                                          className="flex flex-col gap-8"
                                                                          key={
                                                                              index
                                                                          }
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
                                                                                      date
                                                                                  }
                                                                              </h6>

                                                                              <p
                                                                                  className={
                                                                                      styles.dateBoxDayInfo
                                                                                  }
                                                                              >
                                                                                  5
                                                                                  Jul
                                                                              </p>
                                                                          </div>

                                                                          <div className="flex flex-col items-center justify-center gap-2 min-w-[100px]">
                                                                              {hours2.map(
                                                                                  (
                                                                                      hour,
                                                                                      innerIndex
                                                                                  ) => (
                                                                                      <button
                                                                                          key={
                                                                                              innerIndex
                                                                                          }
                                                                                          className="border-2 border-transparent text-[#c7982e] bg-[#c99b314d] hover:border-[#c7982e] text-base font-semibold px-3 py-1 rounded-md "
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
                                                        : days.map(
                                                              (date, index) => {
                                                                  return (
                                                                      <div
                                                                          className="flex flex-col gap-8"
                                                                          key={
                                                                              index
                                                                          }
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
                                                                                      date
                                                                                  }
                                                                              </h6>

                                                                              <p
                                                                                  className={
                                                                                      styles.dateBoxDayInfo
                                                                                  }
                                                                              >
                                                                                  5
                                                                                  Jul
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
                                                                                          hour,
                                                                                          innerIndex
                                                                                      ) => (
                                                                                          <button
                                                                                              key={
                                                                                                  innerIndex
                                                                                              }
                                                                                              className="border-2 border-transparent text-[#c7982e] bg-[#c99b314d] hover:border-[#c7982e] text-base font-semibold px-3 py-1 rounded-md "
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
                                                          )}
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
                                                onClick={() =>
                                                    handleShowMoreClick(
                                                        employee.uid
                                                    )
                                                }
                                                className=" text-[#c7982e] mb-6 flex gap-2 items-center justify-center "
                                            >
                                                {showMore[employee.uid] ? (
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
                                            >
                                                Termin vereinbaren
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
