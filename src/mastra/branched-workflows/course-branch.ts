import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

// ===== LOGICAL OPERATORS DEMONSTRATION =====
// This file demonstrates different logical operators in conditional branching

// Content Analysis Step
const analyzeContentStep = createStep({
  id: "analyze-content",
  description: "Comprehensive content analysis for branching decisions",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social", "email"]).default("article"),
  }),
  outputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social", "email"]),
    wordCount: z.number(),
    complexity: z.enum(["simple", "moderate", "complex"]),
    category: z.enum(["short", "medium", "long"]),
    hasHashtags: z.boolean(),
    hasMentions: z.boolean(),
    sentiment: z.enum(["positive", "neutral", "negative"]),
  }),
  execute: async ({ inputData }) => {
    const { content, type } = inputData;
    const words = content.trim().split(/\s+/);
    const wordCount = words.length;

    // Determine category by length
    let category: "short" | "medium" | "long" = "short";
    if (wordCount >= 50) category = "medium";
    if (wordCount >= 200) category = "long";

    // Determine complexity by average word length
    const avgWordLength =
      words.reduce((sum, word) => sum + word.length, 0) / wordCount;
    let complexity: "simple" | "moderate" | "complex" = "simple";
    if (avgWordLength > 5) complexity = "moderate";
    if (avgWordLength > 7) complexity = "complex";

    // Check for social media elements
    const hasHashtags = /#\w+/.test(content);
    const hasMentions = /@\w+/.test(content);

    // Simple sentiment analysis
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "love",
      "awesome",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "awful",
      "horrible",
      "hate",
      "disappointing",
    ];

    const lowerContent = content.toLowerCase();
    const positiveCount = positiveWords.filter((word) =>
      lowerContent.includes(word)
    ).length;
    const negativeCount = negativeWords.filter((word) =>
      lowerContent.includes(word)
    ).length;

    let sentiment: "positive" | "neutral" | "negative" = "neutral";
    if (positiveCount > negativeCount) sentiment = "positive";
    if (negativeCount > positiveCount) sentiment = "negative";

    console.log(`📊 Analysis: ${category} ${complexity} ${type} content`);
    console.log(
      `📈 Sentiment: ${sentiment}, Hashtags: ${hasHashtags}, Mentions: ${hasMentions}`
    );

    return {
      content,
      type,
      wordCount,
      complexity,
      category,
      hasHashtags,
      hasMentions,
      sentiment,
    };
  },
});

// ===== PROCESSING STEPS FOR DIFFERENT CONDITIONS =====

// Social Media Optimized Processing
const socialMediaStep = createStep({
  id: "social-media-processing",
  description: "Optimized for social media content",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social", "email"]),
    wordCount: z.number(),
    complexity: z.enum(["simple", "moderate", "complex"]),
    category: z.enum(["short", "medium", "long"]),
    hasHashtags: z.boolean(),
    hasMentions: z.boolean(),
    sentiment: z.enum(["positive", "neutral", "negative"]),
  }),
  outputSchema: z.object({
    processedContent: z.string(),
    processingPath: z.string(),
    recommendations: z.array(z.string()),
    optimizations: z.array(z.string()),
  }),
  execute: async ({ inputData }) => {
    console.log("📱 Processing social media content...");

    const recommendations = [
      "Consider adding relevant hashtags",
      "Keep it engaging and concise",
      "Use visual elements when possible",
    ];

    if (!inputData.hasHashtags) {
      recommendations.push("Add 2-3 relevant hashtags");
    }

    return {
      processedContent: `📱 SOCIAL: ${inputData.content}`,
      processingPath: "Social Media Optimized",
      recommendations,
      optimizations: [
        "Engagement focus",
        "Hashtag optimization",
        "Visual appeal",
      ],
    };
  },
});

// Quick and Simple Processing
const quickSimpleStep = createStep({
  id: "quick-simple-processing",
  description: "Fast processing for short and simple content",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social", "email"]),
    wordCount: z.number(),
    complexity: z.enum(["simple", "moderate", "complex"]),
    category: z.enum(["short", "medium", "long"]),
    hasHashtags: z.boolean(),
    hasMentions: z.boolean(),
    sentiment: z.enum(["positive", "neutral", "negative"]),
  }),
  outputSchema: z.object({
    processedContent: z.string(),
    processingPath: z.string(),
    recommendations: z.array(z.string()),
    optimizations: z.array(z.string()),
  }),
  execute: async ({ inputData }) => {
    console.log("⚡ Quick processing for short and simple content...");

    return {
      processedContent: `⚡ QUICK: ${inputData.content}`,
      processingPath: "Quick & Simple",
      recommendations: [
        "Content is concise and clear",
        "Consider expanding with examples",
      ],
      optimizations: ["Speed optimized", "Minimal processing"],
    };
  },
});

