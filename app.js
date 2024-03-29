const express = require("express");
const mysql = require("mysql");
const multer = require("multer");
const moment = require("moment-timezone");
const session = require("express-session");
const flash = require("express-flash");
const path = require("path"); // Add this line to require the 'path' module
const fs = require("fs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
require("dotenv").config();
const ExcelJS = require('exceljs');
const { google } = require('googleapis');
dotenv.config({ path: "./config/config.env" });
const credentials = require('./config/pass.json');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 3000;
app.locals.registrationOpen = false;



const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});
const drive = google.drive({ version: 'v3', auth });
app.use(compression());

app.use(cookieParser());

const static_path = path.join(__dirname, "./public");

app.use(express.static(static_path));

app.use(express.json());


app.set("view engine", "ejs");

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);
});

/*token */
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/");
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.redirect("/");
    }

    req.user = user;
    next();
  });
};
/*token  verification*/

const checkRegistrationStatus = (req, res, next) => {
  const registrationOpen = req.app.locals.registrationOpen;

  if (!registrationOpen) {
    req.flash("error", "Registration is closed.");
    return res.redirect("/registration-closed");
  }

  next();
};
const storage = multer.memoryStorage();

const upload = multer({ storage });

// api all get requests
app.get("/", (req, res) => {
  // Check if the registrationSuccess cookie is present
  const registrationSuccess = req.cookies.registrationSuccess === 'true';

  // Clear the registrationSuccess cookie
  res.clearCookie('registrationSuccess');

  // Render the home page and pass the registrationSuccess flag to the view
  res.render('home', { registrationSuccess });
});

app.get("/gallery", (req, res) => {
  res.render("gallery");
});

app.get("/coordinator", (req, res) => {
  res.render("coordinator");
});

app.get("/terms_and_conditions", (req, res) => {
  res.render("terms");
});
app.get("/About", (req, res) => {
  res.render("About");
});
app.get("/terms_and_conditions", (req, res) => {
  res.render("terms");
});
// app.get("/winner", (req, res) => {
//   res.json("hello this is winner section")
// });

const openingDate = new Date("2024-01-01T00:00:00Z");

app.get("/registration-closed", (req, res) => {
  res.render("admin/registration-closed", { openingDate });
});

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/register", checkRegistrationStatus, upload.single("paymentImage"), async (req, res) => {
  try {
    const {
      name,
      collegeName,
      mobile,
      email,
      creativity_club,
      quick_reel,
      brain_battle,
      hackTheDark,
      quantumAssembler,
      wisdom_war,
      gold_rush,
      gamer_strike,
    } = req.body;

    const fileData = req.file.buffer;

    // Upload the file to Google Drive
    const fileStream = require('stream').Readable.from(fileData);
    const driveResponse = await drive.files.create({
      requestBody: {
        name: `${moment().format("YYYY-MM-DD_HH-mm-ss")}_${email}.jpg`,
        mimeType: 'image/jpeg',
        parents: ["1IqlvU4IIg_9ctXC8PNozzdtMWRtiyiSg"],
      },
      media: {
        mimeType: 'image/jpeg',
        body: fileStream,
      },
    });

    const fileId = driveResponse.data.id;
    const driveLink = `https://drive.google.com/file/d/${fileId}/view`;

    // Validate input
    if (!name || !collegeName || !mobile || !email) {
      req.flash("error", "All fields are required");
      return res.redirect("/register");
    }

    // Check if the mobile and email already exist in the database
    db.query("SELECT * FROM display WHERE mobile = ? OR email = ?", [mobile, email], (selectErr, results) => {
      if (selectErr) {
        console.error(selectErr);
        req.flash("error", "Internal server error");
        return res.redirect("/register");
      }
    
      // Check if both mobile and email already exist
      const mobileExists = results.some(row => row.mobile === mobile);
      const emailExists = results.some(row => row.email === email);
    
      if (mobileExists && emailExists) {
        req.flash("error", "Mobile number and email already exist");
        return res.redirect("/register");
      }
    
      // Check if only mobile exists
      if (mobileExists) {
        req.flash("error", "Mobile number already exists");
        return res.redirect("/register");
      }
    
      // Check if only email exists
      if (emailExists) {
        req.flash("error", "Email already exists");
        return res.redirect("/register");
      }

      const currentISTTime = moment.tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

      // Calculate the total amount based on the selected events
      const selectedEvents = [creativity_club, quick_reel, brain_battle, hackTheDark, quantumAssembler, wisdom_war, gold_rush, gamer_strike];
      const total_amount = selectedEvents.filter(event => event).length * 100;

      const formData = {
        name,
        collegeName,
        mobile,
        email,
        creativity_club: creativity_club ? 'creativity_club' : "none",
        quick_reel: quick_reel ? 'quick_reel' : "none",
        brain_battle: brain_battle ? 'brain_battle' : "none",
        hackTheDark: hackTheDark ? 'hackTheDark' : "none",
        quantamAssembler: quantumAssembler ? 'quantumAssembler' : "none",
        wisdom_war: wisdom_war ? 'wisdom_war' : "none",
        gold_rush: gold_rush ? 'gold_rush' : "none",
        gamer_strike: gamer_strike ? 'gamer_strike' : "none",
        paymentImage: fileId,
        date_time_submit: currentISTTime,
        total_amount, // Add the totalAmount field to the formData
      };

      // Insert data into the database
      db.query("INSERT INTO form_data SET ?", formData,async  (err, result) => {
        if (err) {
          console.error(err);
          req.flash("error", "Internal server error");
          return res.redirect("/register"); // Redirect to the registration page on error
        } else {
          req.flash("success", "Thank You for registering");
          res.cookie('registrationSuccess', 'true', { maxAge: 10000 });
          // Set the session variable indicating successful form submission
          return res.redirect('/?registrationSuccess=true');
  
          // Redirect to the success page
         
        }
      });
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal server error");
    return res.redirect("/register");
  }
});


