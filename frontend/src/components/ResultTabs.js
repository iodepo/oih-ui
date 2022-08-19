import "react-tabs/style/react-tabs.css";
import { Tab, Tabs, TabList } from "react-tabs";

const formatter = Intl.NumberFormat([], { "notation": "compact" })

export default function ResultTabs({
  tabList, counts,
  searchType,
  resetDefaultSearchUrl,
  clearFacetQuery

}) {
  const changeSearchType = type => event => {
    clearFacetQuery()
    resetDefaultSearchUrl(type)
  };

  return (
    <div id='ResTabs' >
        <Tabs selectedIndex={tabList.findIndex(tab => tab.title === searchType)}>
          <TabList className="rounded-2 pt-5 border-bottom text-uppercase text-secondary">
            {tabList.map(tab =>
                <Tab
                  onClick={changeSearchType(tab.title)}
                  key={tab.title}
                  selectedClassName=" rounded-0 primary-color-alt"
                >
                  <div selected={tab.title === searchType} className="d-flex">
                    <div className="primary-bg rounded-circle bubble-alt">{formatter.format(counts[tab.title])}</div>

                    {counts[tab.title] &&
                    <div className="text-light fw-bold bubble-textarea-alt text-capitalize"> {tab.tab_name} </div>}
                  </div>
                </Tab>
            )}
          </TabList>
        </Tabs>
    </div>
  );
}