// Complex Content Processing
const complexContentStep = createStep({
  id: "complex-content-processing",
  description: "Detailed processing for complex content",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social", "email"]),
    wordCount: z.number(),
    complexity: z.enum(["simple", "moderate", "complex"]),
    category: z.enum(["short", "medium", "long"]),
    hasHashtags: z.boolean(),
    hasMentions: z.boolean(),
    sentiment: z.enum(["positive", "neutral", "negative"]),
  }),
  outputSchema: z.object({
    processedContent: z.string(),
    processingPath: z.string(),
    recommendations: z.array(z.string()),
    optimizations: z.array(z.string()),
  }),
  execute: async ({ inputData }) => {
    console.log("🔍 Complex processing for detailed content...");

    // Simulate complex processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      processedContent: `🔍 COMPLEX: ${inputData.content}`,
      processingPath: "Complex Analysis",
      recommendations: [
        "Consider breaking into smaller sections",
        "Add headings for better structure",
        "Include examples and explanations",
      ],
      optimizations: [
        "Deep analysis",
        "Structure optimization",
        "Readability enhancement",
      ],
    };
  },
});

// Positive Content Amplification
const positiveContentStep = createStep({
  id: "positive-content-processing",
  description: "Special processing for positive content",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social", "email"]),
    wordCount: z.number(),
    complexity: z.enum(["simple", "moderate", "complex"]),
    category: z.enum(["short", "medium", "long"]),
    hasHashtags: z.boolean(),
    hasMentions: z.boolean(),
    sentiment: z.enum(["positive", "neutral", "negative"]),
  }),
  outputSchema: z.object({
    processedContent: z.string(),
    processingPath: z.string(),
    recommendations: z.array(z.string()),
    optimizations: z.array(z.string()),
  }),
  execute: async ({ inputData }) => {
    console.log("😊 Amplifying positive content...");

    return {
      processedContent: `😊 POSITIVE: ${inputData.content}`,
      processingPath: "Positive Amplification",
      recommendations: [
        "Share this positive content widely",
        "Consider creating more content like this",
        "Engage with positive community responses",
      ],
      optimizations: [
        "Sentiment amplification",
        "Engagement boost",
        "Community building",
      ],
    };
  },
});

// Standard Processing (Fallback)
const standardProcessingStep = createStep({
  id: "standard-processing",
  description: "Standard processing for general content",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social", "email"]),
    wordCount: z.number(),
    complexity: z.enum(["simple", "moderate", "complex"]),
    category: z.enum(["short", "medium", "long"]),
    hasHashtags: z.boolean(),
    hasMentions: z.boolean(),
    sentiment: z.enum(["positive", "neutral", "negative"]),
  }),
  outputSchema: z.object({
    processedContent: z.string(),
    processingPath: z.string(),
    recommendations: z.array(z.string()),
    optimizations: z.array(z.string()),
  }),
  execute: async ({ inputData }) => {
    console.log("🔄 Standard processing...");

    return {
      processedContent: `🔄 STANDARD: ${inputData.content}`,
      processingPath: "Standard Processing",
      recommendations: [
        "Content processed with standard parameters",
        "Consider optimizing for specific use case",
      ],
      optimizations: ["Balanced approach", "General optimization"],
    };
  },
});

