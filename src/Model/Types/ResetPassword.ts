export default interface ResetPassword {
  token: string;
  password: string;
  challenge: string;
  challengeGuid: string;
}
