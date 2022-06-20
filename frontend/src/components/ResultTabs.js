import 'react-tabs/style/react-tabs.css';
import {Tab, Tabs, TabList} from 'react-tabs';

export default function ResultTabs({tabList, setSearchType}) {

    function changeSearchType(event){
        // console.log(event.target)
        // console.log(event.target.className)
        if (event.target.className === 'tabSpan') {
            setSearchType(event.target.id);
        } else {
            setSearchType(event.target.children[0].id);
        }
    }

    return (
        // <Tabs id="controlled-tabs" selectedTabClassName="bg-blue">
        <Tabs id="controlled-tabs" >
            <TabList>
                {
                    tabList.map((tab, i) => {
                            return (
                                <Tab onClick={changeSearchType} key={tab.title}>
                                    <span className='tabSpan' id={tab.title}>{tab.tab_name}</span>
                                </Tab>
                            )
                        }
                    )
                }
            </TabList>
        </Tabs>
    )
}