import React, { useState } from 'react';
import {MdAutoAwesome, MdTopic} from "react-icons/md";
import {Button, Typography} from "@material-tailwind/react";
import {IconLink, LinksList, ModernClassesTags} from "@/components/Tags.jsx";
import {BsBookmarkPlusFill} from "react-icons/bs";
import {MdBookmarkAdded} from "react-icons/md";
import {fetchData, returnToken} from "@/utils/index.js";
import {servers} from "@/configs/index.js";
import {useNotification} from "@/context/NotificationContext.jsx";
import {CgArrowsExpandUpRight} from "react-icons/cg";
import {MdCheckCircle} from "react-icons/md";
import {LuMessageCirclePlus} from "react-icons/lu";
import {FaEye, FaFileCode} from "react-icons/fa";
import { IoExpand } from "react-icons/io5";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { css } from "@codemirror/lang-css";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import Markdown from "@/components/Markdown.jsx";

export const ModernSummaryCard = ({ title, value, icon: Icon, gradient, link }) => {
    return (
            <div className="relative bg-white backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-gray-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-500/10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
                        <Icon className="text-2xl text-black" />
                    </div>
                    <div className="text-right">
                        <Typography >{value}</Typography>
                        <Typography >{title}</Typography>
                    </div>
                </div>
                <a href={link}
                   className="inline-flex items-center text-blue-gray-900 hover:text-blue-gray-200 text-sm font-medium transition-colors duration-200">
                    View Details
                    <MdAutoAwesome className="ml-1 text-xs" />
                </a>
            </div>
    );
};


export function ModernListTopics({ topics }) {
    return (
        <div className="space-y-3">
            {/* eslint-disable-next-line react/prop-types */}
            {topics.length > 0 ? topics.map((topic, index) => (
                <div key={topic.id} className="group relative">
                    <div className="flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30 hover:border-gray-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20">
                        <div className="flex-shrink-0">
                            <Button  variant="gradient" className="aspect-square w-2 rounded-full flex items-center justify-center shadow-lg">
                                {index + 1}
                            </Button>
                        </div>
                        <div className="flex-1">
                            <a href={`/courses/${topic.course}?topic=${topic.id}`} className=" line-clamp-2">
                                <Typography>
                                {topic?.title ?? `Topic ${index + 1}`}
                                </Typography>
                            </a>
                        </div>
                        <MdTopic className="text-blue-gray-200 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                </div>
            )) : (
                <div className="text-center py-8 text-slate-400">
                    <MdTopic className="mx-auto text-4xl mb-2 opacity-50" />
                    <Typography>No Topics Found</Typography>
                </div>
            )}
        </div>
    );
}


export  function Course({ course, isMore }) {
    return (
            <div
                className="max-w-sm h-full w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-200 dark:border-gray-300">
                <a href={`/courses/${course._id}`}>
                    <img className="rounded-t-lg w-full object-center object-cover max-h-[14rem]" src={course.image} alt="image"/>
                </a>
                <div className="p-5">
                    <a href={`/courses/${course._id}`}>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-black">{course.name}</h5>
                    </a>
                    <h6 className="mb-4 text-xl block font-sans font-semibold uppercase leading-relaxed tracking-normal text-pink-500 antialiased">{course.interest}</h6>
                    <div className={`pt-2`}>
                                {course?.usefulLinks.length > 0 && (
                                        <IconLink links={course?.usefulLinks}/>
                                )}
                    </div>
                </div>
            </div>
    );
}


