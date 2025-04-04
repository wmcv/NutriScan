import React, { useState, useRef, useEffect } from "react";
import { Box, Button, IconButton, HStack, Text } from "@chakra-ui/react";
import { FaPlay, FaStop, FaSyncAlt } from "react-icons/fa";
import { io } from "socket.io-client";

interface CamProps {
  updateBarcode: (newBarcode: string) => void;
}

const socket = io("wss://132.145.98.33:8080", {
  transports: ["websocket", "polling"],
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

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      console.log("Available video devices:", videoDevices);
      setCameras(videoDevices);

      if (videoDevices.length <= 1) {
        console.log("Only one camera detected, flipping not possible.");
      }
    });

    socket.on("product_info", (data) => {
      console.log("🟢 Product detected:", data);
      updateBarcode(data);
      isStreamingRef.current = false;
      setIsPaused(true);
    });

    socket.on("stop_stream", () => {
      console.log("streaming paused by backend");
      isStreamingRef.current = false;
      setIsPaused(true);
    });

    socket.on("connect_error", (err) => {
      console.error("webSocket Connection Error:", err);
    });

    return () => {
      socket.off("product_info");
      socket.off("stop_stream");
      socket.off("connect_error");
    };
  }, []);

  const startStreaming = () => {
    console.log("Starting Stream...");
    setIsStreaming(true);
    setIsPaused(false);
    isStreamingRef.current = true;

    startCamera(cameras[currentCameraIndex]?.deviceId);
  };

  const stopStreaming = () => {
    console.log("Stopping Stream...");
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
      });

      if (videoRef.current) videoRef.current.srcObject = stream;
      console.log("Camera started!");

      if (!frameInterval.current) {
        frameInterval.current = window.setInterval(() => {
          if (isStreamingRef.current) captureFrame();
        }, 500);
      }
    } catch (err) {
      console.error("error accessing camera: ", err);
    }
  };
  //?
  const scanAgain = () => {
    console.log("resuming scanning...");
    setIsPaused(false);
    isStreamingRef.current = true;
  };

  const flipCamera = () => {
    if (cameras.length > 1) {
      const newIndex = (currentCameraIndex + 1) % cameras.length;
      setCurrentCameraIndex(newIndex);
      startCamera(cameras[newIndex].deviceId);
    } else {
      console.log("Only one camera available, flipping not possible.");
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || isPaused) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg");

    socket.emit("send_items", { frame: dataUrl });
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
            style={{ width: "100%", height: "100%" }}
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
