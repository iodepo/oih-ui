const Dataset = [
  "name",
  { key: "txt_sameAs", type: ["list", "truncated", "link"] },
  { key: "txt_license", type: "list", label: "License" },
  { key: "txt_citation", type: "list", label: "Related Works" },
  "txt_version",
  { key: "txt_keywords", type: "keywords" },
  {
    key: "id_includedInDataCatalog",
    type: ["list", "link"],
    label: "Data Catalog",
  },
  "txt_temporalCoverage",
  { key: "txt_distribution", type: ["list", "link"] },
  { key: "txt_region", type: "list" },
  { key: "id_provider", type: ["list", "link"], label: "Provider ID" },
  { key: "txt_provider", type: "list" },
];

const ResearchProject = [
  {
    id: "alternate_name",
    key: "txt_identifier",
    label: "Alternate Name",
  },
  { key: "txt_identifier", label: "Identifier" },
  { key: "txt_memberOf", type: "list", label: "Member Of" },
  { key: "txt_parentOrganization", type: "link", label: "Parent Org" },
  { key: "txt_knowsAbout", type: "list" },
  { key: "id_provider", type: ["list", "link"], label: "Provider ID" },
  { key: "txt_provider", type: "list" },
];

const Vehicle = [
  { key: "txt_additionalProperty", type: "list" },
  "txt_category",
  { key: "txt_vehicleConfiguration", label: "Configuration" },
  { key: "txt_vehicleSpecialUsage", label: "Special Usage" },
];

const Person = [
  {
    key: "txt_provider",
    type: "circle",
  },
  "txt_jobTitle",
  { key: "txt_knowsAbout", type: "list" },
  { key: "txt_knowsLanguage", type: "list" },
  { key: "txt_nationality", type: "list" },
];

const Organization = [
  {
    key: "txt_provider",
    type: "circle",
  },
  "txt_jobTitle",
  { key: "txt_knowsAbout", type: "list" },
  { key: "txt_knowsLanguage", type: "list" },
  { key: "txt_nationality", type: "list" },
];

const CreativeWork = [
  {
    key: "txt_provider",
    type: "circle",
  },
  {
    key: "id",
    type: ["truncated", "link"],
  },

  {
    key: "txt_author",
    type: "list",
    label: "Author(s)",
  },
  "txt_identifier",
  {
    key: "txt_keywords",
    type: "keywords",
  },
];

const Course = [
  {
    key: "txt_hasCourseInstance",
    type: "list",
    label: "Course Instance",
  },
  "txt_location",
];

export {
  CreativeWork,
  Course,
  Dataset,
  Organization,
  Person,
  ResearchProject,
  Vehicle,
};
