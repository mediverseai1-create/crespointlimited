import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. AI features will be unavailable.')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? 'placeholder')

export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' })

export async function generateContent(prompt: string): Promise<string> {
  try {
    const result = await geminiModel.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error('Failed to generate AI content')
  }
}
