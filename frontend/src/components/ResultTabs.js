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
          <TabList className="rounded-2 pt-5 text-secondary">
            {tabList.map(tab =>
                <Tab
                  onClick={changeSearchType(tab.title)}
                  key={tab.title}
                  selectedClassName=" rounded-0 primary-color-alt"
                >
                  {counts[tab.title] &&
                   (<div selected={tab.title === searchType} className="d-flex">
                      <div className="bubble-container">
                        <div className={"" + (tab.title === searchType ? 'bg-selected rounded-circle bubble-alt' : ' primary-bg rounded-circle bubble-alt')}>
                          <span className="text-light-tab">{formatter.format(counts[tab.title])}</span>
                        </div>
                      </div>
                      <div className={"fw-bold text-capitalize" + (tab.title === searchType ? ' bubble-textarea-selected' : ' bubble-textarea-alt')}>
                        {tab.tab_name}
                      </div>
                  </div>
                   )}

                </Tab>
            )}
          </TabList>
        </Tabs>
    </div>
  );
}
