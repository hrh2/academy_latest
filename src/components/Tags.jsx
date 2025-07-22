import { HiAcademicCap } from "react-icons/hi2";
import { MdRocketLaunch } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import {Button, Typography} from "@material-tailwind/react";
import {getLinkStyle} from "./IconLink.jsx";
import Markdown from "@/components/Markdown.jsx";

export const ModernClassesTags = ({ tags, isShort }) => {
  const fixedGradients = [
    'from-blue-700 to-blue-900',
    'from-purple-700 to-purple-900',
    'from-green-700 to-emerald-800',
    'from-rose-700 to-pink-900',
    'from-slate-700 to-slate-900'
  ];

  return (
    <div className="flex flex-wrap gap-3 w-full justify-start">
      {tags.map((tag, index) => {
        const gradient = fixedGradients[index % fixedGradients.length];

        return (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-xl bg-gradient-to-r ${gradient} p-[1px] hover:scale-105 transition-transform duration-300 cursor-pointer`}
          >
            <Button className={`flex gap-2`} variant="gradient">
              <HiAcademicCap className={`text-slate-700 `} size={20}/>
              <span
                className={`font-medium #text-slate-600 ${gradient}`}
              >
                {isShort
                  ? (typeof tag === 'string'
                      ? tag.slice(0, 10) + "..."
                      : tag.name
                        ? tag.name.slice(0, 10) + "..."
                        : "Unknown")
                  : typeof tag === 'string'
                  ? tag
                  : tag.name || "Unknown"}
              </span>
            </Button>
          </div>
        );
      })}

      {tags.length < 1 && (
        <div className="w-full text-center py-12">
          <div className="bg-white/60 dark:bg-gradient-to-br dark:from-slate-800/40 dark:to-slate-900/60 backdrop-blur-sm border border-slate-200/40 dark:border-slate-700/40 rounded-2xl p-8">
            <SiGoogleclassroom className="mx-auto text-6xl text-slate-700 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-slate-400 dark:to-slate-600 mb-4" />
            <p className="text-slate-800 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-slate-300 dark:to-slate-500 text-lg mb-4">
              You currently have no classes assigned
            </p>
            <a
              href="/classes"
              className="inline-flex items-center space-x-2 font-semibold"

            >
              <Button variant={"gradient"} className={`flex gap-3`}>
                  <Typography>Request a Class</Typography>
                  <MdRocketLaunch className="text-lg" />
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};


// eslint-disable-next-line react/prop-types
export const IconLink= ({ links }) => {
    // Filter out links containing 'solution' or 'sln'
    // eslint-disable-next-line react/prop-types
    const filteredLinks = links.filter(
        (link) =>
            !link.name.toLowerCase().includes('private') &&
            !link.name.toLowerCase().includes('private2')
    );

    return (
        <div className="flex gap-2">
            {filteredLinks.map((link, index) => {
                const { color, icon } = getLinkStyle(link.name);
                return (
                        <a key={index} href={link.url}  title={link.name} className={`items-center justify-center p-2 rounded-lg #text-gray-300 #bg-gray-100 #hover:bg-gray-700`}>
                            <span className={color}>{icon}</span>
                        </a>
                );
            })}
        </div>
    );
};


export  const LinksList = ({ links }) => {
    // Filter out links containing 'solution' or 'sln'
    // eslint-disable-next-line react/prop-types
    const filteredLinks = links.filter(
        (link) =>
            !link.name.toLowerCase().includes('solution') &&
            !link.name.toLowerCase().includes('sln')
    );

    return (
        <div className="p-2 flex flex-col gap-3 ">
            {filteredLinks.map((link, index) => {
                const { color, icon } = getLinkStyle(link.name);
                return (
                    <div key={index} className={`flex items-center gap-4 p-2 border rounded-lg shadow-md border-gray-700`}>
                        <a href={link.url}
                           className={`inline-flex text-sm items-center justify-center p-2 font-medium rounded-lg text-gray-800 bg-gray-100 hover:bg-gray-700 hover:text-white`}>
                            <span className={color}>{icon}</span>
                            <span className="w-full font-semibold">{link.name}</span>
                            <svg className="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </a>
                        <div className=" text-gray-900">{link.description}</div>
                    </div>
                );
            })}
        </div>
    );
};




// eslint-disable-next-line react/prop-types
const LinkComponent = ({ link }) => {
    // Filter out links containing 'solution' or 'sln'
    // eslint-disable-next-line react/prop-types
    const filteredLinks = [link].filter(
        (link) =>
            !link.name.toLowerCase().includes('private') &&
            !link.name.toLowerCase().includes('private2')
    );

    return (
        <div className="flex flex-col gap-3 ">
            {filteredLinks.map((link, index) => {
                const { color, icon } = getLinkStyle(link.name);
                return (
                    <div key={index} className={`flex flex-col h-full  #md:flex-row items-center gap-4 p-1 border rounded-lg shadow-md border-gray-700`}>
                        <a href={link.url} className={`inline-flex items-center justify-center p-2  font-medium rounded-lg text-gray-900 bg-white hover:bg-gray-100 hover:text-gray-700`}>
                            <span className={color}>{icon}</span>
                            <span className="w-full font-semibold text-xs">{link.name}</span>
                            <svg className="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </a>
                        <Markdown content= {link.description}/>
                    </div>
                );
            })}
        </div>
    );
};

export default LinkComponent;
