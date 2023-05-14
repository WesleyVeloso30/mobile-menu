import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../AuthContext';

import { Button } from 'react-native';

export default function Main({ route: { name }, navigation: { navigate, goBack } }) {
  const { dispatch } = useAuth();
  const screenActions = [
    {
      screenName: 'SignIn',
      actions: [
        {
          title: 'Sign In',
          onPress: () => dispatch({ type: 'signIn' }),
        },
        {
          title: 'Navigate to Sign Up',
          onPress: () => navigate('SignUp'),
        },
        {
          title: 'Navigate to Reset Password',
          onPress: () => navigate('ResetPassword'),
        },
      ],
    },
    {
      screenName: 'SignUp',
      actions: [
        {
          title: 'Go Back',
          onPress: goBack,
        },
      ],
    },
    {
      screenName: 'ResetPassword',
      actions: [
        {
          title: 'Go Back',
          onPress: goBack,
        },
      ],
    },
    {
      screenName: 'SignUpComplement',
      actions: [
        {
          title: 'Validate Sign Up',
          onPress: () => dispatch({ type: 'validateSignUp' }),
        },
        {
          title: 'Sign Out',
          onPress: () => dispatch({ type: 'signOut' }),
        },
      ],
    },
    {
      screenName: 'AllPosts',
      actions: [
        {
          title: 'Create Post',
          onPress: () => navigate('PostForm'),
        },
      ],
    },
    {
      screenName: 'PostForm',
      actions: [
        {
          title: 'Close Modal',
          onPress: goBack,
        },
      ],
    },
    {
      screenName: 'Profile',
      actions: [
        {
          title: 'Reset Password',
          onPress: () => navigate('ResetPassword'),
        },
      ],
    },
  ];
  const screenAction = screenActions.find(
    ({ screenName }) => screenName === name
  );

  return (
    <View style={styles.container}>
      <Text>{`Screen name: ${name}`}</Text>
      {screenAction &&
        screenAction.actions.map(({ title, onPress }) => (
          <View key={title} style={styles.button}>
            <Button title={title} onPress={onPress} />
          </View>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  button: { margin: 4 },
});
