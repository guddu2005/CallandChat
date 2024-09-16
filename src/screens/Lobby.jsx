import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";
import image from "./google-meet-video-meeting-logoremote-260nw-1748916314-removebg-preview.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faUser, faCalendar, faCog, faExclamationTriangle, faBars } from '@fortawesome/free-solid-svg-icons';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { RiCloseLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

const LobbyScreen = () => {
  const [email, setEmail] = useState("");
  const [room, setRoom] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", { email, room });
    },
    [email, room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);
  // return (
  //   <div className="bg-gradient-to-r from-blue-50 to-blue-100">
  //     {/* Header */}
  //     <header className="flex justify-between items-center bg-gray-200 p-5">
  //       <div className="flex items-center">
  //         <img src="http://surl.li/nghbzi" alt="logo" className="h-16" />
  //         <p className="text-4xl md:text-5xl font-bold ml-3 mt-2">Meet</p>
  //       </div>
        
  //       {/* Date and Icons for larger screens */}
  //       <div className="hidden lg:flex lg:items-center lg:space-x-6">
  //         <p className="text-xl md:text-3xl font-semibold">Date and Time Year</p>
  //         <div className="flex items-center space-x-4">
  //           <FontAwesomeIcon icon={faCalendar} size="lg" color="black" className="cursor-pointer" />
  //           <FontAwesomeIcon icon={faQuestionCircle} size="lg" className="cursor-pointer" />
  //           <FontAwesomeIcon icon={faExclamationTriangle} size="lg" className="cursor-pointer" />
  //           <FontAwesomeIcon icon={faCog} size="lg" color="black" className="cursor-pointer" />
  //           <FontAwesomeIcon icon={faUser} size="lg" color="black" className="cursor-pointer" />
  //         </div>
  //       </div>
  
  //       {/* Hamburger Icon for small screens */}
  //       <div className="lg:hidden flex items-center">
  //         <FontAwesomeIcon
  //           icon={faBars}
  //           size="lg"
  //           color="gray"
  //           className="cursor-pointer"
  //           onClick={() => setIsMenuOpen(!isMenuOpen)}
  //         />
  //       </div>
  //     </header>
  
  //     {/* Mobile Menu */}
  //     {isMenuOpen && (
  //       <div className="lg:hidden fixed top-0 left-0 w-full  bg-gray-200 flex flex-col items-center justify-center z-50">
  //         <RiCloseLine
  //           size="2rem"
  //           color="gray"
  //           className="absolute top-5 right-5 cursor-pointer"
  //           onClick={() => setIsMenuOpen(false)}
  //         />
  //         <div className="flex flex-col items-center space-y-6">
  //           <p className="text-xl font-semibold">Date and Time Year</p>
  //           <FontAwesomeIcon icon={faCalendar} size="2x" color="gray" className="cursor-pointer" />
  //           <FontAwesomeIcon icon={faQuestionCircle} size="2x" color="gray" className="cursor-pointer" />
  //           <FontAwesomeIcon icon={faExclamationTriangle} size="2x" color="gray" className="cursor-pointer" />
  //           <FontAwesomeIcon icon={faCog} size="2x" color="gray" className="cursor-pointer" />
  //           <FontAwesomeIcon icon={faUser} size="2x" color="gray" className="cursor-pointer" />
  //         </div>
  //       </div>
  //     )}
  
  //     {/* Main Content */}
  //     <div className="flex flex-col md:flex-row justify-around items-center h-full p-4">
  //       {/* Logo and Title Section */}
  //       <div className="text-center mb-8 md:mb-0">
  //         <img src={image} alt="Meet logo" className="h-40 md:h-40 mx-auto" />
  //         <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900">Mentors Meet</h1>
  //       </div>
  
  //       {/* Form Section */}
  //       <form
  //         onSubmit={handleSubmitForm}
  //         className="bg-white shadow-lg px-8 md:px-12 pt-8 pb-10 rounded-tl-3xl rounded-br-3xl w-full max-w-md"
  //       >
  //         {/* Email Input */}
  //         <div className="mb-6">
  //           <label
  //             htmlFor="email"
  //             className="block text-gray-800 text-lg font-semibold mb-2"
  //           >
  //             Email ID
  //           </label>
  //           <input
  //             type="email"
  //             id="email"
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //             className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
  //             placeholder="Enter Email ID"
  //           />
  //         </div>
  
  //         {/* Meeting ID Input */}
  //         <div className="mb-6">
  //           <label
  //             htmlFor="room"
  //             className="block text-gray-800 text-lg font-semibold mb-2"
  //           >
  //             Meeting ID
  //           </label>
  //           <input
  //             type="text"
  //             id="room"
  //             value={room}
  //             onChange={(e) => setRoom(e.target.value)}
  //             className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
  //             placeholder="Enter Meeting ID"
  //           />
  //         </div>
  
  //         {/* Join Button */}
  //         <div className="flex items-center justify-center">
  //           <button
  //             type="submit"
  //             className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300"
  //           >
  //             Join
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  // );
  return (
    <div className="h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      {/* Header */}
      <header className="flex justify-between items-center bg-gray-200 p-5">
        <div className="flex items-center">
          <img src="http://surl.li/nghbzi" alt="logo" className="h-16" />
          <p className="text-4xl md:text-5xl font-bold ml-3 mt-2">Meet</p>
        </div>
        
        {/* Date and Icons for larger screens */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6">
          <p className="text-xl md:text-3xl font-semibold">Date and Time Year</p>
          <div className="flex items-center space-x-4">
            <FontAwesomeIcon icon={faCalendar} size="lg" color="black" className="cursor-pointer" />
            <FontAwesomeIcon icon={faQuestionCircle} size="lg" className="cursor-pointer" />
            <FontAwesomeIcon icon={faExclamationTriangle} size="lg" className="cursor-pointer" />
            <FontAwesomeIcon icon={faCog} size="lg" color="black" className="cursor-pointer" />
            <FontAwesomeIcon icon={faUser} size="lg" color="black" className="cursor-pointer" />
          </div>
        </div>
  
        {/* Hamburger Icon for small screens */}
        <div className="lg:hidden flex items-center">
          <FontAwesomeIcon
            icon={faBars}
            size="lg"
            color="gray"
            className="cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
      </header>
  
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-full h-full bg-gray-200 flex flex-col items-center justify-center z-50">
          <RiCloseLine
            size="2rem"
            color="gray"
            className="absolute top-5 right-5 cursor-pointer"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="flex flex-col items-center space-y-6">
            <p className="text-xl font-semibold">Date and Time Year</p>
            <FontAwesomeIcon icon={faCalendar} size="2x" color="gray" className="cursor-pointer" />
            <FontAwesomeIcon icon={faQuestionCircle} size="2x" color="gray" className="cursor-pointer" />
            <FontAwesomeIcon icon={faExclamationTriangle} size="2x" color="gray" className="cursor-pointer" />
            <FontAwesomeIcon icon={faCog} size="2x" color="gray" className="cursor-pointer" />
            <FontAwesomeIcon icon={faUser} size="2x" color="gray" className="cursor-pointer" />
          </div>
        </div>
      )}
  
      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-around items-center  p-4">
        {/* Logo and Title Section */}
        <div className="text-center mb-8 md:mb-0">
          <img src={image} alt="Meet logo" className="h-40 md:h-40 mx-auto" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-900">Mentors Meet</h1>
        </div>
  
        {/* Form Section */}
        <form
          onSubmit={handleSubmitForm}
          className="bg-white shadow-lg px-8 md:px-12 pt-8 pb-10 rounded-tl-3xl rounded-br-3xl w-full max-w-md"
        >
          {/* Email Input */}
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-gray-800 text-lg font-semibold mb-2"
            >
              Email ID
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter Email ID"
            />
          </div>
  
          {/* Meeting ID Input */}
          <div className="mb-6">
            <label
              htmlFor="room"
              className="block text-gray-800 text-lg font-semibold mb-2"
            >
              Meeting ID
            </label>
            <input
              type="text"
              id="room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter Meeting ID"
            />
          </div>
  
          {/* Join Button */}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-300"
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  

};

export default LobbyScreen;
