const https = require("https");

/**
 * Creates a plan that defines pricing and billing cycle details for subscriptions.
 *
 * @param {Object} planDetails - The details of the plan to create.
 * @param {String} planDetails.product_id - The product ID associated with the plan (required).
 * @param {String} planDetails.name - The name of the plan (required).
 * @param {String} [planDetails.status] - The status of the plan (optional).
 * @param {String} [planDetails.description] - A description of the plan (optional).
 * @param {Array} planDetails.billing_cycles - An array of billing cycles for the plan (required).
 * @param {Object} planDetails.payment_preferences - Payment preferences for the plan (required).
 * @param {Object} [planDetails.taxes] - Tax information for the plan (optional).
 *
 * Each billing cycle object in the `billing_cycles` array should contain:
 * - pricing_scheme (optional)
 * - frequency (required)
 * - tenure_type (required)
 * - sequence (required)
 * - total_cycles (optional)
 *
 * The `payment_preferences` object should contain:
 * - auto_bill_outstanding (optional)
 * - setup_fee (optional)
 * - setup_fee_failure_action (optional)
 * - payment_failure_threshold (optional)
 *
 * The `taxes` object, if provided, should contain:
 * - percentage (required)
 * - inclusive (optional)
 *
 * @returns {Promise<Object>} The result of the plan creation.
 */
function createPlan(planDetails) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(planDetails);
    console.log(postData);
    const options = {
      hostname: "api-m.paypal.com",
      path: "/v1/billing/plans",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer access_token$sandbox$579rqbk7brf3r32t$de86615708459dfc8a221fcc3155fa40", // Replace YOUR_ACCESS_TOKEN with your actual access token
      },
    };

    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const response = JSON.parse(data);
          // Handle different response codes
          switch (res.statusCode) {
            case 200:
            case 201:
              // Plan created successfully
              // Response object properties: id, name, status, description, billing_cycles, payment_preferences, taxes
              resolve(response);
              break;
            case 500:
              // Internal Server Error
              reject(new Error("Internal Server Error"));
              break;
            default:
              // Default case for other HTTP response codes
              reject(new Error("An unexpected error occurred"));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

module.exports = { createPlan };
