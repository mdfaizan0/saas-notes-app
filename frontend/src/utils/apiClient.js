const getToken = () => localStorage.getItem("token");

export const apiClient = async (url, options = {}) => {
  const token = getToken();

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};
