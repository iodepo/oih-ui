import React, {useState} from 'react';

import Search from "../components/Search";
import '../App.css';
import TypesCount from "../components/TypesCount";
import Results from "../components/Results";
import Footer from "../components/Footer";
import Header from "../components/Header";

function App() {
    const [searchText, setSearchText] = useState('');
    const [isDisplaySearch, setIsDisplaySearch] = useState(false);

    return (
    <div className="App">
        <Header />
        <Search  setSearchText={setSearchText} isDisplaySearch={isDisplaySearch} setIsDisplaySearch={setIsDisplaySearch}/>
        {!isDisplaySearch && <TypesCount/>}
        {isDisplaySearch && <Results searchText={searchText}/>}
        {/* Map */}
        <Footer />
    </div>
    );
}

export default App;
