// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import {useNotification} from "@/context/NotificationContext.jsx";
import {fetchData, returnToken, sendData} from "@/utils/index.js";
import {servers} from "@/configs/index.js";
import {Button, Card, Spinner, Typography} from "@material-tailwind/react";
import {AcademicCapIcon} from "@heroicons/react/20/solid/index.js";
import Markdown from "react-markdown";

const Classes = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loader, setLoader] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        const fetchClasses = async () => {
            setLoader(true);
            try {
                const result = await fetchData(`${servers.main_api}/classes-to-request`,returnToken());
                if (result.error) {
                    showNotification(result.error,"error");
                } else {
                    setClasses(result.data);
                }
            } catch (error) {
                showNotification("Failed to fetch courses.", "error");
            } finally {
                setLoader(false);
            }
        };
        fetchClasses();
    }, []);

    const handleClassSelection = (classId) => {
        setSelectedClasses(prev => {
            if (prev.includes(classId)) {
                return prev.filter(id => id !== classId);
            }
            return [...prev, classId];
        });
    };

    const handleRequestSubmit = async () => {
        try {
            if(!selectedClasses.length) {
                showNotification("Please select a class","warning");
                return;
            }
            if(!message.length) {
                showNotification("Please enter a description for your reasons to join this class.", "warning");
                return;
            }
            setIsSubmitting(true);
            const result = await sendData(`${servers.main_api}/request`, { requestedClasses: selectedClasses, message }, returnToken());
            if (result.error) {
                showNotification(result.error,"error");
            } else {
                showNotification(result.message,"success");
                setTimeout(() => {
                    window.location="/courses";
                }, 500);
            }
        } catch (error) {
            showNotification(error.message,"error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loader) {
        return (<Spinner/>);
    }

    return (
        <div className="">
            <div className="max-w-7xl mx-auto relative z-10 #rounded-2xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-black mb-4">
                        <Typography variant="h3">
                            JOIN THE FUTURE
                        </Typography>
                    </h1>
                    <Typography variant={"paragraph"} className="mx-auto leading-relaxed">
                        Select your learning path and embark on an extraordinary educational journey
                    </Typography>
                </div>

                {/* Stats Bar */}
                <div className="flex justify-center mb-8 ">
                    <div className="bg-white backdrop-blur-sm border border-slate-700/50 rounded-2xl px-6 py-3">
                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                <Typography>{classes.length} Classes Available</Typography>
                            </div>
                            <div className="w-px h-4 bg-slate-600"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-500"></div>
                                <Typography>{selectedClasses.length} Selected</Typography>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Classes Grid */}
                <Card className="mb-8 p-6">
                    <Typography variant={"h2"} className="text-2xl font-bold  mb-6 flex items-center gap-3">
                        <Card variant={"gradient"} color={"gray"} className="aspect-square p-2 rounded-lg">
                            <AcademicCapIcon class="h-6 w-6"/>
                        </Card>
                        Available Classes
                    </Typography>

                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 #max-h-[60vh] #overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-slate-800">
                        {classes.map((cls, index) => (
                            <div
                                key={cls._id}
                                className="group relative transform transition-all duration-300 hover:scale-[1.02]"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <input
                                    type="checkbox"
                                    onChange={() => handleClassSelection(cls._id)}
                                    id={`select-classRoom-${cls._id}`}
                                    value={cls._id}
                                    checked={selectedClasses.includes(cls._id)}
                                    className="hidden peer"
                                />

                                {/* Card */}
                                <label
                                    htmlFor={`select-classRoom-${cls._id}`}
                                    className="block cursor-pointer relative overflow-hidden"
                                >
                                    {/* Card Content */}
                                    <div className={`relative bg-slate-800/80 backdrop-blur-sm border-2 rounded-2xl p-6 h-full transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 ${
                                        selectedClasses.includes(cls._id) 
                                            ? 'border-cyan-400 shadow-lg shadow-cyan-400/20' 
                                            : 'border-slate-700/50 hover:border-slate-600'
                                    }`}>
                                        {/* Selection Indicator */}
                                        <div className={`absolute top-4 right-4 w-7 h-7 border-2 rounded-full transition-all duration-300 flex items-center justify-center ${
                                            selectedClasses.includes(cls._id)
                                                ? 'border-cyan-400 bg-cyan-400 scale-110 shadow-lg shadow-cyan-400/50'
                                                : 'border-slate-600 hover:border-slate-500'
                                        }`}>
                                            <svg className={`w-4 h-4 transition-all duration-300 ${
                                                selectedClasses.includes(cls._id) ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>

                                        {/* Class Name */}
                                        <h3 className="text-xl font-bold  mb-3 pr-8 group-hover:text-cyan-300 transition-colors duration-300">
                                            {cls.name}
                                        </h3>

                                        {/* Description */}
                                        <div className="text-slate-300 mb-4 text-sm leading-relaxed">
                                            <Markdown content={cls.description} />
                                        </div>

                                        {/* Courses List */}
                                        {cls.courses.length > 0 ? (
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                                                    <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"></div>
                                                    Available Topics ({cls.courses.length})
                                                </h4>
                                                <ul className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
                                                    {cls.courses.map((course, courseIndex) => (
                                                        <li key={courseIndex} className="flex items-center gap-3 text-sm text-slate-300">
                                                            <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex-shrink-0"></div>
                                                            <span className="group-hover: transition-colors duration-300">
                                                                {course.interest}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-400 text-sm">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                                No courses available yet
                                            </div>
                                        )}

                                        {/* Hover Effect Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mt-4">
                        <h3 className="text-xl font-bold  mb-4 flex items-center gap-3">
                            <Card variant={"gradient"} color={"gray"} className="p-2 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </Card>
                            <Typography variant={"h4"} className={` font-bold`}>
                                Tell us why you're interested
                            </Typography>
                        </h3>

                        <div className="relative">
                            <textarea
                                placeholder="Share your motivation and explain why you want to join these classes..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                maxLength={170}
                                className="w-full px-6 py-4 bg-slate-900/50 border border-slate-600/50 rounded-xl  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 resize-none"
                            />
                            <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                                {message.length}/170
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center">
                        <Button
                            variant={"gradient"}
                            onClick={handleRequestSubmit}
                            disabled={isSubmitting || selectedClasses.length === 0 || !message.trim()}
                            className="group relative px-12 py-4  font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed min-w-[200px]"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin"></div>
                                    <span>Submitting...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-3">
                                    <svg className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    <span>Submit Request</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Classes;