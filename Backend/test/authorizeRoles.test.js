const test = require("node:test");
const assert = require("node:assert/strict");
const authorizeRoles = require("../src/middleware/authorizeRoles.js");

function createResponse() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test("authorizeRoles allows a role in the allow-list", () => {
  const req = { auth: { userId: "user-1", role: "manager" } };
  const res = createResponse();
  let called = false;
  authorizeRoles("manager", "admin")(req, res, () => { called = true; });
  assert.equal(called, true);
  assert.equal(res.statusCode, 200);
});

test("authorizeRoles rejects a role outside the allow-list", () => {
  const req = { auth: { userId: "user-2", role: "requester" } };
  const res = createResponse();
  let called = false;
  authorizeRoles("manager", "admin")(req, res, () => { called = true; });
  assert.equal(called, false);
  assert.equal(res.statusCode, 403);
  assert.equal(res.body.success, false);
});

test("authorizeRoles rejects requests without authentication context", () => {
  const req = {};
  const res = createResponse();
  authorizeRoles("admin")(req, res, () => assert.fail("next should not be called"));
  assert.equal(res.statusCode, 403);
});
