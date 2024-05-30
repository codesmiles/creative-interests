const { Router } = require("express");
const { route } = require("./cli");
const router = Router();
const axios = require("axios");
const client = require("@mailchimp/mailchimp_marketing");

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
const root = {
    newsletter_members: "/mailchimp/newsletter_list/members",
};
router.get("/", async (req, res) => {
    res.json({ status: "OK", message: "Welcome to api route" });
})

// create
router.post(`${root.newsletter_members}/subscribe`, async (req, res) => {
    const { email_address, status, others = {} } = req.body;
  
    if (!email_address) {
      return res.status(400).json(sendResponse(false, "Email is required"));
    }
  
    try {
      const response = await client.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
        email_address,
        status,
        ...others,
      });
      return res.json(sendResponse(true, "success", response));
    } catch (error) {
      return res.json(sendResponse(false, "error", error));
    }
  });

//   read
router.get(root.newsletter_members, async (req, res) => {
  
  try {
    const response = await client.lists.getListMembersInfo(
      process.env.MAILCHIMP_LIST_ID
    );
    return res.json(sendResponse(true, "success", response));
  } catch (error) {
    return res.json(sendResponse(false, "error", error));
  }
});

// read single
router.get(`${root.newsletter_members}/:subscriber_hash`, async (req, res) => {
    try {
        const { subscriber_hash } = await req.params;
        
        const response = await client.lists.getListMember(
            process.env.MAILCHIMP_LIST_ID,
            subscriber_hash,
          );
        return res.json(sendResponse(true, "success",response));    
    } catch (error) {
        return res.json(sendResponse(false, "error", error));
    }
})

// update
router.post(`${root.newsletter_members}/:subscriber_hash/update_or_create`, async (req, res) => {
    try {
        const { subscriber_hash } = await req.params;
        const { email_address, status} = req.body;
        
        const response = await client.lists.setListMember(
            process.env.MAILCHIMP_LIST_ID,
            subscriber_hash,
            { email_address: email_address, status_if_new: status }
          );
        return res.json(sendResponse(true, "success",response));    
    } catch (error) {
        return res.json(sendResponse(false, "error", error));
    }
})

// archive
router.post(`${root.newsletter_members}/:subscriber_hash/delete`, async (req, res) => {
    try {
        const { subscriber_hash } = await req.params;
        
        const response = await client.lists.deleteListMember(
            process.env.MAILCHIMP_LIST_ID,
            subscriber_hash,
          );
        return res.json(sendResponse(true, "success",response));    
    } catch (error) {
        return res.json(sendResponse(false, "error", error));
    }
})
// delete
router.post(`${root.newsletter_members}/:subscriber_hash/delete`, async (req, res) => {
    try {
        const { subscriber_hash } = await req.params;
        
        const response = await client.lists.deleteListMemberPermanent(
            process.env.MAILCHIMP_LIST_ID,
            subscriber_hash,
          );
        return res.json(sendResponse(true, "success",response));    
    } catch (error) {
        return res.json(sendResponse(false, "error", error));
    }
})

module.exports = router;
