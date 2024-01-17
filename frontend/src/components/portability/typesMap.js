import Result from "../results/Result";

import CreativeWork from "./types/CreativeWork.json";
import Person from "./types/Person.json";
import Organization from "./types/Organization.json";
import Course from "./types/Course.json";
import Vehicle from "./types/Vehicle.json";
import Dataset from "./types/Dataset.json";
import ResearchProject from "./types/ResearchProject.json";

const TypesMap = {
  CreativeWork: {
    Component: Result(CreativeWork),
  },
  Person: {
    Component: Result(Person),
  },
  Organization: {
    Component: Result(Organization),
  },
  Course: {
    Component: Result(Course),
  },
  Vehicle: {
    Component: Result(Vehicle),
  },
  Dataset: {
    Component: Result(Dataset),
  },
  ResearchProject: {
    Component: Result(ResearchProject),
  },
};

export default TypesMap;
