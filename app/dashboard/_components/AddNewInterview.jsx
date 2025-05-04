"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { chatSession } from "@/utils/GeminiAIModal";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db"; // Ensure db is correctly imported
import { MockInterview } from "@/utils/schema"; // Ensure MockInterview model is correctly imported
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const { user } = useUser();
  const [jsonResponse, setJsonResponse] = useState([]);
  const router=useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!jobPosition || !jobDesc || !jobExperience) {
      alert("Please fill out all fields before starting the interview.");
      return;
    }

    console.log("Job Position:", jobPosition);
    console.log("Job Description:", jobDesc);
    console.log("Years of Experience:", jobExperience);

    const InputPrompt = `
      Job Position: ${jobPosition}, 
      Job Description: ${jobDesc}, 
      Years of Experience: ${jobExperience}, 
      Based on the job description, give me ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} 
      interview questions along with answers in JSON format. 
      Provide 'question' and 'answer' fields in JSON.
    `;

    setAiMessage("Generating interview with AI...");
    setLoading(true);

    try {
      console.log("Sending API request...");
      const result = await chatSession.sendMessage(InputPrompt);
      console.log("Full API Response:", result);

      const responseText = await result.response.text();
      console.log("Generated Response:", responseText);

      const parsedResponse = JSON.parse(responseText.replace(/```json|```/g, ""));
      console.log("Parsed Response:", parsedResponse);
      setJsonResponse(parsedResponse);

      // Ensure the table exists in NeonDB
      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: parsedResponse,
        jobPosition: jobPosition,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress || "Unknown",
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      }).returning({ mockId: MockInterview.mockId });

      console.log("Inserted ID:", resp);
      if(resp)
      {
        setOpenDialog(false);
        router.push('/dashboard/interview/'+resp[0]?.mockId)
      }
      alert(`Interview for ${jobPosition} has been created successfully!`);
      setOpenDialog(false);
    } catch (error) {
      console.error("❌ Error in API call:", error);
      alert(`API Error: ${error.message}`);
    }

    setLoading(false);
    setAiMessage("");
  };

  return (
    <div>
      {/* Button to open modal */}
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center font-bold">+ Add New</h2>
      </div>

      {/* Modal */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Tell us more about your job interview
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Add details about your job position/role, job description, and years of experience.
            </DialogDescription>
          </DialogHeader>

          {/* AI Generating Message */}
          {loading && (
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg text-center my-3">
              {aiMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Job Role Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Role / Job Position
              </label>
              <input
                type="text"
                value={jobPosition}
                onChange={(e) => setJobPosition(e.target.value)}
                placeholder="Ex. Full Stack Developer"
                className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Job Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Job Description / Tech Stack (In Short)
              </label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Ex. React, Angular, Node.js, MySQL"
                className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Years of Experience Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <input
                type="number"
                value={jobExperience}
                onChange={(e) => setJobExperience(e.target.value)}
                placeholder="Ex. 5"
                className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Button Actions */}
            <div className="flex justify-end gap-3 mt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} /> Generating...
                  </>
                ) : (
                  "Start Interview"
                )}
              </Button>
              <Button
                type="button"
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
