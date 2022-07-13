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
    const [region, setRegion] = useState('GLOBAL');
    const [isDisplaySearch, setIsDisplaySearch] = useState(false);
    const [isLoadingFromSharableURL, setIsLoadingFromSharableURL] = useState(true);
    const [searchType, setSearchType] = useState('CreativeWork');

    return (
    <div className="App">
        <BrowserRouter>
            <Header />
            <Search setSearchText={setSearchText} isDisplaySearch={isDisplaySearch}
                         setIsDisplaySearch={setIsDisplaySearch} region={region} setRegion={setRegion}
                    setIsLoadingFromSharableURL={setIsLoadingFromSharableURL} />
            <Routes>
                  <Route path="results/*" element={
                      <Results searchText={searchText} setSearchText={setSearchText} region={region} setRegion={setRegion}
                               isLoadingFromSharableURL={isLoadingFromSharableURL} searchType={searchType}
                               setSearchType={setSearchType}/>} />
                  <Route path="*" element={
                      <TypesCount setIsLoadingFromSharableURL={setIsLoadingFromSharableURL} setSearchType={setSearchType}
                      setIsDisplaySearch={setIsDisplaySearch}/>
                  }>
              </Route>
            </Routes>
      </BrowserRouter>
        <Footer />
    </div>
    );
}

export default App;
