// eslint-disable-next-line no-unused-vars
import React from 'react';
// eslint-disable-next-line react-refresh/only-export-components
import { FaLinkedin, FaYoutube, FaGithub, FaGitAlt, FaFigma, FaMedium, FaDev, FaDropbox, FaStackOverflow, FaKaggle } from 'react-icons/fa';
import { CgFileDocument } from 'react-icons/cg';
import { TbBrowserMaximize, TbBrandNodejs } from 'react-icons/tb';
import { VscVscodeInsiders } from 'react-icons/vsc';
import { MdDeveloperMode } from 'react-icons/md';
import { FcDownload } from 'react-icons/fc';
import { TfiUnlink } from 'react-icons/tfi';
import { SiReplit, SiNotion, SiOpenai, SiNetlify, SiVercel, SiFirebase,SiZoom, SiSketch, SiCodesandbox } from 'react-icons/si';
import { RiChat4Fill } from 'react-icons/ri';

const linkStyles = [
  { keywords: ['linkedin'], color: 'text-blue-700', icon: FaLinkedin },
  { keywords: ['youtube'], color: 'text-red-600', icon: FaYoutube },
  { keywords: ['exam', 'docs'], color: 'text-red-600', icon: CgFileDocument },
  { keywords: ['github'], color: 'text-gray-100', icon: FaGithub },
  { keywords: ['git'], color: 'text-orange-600', icon: FaGitAlt },
  { keywords: ['web'], color: 'text-purple-600', icon: TbBrowserMaximize },
  { keywords: ['visual studio'], color: 'text-blue-600', icon: VscVscodeInsiders },
  { keywords: ['dev2'], color: 'text-green-700', icon: MdDeveloperMode },
  { keywords: ['download'], color: 'text-green-700', icon: FcDownload },
  { keywords: ['node'], color: 'text-green-700', icon: TbBrandNodejs },
  { keywords: ['figma'], color: 'text-pink-500', icon: FaFigma },
  { keywords: ['notion'], color: 'text-black', icon: SiNotion },
  { keywords: ['medium'], color: 'text-gray-900', icon: FaMedium },
  { keywords: ['devpost'], color: 'text-blue-500', icon: FaDev },
  { keywords: ['replit'], color: 'text-yellow-500', icon: SiReplit },
  { keywords: ['chatgpt', 'gpt'], color: 'text-green-600', icon: RiChat4Fill },
  { keywords: ['openai'], color: 'text-green-700', icon: SiOpenai },
  { keywords: ['netlify'], color: 'text-blue-700', icon: SiNetlify },
  { keywords: ['vercel'], color: 'text-gray-200', icon: SiVercel },
  { keywords: ['firebase'], color: 'text-yellow-500', icon: SiFirebase },
  // { keywords: ['google drive', 'gdrive'], color: 'text-green-600', icon: BsGoogleDrive },
  { keywords: ['dropbox'], color: 'text-blue-600', icon: FaDropbox },
  { keywords: ['zoom'], color: 'text-blue-500', icon: SiZoom },
  { keywords: ['sketch'], color: 'text-yellow-400', icon: SiSketch },
  { keywords: ['stack overflow'], color: 'text-orange-400', icon: FaStackOverflow },
  { keywords: ['kaggle'], color: 'text-blue-400', icon: FaKaggle },
  { keywords: ['sandbox', 'codesandbox'], color: 'text-indigo-500', icon: SiCodesandbox },
];

// eslint-disable-next-line react-refresh/only-export-components
export const getLinkStyle = (name) => {
  const lowerName = name.toLowerCase();

  for (const style of linkStyles) {
    if (style.keywords.some(keyword => lowerName.includes(keyword))) {
      return {
        color: style.color,
        icon: <style.icon size={22} className="" />
      };
    }
  }

  // Default fallback
  return {
    color: 'text-pink-700',
    icon: <TfiUnlink size={22} className="me-3" />
  };
};


// eslint-disable-next-line react/prop-types
const IconLink= ({ link }) => {
    // Filter out links containing 'solution' or 'sln'
    // eslint-disable-next-line react/prop-types
    const filteredLinks = [link].filter(
        (link) =>
            !link.name.toLowerCase().includes('private') &&
            !link.name.toLowerCase().includes('private2')
    );

    return (
        <div className="flex flex-col gap-3">
            {filteredLinks.map((link, index) => {
                const { color, icon } = getLinkStyle(link.name);
                return (
                    <div key={index} className={`flex md:flex-row flex-col items-center gap-4 p-1 border rounded-lg shadow-md border-gray-200`}>
                        <a href={link.url}
                           className={`inline-flex items-center justify-center p-2  font-medium rounded-lg text-gray-300 #bg-gray-900 #hover:bg-gray-700 hover:text-white`}>
                            <span className={color}>{icon}</span>
                            <span className="w-full font-semibold text-xs">{link.name}</span>
                            <svg className="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                            </svg>
                        </a>
                        <div className="text-gray-400 text-xs">{link.description}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default IconLink;
