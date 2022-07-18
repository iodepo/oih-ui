import "react-tabs/style/react-tabs.css";
import { Tab, Tabs, TabList } from "react-tabs";

export default function ResultTabs({
  tabList,
  setSearchType,
  searchType,
  clearFacetQuery,
  resetDefaultSearchUrl,
  setPageCount,
  setItemOffset,
  setShowMap
}) {
  function changeSearchType(event) {
    clearFacetQuery();
    setPageCount(0)
    setItemOffset(0)
    if (event.target.className === "tabSpan") {
      setSearchType(event.target.id);
      resetDefaultSearchUrl(event.target.id);
    } else {
      setSearchType(event.target.children[0].id);
      resetDefaultSearchUrl(event.target.children[0].id);
    }
    let tabClicked = '';
    if (event.target.nodeName === 'SPAN') {
      tabClicked = event.target.id
    } else {
      tabClicked = event.target.children[0].id
    }
    if (tabClicked === 'SpatialData') {
      setShowMap(true)
    } else {
      setShowMap(false)
    }
  }

  function selectedTabIndex() {
    for (const tab in tabList) {
      if (tabList[tab].title == searchType) {
        return Number(tab);
      }
    }
  }

  return (
    <Tabs selectedIndex={selectedTabIndex()}>
      <TabList className="bg-light rounded-2 pt-2 border-bottom border-primary">
        {tabList.map((tab, i) => {
          return (
            <Tab
              onClick={changeSearchType}
              key={tab.title}
              selectedClassName="bg-light border border-primary border-bottom-0 rounded-0"
            >
              <span
                selected={tab.title === searchType}
                className="tabSpan"
                id={tab.title}
              >
                {tab.tab_name}
              </span>
            </Tab>
          );
        })}
      </TabList>
    </Tabs>
  );
}
