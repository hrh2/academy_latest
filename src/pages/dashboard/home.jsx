import React, {useEffect, useState} from "react";
import { HiSparkles, HiAcademicCap } from "react-icons/hi2";
import {Typography, Spinner, Button} from "@material-tailwind/react";
import {useAuth} from "@/context/AuthContext.jsx";
import {useNotification} from "@/context/NotificationContext.jsx";
import {servers} from "@/configs/index.js";
import {fetchData, returnToken} from "@/utils/index.js";
import Quote from "@/components/Quote.jsx";
import {SiGoogleclassroom} from "react-icons/si";
import {ModernClassesTags} from "@/components/Tags.jsx";
import {ModernListTopics, ModernSummaryCard} from "@/components/Cards.jsx";
import {BiBookmark, BiCalendar, BiStats} from "react-icons/bi";
import {MdDataUsage} from "react-icons/md";
import Loader from "@/components/Loader.jsx";

export function Home() {
  const {userData } = useAuth();
  const { showNotification } = useNotification();
  const [loader, setLoader] = useState(true);
  const [dashboardData, setDashboardData] = useState({
        globalCourses: [],
        classCourses: [],
        interestedCourses: [],
        classes: [],
        totalUpcomingEvents: 0,
        totalClassCourses: 0,
        totalInterestCourses: 0,
        role: 'GUEST',
    });
  useEffect(() => {
        if (!userData) return;

        async function main() {
            try {
                setLoader(true);
                const result = await fetchData(`${servers.main_api}/dashboard`, returnToken());

                if (result.error) {
                    let errorMessage = result.error;
                    if (!userData.isVerified) {
                        errorMessage += ", Please Remember to Verify your Account!";
                    }
                    showNotification(errorMessage,'warning');
                    return;
                }

                setDashboardData(result.data);

                if (!userData.isVerified) {
                    showNotification("Please Verify your Account to access all features !!!","warning");
                }
            } catch (error) {
                showNotification(error.message,"error");
            } finally {
                setLoader(false);
            }
        }

        main();
    }, [userData]);

  if (loader) {
        return <Loader/>;
  }
  return (
    <div className="mt-12">
      <div className="container px-6 mx-auto pt-8">
        <div className="mb-12 p-4 bg-white rounded-xl border border-blue-gray-100 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-gray-900 to-blue-gray-800 rounded-xl">
                  <HiSparkles className="text-2xl text-white" />
              </div>
             <Typography variant="h5" color="blue-gray">
                  Dashboard
             </Typography>
          </div>
          <Quote />
        </div>
        <div className="mb-12 p-4 bg-white rounded-xl border border-blue-gray-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-gradient-to-br from-blue-gray-900 to-blue-gray-800 rounded-xl">
                <SiGoogleclassroom className="text-xl text-white" />
                </div>
                <Typography variant="h5" color="blue-gray">
                    My Classes
                </Typography>
            </div>
            <ModernClassesTags isShort={false} tags={dashboardData?.classes ?? ["Currently you have no any class"]} />
        </div>
          {/* Summary Section */}
        <div className="mb-12 p-4 bg-white rounded-xl border border-blue-gray-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-gradient-to-br from-blue-gray-900 to-blue-gray-800 rounded-xl">
                    <BiStats className="text-xl text-white" />
                </div>
                <Typography variant="h5" color="blue-gray">
                    Overview
                </Typography>
            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                <ModernSummaryCard
                    title="Class Courses"
                    value={dashboardData.totalClassCourses}
                    icon={BiBookmark}
                    gradient="from-cyan-500 to-blue-500"
                    link="/courses"
                />
                <ModernSummaryCard
                    title="Interest Courses"
                    value={dashboardData.totalInterestCourses}
                    icon={HiAcademicCap}
                    gradient="from-orange-500 to-pink-500"
                    link="/courses"
                />
                <ModernSummaryCard
                    title="Upcoming Events"
                    value={dashboardData.totalUpcomingEvents}
                    icon={BiCalendar}
                    gradient="from-green-500 to-teal-500"
                    link="/courses"
                />
            </div>
        </div>
        <div className="mb-8 bg-white p-4 rounded-xl border border-blue-gray-100 shadow-sm">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-2 bg-gradient-to-br from-blue-gray-900 to-blue-gray-800 rounded-xl">
                    <MdDataUsage className="text-xl text-white" />
                </div>
                <Typography variant="h5" color="blue-gray">
                    My Courses
                </Typography>
            </div>

            {[...dashboardData.classCourses||[],...dashboardData.interestedCourses||[]].length > 0 ? (
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
                    {[...dashboardData.classCourses||[],...dashboardData.interestedCourses||[]].map((course, index) => (
                        <div key={index} className="group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-700/30 rounded-2xl"></div>
                            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 hover:border-blue-gray-600/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-gray-600/10">
                                <div className="flex items-center justify-between mb-6">
                                    <a href={`/courses/${course._id}`} className="font-bold flex-1">
                                        <Typography>
                                            {course.name}
                                        </Typography>
                                    </a>
                                    {index === 0 && (
                                        <Button variant="gradient" color={"blue-gray"} className={`p-2 rounded-lg`}>
                                            Latest
                                        </Button>
                                    )}
                                </div>
                                <ModernListTopics topics={course.practice} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 backdrop-blur-sm border border-slate-600/30 rounded-2xl p-12">
                        <MdDataUsage className="mx-auto text-6xl text-slate-500 mb-6" />
                        <h3 className="text-xl font-semibold text-slate-300 mb-2">No Courses Yet</h3>
                        <Typography className="text-slate-400">Start your learning journey by exploring available courses</Typography>
                    </div>
                </div>
            )}
        </div>

      </div>
      {/*<div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">*/}
      {/*  {statisticsChartsData.map((props) => (*/}
      {/*    <StatisticsChart*/}
      {/*      key={props.title}*/}
      {/*      {...props}*/}
      {/*      footer={*/}
      {/*        <Typography*/}
      {/*          variant="small"*/}
      {/*          className="flex items-center font-normal text-blue-gray-600"*/}
      {/*        >*/}
      {/*          <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />*/}
      {/*          &nbsp;{props.footer}*/}
      {/*        </Typography>*/}
      {/*      }*/}
      {/*    />*/}
      {/*  ))}*/}
      {/*</div>*/}

      {/*<div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">*/}
      {/*  <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">*/}
      {/*    <CardHeader*/}
      {/*      floated={false}*/}
      {/*      shadow={false}*/}
      {/*      color="transparent"*/}
      {/*      className="m-0 flex items-center justify-between p-6"*/}
      {/*    >*/}
      {/*      <div>*/}
      {/*        <Typography variant="h6" color="blue-gray" className="mb-1">*/}
      {/*          Projects*/}
      {/*        </Typography>*/}
      {/*        <Typography*/}
      {/*          variant="small"*/}
      {/*          className="flex items-center gap-1 font-normal text-blue-gray-600"*/}
      {/*        >*/}
      {/*          <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />*/}
      {/*          <strong>30 done</strong> this month*/}
      {/*        </Typography>*/}
      {/*      </div>*/}
      {/*      <Menu placement="left-start">*/}
      {/*        <MenuHandler>*/}
      {/*          <IconButton size="sm" variant="text" color="blue-gray">*/}
      {/*            <EllipsisVerticalIcon*/}
      {/*              strokeWidth={3}*/}
      {/*              fill="currenColor"*/}
      {/*              className="h-6 w-6"*/}
      {/*            />*/}
      {/*          </IconButton>*/}
      {/*        </MenuHandler>*/}
      {/*        <MenuList>*/}
      {/*          <MenuItem>Action</MenuItem>*/}
      {/*          <MenuItem>Another Action</MenuItem>*/}
      {/*          <MenuItem>Something else here</MenuItem>*/}
      {/*        </MenuList>*/}
      {/*      </Menu>*/}
      {/*    </CardHeader>*/}
      {/*    <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">*/}
      {/*      <table className="w-full min-w-[640px] table-auto">*/}
      {/*        <thead>*/}
      {/*          <tr>*/}
      {/*            {["companies", "members", "budget", "completion"].map(*/}
      {/*              (el) => (*/}
      {/*                <th*/}
      {/*                  key={el}*/}
      {/*                  className="border-b border-blue-gray-50 py-3 px-6 text-left"*/}
      {/*                >*/}
      {/*                  <Typography*/}
      {/*                    variant="small"*/}
      {/*                    className="text-[11px] font-medium uppercase text-blue-gray-400"*/}
      {/*                  >*/}
      {/*                    {el}*/}
      {/*                  </Typography>*/}
      {/*                </th>*/}
      {/*              )*/}
      {/*            )}*/}
      {/*          </tr>*/}
      {/*        </thead>*/}
      {/*        <tbody>*/}
      {/*          {projectsTableData.map(*/}
      {/*            ({ img, name, members, budget, completion }, key) => {*/}
      {/*              const className = `py-3 px-5 ${*/}
      {/*                key === projectsTableData.length - 1*/}
      {/*                  ? ""*/}
      {/*                  : "border-b border-blue-gray-50"*/}
      {/*              }`;*/}

      {/*              return (*/}
      {/*                <tr key={name}>*/}
      {/*                  <td className={className}>*/}
      {/*                    <div className="flex items-center gap-4">*/}
      {/*                      <Avatar src={img} alt={name} size="sm" />*/}
      {/*                      <Typography*/}
      {/*                        variant="small"*/}
      {/*                        color="blue-gray"*/}
      {/*                        className="font-bold"*/}
      {/*                      >*/}
      {/*                        {name}*/}
      {/*                      </Typography>*/}
      {/*                    </div>*/}
      {/*                  </td>*/}
      {/*                  <td className={className}>*/}
      {/*                    {members.map(({ img, name }, key) => (*/}
      {/*                      <Tooltip key={name} content={name}>*/}
      {/*                        <Avatar*/}
      {/*                          src={img}*/}
      {/*                          alt={name}*/}
      {/*                          size="xs"*/}
      {/*                          variant="circular"*/}
      {/*                          className={`cursor-pointer border-2 border-white ${*/}
      {/*                            key === 0 ? "" : "-ml-2.5"*/}
      {/*                          }`}*/}
      {/*                        />*/}
      {/*                      </Tooltip>*/}
      {/*                    ))}*/}
      {/*                  </td>*/}
      {/*                  <td className={className}>*/}
      {/*                    <Typography*/}
      {/*                      variant="small"*/}
      {/*                      className="text-xs font-medium text-blue-gray-600"*/}
      {/*                    >*/}
      {/*                      {budget}*/}
      {/*                    </Typography>*/}
      {/*                  </td>*/}
      {/*                  <td className={className}>*/}
      {/*                    <div className="w-10/12">*/}
      {/*                      <Typography*/}
      {/*                        variant="small"*/}
      {/*                        className="mb-1 block text-xs font-medium text-blue-gray-600"*/}
      {/*                      >*/}
      {/*                        {completion}%*/}
      {/*                      </Typography>*/}
      {/*                      <Progress*/}
      {/*                        value={completion}*/}
      {/*                        variant="gradient"*/}
      {/*                        color={completion === 100 ? "green" : "blue"}*/}
      {/*                        className="h-1"*/}
      {/*                      />*/}
      {/*                    </div>*/}
      {/*                  </td>*/}
      {/*                </tr>*/}
      {/*              );*/}
      {/*            }*/}
      {/*          )}*/}
      {/*        </tbody>*/}
      {/*      </table>*/}
      {/*    </CardBody>*/}
      {/*  </Card>*/}
      {/*  <Card className="border border-blue-gray-100 shadow-sm">*/}
      {/*    <CardHeader*/}
      {/*      floated={false}*/}
      {/*      shadow={false}*/}
      {/*      color="transparent"*/}
      {/*      className="m-0 p-6"*/}
      {/*    >*/}
      {/*      <Typography variant="h6" color="blue-gray" className="mb-2">*/}
      {/*        Orders Overview*/}
      {/*      </Typography>*/}
      {/*      <Typography*/}
      {/*        variant="small"*/}
      {/*        className="flex items-center gap-1 font-normal text-blue-gray-600"*/}
      {/*      >*/}
      {/*        <ArrowUpIcon*/}
      {/*          strokeWidth={3}*/}
      {/*          className="h-3.5 w-3.5 text-green-500"*/}
      {/*        />*/}
      {/*        <strong>24%</strong> this month*/}
      {/*      </Typography>*/}
      {/*    </CardHeader>*/}
      {/*    <CardBody className="pt-0">*/}
      {/*      {ordersOverviewData.map(*/}
      {/*        ({ icon, color, title, description }, key) => (*/}
      {/*          <div key={title} className="flex items-start gap-4 py-3">*/}
      {/*            <div*/}
      {/*              className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${*/}
      {/*                key === ordersOverviewData.length - 1*/}
      {/*                  ? "after:h-0"*/}
      {/*                  : "after:h-4/6"*/}
      {/*              }`}*/}
      {/*            >*/}
      {/*              {React.createElement(icon, {*/}
      {/*                className: `!w-5 !h-5 ${color}`,*/}
      {/*              })}*/}
      {/*            </div>*/}
      {/*            <div>*/}
      {/*              <Typography*/}
      {/*                variant="small"*/}
      {/*                color="blue-gray"*/}
      {/*                className="block font-medium"*/}
      {/*              >*/}
      {/*                {title}*/}
      {/*              </Typography>*/}
      {/*              <Typography*/}
      {/*                as="span"*/}
      {/*                variant="small"*/}
      {/*                className="text-xs font-medium text-blue-gray-500"*/}
      {/*              >*/}
      {/*                {description}*/}
      {/*              </Typography>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        )*/}
      {/*      )}*/}
      {/*    </CardBody>*/}
      {/*  </Card>*/}
      {/*</div>*/}
    </div>
  );
}

export default Home;
