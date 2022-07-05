DEFAULT_FACET_FIELDS = ['txt_knowsAbout', 'name', 'txt_knowsLanguage', 'txt_nationality', 'txt_jobTitle',
                        'txt_contributor', 'txt_keywords', 'txt_memberOf', 'txt_parentOrganization', 'id_provider',
                        'id_includedInDataCatalog', 'id_identifier', 'id', 'keys', 'type'
                        ]


class SolrQueryBuilder:

    def __init__(self, rows=10, facet_min_count=1, start=0,
                 query='*:*', sort='score desc, indexed_ts desc',
                 facet='true', flList=None):
        self.params = dict()
        self.params['q'] = query
        self.params['sort'] = sort
        self.params['rows'] = rows
        self.params['facet.mincount'] = facet_min_count
        self.params['start'] = start
        self.params["facet"] = facet
        if flList:
            self.params['fl'] = ','.join(flList)
        
    def add_facet_fields(self, facet_fields=None):
        self.params["facet.field"] = facet_fields if facet_fields is not None else DEFAULT_FACET_FIELDS


    formats = {
        'text': '+%(name)s:(%(value)s)',
        'the_geom': '+%(name)s:%(value)s',
        }

    def _fmt(self, name):
        return self.formats.get(name, '+%(name):"%(value)"')
    
    def add_fq(self, name, value):
        if "fq" not in self.params:
            self.params['fq'] = []
            
        self.params['fq'].append(self._fmt(name) % {'name': name, 'value':value})
        
