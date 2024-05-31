const { Router } = require("express");
const router = Router();
// const axios = require("axios");
const mailchimpServices = require("../../services/api/mailchimp");

const root = {
  newsletter_members: "/mailchimp/newsletter_list/members",
};
router.get("/health", async (req, res) => {
  res.json({ status: "OK", message: "Welcome to api route" });
});

// create
router.post(
  `${root.newsletter_members}/subscribe`,
  mailchimpServices.subscribe
);

//   read
router.get(root.newsletter_members, mailchimpServices.getAll);

// read single
router.get(
  `${root.newsletter_members}/:subscriber_hash`,
  mailchimpServices.findWhere
);

// update
router.post(
  `${root.newsletter_members}/update_or_create/:subscriber_hash`,
  mailchimpServices.updateOrCreate
);

// archive
router.post(
  `${root.newsletter_members}/delete/:subscriber_hash`,
  mailchimpServices.archive
);
// delete
router.post(
  `${root.newsletter_members}/force_delete/:subscriber_hash`,
  mailchimpServices.forceDelete
);

module.exports = router;
