const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
require("dotenv").config();

exports.sendMail = async (
  req,
  res,
  receivers,
  subject,
  body,
  success_redirect_url,
  failure_redirect_url,
  success_flash,
  error_flash
) => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" // Redirect URL
  );

  oauth2Client.setCredentials({
    refresh_token: 
      process.env.REFRESH_TOKEN,
  });

  var accessToken;
  oauth2Client.refreshAccessToken( (error, tokens) => {
    if( !error ){
        console.log({tokens});
         accessToken = tokens.access_token;
    }else{
        req.flash("error_msg", error_flash);
        res.redirect(failure_redirect_url);
    }
})

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "sharmadeeksha325@gmail.com",
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  // send mail with defined transport object
  const mailOptions = {
    from: '"Deeksha Sharma" <sharmadeeksha325@gmail.com>', // sender address
    to: receivers, // list of receivers
    subject: subject, // Subject line
    generateTextFromHTML: true,
    html: body, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      req.flash("error_msg", error_flash);
      res.redirect(failure_redirect_url);
    } else {
      console.log("Mail sent : %s", info.response);
      req.flash("success_msg", success_flash);
      res.redirect(success_redirect_url);
    }
  });
};





// ya29.a0AfB_byCF0bUZcFAUp-b9M-DV-RReQRcOkHRzudsfmkwYjeF_K0OxaeT9b1KxGhfYmMmiDesa85ijmVRQyw2sjd54d-nmNbEzssC_-Ctv7jktsueMmWolgHkpw8FGmklC-h-j573IecdH7fCDnGOurDBQi-lmc5YeYWz9nwaCgYKAXASARISFQHGX2MinmM9cEAzNWZuG-BdJO-ZyA0173
// ya29.a0AfB_byBJfzCs482OI2ydIFReNeM6SVIFfz-aNKDvc26PQRETsIXKoPBkyiSojukRci3hObto2abO0PmcwGdPKTPKeSNvhlhVQwYx21QNbs7CcNo_IjBjQ-hEfA7ojmTqt5O2n8sKbcnDonK_sGGrb_UMTKalUF9UgssUAAaCgYKAYUSARISFQHGX2MiM77p_YHVUfMb-nn2aEQ6mg0173
  // oauth2Client.setCredentials({
  // 	refresh_token: "1//041uQE8miR2QHCgYIARAAGAQSNwF-L9Iry_Y_ug9kSGoG9gQKVhYOrHCqSwpcRF8ibBfhJLJu_rqdwAmulz9DkAEcSuqJ5MA4pIg"
  // });

  // const accessToken = "ya29.a0ARrdaM-kRfO3R_cMgmthHEr_6X9O5ULWvRX_AKnuNCSGMikxzsa4zPCat49c8spqp42v0xacbAYdIO2lmONXDUDxCE8YRDro-qKGY-xo26XnuiQ9O-uNWwql6rVonH8ThqutNGMdBdR4_ZZJTu3rCBz1usyF"
  // const accessToken = oauth2Client.getAccessToken()
  // const token = jwt.sign({ name, email, password , inst , role , batch , branch}, JWT_KEY);
  //   const accessToken =
//     "ya29.a0AfB_byAEmRKi-Vp9C1s55w9cX8H7JYO-vdBqOXnNxk4Q0pHAOzphFvOFLHisXF5f-fOj1Dm2ZReIXqMPj5OZGcnR2v1Gl1TmHU693HHHRu6qFfoUHKOC9Zqn4-GhLzPCQ5wlHiTCO-3-TU65l_Z_ySmdqkHFDIamhwJM4gaCgYKAcoSARISFQHGX2Mipjpn7WJdb2LL2sfeGM0z3Q0173"
//   const { tokens } = await oauth2Client.getToken("4/0AfJohXkNcPpmQRv-aFgHghVTk5saShFtDwHsgU7XtDJ0b0eygvH1O2KvfL5gvrULWkqo4g");
//   oauth2Client.setCredentials(tokens);

//   let refreshToken;

//   oauth2Client.on("tokens", (tokens) => {
//     if (tokens.refresh_token) {
//       // store the refresh_token in my database!
//       refreshToken = tokens.refresh_token;
//       console.log(tokens.refresh_token);
//     }
//     refreshToken = tokens.refresh_token;

//     console.log(tokens.access_token);
//   });

//   console.log({ authUrl });