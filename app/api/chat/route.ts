import { smoothStream, streamText, Message } from 'ai';
import { openai } from '@ai-sdk/openai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define the valid domain categories as a type
type DomainCategory = 
  | 'Medical' 
  | 'Technical' 
  | 'Business' 
  | 'Education' 
  | 'Environment' 
  | 'Government' 
  | 'Social' 
  | 'Arts' 
  | 'Other';

// Domain classification prompt
const domainClassifierPrompt = `
Analyze the following question and determine which domain category it falls under:
- Medical: Health, medicine, wellness, fitness
- Technical: Software, hardware, engineering, AI, data science
- Business: Entrepreneurship, marketing, finance, management
- Education: Learning, teaching, academic research, student life
- Environment: Sustainability, climate, conservation, green technology
- Government: Policy, law, regulation, public administration
- Social: Community, relationships, communication, social media
- Arts: Creativity, design, music, visual arts, literature
- Other: For queries that don't fit the above categories

Return ONLY the category name without explanation.

Question: 
`;

// Domain-specific innovation prompts
const domainPrompts: Record<DomainCategory, string> = {
  Medical: `You are a medical innovation specialist. Generate a creative, ethical, and scientifically grounded idea to solve the following health-related challenge. Include specific implementation steps, potential challenges, and how this idea advances healthcare. Aim for practical yet forward-thinking solutions that could realistically be developed within 3-5 years:`,
  
  Technical: `You are a technology innovation specialist. Generate a creative, feasible, and cutting-edge technical solution to the following challenge. Include specific implementation approaches, technical requirements, and how this innovation builds upon or disrupts existing technologies. Focus on solutions that balance innovation with practicality:`,
  
  Business: `You are a business innovation strategist. Generate a creative, market-viable business idea or strategy to address the following challenge. Include potential business models, target audience analysis, competitive advantages, and implementation roadmap. Balance profitability with sustainability and social responsibility:`,
  
  Education: `You are an education innovation specialist. Generate a creative, evidence-based approach to address the following educational challenge. Include implementation methodology, assessment strategies, and how this idea enhances learning outcomes. Focus on solutions that are inclusive, engaging, and adaptable to diverse learning environments:`,
  
  Environment: `You are an environmental innovation expert. Generate a creative, sustainable solution to the following environmental challenge. Include practical implementation steps, potential impact metrics, and how this idea advances sustainability goals. Balance ecological benefits with economic and social feasibility:`,
  
  Government: `You are a public policy innovation specialist. Generate a creative, ethical policy approach or civic technology solution to address the following governance challenge. Include implementation considerations, stakeholder analysis, and metrics for measuring success. Focus on solutions that enhance transparency, efficiency, or citizen engagement:`,
  
  Social: `You are a social innovation strategist. Generate a creative approach to address the following social challenge. Include community engagement strategies, impact assessment methods, and scalability considerations. Balance addressing immediate needs with systemic change:`,
  
  Arts: `You are a creative innovation specialist. Generate a novel artistic or design-based approach to address the following challenge. Include conceptual foundations, technical requirements, and potential cultural impact. Focus on ideas that push creative boundaries while remaining accessible and meaningful:`,
  
  Other: `You are an innovation generalist with expertise across multiple domains. Generate a creative, practical solution to the following challenge. Include specific implementation steps, potential obstacles, and success metrics. Balance innovation with feasibility, focusing on ideas that could be realistically developed and deployed:`
};

// Function to generate guidance for the user
const generateGuidance = (domain: DomainCategory): string => {
  const guidancePrompts: Record<DomainCategory, string> = {
    Medical: "Consider consulting with healthcare professionals and reviewing medical literature to validate and refine this concept. What specific patient population would benefit most from this innovation?",
    
    Technical: "Consider exploring open-source communities or technology incubators that might help develop this concept further. What existing technologies could you leverage to accelerate development?",
    
    Business: "Consider conducting market research and developing a minimum viable product to test your concept. What unique value proposition would differentiate your solution in the market?",
    
    Education: "Consider piloting this approach in a small educational setting to gather feedback and refine the implementation. What specific learning outcomes would you prioritize measuring?",
    
    Environment: "Consider partnering with environmental organizations or sustainable businesses to pilot this concept. How might you quantify the environmental impact of your solution?",
    
    Government: "Consider engaging with local government innovation labs or civic tech organizations to develop this concept further. How would you measure improved civic outcomes?",
    
    Social: "Consider community-based participatory research approaches to refine and implement this concept. How would you ensure the solution addresses the needs of all stakeholders?",
    
    Arts: "Consider collaborating with artists, designers, and potential audiences to develop and refine this concept. How might you secure funding or resources for implementation?",
    
    Other: "Consider forming an interdisciplinary team to help develop this concept further. What metrics would best capture the success of your innovation?"
  };
  
  return guidancePrompts[domain];
};

export async function POST(req: Request) {
  const { messages } = await req.json();
  const userQuery = messages[messages.length - 1].content as string;
  
  try {
    // Step 1: Classify the domain of the question
    const classificationResult = await streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'user',
          content: domainClassifierPrompt + userQuery
        }
      ],
    });
    
    // Wait for the complete response and get the text
    const domainResponse = await new Response(classificationResult.toDataStream()).text();
    
    // Check if the response is a valid domain category
    const domain = isDomainCategory(domainResponse.trim()) ? domainResponse.trim() as DomainCategory : 'Other';
    
    // Step 2: Generate innovative idea based on the domain
    const innovationPrompt = domainPrompts[domain];
    const fullPrompt = `${innovationPrompt}
    
Problem: ${userQuery}

Please provide an innovative solution for [specific problem/domain]:

1. Concept Summary
   • Brief overview of your proposed solution (2-3 sentences)

2. Innovation Highlights
   • [First key innovation element]
   • [Second key innovation element]
   • [Third key innovation element]

3. Implementation Roadmap
   Step 1: [First implementation step]
   Step 2: [Second implementation step]
   Step 3: [Third implementation step]
   [Additional steps as needed]

4. Challenges & Solutions
   Challenge: [First potential challenge]
   Solution: [Proposed mitigation]
   
   Challenge: [Second potential challenge]
   Solution: [Proposed mitigation]

5. Expected Impact
   • [Primary benefit or impact]
   • [Secondary benefits]
   • [Metrics for measuring success]

What aspect of this solution would you like me to elaborate on further?

${generateGuidance(domain)}`;
    
    // Step 3: Generate and stream the response
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        ...messages.slice(0, -1),
        {
          role: 'user',
          content: fullPrompt
        }
      ],
      experimental_transform: smoothStream(),
      onError({ error }) {
        console.error("Error generating innovation:", error);
      },
    });
    
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Innovation engine error:", error);
    
    // Fallback response
    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        ...messages.slice(0, -1),
        {
          role: 'user',
          content: `Generate a creative and innovative solution to this problem: ${userQuery}`
        }
      ],
      experimental_transform: smoothStream(),
      onError({ error }) {
        console.error("Fallback error:", error);
      },
    });
    
    return result.toDataStreamResponse();
  }
}

// Type guard to check if a string is a valid DomainCategory
function isDomainCategory(value: string): value is DomainCategory {
  return Object.keys(domainPrompts).includes(value);
}