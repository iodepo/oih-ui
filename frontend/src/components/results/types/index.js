import Result from '../Result'

import CreativeWork from './CreativeWork.json';
import Person from './Person.json';
import Organization from './Organization.json'
import Course from './Course.json';
import Vehicle from './Vehicle.json';
import Dataset from './Dataset.json';
import ResearchProject from './ResearchProject.json';

export default {
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
    }
};