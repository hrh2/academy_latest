// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom';
import {useNotification} from "@/context/NotificationContext.jsx";
import {fetchData, returnToken} from "@/utils/index.js";
import {servers} from "@/configs/index.js";
import {SparklesIcon} from "@heroicons/react/24/solid";
import InteractiveCourseViewer from "@/pages/dashboard/courses/InteractiveCourseViewer.jsx";
import Loader from "@/components/Loader.jsx";

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
        return <Loader/>
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
