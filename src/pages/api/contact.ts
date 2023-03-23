import nodemailer from 'nodemailer';

const email = process.env.MAIL_ADDRESS;
const emailPass = process.env.MAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  auth: {
    type: 'login',
    user: email,
    pass: emailPass
  }
});

const mailer = ({ senderMail, name, text }) => {
  const from = `${email}`;
  const mailList = [email];
  const message = {
    from,
    to: mailList,
    subject: `Nova mensagem de contato - ${name} <${senderMail}`,
    html: `
      <h3>Solicitação de serviço direto do Portfólio</h3>
      <br />
      <ul>
        <li>Cliente: <strong>${name}</strong></li>
      </ul>
      <br />
        <p> A mensagem enviada foi: <br />
        <ul>
          <li>${text}</li>
        </ul>
        <br />
        <h3>Code Solutions</h3>
      `,
    replyTo: senderMail
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(message, (error, info) =>
      error ? reject(error) : resolve(info)
    );
  });
};

export default async (req, res) => {
  const { senderMail, name, content } = req.body;

  if (senderMail === '' || name === '' || content === '') {
    res.status(403).send();
    return;
  }
  const mailerRes = await mailer({ senderMail, name, text: content });
  res.send(mailerRes);
};