import React, { useEffect, useCallback, useState } from "react";
import peer from "../services/peer";
import { useSocket } from "../context/SocketProvider";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaStop } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { FaPhone } from 'react-icons/fa';

const RoomPage = () => {
  const navigate = useNavigate();
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null); // New screen stream state
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [current, setCurrent] = useState(false);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    setCurrent(!current);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  // Handle end call and cleaning up streams
  const handleCallEnd = useCallback(async () => {
    setCurrent(!current);
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
      setMyStream(null);
      navigate("/lobby");
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      navigate("/lobby");
    }
    if (peer.peer) {
      peer.peer.close();
      navigate("/lobby");
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
      navigate("/lobby");
    }
    setRemoteSocketId(null);
    navigate("/lobby");
  }, [myStream, screenStream, remoteStream]);

  useEffect(() => {
    const handleCallEndEvent = ({ to }) => {
      if (to === socket.id) {
        handleCallEnd();
      }
    };

    socket.on('call:end', handleCallEndEvent);

    return () => {
      socket.off('call:end', handleCallEndEvent);
    };
  }, [socket, handleCallEnd]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  const toggleMute = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach(track => track.enabled = !isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (myStream) {
      myStream.getVideoTracks().forEach(track => track.enabled = !isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        setScreenStream(screenStream);

        // Stop the current video track and replace it with the screen share track
        const videoTrack = myStream.getVideoTracks()[0];
        peer.peer.getSenders().forEach(sender => {
          if (sender.track === videoTrack) {
            sender.replaceTrack(screenStream.getVideoTracks()[0]);
          }
        });

        screenStream.getTracks()[0].onended = () => {
          // Revert back to the camera video stream when screen sharing stops
          peer.peer.getSenders().forEach(sender => {
            if (sender.track === screenStream.getVideoTracks()[0]) {
              sender.replaceTrack(myStream.getVideoTracks()[0]);
            }
          });
          setIsScreenSharing(false);
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.error("Failed to share screen: ", err);
      }
    } else {
      // Stop screen sharing and revert back to the camera
      screenStream.getTracks().forEach(track => track.stop());
      peer.peer.getSenders().forEach(sender => {
        if (sender.track === screenStream.getVideoTracks()[0]) {
          sender.replaceTrack(myStream.getVideoTracks()[0]);
        }
      });
      setIsScreenSharing(false);
    }
  };
  return (
    <div className="bg-gray-100 p-4 relative h-screen flex flex-col">
      {/* Centered heading */}
      <div className="text-3xl font-bold  text-center">Meeting
        {remoteSocketId ? (
          <div className="mb-4 mt-2 font-normal bg-white rounded p-2">
            {/* Connect button */}
            {!current && !remoteStream && ( // Hide the button if connected
              <div className="flex  justify-around text-lg">
                <p className="font-bold">Someone is in the meeting</p>
                <button
                  onClick={handleCallUser}
                  className=" bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                >
                  {/* <FaPhone className="" /> */}
                  connect
                </button>
              </div>
            )}
          </div>
        ) : (
          "No one in Meet"
        )}
      </div>

      <div className="flex flex-grow justify-center items-center">
        {/* Main video and message box container */}
        <div className="flex w-full h-full">
          {/* Video stream section (taking up 3/4 width) */}
          <div className="relative rounded-md shadow-md w-3/4 h-full  flex flex-col justify-center items-center">
            {remoteStream ? (
              <div className="relative w-full h-full  rounded-md border-4 border-gray-400 shadow-md">
                <h3 className="text-lg mb-2 absolute top-2 left-4 z-10 text-white">Remote Video</h3>
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-md"
                  playsInline
                  autoPlay
                  ref={(videoElement) => {
                    if (videoElement) {
                      videoElement.srcObject = remoteStream;
                    }
                  }}
                ></video>

                {/* Buttons on remote stream */}
                <div className="absolute bottom-4 left-4 z-50 w-full">
                  {myStream && (
                    <>
                      <div className="flex justify-between items-center">
                        {/* Buttons section */}
                        <div className="flex space-x-4 mt-14">
                          <button
                            onClick={sendStreams}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                          >
                            Send Stream
                          </button>
                          <button
                            onClick={toggleMute}
                            className={`bg-${isMuted ? 'green' : 'blue'}-500 text-white py-2 px-4 rounded-lg hover:bg-${isMuted ? 'green' : 'blue'}-600`}
                          >
                            {isMuted ? <FaMicrophone /> : <FaMicrophoneSlash />}
                          </button>
                          <button
                            onClick={handleCallEnd}
                            className=" bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                          >
                            <FaPhone className="text-lg" />
                          </button>
                          <button
                            onClick={toggleVideo}
                            className={`bg-${isVideoOff ? 'green' : 'blue'}-500 text-white py-2 px-4 rounded-lg hover:bg-${isVideoOff ? 'green' : 'blue'}-600`}
                          >
                            {isVideoOff ? <FaVideo /> : <FaVideoSlash />}
                          </button>

                          <button
                            onClick={toggleScreenShare}
                            className={`bg-${isScreenSharing ? 'red' : 'blue'}-500 text-white py-2 px-4 rounded-lg hover:bg-${isScreenSharing ? 'red' : 'blue'}-600`}
                          >
                            {isScreenSharing ? <FaStop /> : <FaDesktop />}
                          </button>
                        </div>

                        {/* Video preview (myStream) section */}
                        <div className="mr-6">
                          <video
                            className="h-28 w-28 rounded-lg border-2 border-white shadow-md"
                            playsInline
                            autoPlay
                            ref={(videoElement) => {
                              if (videoElement) {
                                videoElement.srcObject = myStream;
                              }
                            }}
                          ></video>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full border-4 border-blue-600 rounded-md mb-40 shadow-md bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No remote stream available</span>
              </div>
            )}
          </div>

          {/* Message box section (taking up 1/4 width) */}
          <div className="w-1/4 bg-white border-2 border-gray-300 rounded-md ml-2 p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-center">Message Box</h2>

            {/* You can add more message box content here */}
          </div>
        </div>
      </div>
    </div>
  );

};

export default RoomPage;
