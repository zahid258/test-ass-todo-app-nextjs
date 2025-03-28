import axios from "axios";

/**
 * Creates a pre-configured Axios instance for making HTTP requests to the backend.
 *
 * This instance applies a base URL and default headers to every request, ensuring
 * consistency across API calls in the application.
 */
const fetcher = axios.create({
  baseURL:"http://localhost:3002/",

  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Exports the configured Axios instance for use throughout the application.
 *
 * Example Usage:
 * ```javascript
 * import fetcher from './fetcher';
 *
 * async function getData() {
 *   try {
 *     const response = await fetcher.get('/endpoint');
 *     console.log(response.data);
 *   } catch (error) {
 *     console.error('Error fetching data:', error);
 *   }
 * }
 * ```
 */
export default fetcher;
