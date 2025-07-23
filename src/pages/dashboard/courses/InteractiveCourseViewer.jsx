// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft, ChevronRight, Maximize2, Minimize2, CheckCircle, Circle, Book, Code, FileText, Copy, RotateCcw, Menu, X,
  Trophy, Target, Zap, Focus, ChevronDown, ChevronUp
} from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { css } from '@codemirror/lang-css';
import { cpp } from '@codemirror/lang-cpp';
import { html } from '@codemirror/lang-html';
import { java } from '@codemirror/lang-java';
import { sql } from '@codemirror/lang-sql';
import { php } from '@codemirror/lang-php';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { xml } from '@codemirror/lang-xml';
import { rust } from '@codemirror/lang-rust';
import { wast } from '@codemirror/lang-wast';
import { less } from '@codemirror/lang-less';
import { sass } from '@codemirror/lang-sass';
import { angular } from '@codemirror/lang-angular';
import { vue } from '@codemirror/lang-vue';
import { lezer } from '@codemirror/lang-lezer';
import {FaRegFileAlt} from "react-icons/fa";
import {LuFocus, LuFullscreen} from "react-icons/lu";
import Markdown from "@/components/Markdown.jsx";
import {IconLink, LinksList} from "@/components/index.js";
import {Button, Card, Typography} from "@material-tailwind/react";

const languageExtensions = {
  javascript: javascript,
  python: python,
  css: css,
  cpp: cpp,
  html: html,
  java: java,
  sql: sql,
  php: php,
  json: json,
  markdown: markdown,
  xml: xml,
  rust: rust,
  wast: wast,
  less: less,
  sass: sass,
  angular: angular,
  vue: vue,
  lezer: lezer,
};

const getLanguageExtension = (language) => {
  if (!languageExtensions[language]) {
    console.warn(`Language "${language}" is not supported by CodeMirror. Falling back to plain text.`);
    return [];
  }
  return [languageExtensions[language]()];
};

