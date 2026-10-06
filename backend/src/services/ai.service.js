const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asing this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).min(4).max(5).describe("Between 4 and 5 technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asing this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).min(2).max(3).describe("Between 2 and 3 behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap")
    })).describe("List of skill in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number of the preparation plan, starting from day 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).length(7).describe("Exactly 7 preparation days, numbered from day 1 through day 7"),
    title: z.string().describe("The title of the jon for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const responseSchema = z.toJSONSchema(interviewReportSchema)
    delete responseSchema.$schema

    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        IMPORTANT: You MUST generate between 4 and 5 technical questions (no fewer than 4, no more than 5) and between 2 and 3 behavioral questions (no fewer than 2, no more than 3).`;

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema
        }
    })

    const parsedResponse = interviewReportSchema.safeParse(JSON.parse(response.text))

    if (!parsedResponse.success) {
        throw new Error(`AI generated an invalid interview report: ${parsedResponse.error.message}`)
    }

    return parsedResponse.data
}


async function generatePdfFromHtml(htmlContent) {
    const launchOptions = {
        headless: "new",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--no-first-run",
            "--no-zygote",
            "--single-process"
        ]
    }

    try {
        launchOptions.executablePath = puppeteer.executablePath()
    } catch (e) {
        console.log("Using default puppeteer executable path")
    }

    const browser = await puppeteer.launch(launchOptions)
    try {
        const page = await browser.newPage()
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

        const pdfBuffer = await page.pdf({
            format: 'A4', margin: {
                top: '20mm', 
                bottom: '20mm', 
                left: '15mm', 
                right: '15mm'
            }
        })

        return pdfBuffer
    } finally {
        await browser.close()
    }
}


async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const responseSchema = z.toJSONSchema(resumePdfSchema)
    delete responseSchema.$schema

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
                        
                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.

                    `

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema
        }
    })

    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }