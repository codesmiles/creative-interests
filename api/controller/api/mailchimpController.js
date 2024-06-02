const client = require("@mailchimp/mailchimp_marketing");
const { json } = require("express");

const sendResponse = (successful, message, data = []) => {
  return {
    successful: successful,
    message: message,
    data: data,
  };
};
client.setConfig({
  apiKey: process.env.MAILCHIMP_KEY_ACCESS,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

const convert_query_str_to_arr = (queries) => {
  for (const query in queries) {
    if (queries.hasOwnProperty(query)) {
      const valuesArray = queries[query].split(",");
      if (valuesArray.length > 1) {
        queries[query] = valuesArray;
      }
    }
  }

  return queries;
};

module.exports.subscribe = async (req, res) => {
  const { email_address, status, tags, ...obj } = await req.body;

  if (!email_address) {
    return res.status(400).json(sendResponse(false, "Email is required"));
  }

  try {
    const response = await client.lists.addListMember(
      process.env.MAILCHIMP_LIST_ID,
      {
        tags,
        // status,
        email_address,
      },
      obj
    );
    return res.json(sendResponse(true, "success", response));
  } catch (error) {
    return res.json(sendResponse(false, "error", error));
  }
};

/**
 * Retrieves all list members with pagination and filtering options.
 *
 * @function getAll
 * @param {Object} req - The request object containing the query parameters.
 * @param {Object} res - The response object to send the response.
 * @param {Object} req.query.opts - Optional pagination and filtering options.
 * @returns {Object} - A JSON response with a success flag, message, and data (list members).
 *
 * @throws Will throw an error if the Mailchimp API request fails.
 *
 * @example
 * GET /api/subscribers?count=10&offset=0&status=subscribed
 *
 * @see {@link https://mailchimp.com/developer/marketing/api/list-members/list-members-info/ | Mailchimp API - List Members Info}
 */
module.exports.getAll = async (req, res) => {
  const queries = (await req.query) ?? {};
  try {
    const response = await client.lists.getListMembersInfo(
      process.env.MAILCHIMP_LIST_ID,
      queries
    );
    return res.json(sendResponse(true, "success", response));
  } catch (error) {
    return res.json(sendResponse(false, "error", error));
  }
};

/**
 * Retrieves a specific list member by their unique hash.
 *
 * @function findWhere
 * @param {Object} req - The request object containing the route parameters and query parameters.
 * @param {Object} res - The response object to send the response.
 * @param {string} req.params.subscriber_hash - The unique hash of the list member to retrieve.
 * @param {Object} req.query - Optional pagination and filtering options.
 * @returns {Object} - A JSON response with a success flag, message, and data (the list member).
 *
 * @throws Will throw an error if the Mailchimp API request fails.
 *
 * @example
 * GET /api/subscribers/1234567890abcdef1234567890abcdef?count=10&offset=0
 *
 * @see {@link https://mailchimp.com/developer/marketing/api/list-members/add-or-update-list-member/ | Mailchimp API - Get List Member}
 */
//
module.exports.findWhere = async (req, res) => {
  try {
    const { subscriber_hash } = await req.params;

    const queries = convert_query_str_to_arr((await req.query) ?? {});

    // excludeFields: ['email_address']
    // return res.json(queries)
    const response = await client.lists.getListMember(
      process.env.MAILCHIMP_LIST_ID,
      subscriber_hash,
      queries
    );
    return res.json(sendResponse(true, "success", response));
  } catch (error) {
    return res.json(sendResponse(false, "error", error));
  }
};

/**
 * Updates or creates a list member with the given subscriber hash.
 *
 * @function updateOrCreate
 * @param {Object} req - The request object containing the route parameters and request body.
 * @param {Object} res - The response object to send the response.
 * @param {string} req.params.subscriber_hash - The unique hash of the list member to update or create.

```javascript
/**
 * Updates or creates a list member with the given subscriber hash.
 *
 * @function updateOrCreate
 * @param {Object} req - The request object containing the route parameters and request body.
 * @param {Object} res - The response object to send the response.
 * @param {string} req.params.subscriber_hash - The unique hash of the list member to update or create.
 * @param {Object} req.body - The request body containing the email address and status of the list member.
 * @param {string} req.body.email_address - The email address of the list member.
 * @param {string} req.body.status - The status of the list member.
 * @param {Object} req.query - Optional pagination and filtering options.
 * @returns {Object} - A JSON response with a success flag, message, and data (the updated or created list member).
 *
 * @throws Will throw an error if the Mailchimp API request fails.
 *
 * @example
 * PUT /api/subscribers/1234567890abcdef1234567890abcdef
 * {
 *   "email_address": "example@example.com",
 *   "status": "subscribed"
 * }
 *
 * @see {@link https://mailchimp.com/developer/marketing/api/list-members/add-or-update-list-member/ | Mailchimp API - Add or Update List Member}
 */

module.exports.updateOrCreate = async (req, res) => {
  try {
    const { subscriber_hash } = await req.params;
    const { email_address, status } = req.body;
    const queries = convert_query_str_to_arr((await req.query) ?? {});

    const response = await client.lists.setListMember(
      process.env.MAILCHIMP_LIST_ID,
      subscriber_hash,
      { email_address: email_address, status_if_new: status },
      queries
    );
    return res.json(sendResponse(true, "success", response));
  } catch (error) {
    return res.json(sendResponse(false, "error", error));
  }
};
/**
 * Archives a specific list member by their unique hash.
 *
 * @function archive
 * @param {Object} req - The request object containing the route parameters.
 * @param {Object} res - The response object to send the response.
 * @param {string} req.params.subscriber_hash - The unique hash of the list member to archive.
 * @returns {Object} - A JSON response with a success flag, message, and data (the archived list member).
 *
 * @throws Will throw an error if the Mailchimp API request fails.
 *
 * @example
 * post /api/subscribers/1234567890abcdef1234567890abcdef
 *
 * @see {@link https://mailchimp.com/developer/marketing/api/list-members/archive-list-member/ | Mailchimp API - Delete List Member}
 */

module.exports.archive = async (req, res) => {
  try {
    const { subscriber_hash } = await req.params;

    const response = await client.lists.deleteListMember(
      process.env.MAILCHIMP_LIST_ID,
      subscriber_hash
    );
    return res.json(sendResponse(true, "success", response));
  } catch (error) {
    return res.json(sendResponse(false, "error", error));
  }
};

/**
 * Permanently deletes a specific list member by their unique hash.
 *
 * @function forceDelete
 * @param {Object} req - The request object containing the route parameters.
 * @param {Object} res - The response object to send the response.
 * @param {string} req.params.subscriber_hash - The unique hash of the list member to permanently delete.
 * @returns {Object} - A JSON response with a success flag, message, and data (the permanently deleted list member).
 *
 * @throws Will throw an error if the Mailchimp API request fails.
 *
 * @example
 * POST /api/subscribers/1234567890abcdef1234567890abcdef/force-delete
 *
 * @see {@link https://mailchimp.com/developer/marketing/api/list-members/delete-list-member/ | Mailchimp API - Delete List Member Permanently}
 */
module.exports.forceDelete = async (req, res) => {
  try {
    const { subscriber_hash } = await req.params;

    const response = await client.lists.deleteListMemberPermanent(
      process.env.MAILCHIMP_LIST_ID,
      subscriber_hash
    );
    return res.json(sendResponse(true, "success", response));
  } catch (error) {
    return res.json(sendResponse(false, "error", error));
  }
};
