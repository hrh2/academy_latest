// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import {useNotification} from "@/context/NotificationContext.jsx";
import {fetchData, returnToken} from "@/utils/index.js";
import {servers} from "@/configs/index.js";
import {SparklesIcon} from "@heroicons/react/24/solid";
import InteractiveCourseViewer from "@/pages/dashboard/courses/InteractiveCourseViewer.jsx";

function Course() {
    const { courseID } = useParams();
    const { showNotification } = useNotification();
    const [loader, setLoader] = useState(true);
    const [courseDetails, setCourseDetails] = useState(null);

    useEffect(() => {
        async function main() {
            try {
                setLoader(true);
                const result = await fetchData(`${servers.main_api}/courses/params/${courseID}`, returnToken());
                if (result.error) {
                    showNotification(result.error,"error");
                } else {
                    setCourseDetails(result.data);
                }
            } catch (error) {
                showNotification(error.message,"error");
            } finally {
                setLoader(false);
            }
        }
        main();
    }, [courseID]);


    if (loader) {
        return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mb-4 animate-spin">
                        {/* eslint-disable-next-line react/jsx-no-undef */}
                        <SparklesIcon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white/80 text-lg font-medium">Loading your learning universe...</p>
                </div>
            </div>;
    }

    if (!courseDetails) {
        return <div className={`container mx-auto flex items-center justify-center`}>No course data available for you better request access</div>;
    }

    return (
        <div className="container mx-auto px-2 w-full h-full overflow-hidden overflow-y-scroll">
            <InteractiveCourseViewer courseData={courseDetails} />
        </div>
    );
}

export default Course;
