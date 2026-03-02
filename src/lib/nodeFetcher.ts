import * as http from "http";
import * as https from "https";
import { Fetcher } from "../models";
import { OK } from './status'

interface HttpGet {
  (url: string, ...args): http.ClientRequest;
}

/**
 * Get's a url. Compatible with http and https.
 */
const get: HttpGet = (url, ...args) => {
  if (typeof url !== "string") {
    return {
      on(eventName, callback) {
        callback(new Error("URL must be a string."));
      }
    } as http.ClientRequest;
  }
  return url.indexOf("https://") === 0
    ? https.get(url, ...args)
    : http.get(url, ...args);
};

/**
 * Get's a URL and returns a Promise
 */
const nodeFetcher: Fetcher = url =>
  new Promise((resolve, reject) => {
    get(url, res => {
      if (res.statusCode !== OK) {
        return reject(new Error(`HTTP Error Response: ${res.statusCode} ${res.statusMessage} (${url})`))
      }

      let data = null;

      // called when a data chunk is received.
      res.on("data", chunk => {
        if (data === null) {
          data = chunk;
          return;
        }
        data += chunk;
      });

      // called when the complete response is received.
      res.on("end", () => resolve(data));

      // called when the connection is closed.
      res.on("close", () => {
        if (!res.complete) {
          reject(new Error(`Connection closed before response was complete (${url})`));
        }
      });
    }).on("error", reject);
  });

export default nodeFetcher;
