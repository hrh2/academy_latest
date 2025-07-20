import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button, Spinner,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
  UserIcon,
  PhoneIcon, ShieldCheckIcon
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { platformSettingsData, conversationsData, projectsData } from "@/data";
import {useEffect, useState} from "react";
import {useNotification} from "@/context/NotificationContext.jsx";
import {servers} from "@/configs/index.js";
import {fetchData, returnToken, setToken, updateData} from "@/utils/index.js";
import {XMarkIcon} from "@heroicons/react/24/outline";
import Loader from "@/components/Loader.jsx";

export function Profile() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [loader, setLoader] = useState(false);
  const { showNotification } = useNotification();

  const fetchUserProfile = async () => {
        setLoader(true);
        try {
            const result = await fetchData(`${servers.main_api}/profile`, returnToken());
            if (result.error) {
                showNotification(result.error,"error");
            } else {
                setFormData(result.data);
                setUser(result.data);
            }
        } catch (error) {
            showNotification("Failed to fetch profile.","error");
        }finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        if (!formData.password) {
            showNotification("Password is required.","warning");
            return;
        }
        try {
            setLoader(true);
            const result = await updateData(
                `${servers.main_api}/profile`,
                formData,
                returnToken()
            );
            if (result.error) {
                showNotification(result.error,"error");
            } else {
                showNotification(result.message,"success");
                setToken(result.data.token);
                await  fetchUserProfile();
                setEditMode(false);
            }
        } catch (error) {
            showNotification(error.message,"error");
        } finally {
            setLoader(false);
        }
    };

    if (loader) {
        return <Loader/>
    }

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src={user?.image || '/api/placeholder/240/240'}
                alt="bruce-mars"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {/*CEO / Co-Founder*/}
                </Typography>
              </div>
            </div>
            <div className="w-96">
              <Tabs value="app">
                <TabsHeader>
                  <Tab value="app">
                    <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    App
                  </Tab>
                  <Tab value="message">
                    <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                    Message
                  </Tab>
                  <Tab value="settings">
                    <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Settings
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
            <div>
              <div className="mb-8">
                <div className="bg-gray-500/5 backdrop-blur-md rounded-2xl border border-black/10 p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-4">
                            {/*<Mail className="w-5 h-5 text-purple-400" />*/}
                            <div>
                                <Typography className="font-medium mb-1">Email Address</Typography>
                                <Typography className="text-lg font-semibold">{user.email}</Typography>
                            </div>
                        </div>
                        <a
                            href="?edit-email=true"
                            className="p-3 bg-gray-500/10 backdrop-blur-md rounded-xl border border-black/20 hover:bg-gray-500/20 hover:scale-110 transition-all duration-300 group"
                        >
                            <PencilIcon className="inline-block h-5 w-5 group-hover:scale-110 transition-colors duration-300" />
                        </a>
                    </div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                  <EditableField
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      editMode={editMode}
                      handleChange={handleChange}
                      icon={UserIcon}
                  />

                  <EditableField
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      editMode={editMode}
                      handleChange={handleChange}
                      icon={UserIcon}
                  />

                  <EditableField
                      label="Phone (+250)"
                      name="phone"
                      value={formData.phone}
                      editMode={editMode}
                      handleChange={handleChange}
                      icon={PhoneIcon}
                  />

                  {editMode && (
                      <PasswordInput
                          value={formData.password}
                          onChange={handleChange}
                      />
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-6 mb-8">
                  {editMode ? (
                      <div className="flex items-center gap-4">
                          {!loader ? (
                              <>
                                  <Button variant="gradient"
                                      className="inline-flex items-center gap-3 px-8 py-4 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                                      onClick={handleUpdate}
                                  >
                                      Save Changes
                                  </Button>
                                  <button
                                      onClick={() => setEditMode(false)}
                                      className="p-4 bg-gray-500/10 backdrop-blur-md rounded-2xl border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 hover:scale-110 group"
                                  >
                                      <XMarkIcon className="h-6 w-6 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
                                  </button>
                              </>
                          ) : (
                              <div className="flex items-center gap-3 px-8 py-4 bg-gray-500/10 backdrop-blur-md rounded-2xl border border-black/20">
                                  <Spinner className={""}/>
                                  <span className="text-black font-medium">Saving...</span>
                              </div>
                          )}
                      </div>
                  ) : (
                      <Button variant="gradient"
                          className="inline-flex items-center gap-3 px-8 py-4 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                          onClick={() => setEditMode(true)}
                      >
                          <PencilIcon className="h-6 w-6 inline" />
                          Edit Profile
                      </Button>
                  )}
              </div>

            </div>

            <div>
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Platform Settings
              </Typography>
              <div className="flex flex-col gap-12">
                {platformSettingsData.map(({ title, options }) => (
                  <div key={title}>
                    <Typography className="mb-4 block text-xs font-semibold uppercase text-blue-gray-500">
                      {title}
                    </Typography>
                    <div className="flex flex-col gap-6">
                      {options.map(({ checked, label }) => (
                        <Switch
                          key={label}
                          id={label}
                          label={label}
                          defaultChecked={checked}
                          labelProps={{
                            className: "text-sm font-normal text-blue-gray-500",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="px-4 pb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Projects
            </Typography>
            <Typography
              variant="small"
              className="font-normal text-blue-gray-500"
            >
              Architects design houses
            </Typography>
            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
              {projectsData.map(
                ({ img, title, description, tag, route, members }) => (
                  <Card key={title} color="transparent" shadow={false}>
                    <CardHeader
                      floated={false}
                      color="gray"
                      className="mx-0 mt-0 mb-4 h-64 xl:h-40"
                    >
                      <img
                        src={img}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    </CardHeader>
                    <CardBody className="py-0 px-1">
                      <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500"
                      >
                        {tag}
                      </Typography>
                      <Typography
                        variant="h5"
                        color="blue-gray"
                        className="mt-1 mb-2"
                      >
                        {title}
                      </Typography>
                      <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500"
                      >
                        {description}
                      </Typography>
                    </CardBody>
                    <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
                      <Link to={route}>
                        <Button variant="outlined" size="sm">
                          view project
                        </Button>
                      </Link>
                      <div>
                        {members.map(({ img, name }, key) => (
                          <Tooltip key={name} content={name}>
                            <Avatar
                              src={img}
                              alt={name}
                              size="xs"
                              variant="circular"
                              className={`cursor-pointer border-2 border-black ${
                                key === 0 ? "" : "-ml-2.5"
                              }`}
                            />
                          </Tooltip>
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                )
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

const EditableField = ({ label, name, value, editMode, handleChange, icon: Icon }) => (
    <div className="group">
        <div className="bg-gray-500/5 backdrop-blur-md rounded-2xl border border-black/10 p-2 hover:bg-gray-500/10 transition-all duration-300 hover:border-purple-500/30">
            <div className="flex items-center gap-4 mb-1">
                {Icon && <Icon className="w-5 h-5" />}
                <label htmlFor={name} className="">
                  <Typography
                        variant="medium"
                        className="font-normal text-blue-gray-500"
                  >
                    {label}
                  </Typography>
                </label>
            </div>
            {editMode ? (
                <div className="relative">
                    <input
                        type="text"
                        name={name}
                        value={value || ""}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-500/10 backdrop-blur-md rounded-xl border border-black/20 text-blue-gray-900  placeholder-blue-gray-800 focus:outline-none focus:ring-2 focus:accent-blue-gray-500/50 focus:border-blue-gray-500/50 transition-all duration-300"
                        placeholder={`Enter ${label.toLowerCase()}`}
                    />
                </div>
            ) : (
                <Typography variant="h6" color="blue-gray" className="pl-4">{value || 'Not provided'}</Typography>
            )}
        </div>
    </div>
);

// eslint-disable-next-line react/prop-types
const PasswordInput = ({ value, onChange }) => (
    <div className="bg-gray-500/5 backdrop-blur-md rounded-2xl border border-black/10 p-2">
        <div className="flex items-center gap-2 mb-1">
            <ShieldCheckIcon className="w-5 h-5 " />
            <label className="">
              Confirm Password</label>
        </div>
        <div className="relative">
            <input
                type="password"
                name="password"
                id="password"
                value={value || ""}
                onChange={onChange}
                className="w-full p-4 bg-gray-500/10 backdrop-blur-md rounded-xl border border-black/20 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                placeholder="Enter your password to confirm changes"
                required
            />
        </div>
    </div>
);

export default Profile;
