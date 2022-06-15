import 'react-tabs/style/react-tabs.css';
import {Tab, Tabs, TabList} from 'react-tabs';

export default function ResultTabs({tabList, setSearchType}) {
    // console.log('onClick')
    function changeSearchType(event){
        setSearchType(event.target.id);
    }

    return (
        // <Tabs id="controlled-tabs" selectedTabClassName="bg-blue">
        <Tabs id="controlled-tabs" >
            <TabList>
                {
                    tabList.map((tab, i) => {
                            return (
                                <Tab key={tab.title}>
                                    <span onClick={changeSearchType} id={tab.title}>{tab.tab_name}</span>
                                </Tab>
                            )
                        }
                    )
                }
            </TabList>
        </Tabs>
    )
}