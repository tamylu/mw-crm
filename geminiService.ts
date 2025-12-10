import { GoogleGenAI } from "@google/genai";

// Helper function to safely access environment variables
const getEnvVar = (key: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] || '';
  }
  return '';
};

// Initialize API client
const apiKey = getEnvVar('API_KEY') || getEnvVar('VITE_GOOGLE_API_KEY');

let ai: GoogleGenAI | null = null;

// Initialize only if key exists to prevent crashing
if (apiKey) {
    try {
        ai = new GoogleGenAI({ apiKey });
    } catch (e) {
        console.error("Error initializing GoogleGenAI", e);
    }
} else {
    console.warn("⚠️ Google Gemini API Key missing. AI features will not work.");
}

export const generateProductDescription = async (productName: string, category: string, currentDesc: string): Promise<string> => {
  if (!ai) return "Servicio de IA no configurado (Falta API Key).";
  
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Actúa como un redactor experto en comercio electrónico.
      Escribe una descripción de producto atractiva, breve y optimizada para ventas (máximo 60 palabras) en ESPAÑOL.
      
      Nombre del Producto: ${productName}
      Categoría: ${category}
      Contexto o notas adicionales: ${currentDesc}

      Respuesta (SOLO el texto de la descripción, sin títulos):
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "No se pudo generar la descripción.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error al conectar con el servicio de IA.";
  }
};

export const analyzeSchedule = async (appointments: any[]): Promise<string> => {
    if (!ai) return "";

    try {
        const model = 'gemini-2.5-flash';
        const prompt = `
            Analiza la siguiente lista de citas y proporciona un breve resumen ejecutivo (2 oraciones) en ESPAÑOL sobre la carga de trabajo y prioridades.
            Usa un tono profesional y motivador.
            
            Datos: ${JSON.stringify(appointments.map(a => ({ date: a.date, service: a.service, status: a.status })))}
        `;
        
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });

        return response.text || "No hay información disponible.";
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Servicio de IA no disponible momentáneamente.";
    }
}