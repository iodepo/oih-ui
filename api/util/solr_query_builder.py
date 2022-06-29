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

    def add_fq(self, name, value):
        if "fq" not in self.params:
            self.params['fq'] = []
        if name == 'text':
            self.params['fq'].append(f'+{name}:({value})')
        else:
            self.params['fq'].append(f'+{name}:"{value}"')
