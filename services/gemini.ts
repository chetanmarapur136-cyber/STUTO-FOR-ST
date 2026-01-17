
import { GoogleGenAI } from "@google/genai";
import { AppData } from "../types";

export const getStudyInsights = async (appData: AppData) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Format student data for prompt
  const subjectPerformance = appData.subjects.map(s => {
    const subjAtt = appData.attendance.filter(a => a.subjectId === s.id);
    const present = subjAtt.filter(a => a.status === 'present').length;
    const attPerc = subjAtt.length > 0 ? (present / subjAtt.length) * 100 : 0;
    
    const subjMarks = appData.marks.filter(m => m.subjectId === s.id);
    const avgMark = subjMarks.length > 0 ? subjMarks.reduce((acc, m) => acc + (m.score / m.total) * 100, 0) / subjMarks.length : 0;
    
    return `${s.name}: Attendance ${attPerc.toFixed(1)}%, Average Marks ${avgMark.toFixed(1)}%`;
  }).join('\n');

  const prompt = `
    As an expert AI Study Mentor for a student named ${appData.user?.name}, analyze the following data:
    Course: ${appData.user?.course}
    Attendance Goal: ${appData.user?.attendanceGoal}%
    Monthly Budget: $${appData.user?.monthlyBudget}
    
    Current Performance:
    ${subjectPerformance}
    
    Total Expenses Logged: $${appData.expenses.reduce((acc, e) => acc + e.amount, 0)}
    
    Please provide:
    1. A short, motivating summary.
    2. Key strengths (where performance is high).
    3. Critical warnings (where attendance or marks are low).
    4. Actionable study tips for the next week.
    
    Keep the tone friendly, encouraging, and succinct. Use Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Unable to generate insights at this moment. Please try again later.";
  }
};
