import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchServerResponse } from '../../controllers/llmController';
import jest from 'jest-mock';

const mock = new MockAdapter(axios);

describe('fetchServerResponse', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                userResponse: 'Hello, how are you?',
                assistantQueston: 'What is your name?'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        mock.reset();
    });

    it('should return the assistant response', async () => {
        const mockResponse = {
            choices: [
                {
                    message: {
                        content: 'I am fine, thank you!'
                    }
                }
            ]
        };

        mock.onPost('https://api.openai.com/v1/chat/completions').reply(200, mockResponse);

        await fetchServerResponse(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            response: 'I am fine, thank you!'
        });
    });

    it('should handle errors correctly', async () => {
        mock.onPost('https://api.openai.com/v1/chat/completions').reply(500);

        await fetchServerResponse(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});