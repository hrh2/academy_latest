// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
// import ProgramCard from "../Cards/ProgramCard.jsx";
// import TaskCard from "../Cards/TaskCard.jsx";
// import ClassCard from "../Cards/ClassCard.jsx";
// import LinkComponent from "../Badge/LinkComponent.jsx";
import {ClassCard, CourseCard, ProgramCard, TaskCard, TopicCard} from "@/components/Cards.jsx";
import {Button, Spinner, Typography} from "@material-tailwind/react";
import {useNotification} from "@/context/NotificationContext.jsx";
import {fetchData, returnToken} from "@/utils/index.js";
import {servers} from "@/configs/index.js";
import LinkComponent from "@/components/Tags.jsx";

// eslint-disable-next-line react/prop-types
export default function SearchComponent({ searchKeyword, topics, courses, links, programs, tasks,classes ,onClose}) {
    const { showNotification } = useNotification();
    const [fetchedTopics, setFetchedTopics] = useState([]);
    const [fetchedCourses, setFetchedCourses] = useState([]);
    const [fetchedPrograms, setFetchedPrograms] = useState([]);
    const [fetchedTasks, setFetchedTasks] = useState([]);
    const [fetchedLinks, setFetchedLinks] = useState([]);
    const [fetchedClasses, setFetchedClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!topics || !courses || !links || !programs || !tasks ||!classes) {
            // eslint-disable-next-line react/prop-types
            if (searchKeyword.length > 2) fetchResults();
        }
        console.log(searchKeyword);
    }, [searchKeyword]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const result = await fetchData(`${servers.main_api}/auth-search?q=${searchKeyword}`, returnToken());
            if (result.error) {
                showNotification(result.error, "error");
            } else {
                setFetchedCourses(result.data.courses || []);
                setFetchedTopics(result.data.topics || []);
                setFetchedPrograms(result.data.programs || []);
                setFetchedTasks(result.data.tasks || []);
                setFetchedLinks(result.data.links || []);
                setFetchedClasses(result.data.classes || []);
            }
        } catch (error) {
            showNotification("Failed to fetch results.","error");
        } finally {
            setLoading(false);
        }
    };

    const getFilteredResults = () => {
  const allItems = [
    ...fetchedCourses.map((course) => ({ type: 'course', data: course })),
    ...fetchedTopics.map((topic) => ({ type: 'topic', data: topic })),
    ...fetchedPrograms.map((program) => ({ type: 'program', data: program })),
    ...fetchedTasks.map((task) => ({ type: 'task', data: task })),
    ...fetchedLinks.map((link) => ({ type: 'link', data: link })),
    ...fetchedClasses.map((cls) => ({ type: 'class', data: cls })),
  ];

  return allItems.filter((item) => {
    // Skip if item.data is null or undefined
    if (!item.data || typeof item.data !== 'object') {
      return false;
    }

    const values = Object.values(item.data).flatMap((value) => {
      // Handle nested objects safely
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return Object.values(value).filter((v) => v != null); // Filter out null/undefined values
      }
      return value != null ? [value] : []; // Skip null/undefined values
    });

    return values.some((value) =>
      // Ensure value is a string or can be converted to a string
        // eslint-disable-next-line react/prop-types
      value != null && value.toString().toLowerCase().includes(searchKeyword.toLowerCase())
    );
  });
};
    const filteredResults = getFilteredResults();

    return (
        <div
  className="fixed top-[10vh] left-0 w-full h-[90%] z-[999] overflow-auto bg-black/90 backdrop-blur-sm p-4"
>
<Button variant={"outlined"} color={"white"}
  onClick={onClose}
  className="absolute rounded-full top-4 right-4  text-2xl font-bold "
  aria-label="Close Search"
>
  &times;
</Button>
            {/* eslint-disable-next-line react/prop-types */}
            {!searchKeyword ? (
                <p className="text-center py-4 text-gray-800">
                    Please enter keyword you remember to start searching.
                    <br/>
                    You Can search for a course , a class , any question, link ,program or topic
                </p>
                // eslint-disable-next-line react/prop-types
            ) : searchKeyword.length < 3 ? (
                <div className="text-center py-4 text-gray-800">
                    Please enter at least 3 characters to search.
                </div>
            ) : loading ? (
                <div className="flex justify-center items-center h-[60%] w-full">
                    <Spinner color="#166534" size={50}/>
                </div>
            ) : filteredResults.length === 0 ? (
                <div className="text-center py-4 text-gray-800">
                    No results found for &#34;{searchKeyword}&#34;.
                </div>
            ) : (
                <>
                    <div className="text-start flex justify-between container mx-auto py-4 text-gray-800">
                        <Typography variant={"h6"} color={"white"}>
                            Search Results :
                        </Typography>
                    </div>
                <div className={`mx-auto  container grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 px-2  gap-4 pb-4`}>
                    {filteredResults.slice(0, 8).map((item, index) => {
                        switch (item.type) {
                            case 'topic':
                                return <div><TopicCard key={index} topic={item.data}/></div>;
                            case 'course':
                                return <CourseCard key={index} course={item.data}/>;
                            case 'program':
                                return <ProgramCard key={index} program={item.data}/>;
                            case 'task':
                                return <TaskCard key={index} task={item.data}/>;
                            case 'link':
                                return <div><LinkComponent key={index} link={item.data}/></div>;
                            case 'class':
                                return <div><ClassCard key={index} cls={item.data}/></div>;
                            default:
                                return null;
                        }
                    })}
                </div>
            </>
            )}
        </div>
    );
}