app.get("/register", checkRegistrationStatus, (req, res) => {
  res.render("form.ejs", {
    success: req.flash("success"),
    error: req.flash("error"),
  });
});

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++admin panel api
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


const secretKey = "your-secret-key";

const adminCredentials = {
  username: process.env.ADMIN_ID,
  password: process.env.ADMIN_PASS,
};


app.get("/api/admin", (req, res) => {
  res.render("admin/admin-login");
});

app.get("/admin/dashboard", authenticateToken, (req, res) => {
  // Retrieve total participant count from your database (e.g., MySQL)
  db.query(
    "SELECT COUNT(*) as participantCount FROM admin_record",
    (countErr, countResults) => {
      if (countErr) {
        console.error(countErr);
        req.flash("error", "Internal server error");
        return res.redirect("/api/admin");
      }

      // Retrieve user information from your database (e.g., MySQL)
      db.query("SELECT * FROM admin_record", (userErr, userResults) => {
        if (userErr) {
          console.error(userErr);
          req.flash("error", "Internal server error");
          return res.redirect("/api/admin");
        }
        const totalAmountCollected = userResults.reduce((total, user) => {
          // Assuming user.total_amount is the column in the database
          const userTotalAmount = user.total_amount || 0;
      
          // Add the userTotalAmount to the overall total
          return total + userTotalAmount;
      }, 0);

        // Render the admin dashboard template with the user data and participant count
        res.render("admin/admin", {
          users: userResults,
          success: req.flash("success"),
          error: req.flash("error"),
          participantCount: countResults[0].participantCount,
          totalAmountCollected: totalAmountCollected,
        });
      });
    }
  );
});


app.use("/uploads", express.static("uploads"));

