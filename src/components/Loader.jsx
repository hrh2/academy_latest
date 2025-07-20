import React from 'react';

function Loader() {
    return (
        <div className="min-h-screen  flex items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-transparent border-t-cyan-500 border-r-purple-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-b-pink-500 border-l-blue-500 rounded-full animate-spin animate-reverse"></div>
                    <div className="absolute inset-2 w-16 h-16 border-2 border-transparent border-t-emerald-500 rounded-full animate-pulse"></div>
                </div>
            </div>
    );
}

export default Loader;