import "react-tabs/style/react-tabs.css";
import { Tab, Tabs, TabList } from "react-tabs";

export default function ResultTabs({
  tabList,
  searchType,
  resetDefaultSearchUrl

}) {
  const changeSearchType = type => event => resetDefaultSearchUrl(type);

  return (
    <Tabs selectedIndex={tabList.findIndex(tab => tab.title === searchType)}>
      <TabList className="bg-light rounded-2 pt-2 border-bottom border-primary">
        {tabList.map(tab =>
            <Tab
              onClick={changeSearchType(tab.title)}
              key={tab.title}
              selectedClassName="bg-light border border-primary border-bottom-0 rounded-0"
            >
              <span selected={tab.title === searchType}>
                {tab.tab_name}
              </span>
            </Tab>
        )}
      </TabList>
    </Tabs>
  );
}
