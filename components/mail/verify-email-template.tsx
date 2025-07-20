interface VerifyEmailTemplateProps {
  confirmLink: string;
}

export const VerifyEmailTemplate: React.FC<
  Readonly<VerifyEmailTemplateProps>
> = ({ confirmLink }) => (
  <div>
    <a href={confirmLink}>Click here to verify your email</a>
    <p>The link will expire after 15 minutes</p>
  </div>
);
