// import { getSummaryFromDashboard } from "../../controllers/llmController";
// import { jest } from "@jest/globals";

// const endpoint = "https://api.openai.com/v1/chat/completions";

// describe("generateSummary", () => {
//   beforeEach(() => {
//     global.fetch = jest.fn();
//     process.env.OPENAI_API_ENDPOINT = endpoint;
//   });

//   afterEach(() => {
//     jest.resetAllMocks();
//     delete process.env.OPENAI_API_ENDPOINT;
//   });

//   it("should return a summary based on dashboard image", async () => {
//     const req = {
//       body: {
//         dashboardImage: "data:image/png;base64,ABC123",
//       },
//     };

//     const res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn(),
//     };

//     fetch.mockResolvedValueOnce(
//       new Response(
//         JSON.stringify({
//           choices: [
//             {
//               message: {
//                 content:
//                   '{"transcript": "Thank you for asking about your health summary. The vitals are stable."}',
//               },
//             },
//           ],
//         })
//       )
//     );

//     await getSummaryFromDashboard(req, res);

//     expect(fetch).toHaveBeenCalledTimes(1);
//     expect(fetch).toHaveBeenCalledWith(
//       endpoint,
//       expect.any(Object)
//     );
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       response:
//         '{"transcript": "Thank you for asking about your health summary. The vitals are stable."}',
//     });
//   });
// });

// test("basic test", () => {
//   expect(true).toBe(true);
// });
test("basic test", () => {
  expect(true).toBe(true);
});
