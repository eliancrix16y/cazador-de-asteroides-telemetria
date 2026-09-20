export class ApiClient {
  constructor() {
    this.baseUrl = "";
  }

  async request(path, options = {}) {
    const response = await fetch(this.baseUrl + path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const body = await response.json();
    if (!body.success) throw new Error(body.message || "Error de API");
    return body.data;
  }
}