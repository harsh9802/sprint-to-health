/**
 * @jest-environment jsdom
 */

describe('Health Dashboard Tests', () => {
    let originalSpeak;

    beforeAll(() => {
        // Store the original speak function
        originalSpeak = global.speak;
    });

    beforeEach(() => {
        // Mock speak function to track calls
        global.speak = jest.fn();

        // Mock fetch globally for each test
        global.fetch = jest.fn((url) => {
            if (url === '/api/v1/dashboard/getLatestVitals') {
                // Simulate a fetch response for vitals data
                return Promise.resolve({
                    json: () => Promise.resolve({
                        data: {
                            "Blood Sugar Level": [95, 100, 105],
                            "Systolic Blood Pressure (Upper)": [120, 125, 130],
                            "Diastolic Blood Pressure (Lower)": [80, 85, 90]
                        }
                    })
                });
            } else if (url === '/api/summary') {
                // Simulate a fetch response for summary data
                return Promise.resolve({
                    json: () => Promise.resolve({
                        choices: [{
                            message: {
                                content: '{"transcript": "Thank you for asking about your health summary. The vitals are stable."}'
                            }
                        }]
                    })
                });
            }
        });
    });

    afterAll(() => {
        // Restore the original speak function and clear mocks
        global.speak = originalSpeak;
        jest.clearAllMocks();
    });

    test('should call speak with the correct message when asking questions', () => {
        const question = "Do you feel more tired or less energetic than usual?";
        speak(question); // Simulate asking a question
        expect(global.speak).toHaveBeenCalledWith(question);
    });

    test('should handle mocked fetch response correctly for vitals', async () => {
        // Fetch vitals data
        const response = await fetch('/api/v1/dashboard/getLatestVitals');
        const data = await response.json();

        // Check if data matches the mocked response structure for vitals
        expect(data).toEqual({
            data: {
                "Blood Sugar Level": [95, 100, 105],
                "Systolic Blood Pressure (Upper)": [120, 125, 130],
                "Diastolic Blood Pressure (Lower)": [80, 85, 90]
            }
        });
    });

    test('should handle mocked fetch response correctly for summary', async () => {
        // Fetch summary data
        const response = await fetch('/api/summary');
        const data = await response.json();

        // Check if data matches the mocked response structure for summary
        expect(data).toEqual({
            choices: [{
                message: {
                    content: '{"transcript": "Thank you for asking about your health summary. The vitals are stable."}'
                }
            }]
        });
    });
});
