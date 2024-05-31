const { Router } = require("express");
const router = Router();

const { exec } = require("child_process");
const path = require("path");

router.get("/", (req, res) => {
  res.json({ status: "OK", message: "Welcome to cli route" });
});

const copy_and_make_executable_file = async (file_path, file_name) => {
  const make_executable_command = `chmod +x ${file_path}`;
  const copy_file_command = `sudo cp ${filePath} /usr/local/bin/${file_name}`;

  // Execute the commands sequentially
  return exec(
    `${make_executable_command} && ${copy_file_command}`,
    (error, stdout, stderr) => {
      if (error) {
        return error.message;
      }
      if (stderr) {
        return stderr;
      }
      return `success copied the file into your pc ${stdout}`;
    }
  );
};

/**
 * This route handler is responsible for making the ccwc.js file executable and moving it to /usr/local/bin/ccwc.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
router.get("/ccwc", async (req, res) => {
  const filePath = path.join(__dirname, "..", "services/cli/ccwc-project/ccwc.js");
  const fileName = "cwcc";

  const response = await copy_and_make_executable_file(fileName, filePath);
  return res.json({ message: response });
});

module.exports = router;
