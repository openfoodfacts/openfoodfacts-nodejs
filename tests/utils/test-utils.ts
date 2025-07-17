const notImpl = () => {
  throw new Error("Function not implemented.");
};

export class TestUtils {
  static mockResponse(data: any, ok = true, status = 200): Response {
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
        append: () => {},
        has: () => true,
        set: () => {},
        delete: () => {},
        forEach: () => {},
        getSetCookie: () => [],
      },
      json: () => data,
      text: async () => JSON.stringify(data),
      redirected: false,
      statusText: "",
      type: "default",
      url: "",
      body: null,
      bodyUsed: false,
      clone: notImpl,
      arrayBuffer: function (): Promise<ArrayBuffer> {
        throw new Error("Function not implemented.");
      },
      blob: function (): Promise<Blob> {
        throw new Error("Function not implemented.");
      },
      bytes: function (): Promise<Uint8Array> {
        throw new Error("Function not implemented.");
      },
      formData: function (): Promise<FormData> {
        throw new Error("Function not implemented.");
      },
    };
  }
}
