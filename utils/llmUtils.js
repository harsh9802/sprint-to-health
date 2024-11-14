export const GET_SUMMARY_USER_PROMPT = "Attached image is a screenshot of the dashboard of vitals for a given user. \
					Your task is to generate a text summary in a specific format only which will be used as a transcript to dictate to the user (might be blind).\
					Give response in strictly given format JSON: {\"transcript\": \"Thank you for asking about your health summary. <your response based on the dashboard>\"}\
					When forming a dashboard summary, make sure to include specific numbers and not just generalised information."