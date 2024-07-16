import React, { useState } from "react";
import styles from "./style.module.css";


import { Head, Link, useForm } from '@inertiajs/react';



const QuickAppointmentRequest = ({employeeUID, quickDate, quickHour}) => {

    const { data, setData, post, get, processing, errors, reset } = useForm({
        employeeUID: employeeUID,
    });


    const submit = () => {
        // console.log(data);
        post(route('reservation.quick'), data);
    }



  return (
    <div className={styles.quickContainer}>
      <h6 className={styles.title}>Nächstmöglicher Termin Request</h6>
        <form className={styles.form} onSubmit={e => { e.preventDefault(); submit(); }}>
            <button type="submit" className={styles.submitBtnQuick}>Nächstmöglicher Termin</button>
        </form>
        <center>
            {quickDate} {quickHour}
        </center>

    </div>
  );
};

export default QuickAppointmentRequest;
