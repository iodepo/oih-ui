import '../App.css';

import React, {useState} from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Search from "../components/Search";
import TypesCount from "../components/TypesCount";
import Results from "../components/Results";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {Routes} from "react-router";


function App() {
    const [searchText, setSearchText] = useState('');
    const [isDisplaySearch, setIsDisplaySearch] = useState(false);

    return (
    <div className="App">
        <BrowserRouter>
            <Header />
            <Search setSearchText={setSearchText} isDisplaySearch={isDisplaySearch}
                         setIsDisplaySearch={setIsDisplaySearch} />
            <Routes>
                  <Route path="results/*" element={
                      <Results searchText={searchText} setSearchText={setSearchText}/>} />
                  <Route path="*" element={<TypesCount />} >
              </Route>
            </Routes>
      </BrowserRouter>
        <Footer />
    </div>
    );
}

export default App;
