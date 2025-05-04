"use client";
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import Section from './_components/QuestionsSection';

function StartInterview({ params }) {
    const [interviewData, setInterviewData] = useState(null);
    const [MockInterviewQuestion, setMockInterviewQuestion] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(1);

    useEffect(() => {
        GetInterviewDetails();
    }, []);

    /**
     * Fetches Interview Details by MockId
     */
    const GetInterviewDetails = async () => {
        try {
            const result = await db
                .select()
                .from(MockInterview)
                .where(eq(MockInterview.mockId, params.interviewId));

            if (result.length === 0) {
                console.error("No interview data found");
                return;
            }

            const jsonMockResp = JSON.parse(result[0].jsonMockResp);
            console.log(jsonMockResp);

            setMockInterviewQuestion(jsonMockResp);
            setInterviewData(result[0]);
        } catch (error) {
            console.error("Error fetching interview data:", error);
        }
    };

    if (!params?.interviewId) {
        return <div>Invalid Interview</div>;
    }

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Questions Section */}
                <Section
                    mockInterviewQuestion={MockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                />

                {/* Video/ Audio Recording */}
                <RecordAnswerSection />
            </div>
        </div>
    );
}

export default StartInterview;
