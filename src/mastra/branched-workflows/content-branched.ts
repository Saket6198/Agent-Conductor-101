import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

// ===== CONTENT PROCESSING STEPS =====
// These steps handle different content lengths and types

// Quick Processing Step - for short content
const quickProcessingStep = createStep({
  id: "quick-processing",
  description: "Quick processing for short content",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]),
    wordCount: z.number(),
  }),
  outputSchema: z.object({
    processedContent: z.string(),
    processingType: z.string(),
    timeSpent: z.number(),
  }),
  execute: async ({ inputData }) => {
    console.log("⚡ Quick processing for short content...");
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      processedContent: `QUICK: ${inputData.content.substring(0, 100)}...`,
      processingType: "quick",
      timeSpent: 200,
    };
  },
});

// Standard Processing Step - for medium content
const standardProcessingStep = createStep({
  id: "standard-processing",
  description: "Standard processing for medium content",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]),
    wordCount: z.number(),
  }),
  outputSchema: z.object({
    processedContent: z.string(),
    processingType: z.string(),
    timeSpent: z.number(),
    basicAnalysis: z.object({
      readabilityScore: z.number(),
      keywordCount: z.number(),
    }),
  }),
  execute: async ({ inputData }) => {
    console.log("🔄 Standard processing for medium content...");
    await new Promise((resolve) => setTimeout(resolve, 500));

    const keywords = inputData.content
      .split(/\s+/)
      .filter((word) => word.length > 4);

    return {
      processedContent: `STANDARD: ${inputData.content}`,
      processingType: "standard",
      timeSpent: 500,
      basicAnalysis: {
        readabilityScore: Math.floor(Math.random() * 40) + 60,
        keywordCount: keywords.length,
      },
    };
  },
});

// Detailed Processing Step - for long content
const detailedProcessingStep = createStep({
  id: "detailed-processing",
  description: "Detailed processing for long content",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]),
    wordCount: z.number(),
  }),
  outputSchema: z.object({
    processedContent: z.string(),
    processingType: z.string(),
    timeSpent: z.number(),
    detailedAnalysis: z.object({
      readabilityScore: z.number(),
      seoScore: z.number(),
      sentiment: z.enum(["positive", "neutral", "negative"]),
      wordCount: z.number(),
      paragraphCount: z.number(),
    }),
  }),
  execute: async ({ inputData }) => {
    console.log("🔍 Detailed processing for long content...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const paragraphs = inputData.content.split("\n\n").length;
    const positiveWords = ["good", "great", "excellent", "amazing"];
    const negativeWords = ["bad", "terrible", "awful", "horrible"];

    const content = inputData.content.toLowerCase();
    const positive = positiveWords.filter((word) =>
      content.includes(word)
    ).length;
    const negative = negativeWords.filter((word) =>
      content.includes(word)
    ).length;

    let sentiment: "positive" | "neutral" | "negative" = "neutral";
    if (positive > negative) sentiment = "positive";
    if (negative > positive) sentiment = "negative";

    return {
      processedContent: `DETAILED: ${inputData.content}`,
      processingType: "detailed",
      timeSpent: 1000,
      detailedAnalysis: {
        readabilityScore: Math.floor(Math.random() * 40) + 60,
        seoScore: Math.floor(Math.random() * 30) + 70,
        sentiment,
        wordCount: inputData.wordCount,
        paragraphCount: paragraphs,
      },
    };
  },
});

// Social Media Processing Step - for social content type
const socialProcessingStep = createStep({
  id: "social-processing",
  description: "Special processing for social media content",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]),
    wordCount: z.number(),
  }),
  outputSchema: z.object({
    processedContent: z.string(),
    processingType: z.string(),
    timeSpent: z.number(),
    socialMetrics: z.object({
      hashtagCount: z.number(),
      mentionCount: z.number(),
      engagement: z.string(),
    }),
  }),
  execute: async ({ inputData }) => {
    console.log("📱 Social media processing...");
    await new Promise((resolve) => setTimeout(resolve, 300));

    const hashtags = (inputData.content.match(/#\w+/g) || []).length;
    const mentions = (inputData.content.match(/@\w+/g) || []).length;

    const engagement =
      inputData.wordCount < 20
        ? "high"
        : inputData.wordCount < 50
          ? "medium"
          : "low";

    return {
      processedContent: `SOCIAL: ${inputData.content}`,
      processingType: "social",
      timeSpent: 300,
      socialMetrics: {
        hashtagCount: hashtags,
        mentionCount: mentions,
        engagement,
      },
    };
  },
});

