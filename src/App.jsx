import './App.css';
import Hero from "./assets/hero-bg.png";
import Doctor from "./assets/doctor.webp";
import Medicine from "./components/Medicine.jsx";
import {useRef} from "react";
import {Link} from "react-router-dom";
import Injection from "./assets/injection.webp"
import MedicineImage from "./assets/medicine.webp";
import Stethoscope from "./assets/stethoscope.webp";

function App() {

    const medicineInputRef = useRef(null);
    const handleSearchMedicine = () => {
        if (medicineInputRef.current) {
            medicineInputRef.current.focus();
        }
    };

    return (
        <section className={"home-page-container"}>
            <div className={"hero-image-container"}>
                <img src={Hero} alt="Hero Image"/>
            </div>



            <div className={"hero-info-container"}>

                <div className={"info-container"}>
                    <h1>Generic&nbsp;Name</h1>
                    <p className={"home-info"}>Find Your Remedy, Anytime, Anywhere: <br/> Your Gateway to Generic Medicine Search!</p>
                    <button  onClick={handleSearchMedicine}>Search Medicine</button>
                </div>

                <div className={"doctor-image-container"}>
                    <img src={Doctor} alt=""/>
                </div>

            </div>



            <h1 className={"hero-title"}>Search Medicine</h1>

            <Medicine inputRef={medicineInputRef}/>

            {/*<div className={"background-container"}>*/}
            {/*    <img className={"stethoscopeImage1"} src={Stethoscope} alt=""/>*/}
            {/*    <img className={"stethoscopeImage2"} src={Injection} alt=""/>*/}
            {/*</div>*/}

            <div className={"janaushadhi-location-container"}>
                <h1>Find nearby Jan Aushadhi Kendra</h1>
                <Link to={"https://janaushadhi.gov.in/KendraDetails.aspx"} target="_blank" rel="noopener noreferrer">
                    <button className={"janaushadhi-location-button"}>Search Jan Aushadhi Kendra</button>
                </Link>
            </div>


            <div className={"janaushadhi-location-container"}>
                <h1>Find nearby Pradhan Mantri Jan Arogya Yojana</h1>
                <Link
                    to={"https://web.umang.gov.in/web_new/department?url=pmjay_nha%2Fservice%2F1112&dept_id=184&dept_name=Pradhan%20Mantri%20Jan%20Arogya%20Yojana"}
                    target="_blank">
                    <button className={"janaushadhi-location-button"}>Search PM-JAY</button>
                </Link>
            </div>


            <div className={"about-container"}>
                <h1>What is Upchaar Aayog ?</h1>
                <p>Upchaar-Aayog follow holistic
                    approach of addressing
                    affordability, prescription
                    knowledge, and accessibility, we aim
                    to bridge the gap in healthcare
                    access for economically
                    disadvantaged individuals, ensuring
                    no one is deprived of essential
                    medications due to financial
                    constraints or lack of information.</p>
                <img src="" alt=""/>
            </div>

        </section>
    )
}

export default App