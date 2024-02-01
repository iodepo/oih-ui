import { extractInfo } from "components/search-hub/Export";
import ResultDetails from "../components/results/ResultDetails";

import {
  CreativeWork,
  Person,
  Organization,
  Course,
  Vehicle,
  Dataset,
  ResearchProject,
} from "./types/typesResult";

const TypesMap = {
  CreativeWork: {
    Component: ResultDetails(CreativeWork),
  },
  Person: {
    Component: ResultDetails(Person),
  },
  Organization: {
    Component: ResultDetails(Organization),
  },
  Course: {
    Component: ResultDetails(Course),
  },
  Vehicle: {
    Component: ResultDetails(Vehicle),
  },
  Dataset: {
    Component: ResultDetails(Dataset),
  },
  ResearchProject: {
    Component: ResultDetails(ResearchProject),
  },
};

const createObjectExport = (docs, searchType) => {
  switch (searchType) {
    case "Person":
      return {
        data: docs.map((d) => {
          return extractInfo(Person, d, searchType);
        }),
        title: "Experts",
      };
    case "CreativeWork":
      return {
        data: docs.map((d) => {
          return extractInfo(CreativeWork, d, searchType);
        }),
        title: "Documents",
      };

    case "Course":
      return {
        data: docs.map((d) => {
          return extractInfo(Course, d, searchType);
        }),
        title: "Training",
      };
    case "SpatialData":
    case "Dataset":
      return {
        data: docs.map((d) => {
          return extractInfo(Dataset, d, searchType);
        }),
        title: "Dataset",
      };
    case "Vehicle":
      return {
        data: docs.map((d) => {
          return extractInfo(Vehicle, d, searchType);
        }),
        title: "Vessels",
      };
    case "ResearchProject":
      return {
        data: docs.map((d) => {
          return extractInfo(ResearchProject, d, searchType);
        }),
        title: "Research Project",
      };
    case "Organization":
      return {
        data: docs.map((d) => {
          return extractInfo(Organization, d, searchType);
        }),
        title: "Institutions",
      };
  }
};

export { TypesMap, createObjectExport };
