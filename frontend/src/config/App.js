import React from "react";
import { Route, BrowserRouter } from "react-router-dom";
import TypesCount from "../components/home/TypesCount";
import Results from "../components/search-hub/Results";
import { AppContainer } from "../components/AppContainer";
import { Routes } from "react-router";
import MapContainer from "components/map-view/MapContainer";
import RecordMetadata from "components/search-hub/RecordMetadata";
import OfferForm from "components/matchmaking/offer/OfferForm";
import DemandForm from "components/matchmaking/demand/DemandForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="results/:searchType" element={<Results />} />
        <Route path="results/" element={<Results />} />
        <Route path="/map-viewer" element={<MapContainer isHome={false} />} />
        <Route
          path="/map-viewer/:searchType"
          element={<MapContainer isHome={false} />}
        />
        <Route path="/record/:jsonld" element={<RecordMetadata />} />
        <Route path="/matchmaking/demand" element={<DemandForm />} />
        <Route path="/matchmaking/offer" element={<OfferForm />} />
        <Route path="/" element={<TypesCount />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
