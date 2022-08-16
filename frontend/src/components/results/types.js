import Result from './Result'

export default {
    CreativeWork: {
        Component: Result([
            {
                key: 'id',
                type: ['truncated', 'link']
            },
            {
                key: 'txt_author',
                type: 'list',
                label: 'Author(s)'
            },
            'txt_identifier',
            {
                key: 'txt_keywords',
                type: 'keywords'
            },
            {
                key: 'txt_contributor',
                type: 'list',
                label: 'Contributor(s)'
            }
        ]),
    },
    Person: {
        Component: Result([
            'txt_jobTitle',
            {
                key: 'txt_knowsAbout',
                type: 'list'
            },
            {
                key: 'txt_knowsLanguage',
                type: 'list'
            },
            'txt_nationality'
        ]),
    },
    Organization: {
        Component: Result([
            {
                key: 'txt_url',
                type: ['link', 'truncated'],
                label: 'URL'
            },
            'txt_telephone',
            {
                key: 'txt_memberOf',
                type: 'list'
            }
        ]),
    },
    Course: {
        Component: Result([
            {
                key: 'txt_hasCourseInstance',
                type: 'list',
                label: 'Course Instance'
            },
            'txt_location'
        ]),
    },
    Vehicle: {
        Component: Result([
            {
                key: 'txt_additionalProperty',
                type: 'list',
            },
            'txt_category',
            {
                key: 'txt_vehicleConfiguration',
                label: 'Configuration'
            },
            {
                key: 'txt_vehicleSpecialUsage',
                label: 'Special Usage'
            }
        ]),
    },
    Dataset: {
        Component: Result([
            'name',
            {
                key: 'txt_sameAs',
                type: ["list", "truncated", "link"]
            },
            'txt_license',
            'txt_citation',
            'txt_version',
            {
                key: 'txt_keywords',
                type: 'keywords'
            },
            {
                key: 'id_includedInDataCatalog',
                type: 'link',
                label: 'Data Catalog'
            },
            'txt_temporalCoverage',
            {
                key: 'txt_distribution',
                type: 'link'
            },
            {
                key: 'txt_region',
                type: 'list'
            },
            {
                key: 'id_provider',
                type: ['list', 'link'],
                label: 'Provider ID'
            },
            {
                key: 'txt_provider',
                type: 'list'
            }
        ]),
    },
    ResearchProject: {
        Component: Result([
            {
                id: 'alternate_name',
                key: 'txt_identifier',
                label: 'Alternate Name',
            },
            {
                key: 'txt_identifier',
                label: 'Identifier'
            },
            {
                key: 'txt_memberOf',
                type: 'list',
                label: 'Member Of'
            },
            {
                key: 'txt_parentOrganization',
                type: 'link',
                label: 'Parent Org'
            }
        ]),
    }
};