interface VerifyEmailTemplateProps {
  confirmLink: string;
}

export const VerifyEmailTemplate: React.FC<
  Readonly<VerifyEmailTemplateProps>
> = ({ confirmLink }) => (
  <div>
    <a href={confirmLink}>Click here to verify your email</a>
  </div>
);
