import 'react-tabs/style/react-tabs.css';
import {Tab, Tabs, TabList} from 'react-tabs';


export default function ResultTabs({tabList, setSearchType, searchType, clearFacetQuery, resetDefaultSearchUrl}) {

    function changeSearchType(event){
        clearFacetQuery()
        if (event.target.className === 'tabSpan') {
            setSearchType(event.target.id);
            resetDefaultSearchUrl(event.target.id)
        } else {
            setSearchType(event.target.children[0].id);
            resetDefaultSearchUrl(event.target.id)
        }
    }

    function selectedTabIndex() {
        for (const tab in tabList) {
            if (tabList[tab].title == searchType) {
                return Number(tab)
            }
        }
    }

    return (
        <Tabs id="controlled-tabs" selectedIndex={selectedTabIndex()}>
            <TabList>
                {
                    tabList.map((tab, i) => {
                        return (
                            <Tab onClick={changeSearchType} key={tab.title}>
                                <span selected={tab.title === searchType} className='tabSpan' id={tab.title}>{tab.tab_name}</span>
                            </Tab>
                        )
                    })
                }
            </TabList>
        </Tabs>
    )
}