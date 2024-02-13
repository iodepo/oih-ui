import React from "react";
import { Route, BrowserRouter } from "react-router-dom";
import TypesCount from "../components/home/TypesCount";
import Results from "../components/search-hub/Results";
import { AppContainer } from "../components/AppContainer";
import { Routes } from "react-router";
import MapContainer from "components/map-view/MapContainer";

function App() {
  return (
    <BrowserRouter>
      <AppContainer>
        <Routes>
          <Route path="results/:searchType" element={<Results />} />
          <Route path="results/" element={<Results />} />
          <Route path="/map-viewer" element={<MapContainer isHome={false} />} />
          <Route path="/" element={<TypesCount />}></Route>
        </Routes>
      </AppContainer>
    </BrowserRouter>
  );
}

export default App;
