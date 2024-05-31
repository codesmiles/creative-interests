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

module.exports.subscribe = async (req, res) => {
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
  }

  module.exports.getAll = async (req, res) => {
  
    try {
      const response = await client.lists.getListMembersInfo(
        process.env.MAILCHIMP_LIST_ID
      );
      return res.json(sendResponse(true, "success", response));
    } catch (error) {
      return res.json(sendResponse(false, "error", error));
    }
  }

  module.exports.findWhere = async (req, res) => {
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
}

module.exports.updateOrCreate = async (req, res) => {
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
}

module.exports.archive = async (req, res) => {
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
}

module.exports.forceDelete =  async (req, res) => {
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
}