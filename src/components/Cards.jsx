import {MdAutoAwesome, MdTopic} from "react-icons/md";
import {Button, Typography} from "@material-tailwind/react";
import {IconLink} from "@/components/Tags.jsx";

export const ModernSummaryCard = ({ title, value, icon: Icon, gradient, link }) => {
    return (
            <div className="relative bg-white backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-gray-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-500/10">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
                        <Icon className="text-2xl text-white" />
                    </div>
                    <div className="text-right">
                        <Typography >{value}</Typography>
                        <Typography >{title}</Typography>
                    </div>
                </div>
                <a href={link}
                   className="inline-flex items-center text-blue-gray-900 hover:text-blue-gray-800 text-sm font-medium transition-colors duration-200">
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
                        <MdTopic className="text-blue-gray-800 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
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
                className="max-w-sm h-full w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <a href={`/courses/${course._id}`}>
                    <img className="rounded-t-lg w-full object-center object-cover max-h-[14rem]" src={course.image} alt="image"/>
                </a>
                <div className="p-5">
                    <a href={`/courses/${course._id}`}>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{course.name}</h5>
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



