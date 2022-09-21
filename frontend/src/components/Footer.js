import OIHLogo from '../resources/Logo Nav x 2.png';
import IODE from '../resources/logos/iode_white_220.png';
import UNESCO from '../resources/logos/combined_unesco_ioc_white_220.png';
import UNESCOScience from '../resources/logos/decade_white_220.png';
import Vlaanderen from '../resources/logos/Flanders_white_220.png';

export default function Footer() {
    return (
        <div className="mt-auto ml-5 pt-5 mb-0 pb-5 text-light footer__container">
            <div className="container d-flex ">
                <div className="col-md-6 mx-2 flex-fill text-start">
                    <h3 className="text-white fw-bold h4 text-uppercase">About the Ocean InfoHub Project</h3>
                  <p>
                    The Ocean InfoHub aims to build a sustainable, interoperable, and inclusive digital ecosystem for all ocean stakeholders. Existing and emerging data systems are linked, with the ultimate goal of coordinating action and capacity to improve access to ocean data and knowledge. The Project is funded by the Government of Flanders, Kingdom of Belgium and implemented by IODE, project office of the IOC of UNESCO. It is a contribution to the OceanData 2030 Programme of the UN Decade of Ocean Science for Sustainable Development.
                  </p>
                </div>
                <div className="col-md-6 mx-2 flex-fill">
                    <h3 className="text-white fw-bold h4 text-uppercase">Want to learn more?</h3>
                    <button className="w-50 btn rounded-0 btn-info text-white">GET IN TOUCH</button>
                </div>
            </div>
            <div className="container">
                <div className="d-flex mt-5 footer-logos__container">
                    <div className="col footer-logos">
                        <img src={UNESCO} className="img-fluid" alt="Unesco/IODE Logo" />
                    </div>
                    <div className="col footer-logos">
                        <img src={UNESCOScience} className="img-fluid" alt="Unesco Decade of Ocean Science Logo" />
                    </div>
                    <div className="col footer-logos">
                        <img src={IODE} className="img-fluid" alt="IODE Logo" />
                    </div>
                     <div className="col footer-logos">
                        <img src={Vlaanderen} className="img-fluid" alt="Flanders Logo" />
                    </div>
                    <div className="col footer-logos">
                        <img src={OIHLogo} className="img-fluid" alt="OIH Logo" />
                    </div>
                </div>
            </div>
        </div>
    );
}