// eslint-disable-next-line react/prop-types
export function CourseCard({ course }) {
    const { showNotification } = useNotification();
    const [isInterested, setIsInterested] = useState(course.haveIt||false);
    const [data,setData] = useState(course||null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle adding the course to interests
    const addToInterest = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetchData(`${servers.main_api}/courses/add-to-interest/${course._id}`, returnToken());
            if (result.error) {
                showNotification(result.error,"error");
                setError(result.error);
            } else {
                setIsInterested(true);
                setData(result.data.course)
            }
        } catch (error) {
            showNotification("Failed to fetch results.","error");
            setError(error.message||'An error occurred while adding to interests');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=" hover:scale-115 max-w-lg border rounded-lg shadow flex flex-col justify-between bg-white border-gray-300/5">
            <a href="#">
                <div className="rounded-t-lg h-[12rem] bg-cover bg-center" style={{ backgroundImage: `url(${course?.image})` }}> </div>
            </a>
                <a href="#">
                    <Typography variant={"h5"} className="pl-5 flex flex-col  font-bold tracking-tight">
                        {course?.name}
                    </Typography>
                </a>
                <Typography className="pl-5 font-bold ">{course?.interest}</Typography>
                {(course?.practice?.length > 1) ?
                    <p className="p-1.3 pl-5  font-normal text-gray-900">With a total of <span className="font-bold">{course?.practice?.length} Topics</span></p> :
                    <div className="p-1.3 pl-5  font-normal text-gray-800">
                        {/*{.split("....")[0]}*/}
                        <Markdown content ={(course?.description ? course.description.slice(0,150) + "..." : "No description available")}/>
                    </div>
                }
            {/* eslint-disable-next-line react/prop-types */}
                {(course?.type === "NORMAL" && course?.classes && course.classes.length > 0) &&
                    <div className="mb-3 font-normal pl-5  ">
                        Join the following class/es to get started
                        {/* eslint-disable-next-line react/prop-types */}
                        <ModernClassesTags isShort={true} tags={course?.classes ?? ["No any class"]} />
                    </div>
                }
                <div className={`flex justify-between pl-5 pb-5`}>
                    <a href={`courses/${course._id}`} className={`my-auto`}>
                        <Button variant={"gradient"} className="inline-flex items-center px-4 py-3 font-medium text-center  focus:ring-4 focus:outline-none ">
                        Enroll
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                        </Button>
                    </a>
                    {/* Add to Interest Button */}
                    {loading ?
                        <span className={`mr-6 text-green-700 font-medium`}>Adding...</span> :
                            (isInterested?
                                <MdBookmarkAdded size={32} className={`text-green-700 mr-6`} />:
                                (course?.type==='GLOBAL'&&<BsBookmarkPlusFill onClick={addToInterest} size={27}  className={`mr-6 cursor-pointer hover:text-green-800`}/>)
                            )}
                </div>
                {/* Error message */}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
    );
}



export function TopicCard({topic}) {
    return (
        <div  className="max-w-lg p-6 border rounded-lg shadow bg-white border-gray-300">
            <MdTopic size={28} />
            <a href="#">
                {/* eslint-disable-next-line react/prop-types */}
                    <a href={`/courses/${topic?.course}?topic=${topic?.id}`}>
                <h5 className="mb-2 text-2xl font-semibold tracking-tight text-black">
                    {/* eslint-disable-next-line react/prop-types */}
                        {(topic?.id) + ". " + topic?.title ?? `Topic ${topic?.id}`}
                </h5>
                    </a>
            </a>
            <p className="mb-3 font-normal text-gray-800">
                {/* eslint-disable-next-line react/prop-types */}
                <Markdown content={topic.description.slice(0,100)+"..."}/>
            </p>
            {/* eslint-disable-next-line react/prop-types */}
            <a href={`/courses/${topic?.course}?topic=${topic?.id}`} className="inline-flex font-medium items-center text-blue-600 hover:underline">
                Learn More
                <CgArrowsExpandUpRight size={18}/>
            </a>
        </div>

    );
}



