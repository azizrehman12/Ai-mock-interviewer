"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

function Interview() {
    const { interviewId } = useParams(); // ✅ Extract interviewId
    const [interviewData, setInterviewData] = useState(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);

    useEffect(() => {
        if (interviewId) {
            GetInterviewDetails(interviewId);
        }
    }, [interviewId]);

    /**
     * Fetch interview details from the database
     */
    const GetInterviewDetails = async (id) => {
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, id));

            if (result.length > 0) {
                setInterviewData(result[0]); // ✅ Set first item
            } else {
                console.warn("No interview found for this ID.");
            }
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="font-bold text-2xl">Let's Get Started</h2>

            <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-full md:w-2/3 lg:w-1/2">
                {/* Webcam Section */}
                <div className="flex flex-col items-center mb-5">
                    {webCamEnabled ? (
                        <Webcam
                            mirrored={true}
                            style={{ height: 250, width: 250 }}
                        />
                    ) : (
                        <>
                            <WebcamIcon className="h-24 w-24 my-4 p-4 bg-gray-200 rounded-lg border" />
                            <Button onClick={() => setWebCamEnabled(true)}>Enable Web Cam and Microphone</Button>
                        </>
                    )}
                </div>

                {/* Interview Details */}
                <div className="w-full p-4 border rounded-lg bg-gray-50">
                    <h2 className="text-lg"><strong>Job Role/Position:</strong> {interviewData?.jobPosition || "N/A"}</h2>
                    <h2 className="text-lg"><strong>Job Description/Tech Stack:</strong> {interviewData?.jobDesc || "N/A"}</h2>
                    <h2 className="text-lg"><strong>Years of Experience:</strong> {interviewData?.jobExperience || "N/A"}</h2>
                </div>
                <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                        <h2 className='flex gap-2 items-center text-yellow-500'> <Lightbulb/><strong>Information</strong></h2>
                        <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                    </div>
            </div>

            <div className="flex  justify-end items-end">
                <Button>Start Interview</Button>
            </div>
        </div>
    );
}

export default Interview;
