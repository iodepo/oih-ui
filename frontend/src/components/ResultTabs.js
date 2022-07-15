import "react-tabs/style/react-tabs.css";
import { Tab, Tabs, TabList } from "react-tabs";

export default function ResultTabs({
  tabList,
  setSearchType,
  searchType,
  clearFacetQuery,
  resetDefaultSearchUrl, setPageCount, setItemOffset

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
      resetDefaultSearchUrl(event.target.id);
    }
    // const active_page = document.getElementsByClassName('page-item active')
    // console.log(active_page[0])
    // const paginiation = document.getElementsByClassName('pagination')
    // const paginiation = document.querySelector('.pagination')
    // const child1 = paginiation.querySelector('li')
    // console.log(child1)
    // console.log(paginiation)
    // console.log('pagination for...')
    // for (const i of paginiation) {
    //     console.log('iii')
    //     console.log(i)
    // }
    // Update bubbone on region!!!
    // var ul = document.getElementById("foo");
    // var items = ul.getElementsByTagName("li");
    const div = document.getElementById('resultsPaginate')
    console.log(div.children[0].children)
    console.log('div.children[0].children[1]')
    const li = div.children[0].children[1]
    li.class = 'page-item active'
    console.log(li)
    console.log(div.children[0].children[1].children[0])
    const a = div.children[0].children[1].children[0]
    // a.className = ''
    // div.children[0].children[0].className = 'blah'

    for (const o of li){
        console.log(o)
    }
    // <a rel="canonical" role="button" class="page-link" tabindex="-1" aria-label="Page 1 is your current page" aria-current="page">1</a>
    // <a rel="next" role="button" class="page-link" tabindex="0" aria-label="Page 2">2</a>
    // <a role="button" class="page-link" tabindex="0" aria-label="Page 3">3</a>
    // active_page[0].className = 'page-item'
    // active_page.className = ''
    // get paginatino
    //    get where calue == 1
    //    set it that
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
