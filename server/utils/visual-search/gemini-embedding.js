// ========================================
// Gemini Image Embedding Utility
// ========================================
// This file sends a jewelry image to Gemini
// and converts the image into a numerical
// embedding vector.
//
// Image
//   ↓
// Gemini Embedding 2
//   ↓
// Numerical Vector
// ========================================

const { GoogleGenAI } = require("@google/genai");

// ========================================
// Gemini AI Client
// ========================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ========================================
// Generate Image Embedding
// ========================================

const generateImageEmbedding = async (
  imageBuffer,
  mimeType
) => {
  try {
    // ========================================
    // Validate image
    // ========================================

    if (!imageBuffer) {
      throw new Error("Image buffer is required");
    }

    if (!mimeType) {
      throw new Error("Image MIME type is required");
    }

    // ========================================
    // Send image to Gemini
    // ========================================

    const response = await ai.models.embedContent({
      model: "gemini-embedding-2",

      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: imageBuffer.toString("base64"),
          },
        },
      ],
    });

    // ========================================
    // Get embedding
    // ========================================

    const embedding =
      response.embeddings?.[0]?.values;

    // ========================================
    // Check response
    // ========================================

    if (!embedding || embedding.length === 0) {
      throw new Error(
        "Gemini did not return an image embedding"
      );
    }

    console.log(
      "Gemini embedding generated successfully"
    );

    console.log(
      "Embedding dimensions:",
      embedding.length
    );

    return embedding;

  } catch (error) {

    console.error(
      "Gemini image embedding error:",
      error
    );

    throw error;
  }
};

// ========================================
// Export
// ========================================

module.exports = {
  generateImageEmbedding,
};