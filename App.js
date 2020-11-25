import React from 'react';
import { Text, View, Image, TextInput, StyleSheet } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import TransactionScreen from './Screens/BookTransactionScreen'
import SearchScreen from './Screens/SearchScreen'
import LoginScreen from './Screens/LoginScreen'


export default class App extends React.Component {
  render(){
   return (
  <View styles={styles.container}><AppContainer/> </View>
);
}
}
const TabNavigator = createBottomTabNavigator({
  Transaction: {screen:TransactionScreen},
  Search: {screen:SearchScreen}
},
{defaultNavigationOptions:({navigation})=>({
  tabBarIcon:()=>{
    const routeName=navigation.state.routeName
if(routeName==='Transaction'){
  return(
    <Image source={require('./assets/book.png')}
    style={{width:40,height:40}}/>
  )
} else if (routeName==='Search'){
  return(
    <Image source={require('./assets/searchingbook.png')}
    style={{width:40,height:40}}/>
  )
}
  }
})}

) 
const switchNavigator = createSwitchNavigator({
  LoginScreen: {screen:LoginScreen},
  TabNavigator: {screen:TabNavigator}
})
const AppContainer = createAppContainer(switchNavigator)

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center"
  },
})

