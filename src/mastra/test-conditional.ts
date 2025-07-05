// ===== CONDITIONAL WORKFLOW TESTING EXAMPLES =====
// Use these examples to test your conditional workflows

// Test data for different scenarios
export const testCases = [
  // 1. Short and Simple Content (should trigger quickSimpleStep)
  {
    name: "Short and Simple",
    input: {
      content: "Hello world",
      type: "article" as const,
    },
    expectedPath: "Quick & Simple",
    expectedCondition: "Short AND Simple",
  },

  // 2. Social Media Content (should trigger socialMediaStep)
  {
    name: "Social with Hashtags",
    input: {
      content: "Check out this amazing #coding tutorial! #javascript",
      type: "social" as const,
    },
    expectedPath: "Social Media Optimized",
    expectedCondition: "Social OR Social Elements",
  },

  // 3. Social Media with Mentions
  {
    name: "Social with Mentions",
    input: {
      content: "Hey @john, what do you think about this new feature?",
      type: "social" as const,
    },
    expectedPath: "Social Media Optimized",
    expectedCondition: "Social OR Social Elements",
  },

  // 4. Complex Long Content (should trigger complexContentStep)
  {
    name: "Complex Long Content",
    input: {
      content:
        "This comprehensive analysis delves into the intricate methodologies and sophisticated approaches utilized in contemporary technological implementations, examining the multifaceted implications and comprehensive ramifications of advanced computational paradigms within enterprise-level infrastructure architectures.",
      type: "article" as const,
    },
    expectedPath: "Complex Analysis",
    expectedCondition: "Complex, long, or negative",
  },

  // 5. Standard Processing (everything else)
  {
    name: "Standard Medium Content",
    input: {
      content:
        "This is a medium-length article about technology trends. It covers various topics including software development, artificial intelligence, and data science. The content is informative and well-structured.",
      type: "article" as const,
    },
    expectedPath: "Standard Processing",
    expectedCondition: "NOT (short AND simple) AND NOT (social)",
  },

  // 6. Positive Content (should trigger positiveContentStep in logicalOperatorsWorkflow)
  {
    name: "Positive Short Content",
    input: {
      content: "This is an amazing and excellent tutorial!",
      type: "article" as const,
    },
    expectedPath: "Quick & Simple", // In courseBranchWorkflow
    expectedCondition: "Short AND Simple",
  },

  // 7. Negative Content (should trigger complexContentStep)
  {
    name: "Negative Content",
    input: {
      content: "This terrible and awful experience was disappointing.",
      type: "article" as const,
    },
    expectedPath: "Complex Analysis", // In logicalOperatorsWorkflow
    expectedCondition: "Complex, long, or negative",
  },

  // 8. Blog Content
  {
    name: "Blog Post",
    input: {
      content:
        "Welcome to my blog! Today I want to share some insights about productivity and time management. These tips have helped me become more efficient.",
      type: "blog" as const,
    },
    expectedPath: "Standard Processing",
    expectedCondition: "Everything else",
  },

  // 9. Email Content
  {
    name: "Email Content",
    input: {
      content:
        "Hi team, I hope this email finds you well. I wanted to update you on the project status and next steps.",
      type: "email" as const,
    },
    expectedPath: "Standard Processing",
    expectedCondition: "Everything else",
  },

  // 10. Edge Case - Empty-ish Content
  {
    name: "Very Short Content",
    input: {
      content: "Hi!",
      type: "article" as const,
    },
    expectedPath: "Quick & Simple",
    expectedCondition: "Short AND Simple",
  },
];

// Function to run tests (you can use this in your run-workflow.ts)
export async function testConditionalWorkflows(mastra: any) {
  console.log("🧪 Testing Conditional Workflows\n");

  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.name}`);
    console.log(
      `📝 Input: "${testCase.input.content}" (${testCase.input.type})`
    );
    console.log(`🎯 Expected: ${testCase.expectedPath}\n`);

    try {
      // Test the courseBranchWorkflow
      const result = await mastra.workflows.courseBranchWorkflow.execute(
        testCase.input
      );

      console.log(`✅ Result: ${result.processingPath}`);
      console.log(`📊 Recommendations: ${result.recommendations.join(", ")}`);
      console.log(`⚡ Optimizations: ${result.optimizations.join(", ")}`);

      // Check if result matches expectation
      if (result.processingPath === testCase.expectedPath) {
        console.log(
          `🎉 ✅ Test PASSED - Got expected path: ${testCase.expectedPath}`
        );
      } else {
        console.log(
          `❌ Test FAILED - Expected: ${testCase.expectedPath}, Got: ${result.processingPath}`
        );
      }
    } catch (error) {
      console.log(`❌ Error running test: ${error}`);
    }

    console.log("-".repeat(80));
  }
}

// Example of how to test individual workflows
export const workflowTestExamples = {
  // Test different workflows with the same input
  testAllWorkflowsWithSameInput: async (mastra: any, input: any) => {
    console.log(`\n🔬 Testing all workflows with input: "${input.content}"\n`);

    const workflows = [
      {
        name: "Conditional Workflow",
        workflow: mastra.workflows.conditionalWorkflow,
      },
      {
        name: "Course Branch Workflow",
        workflow: mastra.workflows.courseBranchWorkflow,
      },
      {
        name: "Logical Operators Workflow",
        workflow: mastra.workflows.logicalOperatorsWorkflow,
      },
    ];

    for (const { name, workflow } of workflows) {
      try {
        console.log(`\n📊 Testing ${name}:`);
        const result = await workflow.execute(input);
        console.log(
          `✅ Path: ${result.processingPath || result.processingType}`
        );
        console.log(`📝 Content: ${result.processedContent}`);
      } catch (error) {
        console.log(`❌ Error in ${name}: ${error}`);
      }
    }
  },
};
