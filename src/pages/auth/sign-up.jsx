import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import {Link, useNavigate} from "react-router-dom";
import Dropzone from "react-dropzone";
import {useState} from "react";
import {useNotification} from "@/context/NotificationContext.jsx";
import {servers} from "@/configs/index.js";
import {sendData, setToken} from "@/utils/index.js";


export function SignUp() {
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [loader, setLoader] = useState(false);
    const [rePassword, setRePassword] = useState(false);
    const [image,setImage]=useState(null)
    const [data, setData] = useState({
        email: '',
        phone: '',
        password: '',
        firstName: '',
        lastName: '',
        image:null
    });
    const handleOnChange = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    }
    const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      showNotification("Passwords do not match. Please try again.","warning");
      return;
    }

    try {
      setLoader(true);
      const result = await sendData(`${servers.main_api}/register`, data, "");
      if (result.error) {
        showNotification(result.error,"error");
      } else {
        setToken(result.data.token);
        navigate(`/auth/otp/${data.email}`);
      }
    } catch (error) {
      showNotification(error.message,"error");
    } finally {
      setLoader(false);
    }
  };

    const imageDivStyle = {
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "12rem",
        height: "12rem",
    };

    const handleDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            setImage(event.target.result);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };
  return (
    <section className="h-screen p-2 flex overflow-hidden">
      <div className="w-2/5 h-full  my-auto hidden lg:block">
        <img
          src="/img/pattern.png"
          className="object-cover h-full w-full rounded-3xl"
        />
      </div>
      <div className="w-full  h-[99%] pt-16  lg:w-3/5  flex-col items-center justify-center overflow-y-scroll ">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Join Us Today</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to register.</Typography>
        </div>
        <div className="space-y-4 mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            <Button size="lg" color="white" className="flex items-center gap-2 justify-center shadow-md" fullWidth>
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1156_824)">
                  <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4" />
                  <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853" />
                  <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04" />
                  <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335" />
                </g>
                <defs>
                  <clipPath id="clip0_1156_824">
                    <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                  </clipPath>
                </defs>
              </svg>
              <span>Sign in With Google</span>
            </Button>
          </div>
        <form onSubmit={handleSubmit} className="pt-8 pb-6 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          {/* Profile Image Upload */}
          <div className="flex justify-center mb-8">
              <Dropzone onDrop={handleDrop} accept="image/*">
                  {({getRootProps, getInputProps}) => (
                      <div
                          {...getRootProps()}
                          className="relative group cursor-pointer transition-all duration-300 hover:scale-105"
                      >
                          <input {...getInputProps()} type="file"/>
                          <div
                              className="w-24 h-24 rounded-full border-2 border-dashed border-cyan-400/50 flex items-center justify-center backdrop-blur-sm bg-white/5 hover:border-cyan-400 hover:bg-white/10 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-400/25"
                              style={image ? {...imageDivStyle, width: '6rem', height: '6rem'} : {}}
                          >
                              {!image && (
                                  <div className="text-center">
                                      {/*<FaCloudUploadAlt className="mx-auto text-cyan-400 text-2xl mb-1" />*/}
                                      <span className="text-xs text-gray-400">Upload</span>
                                  </div>
                              )}
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center border-2 border-slate-900">
                                  {/*<FaPlus className="text-xs text-white" />*/}
                              </div>
                          </div>
                      </div>
                  )}
              </Dropzone>
          </div>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Full name
            </Typography>
            <div className="flex md:flex-row flex-col  items-center gap-2">
              <Input
                size="lg"
                placeholder="First name"
                value={data.firstName}
                name="firstName"
                onChange={handleOnChange}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <Input
                size="lg"
                placeholder="Last name"
                value={data.lastName}
                name="lastName"
                onChange={handleOnChange}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
            </div>
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Phone Number
            </Typography>
            <Input
              size="lg"
              placeholder="250 733 ... ... "
              type="number"
              value={data.phone}
              name="phone"
              onChange={handleOnChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={data.email}
              name="email"
              onChange={handleOnChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              size="lg"
              placeholder="Password@123"
              type="password"
              value={data.password}
              name="password"
              onChange={handleOnChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <p className="text-xs text-gray-500 px-2">
                Secure: 8+ chars, number, uppercase, lowercase, special character
            </p>
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Confirm Password
            </Typography>
            <Input
              size="lg"
              placeholder="Password@123"
              type="password"
              value={rePassword}
              name="rePassword"
              onChange={(e)=>setRePassword(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            required={true}
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button className="mt-6" type={"submit"} fullWidth disabled={loader}>
            Register Now
          </Button>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/auth/sign-in" className="text-gray-900 ml-1">Sign in</Link>
          </Typography>
        </form>

      </div>
    </section>
  );
}

export default SignUp;
