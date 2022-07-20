import "react-tabs/style/react-tabs.css";
import { Tab, Tabs, TabList } from "react-tabs";

const formatter = Intl.NumberFormat([], { "notation": "compact" })

export default function ResultTabs({
  tabList, counts,
  searchType,
  resetDefaultSearchUrl

}) {
  const changeSearchType = type => event => resetDefaultSearchUrl(type);

  return (
    <div id='ResTabs' >
        <Tabs selectedIndex={tabList.findIndex(tab => tab.title === searchType)}>
          <TabList className="bg-light rounded-2 pt-2 border-bottom border-primary">
            {tabList.map(tab =>
                <Tab
                  onClick={changeSearchType(tab.title)}
                  key={tab.title}
                  selectedClassName="bg-light border border-primary border-bottom-0 rounded-0"
                >
                  <span selected={tab.title === searchType}>
                    <span className="h6"> {tab.tab_name} </span> {counts[tab.title] && <span className="badge bg-secondary">{formatter.format(counts[tab.title])}</span>}
                  </span>
                </Tab>
            )}
          </TabList>
        </Tabs>
    </div>
  );
}
