import React, { useState, useRef, useEffect } from "react";
import { Box, Button, IconButton, HStack, Text } from "@chakra-ui/react";
import { FaPlay, FaStop, FaSyncAlt } from "react-icons/fa";
import { io } from "socket.io-client";
import { supabase } from "../supabaseClient";

interface CamProps {
  updateBarcode: (newBarcode: string) => void;
}

const socket = io("https://boulevard-r-silly-knit.trycloudflare.com", {
  transports: ["websocket"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const CameraFeed: React.FC<CamProps> = ({ updateBarcode }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameInterval = useRef<number | null>(null);
  const isStreamingRef = useRef(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error.message);
      } else {
        setUser(data.user);
      }
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") setUser(session?.user ?? null);
        if (event === "SIGNED_OUT") setUser(null);
      }
    );

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setCameras(videoDevices);
      console.log("📷 Video Devices:", videoDevices);
    });

    socket.on("product_info", (data) => {
      console.log("📦 Product detected:", data);
      updateBarcode(data);
      isStreamingRef.current = false;
      setIsPaused(true);
    });

    socket.on("stop_stream", () => {
      console.log("⛔ Stream stopped by backend");
      isStreamingRef.current = false;
      setIsPaused(true);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ WebSocket error:", err);
    });

    return () => {
      socket.disconnect();
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  const startStreaming = async () => {
    if (!user) {
      console.log("User not logged in, triggering login...");
      await supabase.auth.signInWithOAuth({ provider: "google" });
      return;
    }

    setIsStreaming(true);
    setIsPaused(false);
    isStreamingRef.current = true;
    startCamera(cameras[currentCameraIndex]?.deviceId);
  };

  const stopStreaming = () => {
    setIsStreaming(false);
    setIsPaused(false);
    isStreamingRef.current = false;
    socket.emit("stop_stream");

    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }

    if (frameInterval.current) {
      clearInterval(frameInterval.current);
      frameInterval.current = null;
    }
  };

  const startCamera = async (deviceId?: string) => {
    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: "environment" },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      if (!frameInterval.current) {
        frameInterval.current = window.setInterval(() => {
          if (isStreamingRef.current) captureFrame();
        }, 500);
      }
    } catch (err) {
      console.error("Camera access error:", err);
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || isPaused) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg");
    socket.emit("send_items", { frame: dataUrl });
  };

  const scanAgain = () => {
    setIsPaused(false);
    isStreamingRef.current = true;
  };

  const flipCamera = () => {
    if (cameras.length > 1) {
      const newIndex = (currentCameraIndex + 1) % cameras.length;
      setCurrentCameraIndex(newIndex);
      stopStreaming(); // stop the current camera
      setTimeout(() => startStreaming(), 300); // start new one after small delay
    } else {
      console.log("⚠️ Only one camera available");
    }
  };

  return (
    <Box mt={1} display="flex" flexDirection="column" alignItems="center">
      <Box
        w="100%"
        h="300px"
        borderRadius="12px"
        bg={isStreaming ? "black" : "gray.100"}
        border={isStreaming ? "none" : "2px dashed gray"}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {isStreaming ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Text color="gray.500" fontSize="lg">
            Camera Preview
          </Text>
        )}
      </Box>

      <HStack mt={2} spacing={2}>
        <Button
          colorScheme={isStreaming ? "red" : "green"}
          onClick={
            isPaused ? scanAgain : isStreaming ? stopStreaming : startStreaming
          }
          leftIcon={
            isPaused ? <FaPlay /> : isStreaming ? <FaStop /> : <FaPlay />
          }
        >
          {isPaused
            ? "Scan Again"
            : isStreaming
            ? "Stop Streaming"
            : "Start Streaming"}
        </Button>

        {cameras.length > 1 && (
          <IconButton
            aria-label="Flip Camera"
            icon={<FaSyncAlt />}
            onClick={flipCamera}
            colorScheme="blue"
          />
        )}
      </HStack>
    </Box>
  );
};

export default CameraFeed;
