import 'react-native-gesture-handler'; //must be the first import
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer'; //version higher than 6.2.0 throws error "r.g.__reanimatedWorkletInit is not a function. (In 'r.g.__reanimatedWorkletInit(p)', 'r.g.__reanimatedWorkletInit' is undefined)" on Expo Snack
import { Button, Platform } from 'react-native';

import Screen from './src/screens/Main';
import { AuthProvider, useAuth } from './AuthContext';

const RootStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const BottomTab = createBottomTabNavigator();
const FeedStack = createNativeStackNavigator();
const GroupsStack = createNativeStackNavigator();
const TopTabFeedStack = createMaterialTopTabNavigator();

function getDefaultHeaderOptions({ navigation: { openDrawer, goBack } }) {
  return {
    headerLeft: ({ canGoBack }) => {
      if (canGoBack) {
        if (Platform.OS === 'web') {
          return <Button title="Go back" onPress={goBack} />;
        } else {
          return undefined;
        }
      }

      return <Button title="Open Drawer" onPress={openDrawer} />;
    },
  };
}

function TopTabFeedNavigator() {
  return (
    <TopTabFeedStack.Navigator>
      <TopTabFeedStack.Screen name="AllPosts" component={Screen} />
      <TopTabFeedStack.Screen name="FavoritePosts" component={Screen} />
    </TopTabFeedStack.Navigator>
  );
}

function FeedNavigator() {
  return (
    <FeedStack.Navigator
      screenOptions={(props) => getDefaultHeaderOptions(props)}>
      <FeedStack.Screen name="Feed" component={TopTabFeedNavigator} />
      <FeedStack.Screen name="Profile" component={Screen} />
      <FeedStack.Screen name="Settings" component={Screen} />
      <FeedStack.Screen name="ResetPassword" component={Screen} />
    </FeedStack.Navigator>
  );
}

function GroupsNavigator() {
  return (
    <GroupsStack.Navigator
      screenOptions={(props) => getDefaultHeaderOptions(props)}>
      <GroupsStack.Screen name="Groups" component={Screen} />
    </GroupsStack.Navigator>
  );
}

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator screenOptions={{ headerShown: false }}>
      <BottomTab.Screen name="FeedNavigator" component={FeedNavigator} />
      <BottomTab.Screen name="GroupsNavigator" component={GroupsNavigator} />
    </BottomTab.Navigator>
  );
}

function DrawerContent(props) {
  const { dispatch } = useAuth();
  const routes = ['Profile', 'Settings'];

  const bottomTabNavigator = props.state.routes.find(
    ({ name }) => name === 'BottomTabNavigator'
  );
  const feedNavigator = bottomTabNavigator.state?.routes.find(
    ({ name }) => name === 'FeedNavigator'
  );
  const currentScreen =
    feedNavigator?.state?.routes[feedNavigator.state.index].name;

  return (
    <DrawerContentScrollView {...props}>
      {routes.map((screen) => (
        <DrawerItem
          focused={screen === currentScreen}
          key={screen}
          label={screen}
          onPress={() => props.navigation.navigate(screen)}
        />
      ))}
      <DrawerItem
        label="Invalidate Sign Up"
        onPress={() => dispatch({ type: 'invalidateSignUp' })}
      />
      <DrawerItem
        label={'Sign Out'}
        onPress={() => dispatch({ type: 'signOut' })}
      />
      <DrawerItem
        label="Sign Out and Invalidate Sign Up"
        onPress={() => dispatch({ type: 'signOutAndInvalidateSignUp' })}
      />
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
}

function RootNavigator() {
  const {
    state: { isAuthenticated, isSignUpValidated },
  } = useAuth();

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          isSignUpValidated ? (
            <>
              <RootStack.Screen
                name="DrawerNavigator"
                component={DrawerNavigator}
              />
              <RootStack.Group
                screenOptions={{ presentation: 'fullScreenModal' }}>
                <RootStack.Screen name="PostForm" component={Screen} />
              </RootStack.Group>
            </>
          ) : (
            <RootStack.Screen name="SignUpComplement" component={Screen} />
          )
        ) : (
          <>
            <RootStack.Screen name="SignIn" component={Screen} />
            <RootStack.Screen name="SignUp" component={Screen} />
            <RootStack.Screen name="ResetPassword" component={Screen} />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