// ===== LOGICAL OPERATORS WORKFLOW =====
// This workflow demonstrates all major logical operators in action
export const logicalOperatorsWorkflow = createWorkflow({
  id: "logical-operators-workflow",
  description:
    "Demonstrates AND (&&), OR (||), and NOT (!) operators in branching",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social", "email"]).default("article"),
  }),
  outputSchema: z.object({
    processedContent: z.string(),
    processingPath: z.string(),
    recommendations: z.array(z.string()),
    optimizations: z.array(z.string()),
  }),
})
  // First, analyze the content
  .then(analyzeContentStep)

  // Branch using different logical operators
  .branch([
    // ===== AND (&&) OPERATOR =====
    // Condition 1: Social media AND has social elements (hashtags OR mentions)
    [
      async ({ inputData }) => {
        const condition =
          inputData.type === "social" &&
          (inputData.hasHashtags || inputData.hasMentions);
        console.log(`🔍 AND + OR Check - Social with elements: ${condition}`);
        console.log(`   - Is social: ${inputData.type === "social"}`);
        console.log(`   - Has hashtags: ${inputData.hasHashtags}`);
        console.log(`   - Has mentions: ${inputData.hasMentions}`);
        return condition;
      },
      socialMediaStep,
    ],

    // ===== AND (&&) OPERATOR =====
    // Condition 2: Short content AND simple complexity AND positive sentiment
    [
      async ({ inputData }) => {
        const condition =
          inputData.category === "short" &&
          inputData.complexity === "simple" &&
          inputData.sentiment === "positive";
        console.log(
          `🔍 Multiple AND Check - Short, simple & positive: ${condition}`
        );
        console.log(`   - Is short: ${inputData.category === "short"}`);
        console.log(`   - Is simple: ${inputData.complexity === "simple"}`);
        console.log(`   - Is positive: ${inputData.sentiment === "positive"}`);
        return condition;
      },
      quickSimpleStep,
    ],

    // ===== OR (||) OPERATOR =====
    // Condition 3: Complex content OR long content OR negative sentiment
    [
      async ({ inputData }) => {
        const condition =
          inputData.complexity === "complex" ||
          inputData.category === "long" ||
          inputData.sentiment === "negative";
        console.log(`🔍 OR Check - Complex, long, or negative: ${condition}`);
        console.log(`   - Is complex: ${inputData.complexity === "complex"}`);
        console.log(`   - Is long: ${inputData.category === "long"}`);
        console.log(`   - Is negative: ${inputData.sentiment === "negative"}`);
        return condition;
      },
      complexContentStep,
    ],

    // ===== NOT (!) OPERATOR =====
    // Condition 4: NOT (negative sentiment) AND positive sentiment
    [
      async ({ inputData }) => {
        const condition =
          !(inputData.sentiment === "negative") &&
          inputData.sentiment === "positive";
        console.log(`🔍 NOT Check - Not negative AND positive: ${condition}`);
        console.log(
          `   - Not negative: ${!(inputData.sentiment === "negative")}`
        );
        console.log(`   - Is positive: ${inputData.sentiment === "positive"}`);
        return condition;
      },
      positiveContentStep,
    ],

    // ===== COMPLEX COMBINATION =====
    // Condition 5: NOT (short AND simple) AND NOT social
    [
      async ({ inputData }) => {
        const condition =
          !(
            inputData.category === "short" && inputData.complexity === "simple"
          ) && !(inputData.type === "social");
        console.log(
          `🔍 Complex NOT Check - Not (short AND simple) AND not social: ${condition}`
        );
        console.log(
          `   - Not short and simple: ${!(inputData.category === "short" && inputData.complexity === "simple")}`
        );
        console.log(`   - Not social: ${!(inputData.type === "social")}`);
        return condition;
      },
      standardProcessingStep,
    ],
  ])
  .commit();

// ===== SIMPLE COURSE WORKFLOW =====
// A simplified version for the course demonstration
export const courseBranchWorkflow = createWorkflow({
  id: "course-branch-workflow",
  description: "Simple conditional branching for course demonstration",
  inputSchema: z.object({
    content: z.string(),
    type: z.enum(["article", "blog", "social", "email"]).default("article"),
  }),
  outputSchema: z.object({
    processedContent: z.string(),
    processingPath: z.string(),
    recommendations: z.array(z.string()),
    optimizations: z.array(z.string()),
  }),
})
  .then(analyzeContentStep)
  .branch([
    // Branch 1: Short AND simple content (both conditions must be true)
    [
      async ({ inputData }) => {
        const condition =
          inputData.category === "short" && inputData.complexity === "simple";
        console.log(`📝 Course Check 1 - Short AND Simple: ${condition}`);
        return condition;
      },
      quickSimpleStep,
    ],

    // Branch 2: Social content OR has social elements (either condition can be true)
    [
      async ({ inputData }) => {
        const condition =
          inputData.type === "social" ||
          inputData.hasHashtags ||
          inputData.hasMentions;
        console.log(
          `📝 Course Check 2 - Social OR Social Elements: ${condition}`
        );
        return condition;
      },
      socialMediaStep,
    ],

    // Branch 3: Everything else (NOT matching above conditions)
    [
      async ({ inputData }) => {
        const isShortAndSimple =
          inputData.category === "short" && inputData.complexity === "simple";
        const isSocialOrHasSocialElements =
          inputData.type === "social" ||
          inputData.hasHashtags ||
          inputData.hasMentions;
        const condition = !(isShortAndSimple || isSocialOrHasSocialElements);
        console.log(
          `📝 Course Check 3 - NOT (short AND simple) AND NOT (social): ${condition}`
        );
        return condition;
      },
      standardProcessingStep,
    ],
  ])
  .commit();
