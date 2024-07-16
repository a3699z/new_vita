import React from "react";
import styles from "./style.module.css";
import FormGroup from "../../../FormGroup";
import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';


const PersonalInformation = ({auth}) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = auth.user.profile_image ? useState('/images/' + auth.user.profile_image) : useState('https://via.placeholder.com/800');
  const { data, setData, errors, post, reset, processing, recentlySuccessful } = useForm({
    profileImage: null,
    userName: auth.user.username ? auth.user.username : '',
    name: auth.user.name ? auth.user.name : '',
    email: auth.user.email ? auth.user.email : '',
    });

  const onChange = () => {};
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file.type.match(/image\/(png|jpg|jpeg)/)) {
          setFile(file);
          setData('profileImage', file);
          previewFile(file);
          console.log(file);
        } else {
          console.error('Unsupported file type');
        }
      };

      const previewFile = (file) => {
        const reader = new FileReader();
        console.log(reader)
        reader.addEventListener('load', () => {
          setPreviewUrl(reader.result);
        });
        reader.readAsDataURL(file);
      };

        const handleSubmit = (e) => {
            e.preventDefault();
            // const formData = new FormData();
            // formData.append('profileImage', file);
            // formData.append('userName', data.userName);
            // formData.append('name', data.name);
            // formData.append('email', data.email);
            post(route('profile.update'));
        }

  return (
    <div className={styles.container}>
      <div className={styles.titleContainer}>
        <h4 className={styles.title}>Persönliche Daten</h4>
        <p className={styles.info}>
          Hier können Sie Ihre persönlichen Daten aktualisieren.
        </p>
      </div>
      <div className={styles.formContainer}>
        <form>
            {/* image and preview of this image */}


            <div className={styles.imageContainer}>
                <img src={previewUrl} alt="profile" className={styles.image} />
                <div className={styles.uploadBtn} onClick={() => {document.getElementById('image').click();}} role="div"
                >Bild hochladen</div>
                <p className={styles.imageInfo}>Hochgeladene Bildgröße: 800 x 800 Pixel.</p>
                <input type="file" id="image" style={{display: 'none'}} onChange={(e) => {handleFileChange(e)}} />
            </div>


          {/* <FormGroup
            id={"userName"}
            name={"userName"}
            label={"Benutzername"}
            placeholder={"ritaaagreiner"}
            onChange={(e) => {setData('userName', e.target.value)}}
            type="text"
            value={auth.user.username}
          /> */}
          <div class={styles.formGroup}>
            <label for="userName" class={styles.label}>
                Benutzername
            </label>
            <input
                type="text"
                name="userName"
                id="userName"
                class={styles.input}
                placeholder="ritaaagreiner"
                onChange={(e) => {setData('userName', e.target.value)}}
                value={auth.user.username}
            />
            </div>



          {/* <FormGroup
            id={"name"}
            name={"name"}
            label={"Name"}
            placeholder={"Rita Greiner"}
            onChange={(e) => {setData('name', e.target.value)}}
            type="text"
            value={auth.user.name}
          /> */}
          <div class={styles.formGroup}>
            <label for="name" class={styles.label}>
                Name
            </label>
            <input
                type="text"
                name="name"
                id="name"
                class={styles.input}
                placeholder="Rita Greiner"
                onChange={(e) => {setData('name', e.target.value)}}
                value={auth.user.name}
            />
            </div>




          {/* <FormGroup
            id={"email"}
            name={"email"}
            label={"E-mail"}
            placeholder={"ritagreiner@gmail.com"}
            onChange={(e) => {setData('email', e.target.value)}}
            type="mail"
            value={auth.user.email}
          /> */}
            <div class={styles.formGroup}>
                <label for="email" class={styles.label}>
                    E-mail
                </label>
                <input
                    type="mail"
                    name="email"
                    id="email"
                    class={styles.input}
                    placeholder="ritagreiner@gmail.com"
                    onChange={(e) => {setData('email', e.target.value)}}
                    value={auth.user.email}
                />
                </div>
        </form>
        <div className={styles.btnGroup}>
          {/* <button className={styles.cancelBtn}>ABBRECHEN</button> */}
          <button className={styles.saveBtn}  onClick={(e) => {handleSubmit(e)}}>Speichern</button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
// color: "#141417";
// fontSize: 18;
// fontFamily: "Manrope";
// fontWeight: "600";
// lineHeight: 64;
// wordWrap: "break-word";
