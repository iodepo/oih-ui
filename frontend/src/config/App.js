import React, {useState} from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Search from "../components/Search";
import TypesCount from "../components/TypesCount";
import Results from "../components/Results";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {Routes} from "react-router";


function App() {
    return (
    <div className="App">
        <BrowserRouter>
            <Header />
            <Search />
            <Routes>
                  <Route path="results/:searchType" element={<Results />}/>
                  <Route path="results/" element={<Results />}/>
                  <Route path="/" element={<TypesCount />}>
              </Route>
            </Routes>
      </BrowserRouter>
        <Footer />
    </div>
    );
}

export default App;
