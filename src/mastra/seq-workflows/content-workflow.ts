import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";
import { contentAgent } from "../agents/content-agent";

const validateContentStep = createStep({
  id: "validate-content",
  description: "Validates incoming text content",
  inputSchema: z.object({
    content: z.string().min(1, "Content cannot be empty"),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    isValid: z.boolean(),
  }),
  execute: async ({ inputData }) => {
    console.log("validateContentStep - Input:", inputData);
    const { content, type } = inputData;

    const wordCount = content.trim().split(/\s+/).length;
    const isValid = wordCount >= 5; // Minimum 5 words

    console.log(
      "validateContentStep - Word count:",
      wordCount,
      "Valid:",
      isValid
    );

    if (!isValid) {
      throw new Error(`Content too short: ${wordCount} words`);
    }

    const result = {
      content: content.trim(),
      type,
      wordCount,
      isValid,
    };

    console.log("validateContentStep - Output:", result);
    return result;
  },
});

const enhanceContentStep = createStep({
  id: "enhance-content",
  description: "Adds metadata to validated content",
  inputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    isValid: z.boolean(),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    console.log("enhanceContentStep - Input:", inputData);
    const { content, type, wordCount } = inputData;

    // Calculate reading time (200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);

    // Determine difficulty based on word count
    let difficulty: "easy" | "medium" | "hard" = "easy";
    if (wordCount > 100) difficulty = "medium";
    if (wordCount > 300) difficulty = "hard";

    const result = {
      content,
      type,
      wordCount,
      metadata: {
        readingTime,
        difficulty,
        processedAt: new Date().toISOString(),
      },
    };

    console.log("enhanceContentStep - Output:", result);
    return result;
  },
});

const generateSummaryStep = createStep({
  id: "generate-summary",
  description: "Creates a summary of the content",
  inputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
    summary: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { content, type, wordCount, metadata } = inputData;

    // Create a simple summary from first sentence
    const sentences = content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);
    const firstSentence = sentences[0]?.trim() + ".";

    // Generate summary based on content length
    let summary = firstSentence;
    if (wordCount > 50) {
      summary += ` This ${type} contains ${wordCount} words and takes approximately ${metadata.readingTime} minute(s) to read.`;
    }

    console.log(`📝 Generated summary: ${summary.length} characters`);

    return {
      content,
      type,
      wordCount,
      metadata,
      summary,
    };
  },
});

const aiAnalysisStep = createStep({
  id: "ai-analysis",
  description: "Uses AI agent to analyze content quality and provide feedback",
  inputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
    summary: z.string(),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
    summary: z.string(),
    aiAnalysis: z.object({
      qualityScore: z.number(),
      mainThemes: z.array(z.string()),
      improvements: z.array(z.string()),
      feedback: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    console.log("aiAnalysisStep - Starting AI analysis...");
    const { content, type, wordCount, metadata, summary } = inputData;

    try {
      // Define the analysis schema for structured output
      const analysisSchema = z.object({
        qualityScore: z
          .number()
          .min(1)
          .max(10)
          .describe("Quality score from 1-10"),
        mainThemes: z
          .array(z.string())
          .min(1)
          .max(4)
          .describe("Main themes and topics (2-4 items)"),
        improvements: z
          .array(z.string())
          .min(1)
          .describe("Specific improvement suggestions"),
        feedback: z.string().describe("Overall constructive feedback"),
      });

      // Create a prompt for the AI agent
      const analysisPrompt = `
        Please analyze this ${type} content and provide a comprehensive assessment:
        
        Content: ${content}
        
        Analyze the content for:
        - Quality and clarity (score 1-10)
        - Main themes and topics (2-4 key themes)
        - Specific areas for improvement
        - Overall constructive feedback
        
        Be thorough and constructive in your analysis and give the response in the given json format.
      `;

      // Use the content agent with structured output
      const result = await contentAgent.generate(analysisPrompt, {
        output: analysisSchema,
      });

      console.log("aiAnalysisStep - AI Analysis completed:", result.object);

      return {
        content,
        type,
        wordCount,
        metadata,
        summary,
        aiAnalysis: result.object!,
      };
    } catch (error) {
      console.error("aiAnalysisStep - Error:", error);
      // Return fallback analysis on error
      return {
        content,
        type,
        wordCount,
        metadata,
        summary,
        aiAnalysis: {
          qualityScore: 5,
          mainThemes: [type],
          improvements: ["Unable to analyze - please try again"],
          feedback: `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      };
    }
  },
});

export const contentWorkflow = createWorkflow({
  id: "content-processing-workflow",
  description: "Validates, enhances, summarizes, and AI-analyzes content",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.string(),
    wordCount: z.number(),
    metadata: z.object({
      readingTime: z.number(),
      difficulty: z.enum(["easy", "medium", "hard"]),
      processedAt: z.string(),
    }),
    summary: z.string(),
    aiAnalysis: z.object({
      qualityScore: z.number(),
      mainThemes: z.array(z.string()),
      improvements: z.array(z.string()),
      feedback: z.string(),
    }),
  }),
})
  .then(validateContentStep)
  .then(enhanceContentStep)
  .then(generateSummaryStep)
  .then(aiAnalysisStep)
  .commit();
