DEFAULT_FACET_FIELDS = ['txt_knowsAbout', 'name', 'txt_knowsLanguage', 'txt_nationality', 'txt_jobTitle',
                        'txt_contributor', 'txt_keywords', 'txt_memberOf', 'txt_parentOrganization', 'id_provider',
                        'id_includedInDataCatalog', 'id_identifier', 'id', 'keys', 'type'
                        ]


class SolrQueryBuilder:

    def __init__(self, search=None):
        self.search = search
        self._set_basic_parmas()

    def _set_basic_parmas(self):
        self.params = {
            'facet.limit': 20,
            'q': '*:*',
            "start": "0",
            "sort": "score desc, indexed_ts desc",
            "facet.mincount": "1",
            "rows": "10",
            "facet": "true",
        }

    def add_facet_fields(self, facet_fields=None):
        self.params["facet.field"] = facet_fields if facet_fields else DEFAULT_FACET_FIELDS

    def add_search_fq(self):
        self.params["fq"] = self.build_fq()

    def build_fq(self):
        fq = []
        if self.search.text:
            fq.append(f"+text:({self.search.text})")
        if self.search.type:
            fq.append(f'+type:{self.search.type}')
        return fq

