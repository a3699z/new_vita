import React, { useState } from "react";
import Navbar from "@/Components/Navbar";
import ProfileInfo from "@/Components/Profile/Emplyee/ProfileInfo";
import Menu from "@/Components/Profile/Emplyee/Menu";

import styles from "./style.module.css";
import Visits from "@/Components/Profile/Emplyee/Visits";
import Quicks from "@/Components/Profile/Emplyee/Quicks";
import AccountSettings from "@/Components/Profile/Emplyee/AccountSettings";
import { useNavigate, useParams } from "react-router-dom";
import VisitDetails from "@/Components/Profile/Emplyee/VisitDetails";

import RserveForPatient from "@/Components/Profile/Emplyee/ReserveForPatient";
import BlockDatesHours from "@/Components/Profile/Emplyee/BlockDatesHours";



const Profile = ({auth, reservations}) => {
    const tabs = [
        {
          id: "profile",
          label: "Meine Termine",
          component: <Visits reservations={reservations} />,
        },
        // {
        //     id: "quickReservations",
        //     label: "Schnellreservierung",
        //     component: <Quicks />,
        // },
        {
          id: "accountSettings",
          label: "Account Einstellungen",
          component: <AccountSettings auth={auth} />,
        },
        // reserve for patient
        {
            id: "reserve_patient",
            label: "Reservierungen",
            component: <RserveForPatient auth={auth} />,
        },
        // block dates and hours
        {
            id: "block_hours",
            label: "Blockierte Termine",
            component: <BlockDatesHours auth={auth} />,
        }
      ];
    console.log(reservations)
//   const navigate = useNavigate();
  const { visitId } = useParams();

  const [activeTab, setActiveTab] = useState("profile");

  const changeTab = (tab) => {
    // navigate("/profile");
    setActiveTab(tab);
  };

  return (
    <>

        <Navbar user={auth.user} />
        <div className={styles.container}>
            <ProfileInfo auth={auth} />
            <div className={`${styles.contentContainer} flex md:flex-row flex-col`}>
                <Menu tabs={tabs} activeTab={activeTab} changeTab={changeTab} />
                <div className={styles.content}>
                {/* {visitId ? (
                    <VisitDetails />
                ) : (
                    tabs.find((t) => t.id === activeTab).component
                )} */}
                {tabs.find((t) => t.id === activeTab).component}
                </div>
            </div>
        </div>
    </>
  );
};

export default Profile;
