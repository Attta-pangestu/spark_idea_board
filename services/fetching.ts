export const fetchServices = {
  getUser: async () => {
    const response = await fetch("/api/user");
    const data = await response.json();
    return data;
  },
};
