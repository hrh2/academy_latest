import { useEffect, useState } from 'react';
import {fetchData, returnToken, shuffleArray} from "@/utils/index.js";
import {servers} from "@/configs/index.js";
import {useNotification} from "@/context/NotificationContext.jsx";
import {Button, Card, Spinner, Typography} from "@material-tailwind/react";
import {AiFillFilter, AiOutlineSearch} from "react-icons/ai";
import {GlobeAltIcon} from "@heroicons/react/20/solid/index.js";
import {ChevronDoubleDownIcon, HeartIcon, SparklesIcon, UserIcon} from "@heroicons/react/24/solid";
import {Course} from "@/components/index.js";

// eslint-disable-next-line react/prop-types
function Courses({ isLink }) {
    const { showNotification } = useNotification()
    const [globalCourses, setGlobalCourses] = useState([]);
    const [classCourses, setClassCourses] = useState([]);
    const [interestedCourses, setInterestedCourses] = useState([]);
    const [loader, setLoader] = useState(true);
    const [role, setRole] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        async function main() {
            try {
                setLoader(true);
                const result = await fetchData(`${servers.main_api}/courses/mine`, returnToken());
                if (result.error) {
                    showNotification(result.error,"error");
                } else {
                    const { globalCourses, classCourses, interestedCourses, role } = result.data;
                    setGlobalCourses(globalCourses || []);
                    setClassCourses(classCourses || []);
                    setInterestedCourses(interestedCourses || []);
                    setRole(role);
                }
            } catch (error) {
                showNotification(error.message, "error");
            } finally {
                setLoader(false);
            }
        }
        main();
    }, []);

    if (loader) {
        return (<Spinner color="gray"/>);
    }

    if (!globalCourses.length && !classCourses.length && !interestedCourses.length) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gray-200/50 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 text-center bg-white/80 backdrop-blur-xl rounded-2xl p-12 border border-gray-200 shadow-sm">
                    <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <AiOutlineSearch className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Courses Available</h3>
                    <p className="text-gray-600">Your learning journey awaits new adventures</p>
                </div>
            </div>
        );
    }

    const getFilteredCourses = () => {
        let courses = [];
        switch (filter) {
            case 'GLOBAL':
                courses = globalCourses;
                break;
            case 'CLASS':
                courses = classCourses;
                break;
            case 'INTERESTED':
                courses = interestedCourses;
                break;
            default:
                courses = [...globalCourses, ...classCourses, ...interestedCourses];
        }

        if (searchTerm) {
            courses = courses.filter(course =>
                course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return shuffleArray(courses);
    };

    const getFilterIcon = (type) => {
        switch (type) {
            case 'GLOBAL': return <GlobeAltIcon className="w-4 h-4" />;
            case 'CLASS': return <UserIcon className="w-4 h-4" />;
            case 'INTERESTED': return <HeartIcon className="w-4 h-4" />;
            default: return <SparklesIcon className="w-4 h-4" />;
        }
    };

    const getFilterCount = (type) => {
        switch (type) {
            case 'GLOBAL': return globalCourses.length;
            case 'CLASS': return classCourses.length;
            case 'INTERESTED': return interestedCourses.length;
            default: return globalCourses.length + classCourses.length + interestedCourses.length;
        }
    };

    return (
        <div className="h-full bg-white border relative overflow-hidden rounded-lg">
            <div className="relative z-10 container mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <Typography variant={"h1"} className="text-gray-800 mb-4">
                        {isLink ? 'Choose Your Path' : 'Learning Universe'}
                    </Typography>
                    <Typography variant={"h5"} className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        {isLink ? 'Select a course with a single click to begin your journey' : 'Explore your personalized learning ecosystem'}
                    </Typography>

                    {/* Search Bar */}
                    <div className="max-w-lg mx-auto relative">
                        <div className="relative">
                            <AiOutlineSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 transition-all duration-300 shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-center mb-6">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-300 shadow-sm"
                        >
                            <AiFillFilter className="w-5 h-5" />
                            Filters
                            <ChevronDoubleDownIcon className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    <div className={`grid md:grid-cols-4 grid-cols-2 gap-4 max-w-4xl mx-auto transition-all duration-500 ${showFilters ? 'translate-y-0' : ' -translate-y-2'}`}>
                        {['ALL', 'GLOBAL', 'CLASS', 'INTERESTED'].map((type) => (
                            <Button
                                key={type}
                                variant={"gradient"}
                                onClick={() => setFilter(type)}
                                className={`transition-all duration-300 hover:scale-105 ${
                                    filter === type&&"text-gray-100 to-gray-900 via-blue-gray-900 form-blue-gray-900"
                                }`}
                            >
                                <div className="flex items-center justify-center gap-3">
                                    {getFilterIcon(type)}
                                    <span className="font-medium">{type}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        filter === type && "bg-black"
                                    }`}>
                                        {getFilterCount(type)}
                                    </span>
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mb-8">
                    {getFilteredCourses().map((course, index) => (
                        <div
                            key={index}
                            className="group transform transition-all duration-300 hover:scale-105"
                            style={{
                                animationDelay: `${index * 100}ms`
                            }}
                        >
                            <a href={`/courses/${course._id}`} className="block h-full">
                                <Course course={course} />
                            </a>
                        </div>
                    ))}
                </div>

                {/* Admin Notice */}
                {role === 'ADMIN' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-amber-50 backdrop-blur-md rounded-2xl p-6 border border-amber-200 relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
                                    <SparklesIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-amber-700 font-semibold text-lg mb-1">Admin Access</h3>
                                    <p className="text-gray-600">
                                        You have elevated privileges to access all course categories including global, class-specific, and interest-based content.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State for Filtered Results */}
                {getFilteredCourses().length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <AiOutlineSearch className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Courses;