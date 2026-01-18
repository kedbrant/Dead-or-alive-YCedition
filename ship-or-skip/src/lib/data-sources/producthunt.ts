/**
 * Product Hunt data source using GraphQL API
 * Fetches launched products similar to the idea being validated
 */

export interface PHProduct {
  name: string;
  tagline: string;
  url: string;
  votesCount: number;
  createdAt: string;
  website: string | null;
}

interface PHGraphQLResponse {
  data?: {
    posts?: {
      edges?: Array<{
        node: {
          name: string;
          tagline: string;
          url: string;
          votesCount: number;
          createdAt: string;
          website: string | null;
        };
      }>;
    };
  };
  errors?: Array<{ message: string }>;
}

const PH_GRAPHQL_ENDPOINT = 'https://api.producthunt.com/v2/api/graphql';

/**
 * Search Product Hunt for products related to a query
 * @param query - Search query (e.g., startup idea or topic)
 * @returns Array of PHProduct objects (max 10)
 */
export async function searchProductHunt(query: string): Promise<PHProduct[]> {
  const token = process.env.PRODUCTHUNT_TOKEN;

  if (!token) {
    console.warn('PRODUCTHUNT_TOKEN not configured, skipping Product Hunt search');
    return [];
  }

  const graphqlQuery = `
    query SearchPosts($query: String!) {
      posts(first: 10, query: $query) {
        edges {
          node {
            name
            tagline
            url
            votesCount
            createdAt
            website
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(PH_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { query },
      }),
    });

    if (!response.ok) {
      console.error(`Product Hunt API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data: PHGraphQLResponse = await response.json();

    if (data.errors && data.errors.length > 0) {
      console.error('Product Hunt GraphQL errors:', data.errors);
      return [];
    }

    const edges = data.data?.posts?.edges;
    if (!edges || edges.length === 0) {
      return [];
    }

    const products: PHProduct[] = edges.map((edge) => ({
      name: edge.node.name,
      tagline: edge.node.tagline,
      url: edge.node.url,
      votesCount: edge.node.votesCount,
      createdAt: edge.node.createdAt,
      website: edge.node.website,
    }));

    return products;
  } catch (error) {
    console.error('Error searching Product Hunt:', error);
    return [];
  }
}
