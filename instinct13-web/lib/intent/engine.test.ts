import assert from "node:assert/strict";
import test from "node:test";
import { inferIntent } from "./engine";

test("defaults to a neutral observer state", () => {
  const result = inferIntent();
  assert.equal(result.intent, "observer");
  assert.equal(result.confidence, 0);
});

test("recognizes exploratory behavior", () => {
  const result = inferIntent({
    pageDiversity: 0.8,
    navigationDepth: 0.8,
    discoveryEngagement: 1,
    premiumLinkEngagement: 0.8,
  });
  assert.equal(result.intent, "explorer");
});

test("recognizes reflective behavior", () => {
  const result = inferIntent({
    reflectionEngagement: 1,
    quietEngagement: 0.5,
    pageDiversity: 0.3,
  });
  assert.equal(result.intent, "thinker");
});

test("recognizes contact engagement", () => {
  const result = inferIntent({
    contactEngagement: 1,
    navigationDepth: 0.4,
  });
  assert.equal(result.intent, "collaborator");
});

test("recognizes quiet observation", () => {
  const result = inferIntent({
    quietEngagement: 1,
    returnVisits: 0.4,
  });
  assert.equal(result.intent, "observer");
});

test("uses the strongest weighted evidence for conflicting signals", () => {
  const result = inferIntent({
    discoveryEngagement: 0.7,
    reflectionEngagement: 1,
    contactEngagement: 0.2,
  });
  assert.equal(result.intent, "thinker");
});

test("calculates confidence from the margin over the runner-up", () => {
  const result = inferIntent({ contactEngagement: 1 });
  assert.equal(result.confidence, 100);
});
