DEFAULT_FACET_FIELDS = ['txt_knowsAbout', 'name', 'txt_knowsLanguage', 'txt_nationality', 'txt_jobTitle',
                        'txt_contributor', 'txt_keywords', 'txt_memberOf', 'txt_parentOrganization', 'id_provider',
                        'has_geom',
                        'id_includedInDataCatalog', 'id_identifier', 'id', 'keys', 'type'
                        ]


class SolrQueryBuilder:

    def __init__(self, rows=10, facet_min_count=1, start=0,
                 query='*:*', sort='score desc, indexed_ts desc',
                 facet='true', flList=None):
        self.params = {
            'q.op':'AND',  # default op to AND  # applies to dismax and standard query parser
        };
        if not '*' in query:
            # default query parser
            self.params.update({
                'defType':'edismax',
                'qf':'name^4 txt_keywords^2 text',
            })
        self.params['q'] = query
        self.params['sort'] = sort
        self.params['rows'] = rows
        self.params['facet.mincount'] = facet_min_count
        self.params['start'] = start
        self.params["facet"] = facet
        if flList:
            self.params['fl'] = ','.join(flList)

    def add_facet_fields(self, facet_fields=None):
        self.params["facet.field"] = facet_fields if (facet_fields is not None) else DEFAULT_FACET_FIELDS

    # These are formats to convert the individual field queries into the representation sent to the solr instance.
    # There are basically two formats here -- text/type include parens () around the value, and the others don't.
    formats = {
        'text': '+%(name)s:(%(value)s)',
        'type': '+%(name)s:(%(value)s)',
        'the_geom': '+%(name)s:%(value)s',
        'n_startYear':'+%(name)s:%(value)s',
        'n_endYear':'+%(name)s:%(value)s',
        }

    def _fmt(self, name):
        return self.formats.get(name, '+%(name)s:"%(value)s"')

    def add_fq(self, name, value):
        if "fq" not in self.params:
            self.params['fq'] = []

        self.params['fq'].append(self._fmt(name) % {'name': name, 'value':value})

    def add_facet_interval(self, interval_fields, facet_intervals):
        self.params["facet.interval"] = interval_fields
        self.params["facet.interval.set"] = facet_intervals
        self.params["f.n_startYear.facet.limit"] = 30
        self.params["f.n_endYear.facet.limit"] = 30
