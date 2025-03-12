export async function fetchCodes(codeType) {
  const query = `
    query {
      codes(codeType: "${codeType}") {
        id {
          code
          codeType
        }
        displayValue
      }
    }
  `;
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({query}),
    });
    if (!response.ok) {
      throw new Error(`HTTP ERROR! STATUS: ${response.status}`);
    }
    const result = await response.json();
    return result.data.codes;
  } catch (error) {
    console.error(`Failed to fetch codes: ${error}`);
    throw error;
  }
}