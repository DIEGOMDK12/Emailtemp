import { EmailAddress } from "../EmailAddress";

export default function EmailAddressExample() {
  return (
    <EmailAddress
      email="temp_a1b2c3@tempmail.com"
      expiresIn={580}
      onRefresh={() => console.log("Refresh triggered")}
      isRefreshing={false}
    />
  );
}
