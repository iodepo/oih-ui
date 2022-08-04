import OIHLogo from '../resources/Logo Nav x 2.png'
import IODE from '../resources/IODE Logo Footer.png'
import UNESCO from '../resources/Unesco Logo White Footer.png'
import UNESCOScience from '../resources/UNESCO Science White Logo Footer.png'
import Vlaanderen from '../resources/Vlaanderen Logo White Footer.png'

export default function Footer() {
    return (
        <div className="mt-5 ml-5 pt-5 mb-0 pb-5 text-light footer-bg">
            <div className="container d-flex ">
                <div className="flex-fill text-start">
                    <h3 className="text-white fw-bold h4 text-uppercase">About OIH Project</h3>
                    <p>The OIH is a three year project funded by the Government of Flanders, <br/>Kingdom of Belgium and implemented by IODE, project office of the UNESCO</p>
                </div>
                <div className="flex-fill">
                    <h3 className="text-white fw-bold h4 text-uppercase">Want to learn more?</h3>
                    <button className="w-50 btn rounded-0 btn-info text-white">GET IN TOUCH</button>
                </div>
            </div>
            <div className="container">
                <div className="d-flex mt-5">
                    <div className="col">
                        <img src={UNESCO} className="img-fluid footer-logos" alt="OIH Logo" />
                    </div>
                    <div className="col">
                        <img src={UNESCOScience} className="img-fluid footer-logos" alt="OIH Logo" />
                    </div>
                    <div className="col">
                        <img src={IODE} className="img-fluid footer-logos" alt="OIH Logo" />
                    </div>
                     <div className="col">
                        <img src={Vlaanderen} className="img-fluid footer-logos" alt="OIH Logo" />
                    </div>
                    <div className="col">
                        <img src={OIHLogo} className="img-fluid footer-logos" alt="OIH Logo" />
                    </div>
                </div>
            </div>
        </div>
    )
}