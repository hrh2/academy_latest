import React, { useEffect, useState } from 'react';
import { CheckCircle, Zap, TrendingUp, Activity, Calendar, BookOpen, Trophy, Target } from 'lucide-react';
import {Link} from "react-router-dom";
import {useNotification} from "@/context/NotificationContext.jsx";
import {fetchData, returnToken} from "@/utils/index.js";
import {servers} from "@/configs/index.js";
import Markdown from "@/components/Markdown.jsx";
import Loader from "@/components/Loader.jsx";
import {Typography} from "@material-tailwind/react";
import {useAuth} from "@/context/AuthContext.jsx";

// eslint-disable-next-line react/prop-types
function Tasks() {
    const {userData } = useAuth();
    const { showNotification } = useNotification();
    const [completedTasks, setCompletedTasks] = useState([]);
    const [incompleteTasks, setIncompleteTasks] = useState([]);
    const [loader, setLoader] = useState(true);
    const [showCompleted, setShowCompleted] = useState(false);

    // const ifSuperAdmin = () => {
    //     return userData && userData.role === 'ADMIN';
    // }
    const ifAdmin = () => {
        return userData && userData.role !== 'NORMAL';
    }

    useEffect(() => {
        async function fetchTasks() {
            try {
                setLoader(true);
                const result = await fetchData(`${servers.main_api}/v1/api/tasks`, returnToken());
                if (result.error) {
                    showNotification(result.error, "error");
                } else {
                    const completedTasks = result.data?.completedTasks || [];
                    const uncompletedTasks = result.data?.uncompletedTasks || [];
                    setCompletedTasks(completedTasks);
                    setIncompleteTasks(uncompletedTasks);
                }
            } catch (error) {
                showNotification(error.message, "error");
            } finally {
                setLoader(false);
            }
        }
        fetchTasks();
    }, []);

    const getTaskTypeIcon = (type) => {
        switch (type) {
            case 'QUIZ':
                return <Trophy className="w-5 h-5" />;
            case 'ASSIGNMENT':
                return <BookOpen className="w-5 h-5" />;
            case 'PROJECT':
                return <Target className="w-5 h-5" />;
            default:
                return <Activity className="w-5 h-5" />;
        }
    };

    const getTaskTypeColor = (type) => {
        switch (type) {
            case 'QUIZ':
                return 'from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300';
            case 'ASSIGNMENT':
                return 'from-slate-50 to-blue-50 border-slate-200 hover:border-slate-300';
            case 'PROJECT':
                return 'from-indigo-50 to-blue-50 border-indigo-200 hover:border-indigo-300';
            default:
                return 'from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300';
        }
    };

    const renderTaskList = (tasks = [], title, noTaskMessage, isCompleted = false) => (
        <div className="space-y-6">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${
                    isCompleted 
                        ? 'bg-green-100' 
                        : 'bg-blue-100'
                }`}>
                    {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                    )}
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                    {title}
                </h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isCompleted 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-blue-100 text-blue-700 border border-blue-300'
                }`}>
                    {tasks.length}
                </div>
            </div>

            {tasks?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task, index) => (
                        <Link to={`/tasks/${task._id}`} key={task._id || index}
                             className={`group relative overflow-hidden rounded-2xl backdrop-blur-sm border transition-all duration-500 hover:scale-105 hover:shadow-lg ${
                                 isCompleted 
                                     ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300' 
                                     : `bg-gradient-to-br ${getTaskTypeColor(task.type)}`
                             } bg-white shadow-sm`}>

                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -skew-y-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out"></div>

                            <div className="relative p-6">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        {isCompleted ? (
                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                        ) : (
                                            <div className="text-blue-600">
                                                {getTaskTypeIcon(task.type)}
                                            </div>
                                        )}
                                        <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                            task.type === 'QUIZ' 
                                                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                                : task.type === 'ASSIGNMENT'
                                                ? 'bg-slate-100 text-slate-700 border border-slate-300'
                                                : task.type === 'PROJECT'
                                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                                                : 'bg-gray-100 text-gray-700 border border-gray-300'
                                        }`}>
                                            {task.type || 'TASK'}
                                        </div>
                                    </div>

                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        isCompleted 
                                            ? 'bg-green-100 text-green-700 border border-green-300' 
                                            : 'bg-orange-100 text-orange-700 border border-orange-300'
                                    }`}>
                                        {isCompleted ? 'Completed' : 'Pending'}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                                    {task.title}
                                </h3>

                                {task.description && (
                                    <p className="leading-relaxed mb-4 line-clamp-3">
                                        <Markdown content={task.description} />
                                    </p>
                                )}

                                {/* Quiz specific info */}
                                {task.type === 'QUIZ' && task.questions && (
                                    <div className="flex items-center space-x-4 text-md text-gray-700 mb-3">
                                        <div className="flex items-center">
                                            <Target className="w-3 h-3 mr-1" />
                                            {task.questions.length} Questions
                                        </div>
                                        <div className="flex items-center">
                                            <Trophy className="w-3 h-3 mr-1" />
                                            {task.questions.reduce((sum, q) => sum + q.mark, 0)} Points
                                        </div>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                    <div className="flex items-center text-xs text-gray-500">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {task.hasDueDate && task.dueDate
                                            ? new Date(task.dueDate).toLocaleDateString()
                                            : 'No due date'
                                        }
                                    </div>

                                    {ifAdmin() && (
                                        <Link
                                          to={`/task-summary/${task._id}`}
                                          className="group px-3 sm:px-4 py-2 bg-green-100 hover:bg-green-200 border border-green-300 hover:border-green-400 text-green-700 hover:text-green-800 rounded-xl transition-all duration-300 text-sm font-medium"
                                        >
                                          <span className="group-hover:scale-105 inline-block transition-transform">
                                            🎯 Submissions
                                          </span>
                                        </Link>
                                    )}

                                    {task.practice?.title && (
                                        <div className="text-xs text-gray-500 truncate max-w-32">
                                            {task.practice.title}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Zap className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">{noTaskMessage}</p>
                </div>
            )}
        </div>
    );

    if (loader) {
        return <Loader/>
    }

    return (
        <div className="h-full rounded-2xl bg-white relative overflow-y-scroll">
            <div className="relative z-10 flex flex-col gap-6 px-6 w-full h-full overflow-y-scroll">
                {/* Header */}
                <div className="text-center py-8">
                    <Typography className="text-4xl md:text-5xl font-bold mb-4">
                        {/*<span className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">*/}
                            Your Tasks
                        {/*</span>*/}
                    </Typography>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Master your learning journey with intelligent task management
                    </p>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto w-full">
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-cyan-600">{incompleteTasks.length}</div>
                        <div className="text-gray-500 text-sm">Active</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
                        <div className="text-gray-500 text-sm">Completed</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-purple-600">{completedTasks.length + incompleteTasks.length}</div>
                        <div className="text-gray-500 text-sm">Total</div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 text-center shadow-sm">
                        <div className="text-2xl font-bold text-pink-600">
                            {completedTasks.length + incompleteTasks.length > 0
                                ? Math.round((completedTasks.length / (completedTasks.length + incompleteTasks.length)) * 100)
                                : 0}%
                        </div>
                        <div className="text-gray-500 text-sm">Progress</div>
                    </div>
                </div>

                {/* Toggle Controls */}
                <div className="flex justify-center mb-8">
                    <div className="relative bg-white/80 w-[24rem] backdrop-blur-sm border border-gray-200 rounded-2xl p-2 shadow-sm">
                        <div className={`absolute top-2 left-2 w-[48%] h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl transition-transform duration-300 ease-out ${showCompleted ? 'translate-x-full' : 'translate-x-0'}`}></div>
                        <div className="relative flex">
                            <button
                                onClick={() => setShowCompleted(false)}
                                className={`px-6 !w-1/2 py-2 rounded-xl font-medium transition-colors duration-300 ${
                                    !showCompleted ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Active Tasks
                            </button>
                            <button
                                onClick={() => setShowCompleted(true)}
                                className={`px-6 !w-1/2 py-2 rounded-xl font-medium transition-colors duration-300 ${
                                    showCompleted ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                Completed
                            </button>
                        </div>
                    </div>
                </div>

                {/* Task Lists */}
                <div className="space-y-12 pb-8">
                    {showCompleted
                        ? renderTaskList(completedTasks, "Completed tasks", "No tasks completed yet. Start conquering your goals!", true)
                        : renderTaskList(incompleteTasks, "Active tasks", "All tasks conquered! Time for new challenges!", false)}
                </div>
            </div>
        </div>
    );
}

export default Tasks;