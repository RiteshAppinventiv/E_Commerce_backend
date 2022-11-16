
// import * as nodemailer from "nodemailer";

// import { timeConversion } from "@utils/appUtils";
// import { TEMPLATES, SERVER, USER_TYPE, TOKEN_TYPE, STATUS } from "@config/index";
// import { TemplateUtil } from "@utils/TemplateUtil";
// import { sendMessageToFlock } from "@utils/FlockUtils";
const SERVER =  require("../environment").SERVER;
const TEMPLATES=require("../constant");
const nodemailer = require("nodemailer");
// const { default: TemplateUtil } = require("./templateUtils");
// const { timeConversion } = require("./appUtils");

// using smtp
const transporter = nodemailer.createTransport({
	host: SERVER.MAIL.SMTP.HOST,
	port: SERVER.MAIL.SMTP.PORT,
	// port: 465,
	secure: true, // use SSL
		requireTLS: true,
	auth: {
		user: SERVER.MAIL.SMTP.USER,
		pass: SERVER.MAIL.SMTP.PASSWORD
	}
	// auth: {
	// 	type: "OAuth2",
	// 	user: SERVER.MAIL.SMTP.USER,
	// 	clientId: "390634207013-8s0rjt7kecbtq4re2161j0g8ki6vs72r.apps.googleusercontent.com",
	// 	clientSecret: "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",
	// 	refreshToken: "1//04jFBsL5A5MbgCgYIARAAGAQSNwF-L9Ir_3xk17tRRAg829WCwsgw5erYxttBVq-cn9LTOckoYYFwgjUoXk3u8JRwdUfEBca5xdI",
	// 	accessToken: "ya29.a0Aa4xrXN1udbP6dEQe8sk70_7ck9EEWGgBUJTpYElRc-Z9TR5J-ark1HCBQrfE6OsdihsTrjPmslmRfbd6Llp5Pfa7sXKTuAvCjf2Yb1uhHxKzNEVqCPj8zEI_Lo_DUBTM73xe5OQFhyyy99AAMShyUn-PTVQaCgYKATASARISFQEjDvL9R8kDuaGPzjgApGyRWi9l7Q0163",
	// 	"expires_in": 3599, 
	// },
});