// eslint-disable-next-line react/prop-types,no-unused-vars
const ContentViewer = ({ showCourseDesc, showTopicDesc, courseData, currentTopic, currentProgram, currentContent, completedPrograms, toggleComplete, copyToClipboard, resetCode, showDescription, setShowDescription }) => (
  <div className="space-y-6 ">
    {showCourseDesc && showDescription && (
      <div className="bg-white border border-gray-700/50 rounded-2xl p-6 lg:p-8 shadow-xl animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line react/prop-types */}
            <Typography variant="h3" className="md:text-3xl text-xl  font-semibold ">{courseData.course?.name}</Typography>
          </div>
          <Button
            variant={"outlined"}
            onClick={() => setShowDescription(false)}
            className="p-2  rounded-lg transition-colors"
            aria-label="Hide course description"
            title="Hide description"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>
        <div className="">
          {/* eslint-disable-next-line react/prop-types */}
          <Markdown content={courseData.course?.description} />
        </div>
        {/* eslint-disable-next-line react/prop-types */}
        <LinksList links={courseData.course?.usefulLinks} />
      </div>
    )}
    {showCourseDesc && !showDescription && (
      <div className="flex justify-center animate-in slide-in-from-top-2 duration-300">
        <Button
          variant={"outlined"}
          onClick={() => setShowDescription(true)}
          className="flex items-center gap-2 px-2 py-1  rounded-xl transition-all duration-300 border border-gray-700/50 hover:border-gray-600/50"
          aria-label="Show course description"
        >
          <ChevronDown className="w-4 h-4" />
          <span>Course Details</span>
        </Button>
      </div>
    )}
    {showTopicDesc && (
      <Card className="backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 lg:p-8 shadow-xl animate-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-3">
          <Card variant={"gradient"} color={"blue"} className="p-2 bg-gradient-to-r  rounded-lg">
            <Book className="w-6 h-6 text-white" />
          </Card>
          {/* eslint-disable-next-line react/prop-types */}
          <Typography className="text-lg lg:text-xl font-semibold text-black">{currentTopic.title}</Typography>
        </div>
        <div className="pt-6 text-black">
          {/* eslint-disable-next-line react/prop-types */}
          <Markdown content={currentTopic.description} />
        </div>
        {/* eslint-disable-next-line react/prop-types */}
        <LinksList links={currentTopic?.usefulLinks} />
      </Card>
    )}
    <Card className="backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 lg:p-8 shadow-xl animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Card variant={"gradient"} color={"blue"} className="p-2 rounded-lg">
            <Book className="w-6 h-6 text-white" />
          </Card>
        </div>
      </div>
      <div className="text-black">
        {/* eslint-disable-next-line react/prop-types */}
        <Markdown content={currentProgram.description} />
      </div>
    </Card>
    <Card className="backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-xl">
      <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <Card variant={"gradient"} color={"blue"} className="p-2 rounded-lg">
            <Code className="w-6 h-6 text-white" />
          </Card>
          <div>
            <Typography className="text-lg font-semibold text-black">
              {/* eslint-disable-next-line react/prop-types */}
              {currentProgram.language === 'text' ? '' : 'Code'}
            </Typography>
            {/* eslint-disable-next-line react/prop-types */}
            <Typography className="text-sm text-gray-900 capitalize">{currentProgram.language}</Typography>
          </div>
        </div>
        <Card className="fluid items-center gap-2">
          <Button
            onClick={() => copyToClipboard(currentContent)}
            className="p-2  rounded-lg hover:bg-gray-800 transition-colors group"
            aria-label="Copy content to clipboard"
            title="Copy content"
          >
            <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </Button>
          {/* eslint-disable-next-line react/prop-types */}
          {currentProgram.language !== 'text' && (
              // eslint-disable-next-line react/prop-types
            <Button
              onClick={() => resetCode(currentProgram._id, currentProgram.content)}
              className="p-2  rounded-lg hover:bg-gray-800 transition-colors group"
              aria-label="Reset to original code"
              title="Reset to original"
            >
              <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </Button>
          )}
        </Card>
      </div>
      <div className="p-4 lg:p-6 text-gray-900 ">
        {/* eslint-disable-next-line react/prop-types */}
        {currentProgram.language === 'text' ? (
          <Markdown content={currentContent} />
        ) : (
          <CodeMirror
            value={currentContent}
            height="auto"
            minHeight="200px"
            extensions={getLanguageExtension(currentProgram.language)}
            onChange={(value) => updateContent(currentProgram._id, value)}
            className="rounded-lg overflow-hidden"
            theme="dark"
          />
        )}
      </div>
      <div className="pt-2">
        {/* eslint-disable-next-line react/prop-types */}
        {currentProgram?.usefulLinks?.length > 0 && (
          <IconLink links={currentProgram?.usefulLinks} />
        )}
      </div>
    </Card>
  </div>
);

