"use client"

import React, { useEffect } from "react";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

const Video = () => {
  useEffect(() => {
    // Function to attempt autoplay
    const attemptAutoplay = async () => {
      try {
        // Find the video element by class name (Cloudinary adds specific classes)
        const videoElement = document.querySelector('.cld-video-player video') as HTMLVideoElement | null;
        if (videoElement) {
          videoElement.muted = true;
          await videoElement.play().catch(err => {
            console.log("Autoplay prevented:", err);
          });
        }
      } catch (err) {
        console.log("Autoplay error:", err);
      }
    };

    // Try autoplay immediately
    attemptAutoplay();

    // Optional: Try again when user interacts with page
    const handleUserInteraction = () => {
      attemptAutoplay();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };
  }, []);

  return (
    <div className="w-full h-[100vh] bg-black bg-opacity-20  ">
      <CldVideoPlayer
        src="Library_B-Roll_Sequence_ufkpyi"
        autoPlay={true}
        muted={true}
        loop={true}
        controls={false}
        className="object-cover w-full  h-[100vh]"
        
      />
    </div>
  );
};

export default Video;