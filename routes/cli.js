const { Router } = require("express");
const router = Router();

const { exec } = require('child_process');
const path = require('path');


router.get("/", (req, res) => {
  res.json({ status: "OK", message: "Welcome to cli route" });
});

/**
 * This route handler is responsible for making the ccwc.js file executable and moving it to /usr/local/bin/ccwc.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
router.get("/ccwc", (req, res) => {
    const filePath = path.join(__dirname,"..", 'ccwc-project/ccwc.js');
    
    const make_executable_command = `chmod +x ${filePath}`;
    const copyFileCommand = `sudo cp ${filePath} /usr/local/bin/ccwc`;
    
    // Execute the commands sequentially
    exec(`${make_executable_command} && ${copyFileCommand}`, (error, stdout, stderr) => {
      if (error) {
        return res.json({error: error.message});
      }
      if (stderr) {
        return res.json({std_error: stderr});
      }
      res.json({stdout: `success copied the file into your pc ${stdout}`});
    });
})

module.exports = router;