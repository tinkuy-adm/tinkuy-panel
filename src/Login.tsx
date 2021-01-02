import React, { useContext, useState } from "react";
import { AuthContext } from "./context/auth.context";
import { loginUser, resetAuthContext } from "./context/auth.actions";
import {
  Center,
  Stack,
  Inline,
  TextInput,
  Button,
  Color,
  Corners,
  Text,
  TextSize,
  Shadow,
  TextWeight,
  TextLeading,
} from "@ableco/baseline";

function Login() {
  const authCtx = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    resetAuthContext(authCtx.dispatch);
    loginUser(authCtx.dispatch, { email, password });
  };

  return (
    <Center className="w-screen h-screen">
      <Stack
        style={{ width: 350 }}
        corners={Corners.LargeRounded}
        p={[8, 4]}
        border={Color.Primary}
        shadow={Shadow.ExtraLarge}
        space={3}
      >
        <Text
          size={TextSize.LG}
          weight={TextWeight.SemiBold}
          color={Color.Primary}
          leading={TextLeading.Loose}
        >
          Tinkuybot - Visualizador
        </Text>
        <TextInput
          p={[1, 2]}
          type="email"
          className="border-2"
          border={Color.Primary}
          corners={Corners.MediumRounded}
          value={email}
          onChange={({ target: { value } }) => setEmail(value)}
          placeholder="correo"
          placeholderColor={Color.Neutral400}
        />
        <TextInput
          p={[1, 2]}
          type="password"
          className="border-2"
          border={Color.Primary}
          corners={Corners.MediumRounded}
          clearTextOnFocus
          value={password}
          onChange={({ target: { value } }) => setPassword(value)}
          placeholder="contraseña"
          placeholderColor={Color.Neutral400}
        />
        {authCtx.state.loading ? <p>Loading...</p> : null}
        {authCtx.state.error ? <p>Nope. Malas credenciales (maybe)</p> : null}
        <Button
          onClick={login}
          disabled={authCtx.state.loading}
          corners={Corners.LargeRounded}
        >
          <Text color={Color.White} size={TextSize.SM}>
            Entrar
          </Text>
        </Button>
      </Stack>
    </Center>
  );
}

export default Login;
