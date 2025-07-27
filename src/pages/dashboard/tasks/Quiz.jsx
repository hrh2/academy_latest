// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {fetchData, returnToken, sendData} from "@/utils/index.js";
import {useAuth} from "@/context/AuthContext.jsx";
import {useNotification} from "@/context/NotificationContext.jsx";
import {servers} from "@/configs/index.js";
import Markdown from "@/components/Markdown.jsx";
import {IconLink} from "@/components/index.js";
import {Typography} from "@material-tailwind/react";

const Task = () => {
    const {userData } = useAuth();
    const { showNotification } = useNotification();
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ifAdmin = () => {
        return userData && userData.role !== 'NORMAL';
    }

  useEffect(() => {
    const fetchTask = async () => {
      if (!returnToken()) {
        setError('No authentication token found. Please log in.');
        showNotification('No authentication token found. Please log in.',"error");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const result = await fetchData(`${servers.main_api}/v1/api/tasks/${id}`, returnToken());
        if (result.error) {
          setError(result.error);
          showNotification(result.error,"error");
        } else {
          setTask(result.data?.task);
          // If task is completed, load the user's previous answers
          if (result.data?.task?.isComplete && result.data?.task?.submissions?.length > 0) {
            const submission = result.data.task.submissions[0];
            const answersObj = {};
            submission.answers.forEach(answer => {
              answersObj[answer.questionIndex] = answer.selectedAnswerIndex;
            });
            setSelectedAnswers(answersObj);
          }
        }
      } catch (err) {
        setError(err.message);
        showNotification(err.message,"error");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    // Only allow selection if quiz is not completed and not past due date
    if (task.isComplete || (task.hasDueDate && task.dueDate && new Date() > new Date(task.dueDate))) {
      return;
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const handleSubmit = async () => {
    if (!task || task.isComplete || (task.hasDueDate && task.dueDate && new Date() > new Date(task.dueDate))) {
      showNotification('Cannot submit: Quiz already completed or past due date.',"error");
      return;
    }

    if (Object.keys(selectedAnswers).length !== task.questions.length) {
      showNotification('Please answer all questions before submitting.',"error");
      return;
    }

    try {
      setIsSubmitting(true);
      const answers = Object.entries(selectedAnswers).map(([questionIndex, selectedAnswerIndex]) => ({
        questionIndex: Number(questionIndex),
        selectedAnswerIndex,
      }));

      const result = await sendData(`${servers.main_api}/v1/api/tasks/${id}/submit`, { answers }, returnToken());

      if (result.error) {
        showNotification(result.error,"error");
        setSubmissionResult({ message: result.error });
      } else {
        showNotification(result.data.message || 'Quiz submitted successfully!',"success");
        setSubmissionResult({
          score: result.data.score,
          message: result.data.message || 'Quiz submitted successfully!'
        });

        // Update task to show it's completed and refresh the data to get correct answers
        const updatedResult = await fetchData(`${servers.main_api}/v1/api/tasks/${id}`, returnToken());
        if (!updatedResult.error) {
          setTask(updatedResult.data?.task);
        }
      }
    } catch (err) {
      setSubmissionResult({ message: err.message });
      showNotification(err.message,"error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Strip markdown for accessibility (basic implementation)
  const stripMarkdown = (text) => text.replace(/`{1,3}[\s\S]*?`{1,3}|\*{1,2}|#{1,6}|[-_*]{2,}/g, '').trim();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br  flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500/30 border-b-cyan-400 rounded-full animate-spin animate-reverse mx-auto"></div>
          </div>
          <Typography variant={"paragraph"} className=" text-lg font-medium">Loading Quiz...</Typography>
          <div className="w-32 h-1 bg-gray-700 rounded-full mx-auto mt-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 sm:p-8 text-center max-w-md w-full">
          <div className="text-red-500 text-6xl mb-4">⚠</div>
          <h2 className="text-red-500 text-xl font-bold mb-2">Error</h2>
          <p className="text-red-400 break-words">{error}</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-600/30 rounded-2xl p-6 sm:p-8 text-center">
          <p className="text-gray-400 text-xl">Quiz not found</p>
        </div>
      </div>
    );
  }

  const canSubmit = !task.isComplete && !(task.hasDueDate && task.dueDate && new Date() > new Date(task.dueDate));
  // eslint-disable-next-line no-prototype-builtins
  const showAnswers = task.isComplete || (task.questions[0]?.answers[0]?.hasOwnProperty('isCorrect'));
  const isPastDueDate = task.hasDueDate && task.dueDate && new Date() > new Date(task.dueDate);
  const answeredCount = Object.keys(selectedAnswers).length;
  const totalQuestions = task.questions.length;
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <div className="h-full bg-gray-100 text-gray-800 dark:bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 dark:text-white relative overflow-hidden overflow-y-scroll">

      <div className="relative z-10 p-4 sm:p-6 pt-8 sm:pt-12 #overflow-y-auto">
        <div className="container mx-auto max-w-4xl ">
          {/* Header Section */}
          <div className=" backdrop-blur-xl border border-gray-700/70 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-2xl">
            <div className="flex flex-col space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg sm:text-xl font-bold">Q</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <Typography variant={"h1"} className="text-xl sm:text-2xl lg:text-3xl font-bold  break-words">
                        {task.title}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:mt-2">
                    <Typography className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                      {task.type}
                    </Typography>
                    <Typography className="text-sm">
                      {totalQuestions} Question{totalQuestions !== 1 ? 's' : ''}
                    </Typography>
                  </div>
                </div>

                {!task.isComplete && canSubmit && (
                  <div className="sm:text-right">
                    <Typography className=" text-sm mb-1">Progress</Typography>
                    <div className="flex items-center space-x-3">
                      <div className="w-20 sm:w-24 h-2 bg-gray-500 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <Typography className="font-medium text-sm whitespace-nowrap">
                        {answeredCount}/{totalQuestions}
                      </Typography>
                    </div>
                  </div>
                )}
              </div>

              <div className="prose prose-invert prose-sm sm:prose-base max-w-none overflow-hidden">
                <div className="break-words ">
                  <Markdown content={task.description} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {task.course && (
                  <Link
                    to={`/courses/${task.course}`}
                    className="group px-3 sm:px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-400/50 text-blue-500 hover:text-blue-300 rounded-xl transition-all duration-300 text-sm font-medium"
                  >
                    <span className="group-hover:scale-105 inline-block transition-transform">
                      📚 Course
                    </span>
                  </Link>
                )}
                {task.practice && task.practice.course && task.practice.id && (
                  <Link
                    to={`/courses/${task.practice.course}?topic=${task.practice.id}`}
                    className="group px-3 sm:px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:border-green-400/50 text-green-500 hover:text-green-300 rounded-xl transition-all duration-300 text-sm font-medium"
                  >
                    <span className="group-hover:scale-105 inline-block transition-transform">
                      🎯 {task.practice.title?.trim() || 'Practice'}
                    </span>
                  </Link>
                )}

                <IconLink links={task?.usefulLinks||[]}/>

                {task.hasDueDate && task.dueDate && (
                  <div className="px-3 sm:px-4 py-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 rounded-xl text-sm font-medium">
                    <span className="hidden sm:inline">⏰ Due: </span>
                    <span className="sm:hidden">⏰ </span>
                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                      timeZone: 'Africa/Harare',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {task.isComplete && (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-green-500/30 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-xl">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/30 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-green-500 text-xl sm:text-2xl">✓</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-green-600 text-lg sm:text-xl font-bold">Quiz Completed!</h3>
                  {task.submissions && task.submissions.length > 0 && (
                    <p className="text-green-500 text-sm sm:text-base break-words">
                      Final Score: <span className="font-bold text-yellow-900">{task.submissions[0].score}</span> / {task.questions.reduce((sum, q) => sum + (q.mark || 1), 0)} points
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {isPastDueDate && !task.isComplete && (
            <div className="bg-gradient-to-r from-red-500/30 to-pink-500/30 backdrop-blur-xl border border-red-500/50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-xl">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/40 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 text-xl sm:text-2xl">⏰</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-red-600 text-lg sm:text-xl font-bold">Deadline Passed</h3>
                  <p className="text-red-500 text-sm sm:text-base">This quiz is no longer accepting submissions.</p>
                </div>
              </div>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-6 sm:space-y-8 ">
            {task.questions.map((question, qIndex) => (
              <div
                key={question._id}
                className="bg-gray-100 backdrop-blur-xl border border-gray-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500"
              >
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{qIndex + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0 mb-4">
                      <div className="prose text-black/90 prose-invert prose-sm sm:prose-base max-w-none flex-1 min-w-0 overflow-hidden">
                        <div className="break-words">
                          <Markdown content={question.text} />
                        </div>
                      </div>
                      <div className="flex-shrink-0 sm:ml-4">
                        <div className="px-3 py-1 bg-yellow-500/20 text-yellow-900 rounded-full text-sm font-medium whitespace-nowrap">
                          {question.mark || 1} pts
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {question.answers.map((answer, aIndex) => {
                        const isSelected = selectedAnswers[qIndex] === aIndex;
                        const isCorrect = showAnswers && answer.isCorrect;
                        const isIncorrect = showAnswers && isSelected && !answer.isCorrect;
                        const isDisabled = !canSubmit || task.isComplete;

                        let answerClasses = `group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 transform hover:scale-[1.01] sm:hover:scale-[1.02] `;

                        if (isCorrect) {
                          answerClasses += 'border-green-500/50 bg-gradient-to-r from-green-500/20 to-emerald-500/20 shadow-lg shadow-green-500/10 ';
                        } else if (isIncorrect) {
                          answerClasses += 'border-red-500/50 bg-gradient-to-r from-red-500/20 to-pink-500/20 shadow-lg shadow-red-500/10 ';
                        } else if (isSelected) {
                          answerClasses += 'border-purple-500/50 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 shadow-lg shadow-purple-500/10 ';
                        } else {
                          answerClasses += 'border-gray-600/30 bg-gray-700/20 hover:border-gray-500/50 hover:bg-gray-700/30 ';
                        }

                        if (isDisabled) {
                          answerClasses += 'cursor-not-allowed opacity-70';
                        } else {
                          answerClasses += 'cursor-pointer';
                        }

                        return (
                          <div
                            key={answer._id}
                            className={answerClasses}
                            onClick={() => !isDisabled && handleAnswerSelect(qIndex, aIndex)}
                            role="button"
                            aria-label={`Select answer: ${stripMarkdown(answer.text)}`}
                            tabIndex={isDisabled ? -1 : 0}
                            onKeyDown={(e) => !isDisabled && e.key === 'Enter' && handleAnswerSelect(qIndex, aIndex)}
                          >
                            <div className="flex text-black/90 flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                              <div className="flex items-start space-x-3 flex-1 min-w-0">
                                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center mt-0.5 sm:mt-1 flex-shrink-0 transition-all duration-300 ${
                                  isSelected 
                                    ? isCorrect 
                                      ? 'border-green-400 bg-green-500' 
                                      : isIncorrect 
                                        ? 'border-red-500 bg-red-500'
                                        : 'border-purple-400 bg-purple-400'
                                    : 'border-gray-500 group-hover:border-gray-400'
                                }`}>
                                  {isSelected && (
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                                  )}
                                </div>
                                <div className="prose prose-invert prose-sm sm:prose-base max-w-none flex-1 min-w-0 overflow-hidden">
                                  <div className="break-words">
                                    <Markdown content={answer.text} />
                                  </div>
                                </div>
                              </div>

                              {showAnswers && (
                                <div className="flex flex-wrap gap-2 sm:ml-4">
                                  {isCorrect && (
                                    <div className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-green-600/10 text-green-900 rounded-full text-xs sm:text-sm font-medium">
                                      <span>✓</span>
                                      <span>Correct</span>
                                    </div>
                                  )}
                                  {isSelected && !isCorrect && (
                                    <div className="flex items-center space-x-1 px-2 sm:px-3 py-1 bg-red-600/20 text-red-900 rounded-full text-xs sm:text-sm font-medium">
                                      <span>✗</span>
                                      <span>Your Choice</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          {canSubmit && !showAnswers && (
            <div className="mt-8 sm:mt-12 text-center">
              <button
                onClick={handleSubmit}
                disabled={answeredCount !== totalQuestions || isSubmitting}
                className="group relative px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-purple-500/25 w-full sm:w-auto"
              >
                <div className="flex items-center justify-center space-x-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Quiz</span>
                      <span className="text-lg sm:text-xl group-hover:translate-x-1 transition-transform">🚀</span>
                    </>
                  )}
                </div>

                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
              </button>

              <div className="mt-4 text-gray-400 text-sm sm:text-base px-4">
                {answeredCount < totalQuestions ? (
                  <p>Please answer all questions to submit ({totalQuestions - answeredCount} remaining)</p>
                ) : (
                  <p>All questions answered! Ready to submit.</p>
                )}
              </div>
            </div>
          )}

          {/* Submission Result */}
          {submissionResult && (
            <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl sm:text-2xl">🎉</span>
                </div>
                <h3 className="text-blue-400 text-lg sm:text-xl font-bold mb-2">Quiz Submitted!</h3>
                <p className="text-blue-300 mb-4 text-sm sm:text-base break-words">{submissionResult.message}</p>
                {submissionResult.score !== undefined && (
                  <div className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-yellow-900/10 text-yellow-900 rounded-xl font-bold text-base sm:text-lg">
                    <span>Final Score:</span>
                    <span className="text-yellow-900 text-lg sm:text-2xl">
                      {submissionResult.score} / {task.questions.reduce((sum, q) => sum + (q.mark || 1), 0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;