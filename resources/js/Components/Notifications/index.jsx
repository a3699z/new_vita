import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import styles from "./style.module.css";


const Notifications = ({ notifications }) => {
    console.log(notifications);
    const [showNotifications, setShowNotifications] = useState(false);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    // get notifications
    // useEffect(() => {
    //     inertia.get("/notifications");
    // }, []);

    return (
        <Dropdown>
            <Dropdown.Trigger>
                {/* <button
                    onClick={toggleNotifications}
                    className="btn-primary rounded-md bg-[#c7982e] flex items-center justify-center px-4 py-2 gap-4 text-white font-semibold text-base"
                >
                    Notifications
                </button> */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24" fill="none">
                    <path d="M9.00195 17H5.60636C4.34793 17 3.71872 17 3.58633 16.9023C3.4376 16.7925 3.40126 16.7277 3.38515 16.5436C3.37082 16.3797 3.75646 15.7486 4.52776 14.4866C5.32411 13.1835 6.00031 11.2862 6.00031 8.6C6.00031 7.11479 6.63245 5.69041 7.75766 4.6402C8.88288 3.59 10.409 3 12.0003 3C13.5916 3 15.1177 3.59 16.2429 4.6402C17.3682 5.69041 18.0003 7.11479 18.0003 8.6C18.0003 11.2862 18.6765 13.1835 19.4729 14.4866C20.2441 15.7486 20.6298 16.3797 20.6155 16.5436C20.5994 16.7277 20.563 16.7925 20.4143 16.9023C20.2819 17 19.6527 17 18.3943 17H15.0003M9.00195 17L9.00031 18C9.00031 19.6569 10.3435 21 12.0003 21C13.6572 21 15.0003 19.6569 15.0003 18V17M9.00195 17H15.0003" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>


            </Dropdown.Trigger>
            <Dropdown.Content>
                {notifications.map((notification) => (
                    <Link
                        key={notification.hey}
                        href={"/visit/" + notification.key}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        {notification.message}
                    </Link>
                ))}
            </Dropdown.Content>
        </Dropdown>
    );
}

export default Notifications;
