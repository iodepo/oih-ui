DEFAULT_FACET_FIELDS = ['txt_knowsAbout', 'name', 'txt_knowsLanguage', 'txt_nationality', 'txt_jobTitle',
                        'txt_contributor', 'txt_keywords', 'txt_memberOf', 'txt_parentOrganization', 'id_provider',
                        'id_includedInDataCatalog', 'id_identifier', 'id', 'keys', 'type'
                        ]


class SolrQueryBuilder:

    def __init__(self, rows=10, facet_min_count=1, start=0, query='*:*', sort='score desc, indexed_ts desc', facet='true'):
        self.params = dict()
        self.params['q'] = query
        self.params['sort'] = sort
        self.params['rows'] = rows
        self.params['facet.mincount'] = facet_min_count
        self.params['start'] = start
        self.params["facet"] = facet

    def add_facet_fields(self, facet_fields=None):
        self.params["facet.field"] = facet_fields if facet_fields else DEFAULT_FACET_FIELDS


class SolarSearchQueryBuilder(SolrQueryBuilder):

    def __init__(self, search):
        super().__init__()
        self.search = search

    def _build_fq(self):
        fq = []
        if self.search.text:
            fq.append(f"+text:({self.search.text})")
        if self.search.type:
            fq.append(f'+type:{self.search.type}')
        return fq

    def add_search_fq(self):
        self.params["fq"] = self._build_fq()
