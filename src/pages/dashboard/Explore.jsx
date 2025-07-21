// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { HiCheckCircle, HiSparkles, HiLightBulb, HiAcademicCap } from "react-icons/hi";
import { BsRocket } from "react-icons/bs";
import { MdExplore } from "react-icons/md";
import {offerings} from "@/data/index.js";
import {CourseCard, TopicCard} from "@/components/index.js";
import {Button, Spinner} from "@material-tailwind/react";
import {fetchData, returnToken, shuffleArray} from "@/utils/index.js";
import {servers} from "@/configs/index.js";
import {useNotification} from "@/context/NotificationContext.jsx";
import Loader from "@/components/Loader.jsx";
import {useInput} from "@/context/InputContext.jsx";

function ExplorePage() {
    const { showNotification } = useNotification();
    const [loading, setLoading] = useState(false);
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const { inputValue } = useInput();

    useEffect(() => {
        fetchExploreData();
    }, []);

    const fetchExploreData = async () => {
        setLoading(true);
        try {
            // Fetch courses for featured section
            const coursesResult = await fetchData(`${servers.main_api}/courses/mine`, returnToken());
            if (!coursesResult.error) {
                const { globalCourses, classCourses, interestedCourses } = coursesResult.data;
                const allCourses = [...(globalCourses || []), ...(classCourses || []), ...(interestedCourses || [])];
                setFeaturedCourses(shuffleArray(allCourses)?.slice(0, 3));

                // Extract unique categories from courses
                const uniqueCategories = [...new Set(allCourses.map(course => course.interest))];
                setCategories(['All', ...uniqueCategories]);
            }

        } catch (error) {
            showNotification(error.message);
        } finally {
            setLoading(false);
        }
    };

    if(loading){
        return <Loader/>
    }

    return (
        <div className="w-full h-full  overflow-hidden overflow-y-scroll">
            <div className="relative z-10 md:px-8 px-4 py-6">
                <div className="relative mb-12 mt-6">
                    <div className="relative bg-white border border-black/10 rounded-3xl p-8 shadow-2xl">
                        <div className="flex flex-col lg:flex-row items-center gap-8">
                            <div className="lg:w-2/3 space-y-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl">
                                        <MdExplore className="text-white text-2xl" />
                                    </div>
                                    <span className="text-cyan-500 font-medium tracking-wide">DISCOVERY PORTAL</span>
                                </div>

                                <h1 className="text-4xl lg:text-6xl font-black bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight">
                                    Explore the
                                    <span className="block bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                        Future of Learning
                                    </span>
                                </h1>

                                <div className="flex flex-wrap gap-4">
                                    <Button variant={"gradient"} className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/10">
                                        <HiSparkles className="text-yellow-400 text-lg" />
                                        <span className="text-sm text-gray-300">AI-Powered</span>
                                    </Button>
                                    <Button variant={"gradient"} className="flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full border border-black/10">
                                        <BsRocket className="text-cyan-400 text-lg" />
                                        <span className="text-sm text-gray-300">Future-Ready</span>
                                    </Button>
                                    <Button variant={"gradient"} className="flex items-center gap-2 px-4 py-2  backdrop-blur-sm rounded-full border border-black/10">
                                        <HiAcademicCap className="text-purple-400 text-lg" />
                                        <span className="text-sm text-gray-300">Expert-Led</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="lg:w-1/3 flex justify-center">
                                <div className="relative">
                                    <div className="w-64 h-64 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-60 animate-spin-slow"></div>
                                    <div className="absolute inset-4 bg-gradient-to-r from-cyan-900 to-purple-900 rounded-full flex items-center justify-center backdrop-blur-xl border border-black/20">
                                        <div className="text-center">
                                            <HiLightBulb className="text-yellow-400 text-4xl mx-auto mb-2 animate-pulse" />
                                            <span className="text-white text-lg font-extrabold">Academy</span>
                                            <div className="text-cyan-400 text-sm">2025</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Courses */}
                {featuredCourses.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-black to-purple-200 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></div>
                            Featured Courses
                        </h2>
                        {loading ? (
                            <div className="flex justify-center py-16">
                                <div className="relative">
                                    <Spinner color="#06b6d4" />
                                    <div className="absolute inset-0 blur-md">
                                        <Spinner color="#8b5cf6" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredCourses.map((course, index) => (
                                    <CourseCard course={course} />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* What We Offer - Redesigned */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-black to-green-200 bg-clip-text text-transparent mb-6 flex items-center gap-3">
                        <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-cyan-400 rounded-full"></div>
                        What We Offer
                    </h2>
                    <div className="relative">
                        <div className="relative bg-white border border-black/10 rounded-3xl p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {offerings.map((offering, index) => (
                                    <div key={offering.id} className="group">
                                        <div className="relative p-6  backdrop-blur-sm border border-black/10 rounded-2xl  transition-all duration-300 hover:scale-105">
                                            <div className="flex items-start gap-4">
                                                <Button className="p-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                                    <HiCheckCircle className="text-xl" />
                                                </Button>
                                                <div className="flex-1">
                                                    <h3 className="text-black font-semibold text-lg mb-2  transition-colors">
                                                        {offering.title}
                                                    </h3>
                                                    <p className="text-gray-800 text-sm leading-relaxed  transition-colors">
                                                        {offering.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-cyan-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ExplorePage;