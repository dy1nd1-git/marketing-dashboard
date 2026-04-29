import React from "react";

export const HeroTitle: React.FC = () => {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h1 className="text-h1 text-slate-900">Analysis Adventure</h1>
        <p className="text-body-lg text-slate-500 mt-2">
          Discovering hidden ROAS opportunities across April's marketing
          landscape.
        </p>
      </div>
      <div className="flex -space-x-2">
        <img
          className="w-10 h-10 rounded-full border-2 border-white"
          data-alt="profile portrait of a marketing executive professional with soft lighting"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKMFM-Md9kQDZs5DcXfY6TWB0yxBDHPXmY5ni5I8Sj1Vc-kjq3oD2nCntbpoVtLHFqHnk6Vdjnt5RhFJsP9WgopGVDT27Cvuu19F2g2KoBwTcDRyYeMecUtxWfFLzhonYFMQ6pHU1m9EmDYBdQyvzcV-Kyt2rOh-Kk-UTSctAzabg_QOvSA43VsX3OCvqbWUcPdFe6EU2RwHUh_7M-W3-7wOyLiFoeCbyotVUbQKymSRCRSovUm55GH3E75thWL9Pi6liOzy2XB0M6"
        />
        <img
          className="w-10 h-10 rounded-full border-2 border-white"
          data-alt="portrait of a male analyst in a modern office environment"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLhWkhdbeClqWr1bUF5GVwWq9c5qHSF7pfRZlDwPyKQYT20rCpDvyAlNZfkSQuZj9F1pmT-a-UeN9NDDMx26pbzDCQI2wAeGXqtwtKLKN8Z4vKwYAdf4FI7eDfRZ8y5X92tZ2jFyTa-1ZhYl9JbZyY3BwxiGytmodKZxksyQzil0yrDFWTd-M2pG6q-fOHO9D22Lunwj3fVsyyxZMcsD60IrXAumS2dT3TE5XgUa8YbU1iBE7O4ll4Y_c7xzPz_1ZvMlt6TWxuXdGN"
        />
        <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
          +3
        </div>
      </div>
    </div>
  );
};
