import * as React from 'react';

interface EmailTemplateProps {
  code: number;
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  code,
}) => (
  <div>
    <h1>Here is your 6 digit confirmation code! {code}</h1>
    <h2>This is 2 more fingers than I have</h2>
  </div>
);

export default EmailTemplate;