// eslint-disable-next-line react/prop-types
export function ProgramCard({ program }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpandToggle = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            <div className="max-w-lg md:p-6 p-2  border h-full rounded-lg shadow bg-white border-gray-400">
                <FaFileCode size={28} />
                <p className="mb-3 font-normal text-gray-900 ">
                    {/* eslint-disable-next-line react/prop-types */}
                    {/*<TextFormatter text={program.description.slice(0, 60) + "..."} />*/}
                    <Markdown content={program.description.slice(0,60)+"..."}/>
                </p>
                <section className="relative font-mono">
                    {/* eslint-disable-next-line react/prop-types */}
                    {program.language !== 'text' && (

                        // eslint-disable-next-line react/prop-types
                        <CodeMirror value={program.content}
                            height="100px"
                            padding="30px"
                            extensions={[javascript(), python(), css(), cpp(), html()]}
                            className="mt-2 md:w-full w-[72vw]"
                            theme="dark"
                        />
                    )}
                    {/* eslint-disable-next-line react/prop-types */}
                    {program.language === 'text' && (
                        <div className={`p-4 border-[2px] rounded-md md:w-[80%] w-full`}>
                            {/* eslint-disable-next-line react/prop-types */}
                            {/*<TextFormatter text={program.content.slice(0, 60) + "..."} />*/}
                            <Markdown content = {program.content.slice(0,60)+"..."}/>
                        </div>
                    )}
                </section>
                <button
                    onClick={handleExpandToggle}
                    className="inline-flex gap-3 font-medium items-center text-blue-600 "
                >
                    Expand to see all details
                    <IoExpand size={18} />
                </button>
            </div>

            {isExpanded && (
                <div
                    className={`fixed top-0 left-0 w-full h-full p-4 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300 ${
                        isExpanded ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <div
                        className={`bg-gray-200 border-gray-300 p-6 rounded-lg max-w-4xl max-h-[90%] overflow-y-scroll w-full relative transform transition-transform duration-300 ${
                            isExpanded ? "scale-100" : "scale-90"
                        }`}
                    >
                        <button
                            onClick={handleExpandToggle}
                            className="sticky top-4 left-[90%] text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                        <h2 className="text-black mb-4 text-xl flex gap-4">
                            Full Details
                            <a className="inline-flex gap-1 items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700 hover:underline"
                               href={`/courses/${program?.practice?.course}?topic=${program?.practice?.id}&section=${program?._id}`} target="_blank">
                                full topic <FaEye/>
                            </a>
                        </h2>
                        <p className="mb-3 font-normal text-gray-900 ">
                            {/* eslint-disable-next-line react/prop-types */}
                            {/*<TextFormatter text={program.description}/>*/}
                            <Markdown content= {program.description}/>

                        </p>
                        {program.language !== 'text' ? (
                            <CodeMirror
                                value={program.content}
                                height="auto"
                                extensions={[javascript(), python(), css(), cpp(), html()]}
                                theme="dark"
                            />
                        ) : (
                                <Markdown content= {program.content}/>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}




// eslint-disable-next-line react/prop-types,no-unused-vars
export function TaskCard({task}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleExpandToggle = () => {
        setIsExpanded(!isExpanded);
    };
    return (
        <>
        <div className="max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                {/* eslint-disable-next-line react/prop-types */}
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-black">{task?.title}</h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                {/* eslint-disable-next-line react/prop-types */}
                {/*<TextFormatter text={task.description.slice(0,70)+"..."}/>*/}
                <Markdown content= {task.description.slice(0,70)+"..."}/>
            </p>
            <button onClick={handleExpandToggle}
               className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-center text-black rounded-lg focus:ring-4 focus:outline-none  bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">
                Details
                <FaEye  size={20} />
            </button>
        </div>
    {isExpanded && (
        <div
            className={`fixed top-0 left-0 w-full h-full p-4 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300 ${
                isExpanded ? "opacity-100" : "opacity-0"
            }`}
        >
            <div
                className={`bg-gray-800 border-gray-700 p-6 rounded-lg max-w-4xl w-full relative transform transition-transform duration-300 ${
                    isExpanded ? "scale-100" : "scale-90"
                }`}
            >
                <button
                    onClick={handleExpandToggle}
                    className="absolute top-4 right-4 text-black bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
                >
                    Cancel
                </button>
                <h2 className="text-black mb-4 text-xl flex gap-4 font-semibold">
                    Full Details of the Task
                </h2>
                <p className="mb-3 font-normal text-gray-500 dark:text-gray-200">
                    {/* eslint-disable-next-line react/prop-types */}
                    {/*<TextFormatter text={task.description}/>*/}
                    <Markdown content={task.description}/>
                </p>
                <LinksList links={task?.usefulLinks}/>
            </div>
        </div>
    )}
</>
)}


export  function ClassCard({ cls }) {
    const [activeTab, setActiveTab] = useState('about'); // Default to 'about' tab

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="w-full text-md bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <ul
                className="flex flex-wrap font-medium text-center text-gray-500 border-b border-gray-200 rounded-t-lg bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800"
                id={`defaultTab${cls?._id}`}
                role="tablist"
            >
                <li className="me-2">
                    <button
                        type="button"
                        onClick={() => handleTabClick('about')}
                        className={`inline-block p-4 rounded-ss-lg ${
                            activeTab === 'about'
                                ? 'text-blue-600 bg-gray-100 dark:bg-gray-700 dark:text-blue-500'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        About
                    </button>
                </li>
                <li className="me-2">
                    <button
                        type="button"
                        onClick={() => handleTabClick('services')}
                        className={`inline-block p-4 ${
                            activeTab === 'services'
                                ? 'text-blue-600 bg-gray-100 dark:bg-gray-700 dark:text-blue-500'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        Courses
                    </button>
                </li>
                <li className="me-2">
                    <button
                        type="button"
                        onClick={() => handleTabClick('statistics')}
                        className={`inline-block p-4 ${
                            activeTab === 'statistics'
                                ? 'text-blue-600 bg-gray-100 dark:bg-gray-700 dark:text-blue-500'
                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        Facts
                    </button>
                </li>
            </ul>
            {/* eslint-disable-next-line react/prop-types */}
            <div id={`defaultTabContent${cls?._id}`}>
                {/* About Tab Content */}
                {activeTab === 'about' && (
                    <div
                        className="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800"
                        id={`about${cls?._id}`}
                        role="tabpanel"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="mb-3 font-extrabold tracking-tight text-gray-900 dark:text-black">
                                {cls?.name}
                            </h2>
                            <span className="px-3 py-1 text-sm font-medium text-black bg-pink-500 rounded-full">
                                ClassRoom
                            </span>
                        </div>
                        <p className="mb-3 text-gray-500 dark:text-gray-400">
                            <Markdown content={cls.description}/>
                        </p>
                        <a
                            href="/messages"
                            className="inline-flex gap-3 items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700 hover:underline"
                        >
                            Request to Join
                            <LuMessageCirclePlus  size={15}/>
                        </a>
                    </div>
                )}

                {/* Courses Tab Content */}
                {activeTab === 'services' && (
                    <div
                        className="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800"
                        id={`services${cls?._id}`}
                        role="tabpanel"
                    >
                        <h2 className="mb-5 font-extrabold tracking-tight text-gray-900 dark:text-black">
                            {cls?.courses.length > 0 ? "This class has the below Courses" : "No course added yet"}
                        </h2>
                        <ul role="list" className="space-y-4 text-gray-500 dark:text-gray-400">
                            {cls?.courses.map((course, index) => (
                                <li key={index} className="flex space-x-2 rtl:space-x-reverse items-center">
                                    <MdCheckCircle size={16} className="text-teal-700" />
                                    <span className="leading-tight">{course?.interest}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Facts Tab Content */}
                {activeTab === 'statistics' && (
                    <div
                        className="p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800"
                        id={`statistics${cls?._id}`}
                        role="tabpanel"
                    >
                        <dl className="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-6 dark:text-black sm:p-8">
                            <div className="flex flex-col">
                                <dt className="mb-2 text-3xl font-extrabold">{cls?.courses.length + 5}+</dt>
                                <dd className="text-gray-500 dark:text-gray-400">Contributions</dd>
                            </div>
                        </dl>
                    </div>
                )}
            </div>
        </div>
    );
}