// Word Count Calculator Step - prepares data for branching
const wordCountStep = createStep({
  id: "word-count",
  description: "Calculate word count to determine processing path",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]),
    wordCount: z.number(),
  }),
  execute: async ({ inputData }) => {
    console.log("📊 Calculating word count...");

    const wordCount = inputData.content.trim().split(/\s+/).length;

    console.log(`📝 Content has ${wordCount} words`);
    console.log(`📋 Content type: ${inputData.type}`);

    return {
      content: inputData.content,
      type: inputData.type,
      wordCount,
    };
  },
});

// ===== CONDITIONAL BRANCHING WORKFLOW =====
// This workflow demonstrates intelligent routing based on content characteristics
export const branchedWorkflow = createWorkflow({
  id: "branched-content-workflow",
  description: "Intelligently routes content based on length and type",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social"]).default("article"),
  }),
  outputSchema: z.union([
    z.object({
      processedContent: z.string(),
      processingType: z.string(),
      timeSpent: z.number(),
    }),
    z.object({
      processedContent: z.string(),
      processingType: z.string(),
      timeSpent: z.number(),
      basicAnalysis: z.object({
        readabilityScore: z.number(),
        keywordCount: z.number(),
      }),
    }),
    z.object({
      processedContent: z.string(),
      processingType: z.string(),
      timeSpent: z.number(),
      detailedAnalysis: z.object({
        readabilityScore: z.number(),
        seoScore: z.number(),
        sentiment: z.enum(["positive", "neutral", "negative"]),
        wordCount: z.number(),
        paragraphCount: z.number(),
      }),
    }),
    z.object({
      processedContent: z.string(),
      processingType: z.string(),
      timeSpent: z.number(),
      socialMetrics: z.object({
        hashtagCount: z.number(),
        mentionCount: z.number(),
        engagement: z.string(),
      }),
    }),
  ]),
})
  // First, calculate word count to enable branching decisions
  .then(wordCountStep)

  // Branch based on content characteristics - only one will execute
  .branch([
    // Condition 1: Social media content gets special processing (highest priority)
    [
      async ({ inputData }) => {
        console.log(
          `🤔 Checking if social content: ${inputData.type === "social"}`
        );
        return inputData.type === "social";
      },
      socialProcessingStep,
    ],

    // Condition 2: Short content (< 50 words) gets quick processing
    [
      async ({ inputData }) => {
        const isShort = inputData.wordCount < 50 && inputData.type !== "social";
        console.log(
          `🤔 Checking if short content: ${isShort} (${inputData.wordCount} words)`
        );
        return isShort;
      },
      quickProcessingStep,
    ],

    // Condition 3: Medium content (50-200 words) gets standard processing
    [
      async ({ inputData }) => {
        const isMedium =
          inputData.wordCount >= 50 &&
          inputData.wordCount <= 200 &&
          inputData.type !== "social";
        console.log(
          `🤔 Checking if medium content: ${isMedium} (${inputData.wordCount} words)`
        );
        return isMedium;
      },
      standardProcessingStep,
    ],

    // Condition 4: Long content (> 200 words) gets detailed processing
    [
      async ({ inputData }) => {
        const isLong = inputData.wordCount > 200 && inputData.type !== "social";
        console.log(
          `🤔 Checking if long content: ${isLong} (${inputData.wordCount} words)`
        );
        return isLong;
      },
      detailedProcessingStep,
    ],
  ])
  .commit();
