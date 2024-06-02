const { Router } = require("express");
const router = Router();

const mailchimpController = require("../../controller/api/mailchimpController");

const root = {
  newsletter_members: "/mailchimp/newsletter_list/members",
};
router.get("/health", async (req, res) => {
  res.json({ status: "OK", message: "Welcome to api route" });
});

// create
router.post(
  `${root.newsletter_members}/subscribe`,
  mailchimpController.subscribe
);

//   read
router.get(root.newsletter_members, mailchimpController.getAll);

// read single
router.get(
  `${root.newsletter_members}/:subscriber_hash`,
  mailchimpController.findWhere
);

// update
router.post(
  `${root.newsletter_members}/update_or_create/:subscriber_hash`,
  mailchimpController.updateOrCreate
);

// archive
router.post(
  `${root.newsletter_members}/unsubscribe/:subscriber_hash`,
  mailchimpController.archive
);
// delete
router.post(
  `${root.newsletter_members}/force_delete/:subscriber_hash`,
  mailchimpController.forceDelete
);

module.exports = router;
