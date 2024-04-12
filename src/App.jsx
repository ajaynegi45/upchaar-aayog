import './App.css';
import Hero from "./assets/hero-bg.png";
import Doctor from "./assets/hero.png";
import search from "./assets/search.svg";


function App() {

  return (
      <>
          <div className={"hero-image-container"}>
              <img src={Hero} alt="Hero Image"/>
          </div>

          <div className={"hero-info-container"}>
              <div className={"info-container"} >
                  <h1>Generic&nbsp;Name</h1>
                  <p>Find Your Remedy, Anytime, Anywhere: <br/> Your Gateway to Generic Medicine Search!</p>
                  <button>Search Medicine</button>
              </div>
              <div className={"doctor-image-container"}>
                  <img src={Doctor} alt=""/>
              </div>
          </div>

          <h1 className={"hero-title"} >Search Medicine</h1>

          <div className={"search-container"} >
              <input type="text" placeholder={"Search Medicine"} />
              <button> <span> <img src={search} alt="" /> </span></button>
          </div>


      </>
  )
}

export default App


// https://www.myupchar.com/home/medicine_api
// https://open.fda.gov/apis/drug/event/how-to-use-the-endpoint/