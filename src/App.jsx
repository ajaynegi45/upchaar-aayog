import './App.css';
import Hero from "./assets/hero-bg.png";
import Doctor from "./assets/doctor.png";
import Medicine from "./components/Medicine.jsx";
import {useRef} from "react";


function App() {

    const medicineInputRef = useRef(null);

    const handleSearchMedicine = () => {
        if (medicineInputRef.current) {
            medicineInputRef.current.focus();
        }
    };


    return (
      <>


          <div className={"hero-image-container"}>
              <img src={Hero} alt="Hero Image"/>
          </div>

          <div className={"hero-info-container"}>
              <div className={"info-container"} >
                  <h1>Generic&nbsp;Name</h1>
                  <p>Find Your Remedy, Anytime, Anywhere: <br/> Your Gateway to Generic Medicine Search!</p>
                  <button onClick={handleSearchMedicine} >Search Medicine</button>
              </div>
              <div className={"doctor-image-container"}>
                  <img src={Doctor} alt=""/>
              </div>
          </div>

          <h1 className={"hero-title"} >Search Medicine</h1>

          <Medicine inputRef={medicineInputRef} />

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
              <img src="" alt="" />
          </div>

      </>
  )
}

export default App