import React, {useState} from 'react';
import {Route, BrowserRouter, useLocation} from 'react-router-dom';

import Search from "../components/Search";
import TypesCount from "../components/TypesCount";
import Results from "../components/Results";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { AppContainer } from "../components/AppContainer";
import {Routes} from "react-router";
import ReactGA from "react-ga4";

ReactGA.initialize([
    {
        trackingId: "G-QJ5XJMZFXW",
    },
]);

function App() {
    return (
        <BrowserRouter>
          <AppContainer>
            <Header />
            <Search />
            <Routes>
              <Route path="results/:searchType" element={<Results />}/>
              <Route path="results/" element={<Results />}/>
              <Route path="/" element={<TypesCount />}>
              </Route>
            </Routes>
            <Footer />
          </AppContainer>
        </BrowserRouter>
    );
}

export default App;
