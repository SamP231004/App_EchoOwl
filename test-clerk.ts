import { useSignIn } from '@clerk/expo';
function Test() {
  const { signIn } = useSignIn();
  if (signIn) {
      let x: string = signIn.create;
  }
}