// eslint-disable-next-line react/prop-types
export default function InteractiveCourseViewer({ courseData }) {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentProgramIndex, setCurrentProgramIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [completedPrograms, setCompletedPrograms] = useState(new Set());
  const [copiedCode, setCopiedCode] = useState('');
  const [editedContent, setEditedContent] = useState({});
  const [showDescription, setShowDescription] = useState(true);
  const [focusMode, setFocusMode] = useState(false);

  // eslint-disable-next-line react/prop-types
  const topics = courseData?.topics || [];
  const currentTopic = topics[currentTopicIndex];
  const programs = currentTopic?.programs || [];
  const currentProgram = programs[currentProgramIndex];

  const courseId = useMemo(() => courseData?.course?._id, [courseData?.course?._id]);

  // Load progress from localStorage and handle URL query parameters
  useEffect(() => {
    try {
      const token =  returnToken()
      const urlParams = new URLSearchParams(window.location.search);
      const topicParam = urlParams.get('topic');
      const sectionParam = urlParams.get('section');

      let initialTopicIndex = 0;
      let initialProgramIndex = 0;

      // Handle URL parameters
      if (topicParam) {
        const topicId = parseInt(topicParam);
        const topicIndex = topics.findIndex(topic => topic.id === topicId);
        if (topicIndex !== -1) {
          initialTopicIndex = topicIndex;
          if (sectionParam) {
            const programIndex = topics[topicIndex].programs.findIndex(program => program._id === sectionParam);
            if (programIndex !== -1) {
              initialProgramIndex = programIndex;
            }
          }
          setCurrentTopicIndex(initialTopicIndex);
          setCurrentProgramIndex(initialProgramIndex);
          return;
        }
      }

      // Fall back to localStorage if no valid URL params
      if (token && courseId) {
        const savedProgress = localStorage.getItem(`courseProgress_${courseId}_${token}`);
        if (savedProgress) {
          const { completedPrograms, topicIndex, programIndex } = JSON.parse(savedProgress);
          setCompletedPrograms(new Set(completedPrograms));
          initialTopicIndex = topicIndex || 0;
          initialProgramIndex = programIndex || 0;
        }
      }

      setCurrentTopicIndex(initialTopicIndex);
      setCurrentProgramIndex(initialProgramIndex);
    } catch (err) {
      console.error('Error accessing localStorage:', err);
    }
  }, [courseId, topics, setCurrentTopicIndex, setCurrentProgramIndex]);

  // Save progress to localStorage
  useEffect(() => {
    try {
      const token = localStorage.getItem('userToken');
      if (token && courseId) {
        localStorage.setItem(
          `courseProgress_${courseId}_${token}`,
          JSON.stringify({
            completedPrograms: Array.from(completedPrograms),
            topicIndex: currentTopicIndex,
            programIndex: currentProgramIndex
          })
        );
      }
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }, [completedPrograms, currentTopicIndex, currentProgramIndex, courseId]);

  // Handle fullscreen mode
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle escape key to exit focus mode
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && focusMode) {
        setFocusMode(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [focusMode]);

  // Close sidebar when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      try {
        setFocusMode(true);
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
          setFocusMode(false);
        }
      } catch (err) {
        console.error('Error attempting to exit fullscreen:', err);
      }
    }
  };

  const goToNextProgram = () => {
    if (currentProgram && !completedPrograms.has(currentProgram._id)) {
      toggleComplete(currentProgram._id);
    }
    if (currentProgramIndex < programs.length - 1) {
      setCurrentProgramIndex(currentProgramIndex + 1);
    } else if (currentTopicIndex < topics.length - 1) {
      setCurrentTopicIndex(currentTopicIndex + 1);
      setCurrentProgramIndex(0);
    }
  };

  const goToPreviousProgram = () => {
    if (currentProgramIndex > 0) {
      setCurrentProgramIndex(currentProgramIndex - 1);
    } else if (currentTopicIndex > 0) {
      setCurrentTopicIndex(currentTopicIndex - 1);
      const prevTopic = topics[currentTopicIndex - 1];
      setCurrentProgramIndex(prevTopic.programs.length - 1);
    }
  };

  const goToTopic = (topicIndex) => {
    setCurrentTopicIndex(topicIndex);
    setCurrentProgramIndex(0);
    setIsSidebarOpen(false);
  };

  const toggleComplete = (programId) => {
    const newCompleted = new Set(completedPrograms);
    if (newCompleted.has(programId)) {
      newCompleted.delete(programId);
    } else {
      newCompleted.add(programId);
    }
    setCompletedPrograms(newCompleted);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const resetCode = (programId, originalCode) => {
    setEditedContent(prev => ({
      ...prev,
      [programId]: originalCode
    }));
  };

  const getCurrentContent = (programId, originalContent) => {
    return editedContent[programId] !== undefined ? editedContent[programId] : originalContent;
  };

  const updateContent = (programId, newContent) => {
    setEditedContent(prev => ({
      ...prev,
      [programId]: newContent
    }));
  };

  const totalPrograms = topics.reduce((total, topic) => total + topic.programs.length, 0);
  const completedCount = completedPrograms.size;
  const progressPercentage = totalPrograms > 0 ? (completedCount / totalPrograms) * 100 : 0;

  const TopicSidebar = () => (
    <>
      {isSidebarOpen && (
        <div
          className="fixed p-1 inset-0 bg-white backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-0
        lg:rounded-l-lg
        w-80 sm:w-96 lg:w-80 xl:w-96
        bg-white
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        backdrop-blur-xl
      `}>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <div className="p-4 lg:p-6 md:h-[84vh] h-[90vh] overflow-y-scroll">
            <div className="lg:hidden flex justify-end p-4">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-gray-800 hover:text-black hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Card variant={"gradient"} color={"gray"}  className="p-3 rounded-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </Card>
                <div>
                  <Typography variant={"h3"} className="text-xl font-bold bg-gradient-to-r from-black to-gray-800 bg-clip-text text-transparent">
                    Course Progress
                  </Typography>
                  <p className="text-sm text-gray-800">{completedCount} of {totalPrograms} completed</p>
                </div>
              </div>
              <div className="relative">
                <Card variant={"gradient"} color={"white"} className=" rounded-full h-3 overflow-hidden backdrop-blur-sm">
                  <div
                    className="bg-gradient-to-r from-cyan-600 to-blue-500 h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse" />
                  </div>
                </Card>
                <div className="mt-2 text-right">
                  <span className="text-xs font-medium text-emerald-400">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Typography variant={"h3"} className="text-sm font-semibold  uppercase tracking-wider mb-4">
                Course Topics
              </Typography>
              {topics.map((topic, topicIndex) => {
                const topicCompleted = topic.programs.every(program => completedPrograms.has(program._id));
                const topicProgress = topic.programs.length > 0
                  ? (topic.programs.filter(program => completedPrograms.has(program._id)).length / topic.programs.length) * 100
                  : 0;
                return (
                  <div key={topic._id} className="group">
                    <Button
                      onClick={() => goToTopic(topicIndex)}
                      variant={"gradient"}
                      color={currentTopicIndex === topicIndex ?"gray":"white"}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]`}
                      aria-label={`Go to topic ${topic.id}: ${topic.title}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Card variant={"gradient"} color={currentTopicIndex === topicIndex ?"white":"gray"} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold  `}>
                            {topicCompleted ? <CheckCircle className="w-4 h-4" /> : topic.id}
                          </Card>
                          <Typography className={`font-semibold`}>Topic {topic.id}</Typography>
                        </div>
                        <div className="flex items-center gap-2">
                          <Typography color={"white"} className="text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-500  px-2 py-1 rounded-full">
                            {topic.programs.length}
                          </Typography>
                          {topicProgress > 0 && (
                            <div className="w-12 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 transition-all duration-300"
                                style={{ width: `${topicProgress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <Typography className="text-sm  line-clamp-2">{topic.title}</Typography>
                    </Button>
                    {currentTopicIndex === topicIndex && (
                      <div className="mt-3 ml-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
                        {topic.programs.map((program, programIndex) => (
                          <Button
                            key={program._id}
                            onClick={() => setCurrentProgramIndex(programIndex)}
                            variant={"gradient"}
                            color={currentProgramIndex === programIndex?"blue-gray":"gray"}
                            className={`w-full text-left p-3 rounded-lg text-sm transition-all duration-200 `}
                            aria-label={`Go to section ${programIndex + 1}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">Section {programIndex + 1}</span>
                              <div className="flex items-center gap-2">
                                {completedPrograms.has(program._id) && (
                                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                                )}
                                <span className="text-xs  px-2 py-0.5 rounded">
                                  {program.language}
                                </span>
                              </div>
                            </div>
                          </Button>
                        ))}
                        {topic?.tasks?.length > 0 && (
                          <div className="p-2 border border-gray-600 rounded-lg flex flex-col gap-2 bg-gray-900">
                            {topic.tasks.map((task, index) => (
                              <a href={`/tasks/${task}`} key={task} className="flex justify-between">
                                <FaRegFileAlt className="my-auto" />
                                <span className="text-black">Quiz </span>
                                <span className="text-black">{index + 1}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );

  const FocusModePopup = () => {
    if (!focusMode || !currentProgram) return null;
    const canGoNext = !(currentTopicIndex === topics.length - 1 && currentProgramIndex === programs.length - 1);
    const canGoPrev = !(currentTopicIndex === 0 && currentProgramIndex === 0);
    const currentContent = getCurrentContent(currentProgram._id, currentProgram.content);
    const showCourseDesc = currentTopicIndex === 0 && currentProgramIndex === 0;
    const showTopicDesc = currentProgramIndex === 0;

    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-700/50 shadow-2xl overflow-y-scroll">
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-gray-100/50">
            <div className="flex items-center gap-4">
              <div>
                <Typography variant={"h2"} className="text-xl font-bold text-black">{currentTopic?.title}</Typography>
                <Typography variant={"paragraph"} className="text-sm text-gray-800">
                  Section {currentProgramIndex + 1}
                </Typography>
              </div>
            </div>
            <Button
              onClick={() => toggleComplete(currentProgram._id)}
              variant={"gradient"}
              color={completedPrograms.has(currentProgram._id)?"green":"gray"}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 `}
              aria-label={completedPrograms.has(currentProgram._id) ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {completedPrograms.has(currentProgram._id) ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {completedPrograms.has(currentProgram._id) ? 'Completed' : 'Mark Complete'}
              </span>
            </Button>
            <div className={`flex gap-1 justify-between`}>
              <Button
                    onClick={()=>setFocusMode(!focusMode)}
                    variant={"outlined"}
                    className="p-2 rounded-lg transition-colors"
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  >
                    {focusMode ? <Minimize2 className="w-6 h-6" /> : <LuFullscreen className="w-6 h-6" />}
              </Button>
              <Button
                onClick={toggleFullscreen}
                variant="gradient"
                color={"orange"}
                className="p-2 rounded-lg transition-colors"
                aria-label="Exit focus mode"
              >
                {isFullscreen ? <X className="w-6 h-6" />:<LuFocus  className="w-6 h-6" />}
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <ContentViewer
              showCourseDesc={showCourseDesc}
              showTopicDesc={showTopicDesc}
              courseData={courseData}
              currentTopic={currentTopic}
              currentProgram={currentProgram}
              currentContent={currentContent}
              completedPrograms={completedPrograms}
              toggleComplete={toggleComplete}
              copyToClipboard={copyToClipboard}
              resetCode={resetCode}
              showDescription={showDescription}
              setShowDescription={setShowDescription}
            />
          </div>
          <div className="flex items-center justify-between gap-4 p-4">
            <Button
              onClick={goToPreviousProgram}
              disabled={!canGoPrev}
              variant={"gradient"}
              color={"blue"}
              className="flex items-center gap-2 px-4 py-3  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
              aria-label="Go to previous program"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Card className="flex items-center gap-2 px-4 py-2  rounded-full backdrop-blur-sm">
              <Zap className="w-4 h-4 text-yellow-400" />
              <Typography variant={"lead"} className="text-sm font-medium">
                {currentProgramIndex + 1} / {programs.length}
              </Typography>
            </Card>
            <Button
              onClick={goToNextProgram}
              disabled={!canGoNext}
              variant={"gradient"}
              color={"blue"}
              className="flex items-center gap-2 px-4 py-3  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100 shadow-lg "
              aria-label={completedPrograms.has(currentProgram?._id) ? 'Go to next program' : 'Mark complete and go to next program'}
            >
              <span className="hidden sm:inline">{completedPrograms.has(currentProgram?._id) ? 'Next' : 'Mark Complete & Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const ProgramViewer = () => {
    if (!currentProgram || !currentTopic) return null;
    const canGoNext = !(currentTopicIndex === topics.length - 1 && currentProgramIndex === programs.length - 1);
    const canGoPrev = !(currentTopicIndex === 0 && currentProgramIndex === 0);
    const currentContent = getCurrentContent(currentProgram._id, currentProgram.content);
    const showCourseDesc = currentTopicIndex === 0 && currentProgramIndex === 0;
    const showTopicDesc = currentProgramIndex === 0;

    return (
      <div className="flex-1 md:h-[88vh] overflow-y-auto">
        <div className="bg-white sticky top-0 z-30  backdrop-blur-xl border-b border-gray-700/50">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {!isFullscreen && (
                  <Button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2  rounded-lg transition-colors"
                    aria-label="Open sidebar"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                )}
                <div>
                  <Typography variant={"h1"} className="text-xl lg:text-2xl font-bold">
                    {currentTopic?.title}
                  </Typography>
                  <Typography className="flex items-center gap-2 mt-1 text-sm ">
                    <Target className="w-4 h-4" />
                    <span>Topic {currentTopic?.id} of {topics.length}</span>
                    <span>•</span>
                    <span>Section {currentProgramIndex + 1} of {programs.length}</span>
                  </Typography>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Button
                  onClick={toggleFullscreen}
                  variant={"gradient"}
                  color={"orange"}
                  className="flex items-center gap-2 px-4 py-2 transition-all duration-300 shadow-lg"
                  aria-label="Enter focus mode"
                >
                  <Focus className="w-4 h-4" />
                  <span className="hidden sm:inline">Focus Mode</span>
                </Button>
                <Button
                  onClick={() => toggleComplete(currentProgram._id)}
                  variant={"gradient"}
                  color={completedPrograms.has(currentProgram._id)?"green":"gray"}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 `}
                  aria-label={completedPrograms.has(currentProgram._id) ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {completedPrograms.has(currentProgram._id) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {completedPrograms.has(currentProgram._id) ? 'Completed' : 'Mark Complete'}
                  </span>
                </Button>
                <Button
                  onClick={()=>setFocusMode(!focusMode)}
                  variant={"outlined"}
                  color={"gray"}
                  className="p-2 transition-colors"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                >
                  {focusMode ? <Minimize2 className="w-4 h-4" /> : <LuFullscreen className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 lg:p-6 space-y-6 lg:space-y-8">
          <ContentViewer
            showCourseDesc={showCourseDesc}
            showTopicDesc={showTopicDesc}
            courseData={courseData}
            currentTopic={currentTopic}
            currentProgram={currentProgram}
            currentContent={currentContent}
            completedPrograms={completedPrograms}
            toggleComplete={toggleComplete}
            copyToClipboard={copyToClipboard}
            resetCode={resetCode}
            showDescription={showDescription}
            setShowDescription={setShowDescription}
          />
          <div className="flex items-center justify-between gap-4 pt-4">
            <Button
              onClick={goToPreviousProgram}
              disabled={!canGoPrev}
              variant={"gradient"}
              color={"blue"}
              className="flex items-center gap-2 px-4 py-3  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
              aria-label="Go to previous program"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <Card className="flex items-center gap-2 px-4 py-2  rounded-full backdrop-blur-sm">
              <Zap className="w-4 h-4 text-yellow-400" />
              <Typography variant={"lead"} className="text-sm font-medium">
                {currentProgramIndex + 1} / {programs.length}
              </Typography>
            </Card>
            <Button
              onClick={goToNextProgram}
              disabled={!canGoNext}
              variant={"gradient"}
              color={"blue"}
              className="flex items-center gap-2 px-4 py-3  disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100 shadow-lg "
              aria-label={completedPrograms.has(currentProgram?._id) ? 'Go to next program' : 'Mark complete and go to next program'}
            >
              <span className="hidden sm:inline">{completedPrograms.has(currentProgram?._id) ? 'Next' : 'Mark Complete & Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (!courseData || !topics.length || !currentTopic || !currentProgram) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Button className="p-4  rounded-full mb-6 backdrop-blur-sm">
            <FileText className="w-12 h-12 mx-auto opacity-50" />
          </Button>
          <Typography variant={"h3"} className="text-xl font-semibold mb-2">No Content Available</Typography>
          <Typography variant={"paragraph"} className="">Course content is not available at the moment.</Typography>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-gray-950' : 'w-full h-full'} flex relative`}>
        {!isFullscreen && <TopicSidebar />}
        <ProgramViewer />
        {copiedCode && (
          <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-emerald-500 to-teal-500 text-black px-6 py-3 rounded-xl shadow-lg transform animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Content copied!</span>
            </div>
          </div>
        )}
      </div>
      <FocusModePopup />
    </>
  );
}