class MailManager {
	fromEmail = SERVER.MAIL.SMTP.USER;
	async sendMail(params) {
		const mailOptions = {
			from: `${SERVER.APP_NAME} <${this.fromEmail}>`, // sender email
			to: params.email, // list of receivers
			subject: params.subject, // Subject line
			html: params.content
		};

		return new Promise(function (resolve, reject) {
			return transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.error("sendMail==============>", error);
					sendMessageToFlock({ "title": "sendMail", "error": error });
					resolve(SERVER.ENVIRONMENT !== "production" ? true : false);
				} else {
					console.log("Message sent: " + info.response);
					resolve(true);
				}
			});
		});
	}

	async forgotPasswordMail(params) {
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "forgot-password.html"))
			.compileFile({
				"otp": params.otp,
				"name": params.name,
				"validity": timeConversion(SERVER.TOKEN_INFO.EXPIRATION_TIME.VERIFY_EMAIL)
			});

		return await this.sendMail({
			"email": params.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.FORGOT_PASSWORD,
			"content": mailContent
		});
	}

	async adminForgotPasswordMail(params) {
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "admin-forgot-password.html"))
			.compileFile({
				"url": `${SERVER.ADMIN_URL}` + `/account/reset-password?token=${params.accessToken}&email=${params.email}`,
				"firstname": params.firstname,
				"validity": timeConversion(SERVER.TOKEN_INFO.EXPIRATION_TIME.FORGOT_PASSWORD)
			});

		return await this.sendMail({
			"email": params.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.FORGOT_PASSWORD,
			"content": mailContent
		});
	}

	async adminResendEmail(params) {
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "admin-resend-email.html"))
			.compileFile({
				"url": `${SERVER.ADMIN_URL}` + `/account/reset-password?token=${params.accessToken}&email=${params.email}`,
				"firstname": params.firstname,
				"validity": timeConversion(SERVER.TOKEN_INFO.EXPIRATION_TIME.VERIFY_EMAIL)
			});

		return await this.sendMail({
			"email": params.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.RESEND_EMAIL,
			"content": mailContent
		});
	}

	async resentOtp(params) {
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "resendOtp.html"))
			.compileFile({
				"otp": params.otp,
				"name": params.name,
				"validity": timeConversion(SERVER.TOKEN_INFO.EXPIRATION_TIME.VERIFY_EMAIL)
			});

		return await this.sendMail({
			"email": params.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.RESEND_OTP,
			"content": mailContent
		});
	}

	async AddUserMail(params) {
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "add-user-welcome.html"))
			.compileFile({
				"name": params.name,
				"email": params.email,
				"password": params.password,
				"deeplink": params.deeplink,
				"validity": timeConversion(SERVER.TOKEN_INFO.EXPIRATION_TIME.VERIFY_EMAIL)
			});

		return await this.sendMail({
			"email": params.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.WELCOME,
			"content": mailContent
		});
	}

	async AddAdminMail(params) {
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "add-admin-welcome.html"))
			.compileFile({
				"email": params.email,
				"password": params.password,
				"link": `${SERVER.ADMIN_URL}/account/login`,
				"validity": timeConversion(SERVER.TOKEN_INFO.EXPIRATION_TIME.VERIFY_EMAIL)
			});

		return await this.sendMail({
			"email": params.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.WELCOME,
			"content": mailContent
		});
	}

	async verifyEmail(params) {
		const mailtranporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "ritesh.sahoo.trail@gmail.com",
                pass: "eaveegrulckwizma"
            }
            // auth: {
            //     user: "ritesh.sahoo@appinventiv.com",
            //     pass: "App@@2022#"
            // }
        });
        const details = {
            to: String(params.email),
            from: "ritesh.sahoo@appinventiv.com",
            subject: "Sending Otp",
            html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + params.otp + "</h1>" // html body
        }

        const response = await mailtranporter.sendMail(details)
	}
	async sendEmail(params) {
		const mailtranporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "ritesh.sahoo.trail@gmail.com",
                pass: "eaveegrulckwizma"
            }
        });
        const details = {
            to: String(params.email),
            from: "ritesh.sahoo@appinventiv.com",
            subject: params.subject,
            html: `<h3>My name is ${params.fName} ${params.lName}</h3>` + "<p style='font-weight:bold;'>" + params.message + "</p>" // html body
        }

        const response = await mailtranporter.sendMail(details)
		console.log("mail response",response);
	}
	async composeMail(params) {
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "compose.html"))
			.compileFile({
				"message": params.message,
				"name": params.name,
				//"validity": timeConversion(SERVER.TOKEN_INFO.EXPIRATION_TIME.FORGOT_PASSWORD)
			});

		return await this.sendMail({
			"email": params.email,
			"subject": params.subject,
			"content": mailContent
		});
	}
	async incidenReportdMail(params) {
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "forgot-password.html"))
			.compileFile({
				"otp": params.otp,
				"name": params.name,
				"validity": timeConversion(SERVER.TOKEN_INFO.EXPIRATION_TIME.FORGOT_PASSWORD)
			});

		return await this.sendMail({
			"email": params.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.FORGOT_PASSWORD,
			"content": mailContent
		});
	}

	/**
	 * @function accountBlocked
	 * @description user account have been blocked
	 */
	async accountBlocked(payload) {
		let mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "account-blocked.html"))
			.compileFile({
				"name": payload?.name,
				"reason": payload.reason
			});

		return await this.sendMail({
			"email": payload.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.ACCOUNT_BLOCKED,
			"content": mailContent
		});
	}

	/**
	 * @function welcomeEmail
	 * @description send welcome email to user after profile completion
	 * @author Rajat Maheshwari
	 * @param params.email: user's email
	 * @param params.name: user's name
	 */
	async welcomeEmail(params) {
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "welcome-email.html"))
			.compileFile({
				"name": params.name
			});

		return await this.sendMail({
			"email": params.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.WELCOME,
			"content": mailContent
		});
	}

	/**
	 * @function accountBlocked
	 * @description user account have been rejected
	 */
	async verificationStatus(payload) {
		let mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "verification-process.html"))
			.compileFile({
				"name": payload?.name,
				"reason": payload.reason
			});

		return await this.sendMail({
			"email": payload.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.VERIFICATION_REJECTED,
			"content": mailContent
		});
	}

	// /**
	//  * @function emailVerification
	//  * @description send otp to user's email for verification on (signup)
	//  * @author Rajat Maheshwari
	//  * @param params.email: user's email
	//  * @param params.otp: otp
	//  */
	// async emailVerification(params) {
	// 	const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "email-verification.html"))
	// 		.compileFile({
	// 			"otp": params.otp,
	// 			"name": params.name,
	// 			"validity": timeConversion(SERVER.TOKEN_INFO.EXPIRATION_TIME.VERIFY_EMAIL)
	// 		});

	// 	return await this.sendMail({
	// 		"email": params.email,
	// 		"subject": TEMPLATES.EMAIL.SUBJECT.VERIFY_EMAIL,
	// 		"content": mailContent
	// 	});
	// }


	/**
	 * @function documentUploadLink
	 * @description send document upload link
	 * @author Rajat Maheshwari
	 * @param params.name: user's name
	 * @param params.email: user's email
	 * @param params.type: type
	 * @param params.displayName: name to be displayed on template
	 * @param params.token: unique token for document upload
	 */
	async documentUploadLink(params) {
		const mailContent = await (new TemplateUtil(SERVER.TEMPLATE_PATH + "document-link.html"))
			.compileFile({
				"url": `${SERVER.APP_URL}/deeplink?name=${params.name}&token=${params.token}&type=${params.type}`,
				"displayName": params.displayName,
				"name": params.name
			});

		return await this.sendMail({
			"email": params.email,
			"subject": TEMPLATES.EMAIL.SUBJECT.UPLOAD_DOCUMENT,
			"content": mailContent
		});
	}
}

module.exports.mailManager = new MailManager();