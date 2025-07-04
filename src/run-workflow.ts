// src/run-workflow.ts
import { mastra } from "./mastra";

async function runContentWorkflow() {
  console.log("🚀 Running workflow programmatically...\n");

  try {
    const workflow = mastra.getWorkflow("contentWorkflow");

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    const run = workflow.createRun();

    // Execute with test data
    const result = await run.start({
      inputData: {
        content:
          "Climate change is one of the most pressing challenges of our time, requiring immediate action from governments, businesses, and individuals worldwide.",
        type: "blog",
      },
    });

    if (result.status === "success") {
      console.log("✅ Success!");
      console.log("📝 Content:", result.result.content);
      console.log("📊 Word count:", result.result.wordCount);
      console.log(
        "⏱️ Reading time:",
        result.result.metadata.readingTime,
        "minutes"
      );
      console.log("🎯 Difficulty:", result.result.metadata.difficulty);
      console.log("📅 Processed at:", result.result.metadata.processedAt);
      console.log("📋 Summary:", result.result.summary);

      // Display AI analysis results
      console.log("\n🤖 AI Analysis:");
      console.log(
        "⭐ Quality Score:",
        result.result.aiAnalysis.qualityScore + "/10"
      );
      console.log(
        "🏷️ Main Themes:",
        result.result.aiAnalysis.mainThemes.join(", ")
      );
      console.log("💡 Improvements:");
      result.result.aiAnalysis.improvements.forEach((improvement, index) => {
        console.log(`   ${index + 1}. ${improvement}`);
      });
      console.log("💬 Feedback:", result.result.aiAnalysis.feedback);
    }
  } catch (error) {
    console.error("❌ Error:", (error as Error).message);
  }
}

runContentWorkflow();
