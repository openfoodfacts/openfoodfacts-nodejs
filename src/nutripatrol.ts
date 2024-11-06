import createClient from "openapi-fetch";

import { components, paths } from "./schemas/nutripatrol";
import { NutriPatrolError } from "./error";
import { USER_AGENT } from "./consts";

export type Flag = components["schemas"]["FlagCreate"];
export type Ticket = components["schemas"]["Ticket"];
export type FlagResponse = {
  __data__: Flag;
  _dirty: any[];
  __rel__: object;
};

export type FlagsResponse = {
  flags: Flag[];
};

export type FlagBatchResponse = {
  ticket_id_to_flags: {
    [ticketId: string]: Flag[];
  };
};

export type TicketsResponse = {
  tickets: Ticket[];
};

export class NutriPatrol {
  private readonly fetch: typeof global.fetch;
  private readonly baseUrl: string;
  readonly raw: ReturnType<typeof createClient<paths>>;

  constructor(fetch: typeof global.fetch) {
    this.baseUrl = "https://nutripatrol.openfoodfacts.org";

    this.fetch = fetch;
    this.raw = createClient({
      baseUrl: this.baseUrl,
      fetch,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
      },
    });
  }

  private async fetchApi<T>(
    method: "GET" | "POST" | "PUT" | "DELETE",
    path: string,
    options: any = {},
  ): Promise<T | NutriPatrolError> {
    const methods = {
      GET: this.raw.GET,
      POST: this.raw.POST,
      PUT: this.raw.PUT,
      DELETE: this.raw.DELETE,
    };

    try {
      const fct = methods[method] as any;
      const res = await fct(path as any, options as any);
      let errorDetails: NutriPatrolError | undefined;

      if (!res.response.ok) {
        switch (res.response.status) {
          case 422:
            return {
              error: {
                statusCode: 422,
                message: "Validation error",
                details: res.error?.detail?.map((d: any) => d.msg),
              },
            } as NutriPatrolError;
          default:
            errorDetails = await res.response.json();
            return {
              error: {
                statusCode: res.response.status,
                message: "Error while requesting Nutripatrol API",
                details: errorDetails,
              },
            } as NutriPatrolError;
        }
      }

      const data = await res.response.json();

      if (!data) {
        return {
          error: {
            statusCode: 500,
            message: "Malformed API response",
          },
        };
      }

      return data;
    } catch {
      return {
        error: {
          statusCode: 500,
          message: "An unexpected error occurred",
        },
      };
    }
  }

  /**
   * List all flags.
   *
   * @returns {Promise<Flag[] | NutriPatrolError>} - A promise that resolves with the list of flag data or error.
   *
   * The error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid flag ID).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async getFlags(): Promise<Flag[] | NutriPatrolError> {
    const data = await this.fetchApi<FlagsResponse>("GET", `/api/v1/flags`);
    if ("error" in data) {
      return data;
    }
    return data.flags;
  }

  /**
   * Retrieves a specific flag by its ID from the NutriPatrol API.
   *
   * @param {number} flagId - The ID of the flag to fetch.
   * @returns {Promise<Flag | NutriPatrolError>} - A promise that resolves with the flag data if found or error.
   *
   * The error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid flag ID).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async getFlagById(flagId: number): Promise<Flag | NutriPatrolError> {
    const data = await this.fetchApi<FlagResponse>(
      "GET",
      `/api/v1/flags/{flag_id}`,
      {
        params: { path: { flag_id: flagId } },
      },
    );
    if ("error" in data) {
      return data;
    }
    return data.__data__;
  }

  /**
   * Create a flag in the NutriPatrol API.
   *
   * @param {Flag} flagData - Data for the flag to create.
   * @returns {Promise<Flag | NutriPatrolError>} - A promise that resolves with the flag created or error..
   *
   * The error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid flag ID).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async createFlag(flagData: Flag): Promise<Flag | NutriPatrolError> {
    const data = await this.fetchApi<Flag>("POST", `/api/v1/flags`, {
      body: flagData,
    });
    if ("error" in data) {
      return data;
    }
    return data;
  }

  /**
   * Get flags by ticket batch.
   *
   * @param {number[]} ticketIds - Ids of ticket to get flags from.
   * @returns {Promise<{ [ticketId: string]: Flag[] } | NutriPatrolError>} - A promise that resolves with the flags associated to each ticket or error.
   *
   * The error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid flag ID).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async getFlagsByTicketBatch(
    ticketIds: number[],
  ): Promise<{ [ticketId: string]: Flag[] } | NutriPatrolError> {
    const data = await this.fetchApi<FlagBatchResponse>(
      "POST",
      `/api/v1/batch`,
      {
        body: {
          ticket_ids: ticketIds,
        },
      },
    );
    if ("error" in data) {
      return data;
    }
    return data.ticket_id_to_flags;
  }

  /**
   * List all tickets.
   *
   * @param {object} query - Parameters to filter the tickets.
   * @returns {Promise<Ticket[] | NutriPatrolError>} - A promise that resolves with the list of ticket data or error.
   *
   * The error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid filter value).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async getTickets(query: {
    status: "open" | "closed";
    type?: string;
    reason?: "inappropriate" | "human" | "beauty" | "other";
    page?: number;
    page_size?: number;
  }): Promise<Ticket[] | NutriPatrolError> {
    const data = await this.fetchApi<TicketsResponse>(
      "GET",
      `/api/v1/tickets`,
      { params: { query } },
    );
    if ("error" in data) {
      return data;
    }
    return data.tickets;
  }

  /**
   * Retrieves a specific ticket by its ID from the NutriPatrol API.
   *
   * @param {number} ticketId - The ID of the ticket to fetch.
   * @returns {Promise<Ticket | NutriPatrolError>} - A promise that resolves with the ticket data if found or error.
   *
   * The error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid ticket ID).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async getTicketById(ticketId: number): Promise<Ticket | NutriPatrolError> {
    const data = await this.fetchApi<Ticket>(
      "GET",
      `/api/v1/tickets/{ticket_id}`,
      {
        params: { path: { ticket_id: ticketId } },
      },
    );
    if ("error" in data) {
      return data;
    }
    return data;
  }

  /**
   * Create a ticket in the NutriPatrol API.
   *
   * @param {Ticket} ticketData - Data for the ticket to create.
   * @returns {Promise<Ticket | NutriPatrolError>} - A promise that resolves with the ticket created or error.
   *
   * The error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid ticket status).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async createTicket(
    ticketData: Omit<Ticket, "id">,
  ): Promise<Ticket | NutriPatrolError> {
    const data = await this.fetchApi<Ticket>("POST", `/api/v1/tickets`, {
      body: ticketData,
    });
    if ("error" in data) {
      return data;
    }
    return data;
  }

  /**
   * Update a ticket status in the NutriPatrol API.
   *
   * @param {number} ticketId - The ID of the ticket to update.
   * @param {"open" | "closed"} status - The new status of the ticket.
   * @returns {Promise<Ticket | NutriPatrolError>} - A promise that resolves with the ticket updated or error.
   *
   * The error can be one of the following:
   * - A `NutriPatrolError` with status 422 if there is a validation issue (e.g., invalid ticket status).
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async updateTicketStatus(
    ticketId: number,
    status: "open" | "closed",
  ): Promise<Ticket | NutriPatrolError> {
    const data = await this.fetchApi<Ticket>(
      "PUT",
      `/api/v1/tickets/{ticket_id}/status`,
      {
        params: {
          path: { ticket_id: ticketId },
          query: { status },
        },
      },
    );
    if ("error" in data) {
      return data;
    }
    return data;
  }

  /**
   * Get the status of the NutriPatrol API.
   *
   * @returns {Promise<{ status: string } | NutriPatrolError>} - A promise that resolves with the API status or error.
   *
   * The error can be one of the following:
   * - A `NutriPatrolError` with the corresponding HTTP status code for other types of errors (e.g., 404, 500).
   * - A generic `NutriPatrolError` with status 500 for unexpected errors.
   *
   */
  async getApiStatus(): Promise<{ status: string } | NutriPatrolError> {
    const data = await this.fetchApi<{ status: string }>(
      "GET",
      `/api/v1/status`,
    );
    if ("error" in data) {
      return data;
    }
    return data;
  }
}
