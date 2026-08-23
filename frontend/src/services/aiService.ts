export interface AiResponse {
  answer: string;
  sources: string[];
}

const responses: Record<string, AiResponse> = {
  default: {
    answer: 'I found 184 customers with a high likelihood of adopting a premium banking product. The strongest signals are consistent salary credits, high digital activity, and stable monthly balances.',
    sources: ['Customer 360', 'Recommendation model', 'Digital activity'],
  },
};

export async function askBankingAssistant(question: string): Promise<AiResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { ...responses.default, answer: question.toLowerCase().includes('risk') ? 'There are 1,842 customers showing elevated risk signals. The largest cohort is declining digital engagement, so the recommended action is a human-reviewed outreach journey rather than an automated offer.' : responses.default.answer };
}
