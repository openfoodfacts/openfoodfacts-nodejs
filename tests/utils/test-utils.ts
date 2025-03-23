export class TestUtils {
  static mockResponse(data: any, ok = true, status = 200) {
    return {
      ok,
      status,
      headers: {
        get: (header: string) => {
          const headers: { [key: string]: string } = {
            "Content-Type": "application/json",
          };
          return headers[header];
        },
      },
      json: async () => data,
      text: async () => JSON.stringify(data),
      clone: () => ({ json: async () => data }),
    };
  }
}
