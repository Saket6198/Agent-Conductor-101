import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { weatherWorkflow } from "./seq-workflows/weather-workflow";
import { contentWorkflow } from "./seq-workflows/content-workflow";
import { weatherAgent } from "./agents/weather-agent";
import { financialAgent } from "./agents/financial-agent";
import { personalAssistantAgent } from "./agents/personal-assistant";
import { contentAgent } from "./agents/content-agent";
import { parallelWorkflow } from "./parallel-workflows/content-parallel";
import { branchedWorkflow } from "./branched-workflows/content-branched";

import {
  logicalOperatorsWorkflow,
  courseBranchWorkflow,
} from "./branched-workflows/course-branch";

export const mastra = new Mastra({
  workflows: {
    weatherWorkflow,
    contentWorkflow,
    parallelWorkflow, // Add the parallel workflow
    branchedWorkflow, // Add the branched workflow
    logicalOperatorsWorkflow, // Add the logical operators workflow
    courseBranchWorkflow, // Add the course branch workflow
  },
  agents: {
    weatherAgent,
    // financialAgent,
    personalAssistantAgent,
    contentAgent,
  },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: "Mastra",
    level: "info",
  }),
});