app.get("/admin/dashboard/participants", authenticateToken, (req, res) => {
  // Retrieve user information from your database (e.g., MySQL)
  db.query("SELECT * FROM admin_record", (err, results) => {
    if (err) {
      console.error(err);
      req.flash("error", "Internal server error");
      return res.redirect("/admin/dashboard");
    }

    // Query to get the count of Gold Rush participants
    db.query(
      "SELECT COUNT(*) AS goldRushParticipants FROM adddata WHERE gold_rush = 'gold_rush'",
      (goldRushErr, goldRushResults) => {
        if (goldRushErr) {
          console.error(goldRushErr);
          req.flash("error", "Internal server error");
          return res.redirect("/admin/dashboard");
        }
        const goldRushParticipants = goldRushResults[0].goldRushParticipants;
        db.query(
          "SELECT COUNT(*) AS brain_battleParticipants FROM adddata WHERE brain_battle = 'brain_battle'",
          (brain_battleErr, brain_battleResults) => {
            if (brain_battleErr) {
              console.error(brain_battleErr);
              req.flash("error", "Internal server error");
              return res.redirect("/admin/dashboard");
            }
            const brain_battleParticipants =
              brain_battleResults[0].brain_battleParticipants;
            db.query(
              "SELECT COUNT(*) AS wisdomWarParticipants FROM adddata WHERE wisdom_war = 'wisdom_war'",
              (wisdom_warErr, wisdom_warResults) => {
                if (wisdom_warErr) {
                  console.error(wisdom_warErr);
                  req.flash("error", "Internal server error");
                  return res.redirect("/admin/dashboard");
                }
                const wisdomWarParticipants =
                  wisdom_warResults[0].wisdomWarParticipants;
                db.query(
                  "SELECT COUNT(*) AS quick_reelParticipants FROM adddata WHERE quick_reel = 'quick_reel'",
                  (quick_reelErr, quick_reelResults) => {
                    if (quick_reelErr) {
                      console.error(quick_reelErr);
                      req.flash("error", "Internal server error");
                      return res.redirect("/admin/dashboard");
                    }
                    const quick_reelParticipants =
                      quick_reelResults[0].quick_reelParticipants;

                    db.query(
                      "SELECT COUNT(*) AS creativity_clubParticipants FROM adddata WHERE creativity_club = 'creativity_club'",
                      (creativity_clubErr, creativity_clubResults) => {
                        if (creativity_clubErr) {
                          console.error(creativity_clubErr);
                          req.flash("error", "Internal server error");
                          return res.redirect("/admin/dashboard");
                        }
                        const creativity_clubParticipants =
                          creativity_clubResults[0].creativity_clubParticipants;
                        db.query(
                          "SELECT COUNT(*) AS quantumAssemblerParticipants FROM adddata WHERE quantamAssembler = 'quantumAssembler'",
                          (quantumAssemblerErr, quantumAssemblerResults) => {
                            if (quantumAssemblerErr) {
                              console.error(quantumAssemblerErr);
                              req.flash("error", "Internal server error");
                              return res.redirect("/admin/dashboard");
                            }
                            const quantumAssemblerParticipants =
                              quantumAssemblerResults[0]
                                .quantumAssemblerParticipants;
                            db.query(
                              "SELECT COUNT(*) AS hackTheDarkParticipants FROM adddata WHERE hackTheDark = 'hackTheDark'",
                              (hackTheDarkErr, hackTheDarkResults) => {
                                if (hackTheDarkErr) {
                                  console.error(hackTheDarkErr);
                                  req.flash("error", "Internal server error");
                                  return res.redirect("/admin/dashboard");
                                }
                                const hackTheDarkParticipants =
                                  hackTheDarkResults[0].hackTheDarkParticipants;

                                db.query(
                                  "SELECT COUNT(*) AS gamer_strikeParticipants FROM adddata WHERE gamer_strike = 'gamer_strike'",
                                  (gamer_strikeErr, gamer_strikeResult) => {
                                    if (gamer_strikeErr) {
                                      console.error(gamer_strikeErr);
                                      req.flash(
                                        "error",
                                        "Internal server error"
                                      );
                                      return res.redirect("/admin/dashboard");
                                    }
                                    const gamer_strikeParticipants =
                                      gamer_strikeResult[0]
                                        .gamer_strikeParticipants;

                                    // Render the admin participants template with the user data and Gold Rush count
                                    res.render("admin/admin-participants", {
                                      gamer_strikeParticipants,
                                      hackTheDarkParticipants,
                                      goldRushParticipants,
                                      quantumAssemblerParticipants,
                                      creativity_clubParticipants,
                                      quick_reelParticipants,
                                      wisdomWarParticipants,
                                      brain_battleParticipants,
                                      users: results,
                                      success: req.flash("success"),
                                      error: req.flash("error"),
                                    });
                                  }
                                );
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

app.get("/admin/dashboard/user", authenticateToken, (req, res) => {
  db.query("SELECT * FROM admin_record", (err, results) => {
    if (err) {
      console.error(err);
      req.flash("error", "Internal server error", err);
      return res.redirect("/admin/dashboard");
    }

    // Render the admin dashboard template with the user data
    res.render("admin/user", {
      users: results,
      success: req.flash("success"),
      error: req.flash("error"),
    });
  });

});
// ******************************************************************************************* excel download

app.get("/admin/download-excel", authenticateToken, async (req, res) => {
  try {
    const results = await new Promise((resolve, reject) => {
      db.query("SELECT * FROM admin_record", (err, results) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Participants");

    // Define the columns in the Excel sheet
    worksheet.columns = [
      { header: "Name", key: "name", width: 20 },
      { header: "College Name", key: "collegeName", width: 30 },
      { header: "Mobile", key: "mobile", width: 15 },
      { header: "Email", key: "email", width: 40 },
      { header: "Creativity Club", key: "creativity_club", width: 20 },
      { header: "Quick Reel", key: "quick_reel", width: 20 },
      { header: "Brain Battle", key: "brain_battle", width: 20 },
      { header: "Hack The Dark", key: "hackTheDark", width: 20 },
      { header: "Quantum Assembler", key: "quantamAssembler", width: 20 },
      { header: "Wisdom War", key: "wisdom_war", width: 20 },
      { header: "Gold Rush", key: "gold_rush", width: 20 },
      { header: "Gamer Strike", key: "gamer_strike", width: 20 },
      { header: "amount", key: "total_amount", width: 20 },
      { header: "Payment Image", key: "paymentImage", width: 30 },
      { header: "Date and Time", key: "date_time_submit", width: 25 },
    ];

    // Add data to the Excel sheet
    results.forEach((user) => {
      // Convert date_time_submit to a formatted date and time string
      user.date_time_submit = moment(user.date_time_submit).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      worksheet.addRow(user);
    });

    const excelFileName = `participants_${Date.now()}.xlsx`;

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${excelFileName}`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error(error);
    req.flash("error", "Internal server error");
    return res.redirect("/admin/dashboard");
  }
});

// ******************************************************************************************* excel download

app.get("/admin/dashboard/events", authenticateToken, (req, res) => {
  db.query("SELECT * FROM admin_record", (err, results) => {
    if (err) {
      console.error(err);
      req.flash("error", "Internal server error");
      return res.redirect("/admin/dashboard1");
    }
    // Pass the 'username' variable to the template
    res.render("admin/admin-events", {
      users: results,
      success: req.flash("success"),
      error: req.flash("error"),
      registrationOpen: req.app.locals.registrationOpen,
      username: req.user.username, // Add this line
    });
  });
});

app.post("/admin/update-registration", authenticateToken, (req, res) => {
  const { action } = req.body;

  if (action === "open") {
    req.app.locals.registrationOpen = true;
    req.flash("success", "Registration opened successfully.");
  } else if (action === "close") {
    req.app.locals.registrationOpen = false;
    req.flash("success", "Registration closed successfully.");
  } else {
    // If no action specified, default to opening registration
    req.app.locals.registrationOpen = true;
  }

  res.redirect("/admin/dashboard/events");
});

const expiresInDuration = 6 * 60 * 60; // 6 hours in seconds

app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  // Check admin credentials
  if (
    username === adminCredentials.username &&
    password === adminCredentials.password
  ) {
    // Generate a JWT token with a longer expiration time
    const token = jwt.sign({ username }, secretKey, { expiresIn: expiresInDuration });

    // Set the token as a cookie
    res.cookie("token", token, { maxAge: expiresInDuration * 1000 });

    return res.redirect("/admin/dashboard");
  } else {
    req.flash("success", "Invalid username or password.");
    res.render("admin-login", { error: "Invalid username or password" });
  }
});

// Protected admin dashboard route

// Logout route
app.get("/admin/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/api/admin");
});

app.get("/download/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    "SELECT paymentImage FROM admin_record WHERE id = ?",
    userId,
    (selectErr, results) => {
      if (selectErr) {
        console.error(selectErr);
        req.flash("error", "Internal server error");
        res.redirect("/admin/dashboard"); // Redirect to the admin page or appropriate page
      } else if (results.length === 0) {
        req.flash("error", "User not found");
        res.redirect("/admin/dashboard"); // Redirect to the admin page or appropriate page
      } else {
        const imageFilename = results[0].paymentImage;
        // Define the path to the directory where user images are stored
        const imagePath = path.join(__dirname, "uploads", imageFilename);

        // Check if the file exists
        if (fs.existsSync(imagePath)) {
          // Set the appropriate headers to indicate the file download
          res.setHeader(
            "Content-disposition",
            "attachment; filename=" + imageFilename
          );
          res.setHeader("Content-type", "image/png"); // You can set the appropriate content type

          // Stream the file to the response
          const fileStream = fs.createReadStream(imagePath);
          fileStream.pipe(res);
        } else {
          req.flash("error", "File not found");
          res.redirect("/admin/dashboard/participants"); // Redirect to the admin page or appropriate page
        }
      }
    }
  );
});

//*****************************************************************************************************event management */

// Add this route after your other routes

app.post("/admin/update-registration", (req, res) => {
  const { action } = req.body;
  if (action === "open") {
    return true
  } else if (action === "close") {
    return false
  }
  res.redirect("/admin/dashboard");
});

//*****************************************************************************************************event management */

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
